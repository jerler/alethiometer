import "./style.css";
import { symbolForArmDeg, SYMBOL_RING } from "./constants.js";
import arm0Url from "./assets/arm-0.svg";
import arm1Url from "./assets/arm-1.svg";
import arm2Url from "./assets/arm-2.svg";
import arm3Url from "./assets/arm-3.svg";

const faceEl = document.getElementById("face");
const arms = Array.from(document.querySelectorAll(".arm"));
const dials = Array.from(document.querySelectorAll(".dial"));
const symbolsEl = document.getElementById("symbols");
const symbolRingEl = document.getElementById("symbolRing");
const concentrateBtn = document.getElementById("concentrate");
const resetBtn = document.getElementById("reset");
const spotlightPrimaryEl = document.getElementById("spotlightPrimary");
const spotlightSecondaryEl = document.getElementById("spotlightSecondary");

// Answer panel
const panelNormalEl = document.getElementById("panelNormal");
const panelReadingEl = document.getElementById("panelReading");
const answersEl = document.getElementById("answers");
const armsTabBtn = document.getElementById("armsTab");
const readingTabBtn = document.getElementById("readingTab");

// Dictionary Panel
const panelDictionaryEl = document.getElementById("panelDictionary")
const dictionaryTabBtn = document.getElementById("dictionaryTab")
const dictionarySelectEl = document.getElementById("dictionarySelect")
const dictionaryDetailEl = document.getElementById("dictionaryDetail")

// Spotlight elements (panel)
const spotlightImgEl = document.getElementById("spotlightImg");
const spotlightNameEl = document.getElementById("spotlightName");
const spotlightMediaEl = document.getElementById("spotlightMedia");
const DIAL_SENSITIVITY = 0.75;
const WHEEL_SENSITIVITY = 0.08;
const WHEEL_SENSITIVITY_FINE = 0.015;
const ANSWER_ARM_IDX = 3;

let armSelects = [];

// Attach SVGs
const armSvgUrls = [arm0Url, arm1Url, arm2Url, arm3Url];
arms.forEach((armEl, i) => {
  const img = armEl.querySelector(".arm-svg");
  if (!img) return;
  img.src = armSvgUrls[i];
  img.draggable = false;
});

// ---- State ----
const state = {
  selectedArm: 0,
  armDeg: [270, 30, 150, 320],
  drag: null, // { kind: 'arm'|'dial', idx, pointerId, startX, startY, startDeg }
};

// wheel snap timers (for arms 0..2)
const wheelSnapTimers = Array(3).fill(null);

// idle drift for arm 3
const idle = {
  velocity: 30,
  targetVel: -12,
  nextChangeAt: 0,
  lastTime: performance.now(),
  pausedUntil: 0,
  isReading: false,
};

const activeReading = {
  id: 0,
  questionSymbolDegs: null,
};

// ---- Helpers ----
function normalizeDeg(d) {
  d %= 360;
  return d < 0 ? d + 360 : d;
}

function armDegForSymbol(symbol) {
  return normalizeDeg(symbol.deg - 90);
}

function armDegForNorthDeg(northDeg) {
  return normalizeDeg(northDeg - 90);
}

function showPanelTab(tabName) {
  const panels = {
    arms: panelNormalEl,
    reading: panelReadingEl,
    dictionary: panelDictionaryEl,
  }

  const tabs = {
    arms: armsTabBtn,
    reading: readingTabBtn,
    dictionary: dictionaryTabBtn,
  }

  for (const [name, panel] of Object.entries(panels)) {
    if (panel) panel.hidden = name !== tabName
  }

  for (const [name, tab] of Object.entries(tabs)) {
    if (!tab) continue

    const active = name === tabName
    tab.classList.toggle("active", active)
    tab.setAttribute("aria-selected", String(active))
  }

  if (tabName === "reading") {
    clearReadingAvailable()
  }
}

function showNormalPanel() {
  showPanelTab("arms");
}

function showReadingPanel() {
  showPanelTab("reading");
}

function showDictionaryPanel() {
  showPanelTab("dictionary")
}

