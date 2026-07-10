import { SYMBOL_STEP_DEG } from "../data/constants.js";
import { mod, normalizeDeg, shortestDiffDeg } from "../utils/shared.js";

export function createArmsController({
  state,
  arms,
  dials,
  faceEl,
  symbolsEl,
  symbolForDeg,
  SYMBOL_RING,
  dialFrameUrls,
  dialFrameStepDeg,
  dialSensitivity,
  wheelSensitivity,
  wheelSensitivityFine,
  onSelectionChange = () => {},
  onStateChanged = () => {},
  onDescribeSymbol = () => {},
}) {
  /* Controller State */
  const armKeyStepDeg = 360 / SYMBOL_RING.length;

  let armSelects = [];
  let armDescribeButtons = [];

  const dialAnim = state.armDeg.slice(0, 3).map((deg) => ({
    phase: 0,
    lastArmDeg: deg,
  }));

  const reversedDialIndices = new Set([1]);

  const wheelSnapTimers = Array(3).fill(null);

  /* Core Arm Getters / Setters */
  function applyArm(idx) {
    arms[idx].style.transform = `rotate(${normalizeDeg(state.armDeg[idx] - 90)}deg)`;
  }

  function getFaceCenter() {
    const r = faceEl.getBoundingClientRect();
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
  }

  function degFromPointer(clientX, clientY) {
    const { cx, cy } = getFaceCenter();
    const dx = clientX - cx;
    const dy = clientY - cy;
    const rad = Math.atan2(dy, dx);
    return normalizeDeg(rad * (180 / Math.PI) + 90);
  }

  function snapToSymbol(d) {
    return Math.round(d / SYMBOL_STEP_DEG) * SYMBOL_STEP_DEG;
  }

  /* Selection / Dial Rendering */
  function setSelectedArm(idx) {
    state.selectedArm = idx;
    arms
      .slice(0, 3)
      .forEach((el, i) => el.classList.toggle("selected", i === idx));
    dials.forEach((el, i) => el.classList.toggle("selected", i === idx));

    onSelectionChange();
  }

  function setDialFrame(idx, frameIdx) {
    const dialEl = dials[idx];
    if (!dialEl) return;

    const url = dialFrameUrls[mod(frameIdx, dialFrameUrls.length)];
    dialEl.style.backgroundImage = `url("${url}")`;
  }

  function buildDials() {
    dials.forEach((dialEl) => {
      dialEl.style.backgroundImage = `url("${dialFrameUrls[0]}")`;
      dialEl.style.backgroundSize = "contain";
      dialEl.style.backgroundRepeat = "no-repeat";
      dialEl.style.backgroundPosition = "center";
    });
  }

  function updateDialFrames() {
    for (let i = 0; i < 3; i++) {
      const currentDeg = normalizeDeg(state.armDeg[i]);
      const delta = shortestDiffDeg(dialAnim[i].lastArmDeg, currentDeg);
      const direction = reversedDialIndices.has(i) ? -1 : 1;

      dialAnim[i].lastArmDeg = currentDeg;
      dialAnim[i].phase += (delta / dialFrameStepDeg) * direction;

      setDialFrame(i, Math.round(dialAnim[i].phase));
    }
  }

  /* Arm Selector UI */
  function buildArmSelectors() {
    symbolsEl.innerHTML = "";
    armSelects = [];
    armDescribeButtons = [];

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

      const describeBtn = document.createElement("button");
      describeBtn.type = "button";
      describeBtn.className = "arm-describe-button";
      describeBtn.dataset.arm = String(i);
      describeBtn.textContent = `Describe Arm ${i + 1} in dictionary`;
      describeBtn.setAttribute("aria-label", `Describe Arm ${i + 1} in dictionary`);

      describeBtn.addEventListener("click", () => {
        const symbol = symbolForDeg(state.armDeg[i]);
        if (!symbol) return;
        onDescribeSymbol(symbol);
      });

      for (const symbol of SYMBOL_RING) {
        const option = document.createElement("option");
        option.value = String(symbol.deg);
        option.textContent = symbol.name;
        select.appendChild(option);
      }

      select.addEventListener("change", (e) => {
        const symbolDeg = Number(e.target.value);

        setSelectedArm(i);
        animateArmTo(i, symbolDeg, 220);
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
      row.appendChild(describeBtn);
      symbolsEl.appendChild(row);

      armSelects.push(select);
      armDescribeButtons.push(describeBtn);
    }
  }

  function updateArmSelectors() {
    armSelects.forEach((select, i) => {
      const symbol = symbolForDeg(state.armDeg[i]);
      select.value = String(symbol.deg);

      const describeBtn = armDescribeButtons[i];
      if (!describeBtn) return;

      const label = `Describe ${symbol.name} in dictionary`;
      describeBtn.textContent = label;
      describeBtn.setAttribute("aria-label", label);
    });
  }

  /* Render / Animations */
  function render() {
    for (let i = 0; i < state.armDeg.length; i++) {
      state.armDeg[i] = normalizeDeg(state.armDeg[i]);
    }

    for (let i = 0; i < arms.length; i++) {
      applyArm(i);
    }

    updateDialFrames();
    updateArmSelectors();
    onStateChanged();
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

  /* Wheel Helpers */
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

  /* Event Listeners */
  function bindInteractions() {
    document.addEventListener("keydown", (e) => {
      const clockwiseKeys = ["ArrowRight", "ArrowDown"];
      const counterClockwiseKeys = ["ArrowLeft", "ArrowUp"];

      if (e.defaultPrevented) return;

      if (!clockwiseKeys.includes(e.key) && !counterClockwiseKeys.includes(e.key)) {
        return;
      }

      const tagName = document.activeElement?.tagName?.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      e.preventDefault();

      const idx = state.selectedArm;
      if (idx == null || idx > 2) return;

      const direction = clockwiseKeys.includes(e.key) ? 1 : -1;
      const targetDeg = snapToSymbol(state.armDeg[idx] + direction * armKeyStepDeg);

      animateArmTo(idx, targetDeg, 160);
    });

    arms.slice(0, 3).forEach((armEl, idx) => {
      armEl.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        setSelectedArm(idx);
        state.drag = { kind: "arm", idx, pointerId: e.pointerId };
        armEl.setPointerCapture(e.pointerId);
      });

      armEl.addEventListener("pointermove", (e) => {
        if (!state.drag || state.drag.kind !== "arm" || state.drag.idx !== idx) return;
        state.armDeg[idx] = degFromPointer(e.clientX, e.clientY);
        render();
      });

      function endArmDrag() {
        if (!state.drag || state.drag.kind !== "arm" || state.drag.idx !== idx) return;
        state.drag = null;
        snapArm(idx);
      }

      armEl.addEventListener("pointerup", endArmDrag);
      armEl.addEventListener("pointercancel", endArmDrag);
    });

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
        if (!d || d.kind !== "dial" || d.idx !== idx || d.pointerId !== e.pointerId) return;
        if ((e.buttons & 1) !== 1) return;

        let delta;
        if (idx === 0) {
          delta = (e.clientX - d.startX) * dialSensitivity;
        } else {
          delta = -(e.clientY - d.startY) * dialSensitivity;
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
          if (e.ctrlKey || e.metaKey) return;

          e.preventDefault();
          e.stopPropagation();
          setSelectedArm(idx);

          const k = e.shiftKey ? wheelSensitivityFine : wheelSensitivity;
          state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k);
          render();
          scheduleWheelSnap(idx);
        },
        { passive: false },
      );
    });

    faceEl.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();

        const hoveredIdx = armIdxFromWheelEvent(e);
        const idx = hoveredIdx != null && hoveredIdx < 3 ? hoveredIdx : state.selectedArm;
        if (idx !== state.selectedArm) setSelectedArm(idx);

        const k = e.shiftKey ? wheelSensitivityFine : wheelSensitivity;
        state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k);
        render();
        scheduleWheelSnap(idx);
      },
      { passive: false },
    );
  }

  /* Reading / Reset Helpers */
  function currentQuestionSymbolDegs() {
    return state.armDeg.slice(0, 3).map((deg) => symbolForDeg(deg).deg);
  }

  function resetQuestionArms() {
    setSelectedArm(0);

    animateArmTo(0, 0, 220);
    animateArmTo(1, 120, 220);
    animateArmTo(2, 240, 220);
  }

  /* Lifecycle */
  function init() {
    buildArmSelectors();
    buildDials();
    setSelectedArm(0);
    render();
  }

  /* Public API */
  return {
    init,
    render,
    bindInteractions,
    applyArm,
    setSelectedArm,
    currentQuestionSymbolDegs,
    resetQuestionArms,
  };
}