function shortestDiffDeg(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function isReadingPanelActive() {
  return panelReadingEl && !panelReadingEl.hidden
}

function markReadingAvailable() {
  if (isReadingPanelActive()) return

  readingTabBtn?.classList.add('has-reading')
}

function clearReadingAvailable() {
  readingTabBtn?.classList.remove('has-reading')
}

function snapToSymbol(d) {
  const step = 360 / SYMBOL_RING.length;
  return Math.round(d / step) * step;
}

function setSelectedArm(idx) {
  state.selectedArm = idx;
  arms
    .slice(0, 3)
    .forEach((el, i) => el.classList.toggle("selected", i === idx));
  dials.forEach((el, i) => el.classList.toggle("selected", i === idx));
  updateSpotlight();
}

function getFaceCenter() {
  const r = faceEl.getBoundingClientRect();
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
}

// pointer position -> degrees, 0 right, clockwise positive
function degFromPointer(clientX, clientY) {
  const { cx, cy } = getFaceCenter();
  const dx = clientX - cx;
  const dy = clientY - cy;
  const rad = Math.atan2(dy, dx);
  return normalizeDeg(rad * (180 / Math.PI));
}

function applyArm(idx) {
  arms[idx].style.transform = `rotate(${normalizeDeg(state.armDeg[idx])}deg)`;
}

function currentQuestionSymbolDegs() {
  return state.armDeg.slice(0, 3).map((deg) => symbolForArmDeg(deg).deg);
}

function beginReadingRun() {
  activeReading.id += 1;
  activeReading.questionSymbolDegs = currentQuestionSymbolDegs();

  idle.isReading = true;
  idle.velocity = 0;

  return activeReading.id;
}

function isReadingRunActive(readingId) {
  return idle.isReading && activeReading.id === readingId;
}

function finishReadingRun(readingId) {
  if (!isReadingRunActive(readingId)) return;

  activeReading.questionSymbolDegs = null;

  idle.lastTime = performance.now();
  idle.velocity = 0;
  pickNewIdleTarget(performance.now());
  idle.isReading = false;
}

function cancelActiveReading({
  clearAnswers = true,
  returnToArms = false,
  pauseMs = READING_TIMING.pauseAfterFinalTurnMs,
} = {}) {
  if (!idle.isReading && !activeReading.questionSymbolDegs) return

  const now = performance.now()

  // Invalidate the currently running async reading.
  activeReading.id += 1
  activeReading.questionSymbolDegs = null

  // Stop the reading animation, but do not immediately resume wandering.
  idle.isReading = false
  idle.velocity = 0
  idle.lastTime = now
  idle.pausedUntil = now + pauseMs

  // Pick the next idle target for after the pause.
  pickNewIdleTarget(now + pauseMs)

  if (clearAnswers) {
    showReadingEmptyState();
  }

  clearReadingAvailable()
}

function cancelReadingIfQuestionChanged() {
  if (!idle.isReading || !activeReading.questionSymbolDegs) return;

  const currentDegs = currentQuestionSymbolDegs();

  const changed = currentDegs.some((deg, i) => {
    return deg !== activeReading.questionSymbolDegs[i];
  });

  if (changed) {
    cancelActiveReading({
      clearAnswers: true,
      returnToArms: false,
    });
  }
}

function symbolByDeg(deg) {
  return SYMBOL_RING.find((symbol) => symbol.deg === deg)
}

function buildDictionarySelect() {
  if (!dictionarySelectEl) return

  dictionarySelectEl.innerHTML = ""

  for (const symbol of SYMBOL_RING) {
    const option = document.createElement("option")
    option.value = String(symbol.deg)
    option.textContent = symbol.name
    dictionarySelectEl.appendChild(option)
  }

  dictionarySelectEl.addEventListener("change", () => {
    const symbol = symbolByDeg(Number(dictionarySelectEl.value))
    if (symbol) renderDictionarySymbol(symbol)
  })
}

function renderDictionarySymbol(symbol) {
  if (!dictionaryDetailEl || !dictionarySelectEl) return

  dictionarySelectEl.value = String(symbol.deg)

  dictionaryDetailEl.innerHTML = `
    <article class="dictionary-card">
      <div
        class="spotlight-media dictionary-media"
        role="img"
        aria-label="${escapeHtml(symbol.name)} preview"
      >
        <img class="dictionary-image" alt="" />
      </div>

      <div class="dictionary-name">${escapeHtml(symbol.name)}</div>
      <div class="dictionary-degree">${symbol.deg}°</div>

      <section class="dictionary-section">
        <div class="dictionary-label">Primary meaning</div>
        <div class="dictionary-primary">
          ${escapeHtml(symbol.primaryMeaning ?? "—")}
        </div>
      </section>

      <section class="dictionary-section">
        <div class="dictionary-label">Associated meanings</div>
        <div class="dictionary-meanings">
          ${(symbol.secondaryMeanings || [])
            .map((meaning) => `<span>${escapeHtml(meaning)}</span>`)
            .join("")}
        </div>
      </section>
    </article>
  `

  const mediaEl = dictionaryDetailEl.querySelector(".dictionary-media")
  const imgEl = dictionaryDetailEl.querySelector(".dictionary-image")

  applySymbolPreviewToMedia(symbol, mediaEl, imgEl)
}

function readingCardHtml({ symbol, symbolIndex }) {
  const p = symbol.preview || {};

  const scale = p.scale ?? 1;
  const rotate = p.rotate ?? 0;
  const nudgeX = p.nudgeX ?? 0;
  const nudgeY = p.nudgeY ?? 0;
  const fit = p.fit ?? "contain";
  const depth = formatInterpretationDepth(1);

  return `
    <div
      class="reading-card"
      data-reading-card="${symbolIndex}"
      data-symbol-deg="${symbol.deg}"
      role="button"
      tabindex="0"
    >
      <div
        class="reading-card-image-wrap"
        style="
          --card-scale: ${scale};
          --card-rot: ${rotate}deg;
          --card-nudge-x: ${nudgeX}%;
          --card-nudge-y: ${nudgeY}%;
          --card-fit: ${fit};
        "
      >
        <img
          class="reading-card-image"
          src="${symbol.iconUrl}"
          alt="${escapeHtml(symbol.name)}"
        />
      </div>

      <div class="reading-card-text">
        <div class="reading-card-name">
          ${escapeHtml(symbol.name)}
        </div>

        <div
          class="reading-card-depth"
          data-depth="${depth}"
        >
          ${depth}
        </div>
      </div>
    </div>
  `;
}

const READING_TIMING = {
  swingToSymbolMs: 1000,
  pauseOnFirstLandMs: 100,
  msPerFullTurn: 1500,
  pauseBetweenTurnsMs: 100,
  pauseAfterFinalTurnMs: 500,
  pauseBetweenSymbolsMinMs: 75,
  pauseBetweenSymbolsMaxMs: 250,
  finalPauseMs: 1000,
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomMs(min, max) {
  return randomInt(min, max);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function setAnswerArmRawDeg(deg) {
  state.armDeg[ANSWER_ARM_IDX] = deg;
  arms[ANSWER_ARM_IDX].style.transform = `rotate(${deg}deg)`;
}

function animateAnswerArmToRaw(targetDeg, durationMs, readingId) {
  return new Promise(resolve => {
    const startTime = performance.now()
    const startDeg = state.armDeg[ANSWER_ARM_IDX]
    const diff = targetDeg - startDeg

    function frame(now) {
      if (readingId != null && !isReadingRunActive(readingId)) {
        resolve(false)
        return
      }

      const t = Math.min(1, (now - startTime) / durationMs)
      const eased = easeInOutCubic(t)

      setAnswerArmRawDeg(startDeg + diff * eased)

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        setAnswerArmRawDeg(targetDeg)
        resolve(true)
      }
    }

    requestAnimationFrame(frame)
  })
}

function buildArmSelectors() {
  symbolsEl.innerHTML = "";
  armSelects = [];

  for (let i = 0; i < 3; i++) {
    const row = document.createElement("div");
    row.className = "symbol-row arm-control-row";

    const label = document.createElement("label");
    label.htmlFor = `armSelect-${i}`;
    label.textContent = `Arm ${i + 1}`;

    const select = document.createElement("select");
    select.id = `armSelect-${i}`;
    select.className = "arm-symbol-select";
    select.dataset.arm = String(i);

    for (const symbol of SYMBOL_RING) {
      const option = document.createElement("option");
      option.value = String(symbol.deg);
      option.textContent = symbol.name;
      select.appendChild(option);
    }

    select.addEventListener("change", (e) => {
      const symbolDeg = Number(e.target.value);

      setSelectedArm(i);
      animateArmTo(i, armDegForNorthDeg(symbolDeg), 220);
    });

    select.addEventListener("keydown", (e) => {
      const forwardKeys = ["ArrowDown", "ArrowRight"];
      const backwardKeys = ["ArrowUp", "ArrowLeft"];

      if (!forwardKeys.includes(e.key) && !backwardKeys.includes(e.key)) return;

      e.preventDefault();

      const currentIndex = select.selectedIndex;
      const lastIndex = select.options.length - 1;

      let nextIndex;

      if (forwardKeys.includes(e.key)) {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      } else {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      }

      select.selectedIndex = nextIndex;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    row.appendChild(label);
    row.appendChild(select);
    symbolsEl.appendChild(row);

    armSelects.push(select);
  }
}

function updateArmSelectors() {
  armSelects.forEach((select, i) => {
    const symbol = symbolForArmDeg(state.armDeg[i]);
    select.value = String(symbol.deg);
  });
}

function updateReadingCardDepth(symbolIndex, level, rootEl = document) {
  const cardEl = rootEl.querySelector(`[data-reading-card="${symbolIndex}"]`);
  if (!cardEl) return;

  const depthEl = cardEl.querySelector(".reading-card-depth");
  if (!depthEl) return;

  const depth = formatInterpretationDepth(level);

  depthEl.textContent = depth;
  depthEl.dataset.depth = depth;
}

function render() {
  for (let i = 0; i < state.armDeg.length; i++) {
    state.armDeg[i] = normalizeDeg(state.armDeg[i]);
  }

  for (let i = 0; i < arms.length; i++) {
    applyArm(i);
  }

  updateArmSelectors();
  updateSpotlight();
  cancelReadingIfQuestionChanged();
}

function animateArmTo(idx, targetDeg, ms = 160) {
  const start = performance.now();
  const from = state.armDeg[idx];
  const diff = shortestDiffDeg(from, targetDeg);

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const t = Math.min(1, (now - start) / ms);
    state.armDeg[idx] = normalizeDeg(from + diff * easeOut(t));
    render();
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function snapArm(idx) {
  if (state.drag) return;
  animateArmTo(idx, snapToSymbol(state.armDeg[idx]));
}

function randomDirection() {
  return Math.random() < 0.5 ? -1 : 1;
}

// direction: 1 = clockwise, -1 = counter-clockwise
function directedDiffToSymbol(fromDeg, symbolDeg, direction) {
  const from = normalizeDeg(fromDeg);
  const to = normalizeDeg(symbolDeg);

  if (direction === 1) {
    return (to - from + 360) % 360;
  }

  return -((from - to + 360) % 360);
}

function scheduleWheelSnap(idx, delayMs = 120) {
  if (wheelSnapTimers[idx]) clearTimeout(wheelSnapTimers[idx]);
  wheelSnapTimers[idx] = setTimeout(() => snapArm(idx), delayMs);
}

function armIdxFromWheelEvent(e) {
  const el = document.elementFromPoint(e.clientX, e.clientY);
  const svg = el?.closest?.(".arm-svg");
  if (!svg) return null;
  const armEl = svg.closest(".arm");
  if (!armEl) return null;
  return Number(armEl.dataset.arm);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ---- Symbols ring ----
function buildSymbols() {
  symbolRingEl.innerHTML = "";
  for (const s of SYMBOL_RING) {
    if (!s.iconUrl) continue;

    const el = document.createElement("div");
    el.className = "symbol";
    el.style.setProperty("--deg", `${s.deg}deg`);

    const a = s.appearance || {};
    if (a.scale != null) el.style.setProperty("--sym-scale", String(a.scale));
    if (a.rotate != null) el.style.setProperty("--sym-rot", `${a.rotate}deg`);
    if (a.opacity != null)
      el.style.setProperty("--sym-opacity", String(a.opacity));

    const BASE_SYMBOL_SIZE = 40;

    if (a.nudgeX != null) {
      el.style.setProperty("--sym-nudge-x", `${a.nudgeX / BASE_SYMBOL_SIZE}em`);
    }

    if (a.nudgeY != null) {
      el.style.setProperty("--sym-nudge-y", `${a.nudgeY / BASE_SYMBOL_SIZE}em`);
    }

    const img = document.createElement("img");
    img.src = s.iconUrl;
    img.alt = s.name;

    el.appendChild(img);
    symbolRingEl.appendChild(el);
  }
}

// ---- Idle arm (arm 3) ----
function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pickNewIdleTarget(now) {
  const dir = Math.random() < 0.55 ? -1 : 1;
  const speed = Math.random() < 0.15 ? rand(18, 45) : rand(9, 16);
  idle.targetVel = dir * speed;
  idle.nextChangeAt = now + rand(900, 2600);
}

function stepIdle(dt) {
  const chase = 2.2;
  idle.velocity +=
    (idle.targetVel - idle.velocity) * (1 - Math.exp(-chase * dt));
  state.armDeg[ANSWER_ARM_IDX] = normalizeDeg(
    state.armDeg[ANSWER_ARM_IDX] + idle.velocity * dt,
  );
}

function idleLoop(now) {
  if (idle.isReading) {
    idle.lastTime = now;
    requestAnimationFrame(idleLoop);
    return;
  }

  const dt = Math.min(0.05, (now - idle.lastTime) / 1000);
  idle.lastTime = now;

  if (now < idle.pausedUntil) {
    requestAnimationFrame(idleLoop);
    return;
  }

  if (now >= idle.nextChangeAt) pickNewIdleTarget(now);

  stepIdle(dt);
  applyArm(ANSWER_ARM_IDX); // only update idle arm
  requestAnimationFrame(idleLoop);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateAnswerSequence() {
  let remainingTurns = randomInt(1, 12);
  const sequence = [];

  while (remainingTurns > 0) {
    const turns = randomInt(1, Math.min(3, remainingTurns));
    const symbol = SYMBOL_RING[randomInt(0, SYMBOL_RING.length - 1)];

    sequence.push({ symbol, turns });
    remainingTurns -= turns;
  }

  return sequence;
}

function formatInterpretationDepth(level) {
  if (level <= 1) return "primary";
  if (level === 2) return "secondary";
  return "deep";
}

async function playAnswerSequence(
  sequence,
  { onFirstLanding = () => {}, onDepthChange = () => {} } = {},
) {
  const readingId = beginReadingRun()

  let currentRawDeg = state.armDeg[ANSWER_ARM_IDX]
  for (let symbolIndex = 0; symbolIndex < sequence.length; symbolIndex++) {
    const { symbol, turns } = sequence[symbolIndex];
    const symbolDeg = armDegForSymbol(symbol);

    // Pick a fresh direction for moving between symbols.
    // 1 = clockwise, -1 = counter-clockwise
    const direction = randomDirection();

    // Move to the target symbol using the chosen direction.
    const firstLandingDeg =
      currentRawDeg + directedDiffToSymbol(currentRawDeg, symbolDeg, direction);

    const landed = await animateAnswerArmToRaw(
      firstLandingDeg,
      READING_TIMING.swingToSymbolMs,
      readingId
    )

    if (!landed || !isReadingRunActive(readingId)) return false

    onFirstLanding({ symbol, turns, symbolIndex })
    await wait(
      turns > 0
        ? READING_TIMING.pauseOnFirstLandMs
        : READING_TIMING.pauseAfterFinalTurnMs,
    );

    currentRawDeg = firstLandingDeg;

    // Repeated turns on this same symbol keep the same direction.
    for (let i = 0; i < turns; i++) {
      const nextLandingDeg = currentRawDeg + direction * 360;
      const isLastTurnForThisSymbol = i === turns - 1;

      const completedTurn = await animateAnswerArmToRaw(
        nextLandingDeg,
        READING_TIMING.msPerFullTurn,
        readingId
      )

      if (!completedTurn || !isReadingRunActive(readingId)) return false
      currentRawDeg = nextLandingDeg;

      const depthLevel = Math.min(i + 1, 3);
      onDepthChange({ symbol, turns, symbolIndex, depthLevel });

      await wait(
        isLastTurnForThisSymbol
          ? READING_TIMING.pauseAfterFinalTurnMs
          : READING_TIMING.pauseBetweenTurnsMs,
      );
    }
    if (symbolIndex < sequence.length - 1) {
      await wait(
        randomMs(
          READING_TIMING.pauseBetweenSymbolsMinMs,
          READING_TIMING.pauseBetweenSymbolsMaxMs,
        ),
      );
    }
  }

  state.armDeg[ANSWER_ARM_IDX] = normalizeDeg(state.armDeg[ANSWER_ARM_IDX]);
  applyArm(ANSWER_ARM_IDX);

  await wait(READING_TIMING.finalPauseMs);

  if (!isReadingRunActive(readingId)) return false

  finishReadingRun(readingId)
  return true;
}

// ---- Spotlight auto-scale (alpha bbox) ----
const previewAutoCache = new Map(); // iconUrl -> { scale, nudgeX, nudgeY }

async function computeAutoPreview(
  iconUrl,
  { alphaThreshold = 8, targetFill = 0.88 } = {},
) {
  if (previewAutoCache.has(iconUrl)) return previewAutoCache.get(iconUrl);

  const img = new Image();
  img.src = iconUrl;
  await img.decode();

  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;

  // Downscale for speed (still accurate enough)
  const maxDim = 180;
  const scaleDown = Math.min(1, maxDim / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scaleDown));
  const ch = Math.max(1, Math.round(h * scaleDown));

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, 0, 0, cw, ch);

  const { data } = ctx.getImageData(0, 0, cw, ch);

  let minX = cw,
    minY = ch,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const a = data[(y * cw + x) * 4 + 3];
      if (a > alphaThreshold) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < 0) {
    const fallback = { scale: 1, nudgeX: 0, nudgeY: 0 };
    previewAutoCache.set(iconUrl, fallback);
    return fallback;
  }

  const bboxW = maxX - minX + 1;
  const bboxH = maxY - minY + 1;

  const bboxMax = Math.max(bboxW, bboxH);
  const imgMax = Math.max(cw, ch);

  // Scale so bbox occupies targetFill of the (downscaled) image box,
  // then your CSS % sizing handles the rest.
  const autoScale = (imgMax / bboxMax) * targetFill;

  // auto-center (conservative)
  const bboxCx = (minX + maxX) / 2;
  const bboxCy = (minY + maxY) / 2;
  const imgCx = (cw - 1) / 2;
  const imgCy = (ch - 1) / 2;
  const nudgeX = (imgCx - bboxCx) * 0.1;
  const nudgeY = (imgCy - bboxCy) * 0.1;

  const result = { scale: autoScale, nudgeX, nudgeY };
  previewAutoCache.set(iconUrl, result);
  return result;
}

function updateSpotlight() {
  const idx = state.selectedArm;
  if (idx == null || idx > 2) return;
  if (!spotlightMediaEl || !spotlightImgEl || !spotlightNameEl) return;

  const s = symbolForArmDeg(state.armDeg[idx]);
  spotlightNameEl.textContent = s?.name ?? "—";
  spotlightPrimaryEl.textContent = s?.primaryMeaning
    ? `${s.primaryMeaning}`
    : "—";

  const secs = Array.isArray(s?.secondaryMeanings)
    ? s.secondaryMeanings.filter(Boolean)
    : [];
  // Exaggerated trail: 80% then -10% each meaning, clamped
  const startOpacity = 0.8;
  const step = 0.1;
  const minOpacity = 0.15;

  spotlightSecondaryEl.innerHTML = secs
    .map((txt, i) => {
      const op = Math.max(minOpacity, startOpacity - i * step);
      return `<span class="meaning-item" style="opacity:${op}">${escapeHtml(txt)}</span>`;
    })
    .join("");

  applySymbolPreviewToMedia(s, spotlightMediaEl, spotlightImgEl)
}

async function applySymbolPreviewToMedia(symbol, mediaEl, imgEl) {
  if (!symbol || !mediaEl || !imgEl) return

  if (!symbol.iconUrl) {
    imgEl.removeAttribute("src")
    imgEl.alt = ""
    imgEl.style.visibility = "hidden"

    mediaEl.style.removeProperty("--prev-scale")
    mediaEl.style.removeProperty("--prev-rot")
    mediaEl.style.removeProperty("--prev-nudge-x")
    mediaEl.style.removeProperty("--prev-nudge-y")
    mediaEl.style.removeProperty("--prev-fit")

    return
  }

  const p = symbol.preview || {}

  imgEl.src = symbol.iconUrl
  imgEl.alt = symbol.name
  imgEl.style.visibility = "visible"

  mediaEl.style.setProperty("--prev-rot", `${p.rotate ?? 0}deg`)
  mediaEl.style.setProperty("--prev-fit", p.fit ?? "contain")

  const manualScale = p.scale ?? 1
  const manualNX = p.nudgeX ?? 0
  const manualNY = p.nudgeY ?? 0
  const useAuto = p.autoScale ?? true

  if (!useAuto) {
    mediaEl.style.setProperty("--prev-scale", String(manualScale))
    mediaEl.style.setProperty("--prev-nudge-x", `${manualNX}%`)
    mediaEl.style.setProperty("--prev-nudge-y", `${manualNY}%`)
    return
  }

  const auto = await computeAutoPreview(symbol.iconUrl, {
    alphaThreshold: p.alphaThreshold ?? 8,
    targetFill: p.targetFill ?? 0.88,
  })

  mediaEl.style.setProperty("--prev-scale", String(auto.scale * manualScale))
  mediaEl.style.setProperty("--prev-nudge-x", `${manualNX}%`)
  mediaEl.style.setProperty("--prev-nudge-y", `${manualNY}%`)
}

// ---- Interactions ----

// Arms 0..2 drag to rotate
arms.slice(0, 3).forEach((armEl, idx) => {
  armEl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    setSelectedArm(idx);
    state.drag = { kind: "arm", idx, pointerId: e.pointerId };
    armEl.setPointerCapture(e.pointerId);
  });

  armEl.addEventListener("pointermove", (e) => {
    if (!state.drag || state.drag.kind !== "arm" || state.drag.idx !== idx)
      return;
    state.armDeg[idx] = degFromPointer(e.clientX, e.clientY);
    render();
  });

  function endArmDrag() {
    if (!state.drag || state.drag.kind !== "arm" || state.drag.idx !== idx)
      return;
    state.drag = null;
    snapArm(idx);
  }

  armEl.addEventListener("pointerup", endArmDrag);
  armEl.addEventListener("pointercancel", endArmDrag);
});

// Dials 0..2 drag/wheel
dials.forEach((dialEl, idx) => {
  dialEl.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    setSelectedArm(idx);
    state.drag = {
      kind: "dial",
      idx,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startDeg: state.armDeg[idx],
    };
    dialEl.setPointerCapture(e.pointerId);
  });

  dialEl.addEventListener("pointermove", (e) => {
    const d = state.drag;
    if (!d || d.kind !== "dial" || d.idx !== idx || d.pointerId !== e.pointerId)
      return;
    if ((e.buttons & 1) !== 1) return;

    let delta;
    if (idx === 0) {
      delta = (e.clientX - d.startX) * DIAL_SENSITIVITY;
    } else {
      delta = -(e.clientY - d.startY) * DIAL_SENSITIVITY;
    }

    state.armDeg[idx] = normalizeDeg(d.startDeg + delta);
    render();
  });

  function endDialDrag() {
    const d = state.drag;
    if (!d || d.kind !== "dial" || d.idx !== idx) return;
    state.drag = null;
    snapArm(idx);
  }

  dialEl.addEventListener("pointerup", endDialDrag);
  dialEl.addEventListener("pointercancel", endDialDrag);
  dialEl.addEventListener("lostpointercapture", endDialDrag);

  dialEl.addEventListener(
    "wheel",
    (e) => {
      // allow browser zoom (Ctrl/⌘ + wheel / trackpad pinch)
      if (e.ctrlKey || e.metaKey) return;

      e.preventDefault();
      e.stopPropagation();
      setSelectedArm(idx);

      const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY;
      state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k);
      render();
      scheduleWheelSnap(idx);
    },
    { passive: false },
  );
});

// Scroll anywhere on face to rotate selected arm (or hovered arm)
faceEl.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    const hoveredIdx = armIdxFromWheelEvent(e);
    const idx =
      hoveredIdx != null && hoveredIdx < 3 ? hoveredIdx : state.selectedArm;
    if (idx !== state.selectedArm) setSelectedArm(idx);

    const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY;
    state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k);
    render();
    scheduleWheelSnap(idx);
  },
  { passive: false },
);

concentrateBtn.addEventListener("click", async () => {
  if (!answersEl) return;
  if (idle.isReading) return;

  const sequence = generateAnswerSequence();

  const entry = document.createElement("div");
  entry.className = "reading-entry";

  entry.innerHTML = `
    <div class="reading-card-list"></div>
  `;

  answersEl.innerHTML = ''
  answersEl.appendChild(entry)

  clearReadingAvailable()
  showReadingPanel()

  const cardListEl = entry.querySelector(".reading-card-list");
  if (!cardListEl) return;

  await playAnswerSequence(sequence, {
    onFirstLanding: ({ symbol, symbolIndex }) => {
      cardListEl.insertAdjacentHTML(
        'beforeend',
        readingCardHtml({ symbol, symbolIndex })
      )

      markReadingAvailable()
    },

    onDepthChange: ({ symbolIndex, depthLevel }) => {
      updateReadingCardDepth(symbolIndex, depthLevel, entry);
    },
  });
});

function showReadingEmptyState() {
  if (!answersEl) return

  answersEl.innerHTML = `
    <div class="reading-entry reading-empty">
      <div class="reading-empty-title">No reading yet</div>

      <div class="reading-empty-mark" aria-hidden="true">✦</div>

      <p>
        Set the three question arms, then press <strong>Concentrate</strong>.
        The answer arm will move through symbols and build a reading here.
      </p>
    </div>
  `
}

resetBtn.addEventListener('click', () => {
  cancelActiveReading({
    clearAnswers: true,
    returnToArms: true,
  })

  setSelectedArm(0)

  animateArmTo(0, 270, 220)
  animateArmTo(1, 30, 220)
  animateArmTo(2, 150, 220)

  showReadingEmptyState();
  clearReadingAvailable();
});

armsTabBtn?.addEventListener("click", () => {
  showNormalPanel();
});

dictionaryTabBtn?.addEventListener("click", () => {
  showDictionaryPanel()
})

readingTabBtn?.addEventListener("click", () => {
  showReadingPanel();
  clearReadingAvailable();
});

answersEl?.addEventListener("click", (e) => {
  const cardEl = e.target.closest(".reading-card")
  if (!cardEl) return

  const symbol = symbolByDeg(Number(cardEl.dataset.symbolDeg))
  if (!symbol) return

  renderDictionarySymbol(symbol)
  showDictionaryPanel()
})

answersEl?.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return

  const cardEl = e.target.closest(".reading-card")
  if (!cardEl) return

  e.preventDefault()

  const symbol = symbolByDeg(Number(cardEl.dataset.symbolDeg))
  if (!symbol) return

  renderDictionarySymbol(symbol)
  showDictionaryPanel()
})

// ---- init ----
buildArmSelectors();
buildSymbols();
setSelectedArm(0);
showReadingEmptyState();
buildDictionarySelect()
renderDictionarySymbol(SYMBOL_RING[0])
render();
pickNewIdleTarget(performance.now());
requestAnimationFrame(idleLoop);
