import {
  escapeHtml,
  symbolAltText,
  symbolCssClassName,
  symbolPreviewLabel,
  toTitleCase,
} from "../utils/shared.js";
import { formatInterpretationDepth } from "./reading-engine.js";

export function createPanelUI({
  state,
  elements,
  SYMBOL_RING,
  symbolForDeg,
  onConcentrate = () => {},
  onClearReading = () => {},
}) {
  const {
    panelArmsEl,
    panelReadingEl,
    panelDictionaryEl,
    armsTabBtn,
    readingTabBtn,
    dictionaryTabBtn,
    sideTabsEl,
    answersEl,
    panelConcentrateBtn,
    panelClearBtn,
    dictionarySelectEl,
    dictionaryDetailEl,
    symbolRingEl,
    spotlightPrimaryEl,
    spotlightSecondaryEl,
    spotlightImgEl,
    spotlightNameEl,
    spotlightMediaEl,
    skipToArmsLink,
    a11yStatusEl,
  } = elements;

  /* Internal UI State */
  const previewAutoCache = new Map();
  const symbolHighlightTimers = new WeakMap();

  let lastSymbolTap = {
    deg: null,
    time: 0,
  };

  /* Accessibility */
  function announceStatus(message) {
    if (!a11yStatusEl || !message) return;

    a11yStatusEl.textContent = "";
    requestAnimationFrame(() => {
      a11yStatusEl.textContent = message;
    });
  }

  /* Panel / Mobile Layout Helpers */
  function isMobileLayout() {
    return window.matchMedia("(max-width: 900px)").matches;
  }

  function openMobilePanel() {
    if (!isMobileLayout()) return;
    panelDictionaryEl?.closest("aside")?.classList.add("mobile-panel-open");
  }

  function closeMobilePanel() {
    panelDictionaryEl?.closest("aside")?.classList.remove("mobile-panel-open");
  }

  function isMobilePanelOpen() {
    return panelDictionaryEl?.closest("aside")?.classList.contains("mobile-panel-open");
  }

  function showPanelTab(tabName) {
    const panels = {
      arms: panelArmsEl,
      reading: panelReadingEl,
      dictionary: panelDictionaryEl,
    };

    const tabs = {
      arms: armsTabBtn,
      reading: readingTabBtn,
      dictionary: dictionaryTabBtn,
    };

    for (const [name, panel] of Object.entries(panels)) {
      if (panel) panel.hidden = name !== tabName;
    }

    for (const [name, tab] of Object.entries(tabs)) {
      if (!tab) continue;

      const active = name === tabName;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.setAttribute("tabindex", active ? "0" : "-1");
    }

    if (tabName === "reading" && isReadingPanelActive()) {
      clearReadingAvailable();
    }
  }

  function showReadingPanel() {
    showPanelTab("reading");
  }

  function showDictionaryPanel() {
    showPanelTab("dictionary");
  }

  function isReadingPanelActive() {
    if (!panelReadingEl || panelReadingEl.hidden) return false;

    if (isMobileLayout()) {
      return isMobilePanelOpen();
    }

    return true;
  }

  function markReadingAvailable() {
    if (isReadingPanelActive()) return;
    readingTabBtn?.classList.add("has-reading");
  }

  function clearReadingAvailable() {
    readingTabBtn?.classList.remove("has-reading");
  }

  /* Symbol Lookup / Dictionary */
  function symbolByDeg(deg) {
    return SYMBOL_RING.find((symbol) => symbol.deg === deg);
  }

  function renderDictionarySymbol(symbol) {
    if (!dictionaryDetailEl || !dictionarySelectEl) return;

    dictionarySelectEl.value = String(symbol.deg);

    const secondaryMeanings = Array.isArray(symbol.secondaryMeanings)
      ? symbol.secondaryMeanings.filter(Boolean)
      : [];

    const primaryMeanings = [symbol.primaryMeaning, ...secondaryMeanings.slice(0, 3)].filter(Boolean);

    const secondaryMeaningsGroup = secondaryMeanings.slice(3, 7);
    const deepMeaningsGroup = secondaryMeanings.slice(7);

    const description = symbol.description || "No description found";

    dictionaryDetailEl.innerHTML = `
      <article class="dictionary-card">
        <div
          class="spotlight-media dictionary-media"
          role="img"
          aria-label="${escapeHtml(symbolPreviewLabel(symbol))}"
        >
          <img class="dictionary-image" alt="" />
        </div>

        <div class="dictionary-name">${escapeHtml(symbol.name)}</div>

        <div class="dictionary-primary-statement">
          ${escapeHtml(symbol.primaryMeaning ?? "-")}
        </div>

        <section class="dictionary-description-section" aria-labelledby="dictionaryDescriptionLabel">
          <h3 id="dictionaryDescriptionLabel" class="sr-only">Description</h3>
          <p>${escapeHtml(description)}</p>
        </section>

        <section class="dictionary-section" aria-labelledby="dictionaryPrimaryMeaningsLabel">
          <h3 id="dictionaryPrimaryMeaningsLabel" class="dictionary-label">Primary meanings</h3>
          <ul class="dictionary-meanings" aria-labelledby="dictionaryPrimaryMeaningsLabel">
            ${
              primaryMeanings.map((meaning) => `<li>${escapeHtml(meaning)}</li>`).join("") ||
              "<li>None listed</li>"
            }
          </ul>
        </section>

        <section class="dictionary-section" aria-labelledby="dictionarySecondaryMeaningsLabel">
          <h3 id="dictionarySecondaryMeaningsLabel" class="dictionary-label">Secondary meanings</h3>
          <ul class="dictionary-meanings" aria-labelledby="dictionarySecondaryMeaningsLabel">
            ${secondaryMeaningsGroup.map((meaning) => `<li>${escapeHtml(meaning)}</li>`).join("")}
            ${secondaryMeaningsGroup.length === 0 ? "<li>None listed</li>" : ""}
          </ul>
        </section>

        <section class="dictionary-section dictionary-deep-section" aria-labelledby="dictionaryDeepMeaningsLabel">
          <h3 id="dictionaryDeepMeaningsLabel" class="dictionary-label">Deep meanings</h3>
          <ul class="dictionary-meanings dictionary-deep-meanings" aria-labelledby="dictionaryDeepMeaningsLabel">
            ${deepMeaningsGroup
              .map((meaning, i) => {
                const opacity = Math.max(0.16, 0.8 - i * 0.08);
                return `<li style="opacity: ${opacity}">${escapeHtml(meaning)}</li>`;
              })
              .join("")}
            ${deepMeaningsGroup.length === 0 ? "<li>None listed</li>" : ""}
          </ul>
        </section>
      </article>
    `;

    const mediaEl = dictionaryDetailEl.querySelector(".dictionary-media");
    const imgEl = dictionaryDetailEl.querySelector(".dictionary-image");

    applySymbolPreviewToMedia(symbol, mediaEl, imgEl);
  }

  function openDictionaryForSymbol(symbol) {
    if (!symbol) return;

    renderDictionarySymbol(symbol);
    showDictionaryPanel();
    openMobilePanel();
  }

  /* Dictionary Select Setup */
  function buildDictionarySelect() {
    if (!dictionarySelectEl) return;

    dictionarySelectEl.innerHTML = "";

    for (const symbol of SYMBOL_RING) {
      const option = document.createElement("option");
      option.value = String(symbol.deg);
      option.textContent = symbol.name;
      dictionarySelectEl.appendChild(option);
    }

    dictionarySelectEl.addEventListener("change", () => {
      const symbol = symbolByDeg(Number(dictionarySelectEl.value));
      if (symbol) renderDictionarySymbol(symbol);
    });

    dictionarySelectEl.addEventListener("keydown", (e) => {
      const forwardKeys = ["ArrowDown", "ArrowRight"];
      const backwardKeys = ["ArrowUp", "ArrowLeft"];

      if (!forwardKeys.includes(e.key) && !backwardKeys.includes(e.key)) return;

      e.preventDefault();

      const currentIndex = dictionarySelectEl.selectedIndex;
      const lastIndex = dictionarySelectEl.options.length - 1;

      let nextIndex;

      if (forwardKeys.includes(e.key)) {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      } else {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      }

      dictionarySelectEl.selectedIndex = nextIndex;
      dictionarySelectEl.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }

  /* Symbol Preview / Spotlight Rendering */
  async function computeAutoPreview(iconUrl, { alphaThreshold = 8, targetFill = 0.88 } = {}) {
    if (previewAutoCache.has(iconUrl)) return previewAutoCache.get(iconUrl);

    const img = new Image();
    img.src = iconUrl;
    await img.decode();

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

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

    let minX = cw;
    let minY = ch;
    let maxX = -1;
    let maxY = -1;

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

    const autoScale = (imgMax / bboxMax) * targetFill;

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

  async function applySymbolPreviewToMedia(symbol, mediaEl, imgEl) {
    if (!symbol || !mediaEl || !imgEl) return;

    if (!symbol.iconUrl) {
      imgEl.removeAttribute("src");
      imgEl.alt = "";
      imgEl.style.visibility = "hidden";

      mediaEl.style.removeProperty("--preview-auto-scale");
      mediaEl.style.removeProperty("--preview-scale");
      mediaEl.style.removeProperty("--preview-rot");
      mediaEl.style.removeProperty("--preview-nudge-x");
      mediaEl.style.removeProperty("--preview-nudge-y");
      mediaEl.style.removeProperty("--preview-fit");
      return;
    }

    const previewClass = symbolCssClassName(symbol.name, "preview");
    const previousClass = mediaEl.dataset.symbolPreviewClass;
    if (previousClass) mediaEl.classList.remove(previousClass);

    imgEl.src = symbol.iconUrl;
    imgEl.alt = symbolAltText(symbol);
    imgEl.style.visibility = "visible";

    if (mediaEl.getAttribute("role") === "img") {
      mediaEl.setAttribute("aria-label", symbolPreviewLabel(symbol));
    }

    if (previewClass) {
      mediaEl.classList.add(previewClass);
      mediaEl.dataset.symbolPreviewClass = previewClass;
    } else {
      mediaEl.dataset.symbolPreviewClass = "";
    }

    const auto = await computeAutoPreview(symbol.iconUrl, {
      alphaThreshold: 8,
      targetFill: 0.88,
    });

    mediaEl.style.setProperty("--preview-auto-scale", String(auto.scale));
  }

  function updateSpotlight() {
    const idx = state.selectedArm;
    if (idx == null || idx > 2) return;
    if (!spotlightMediaEl || !spotlightImgEl || !spotlightNameEl) return;

    const s = symbolForDeg(state.armDeg[idx]);
    spotlightNameEl.textContent = s?.name ?? "-";
    spotlightPrimaryEl.textContent = s?.primaryMeaning ? toTitleCase(s.primaryMeaning) : "-";

    const secs = Array.isArray(s?.secondaryMeanings) ? s.secondaryMeanings.filter(Boolean) : [];
    const startOpacity = 0.8;
    const step = 0.1;
    const minOpacity = 0.15;

    spotlightSecondaryEl.innerHTML = secs
      .map((txt, i) => {
        const op = Math.max(minOpacity, startOpacity - i * step);
        return `<span class="meaning-item" style="opacity:${op}">${escapeHtml(txt)}</span>`;
      })
      .join("");

    applySymbolPreviewToMedia(s, spotlightMediaEl, spotlightImgEl);
  }

  /* Symbol Ring UI */
  function buildSymbols() {
    symbolRingEl.innerHTML = "";

    for (const s of SYMBOL_RING) {
      if (!s.iconUrl) continue;

      const el = document.createElement("div");
      el.className = "symbol";
      const symbolClass = symbolCssClassName(s.name, "symbol");
      if (symbolClass) el.classList.add(symbolClass);
      el.dataset.symbolDeg = String(s.deg);
      el.style.setProperty("--deg", `${s.deg}deg`);

      const img = document.createElement("img");
      img.src = s.iconUrl;
      img.alt = symbolAltText(s);

      el.appendChild(img);
      symbolRingEl.appendChild(el);
    }
  }

  function highlightSymbol(symbol, durationMs = 5600) {
    if (!symbolRingEl || !symbol) return;

    const symbolEl = symbolRingEl.querySelector(`.symbol[data-symbol-deg="${symbol.deg}"]`);
    if (!symbolEl) return;

    const existingTimer = symbolHighlightTimers.get(symbolEl);
    if (existingTimer) window.clearTimeout(existingTimer);

    symbolEl.classList.remove("symbol-highlight");
    void symbolEl.offsetWidth;
    symbolEl.classList.add("symbol-highlight");

    const timer = window.setTimeout(() => {
      symbolEl.classList.remove("symbol-highlight");
      symbolHighlightTimers.delete(symbolEl);
    }, durationMs);

    symbolHighlightTimers.set(symbolEl, timer);
  }

  /* Reading Card UI */
  function readingCardHtml({ symbol, symbolIndex }) {
    const previewClass = symbolCssClassName(symbol.name, "preview");
    const depth = formatInterpretationDepth(1);
    const primaryMeaning = symbol.primaryMeaning || "No primary meaning listed";
    const cardA11yLabel = `Icon ${symbolIndex + 1} - ${symbol.name} - primary meaning: ${primaryMeaning}. Press Enter or Space to view this symbol in the dictionary.`;

    return `
      <div
        class="reading-card"
        data-reading-card="${symbolIndex}"
        data-symbol-deg="${symbol.deg}"
        role="button"
        tabindex="0"
        aria-label="${escapeHtml(cardA11yLabel)}"
      >
        <div class="reading-card-image-wrap${previewClass ? ` ${previewClass}` : ""}">
          <img
            class="reading-card-image"
            src="${symbol.iconUrl}"
            alt="${escapeHtml(symbolAltText(symbol))}"
          />
        </div>

        <div class="reading-card-text">
          <div class="reading-card-name">${escapeHtml(symbol.name)}</div>
          <div class="reading-card-depth" data-depth="${depth}">${depth}</div>
        </div>
      </div>
    `;
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

  /* Reading Panel State */
  function showReadingEmptyState() {
    if (!answersEl) return;

    answersEl.innerHTML = `
      <div class="reading-entry reading-empty">
        <div class="reading-empty-title">No reading yet</div>

        <div class="reading-empty-mark" aria-hidden="true">✦</div>

        <p>
          Set the three question arms, then press <strong>Concentrate</strong>.
          The answer arm will move through symbols and build a reading here.
        </p>
      </div>
    `;
  }

  function updatePanelButtons() {
    const hasReading = answersEl.querySelector(".reading-card") !== null;
    panelClearBtn.hidden = !hasReading;
  }


  /* Tab Navigation */
  function handlePanelTabClick(tabName) {
    const tabMap = {
      arms: armsTabBtn,
      reading: readingTabBtn,
      dictionary: dictionaryTabBtn,
    };

    const clickedTab = tabMap[tabName];
    const clickedActiveTab = clickedTab?.classList.contains("active");

    if (isMobileLayout() && clickedActiveTab && isMobilePanelOpen()) {
      closeMobilePanel();
      return;
    }

    showPanelTab(tabName);
    openMobilePanel();

    if (tabName === "reading") clearReadingAvailable();
  }

  function tabNameForButton(btn) {
    if (!btn) return null;
    if (btn === armsTabBtn) return "arms";
    if (btn === readingTabBtn) return "reading";
    if (btn === dictionaryTabBtn) return "dictionary";
    return null;
  }

  function moveTabFocus(step) {
    const tabs = [armsTabBtn, readingTabBtn, dictionaryTabBtn].filter(Boolean);
    const activeIdx = tabs.indexOf(document.activeElement);
    if (tabs.length === 0 || activeIdx === -1) return;

    const nextIdx = (activeIdx + step + tabs.length) % tabs.length;
    const nextTab = tabs[nextIdx];
    const nextName = tabNameForButton(nextTab);
    if (!nextName) return;

    nextTab.focus();
    handlePanelTabClick(nextName);
  }

  /* Event Listeners */
  function bindEvents() {
    panelConcentrateBtn?.addEventListener("click", () => {
      onConcentrate();
      closeMobilePanel();
    });

    panelClearBtn?.addEventListener("click", () => {
      onClearReading();
      showReadingEmptyState();
      clearReadingAvailable();
      updatePanelButtons();
    });

    armsTabBtn?.addEventListener("click", () => {
      handlePanelTabClick("arms");
    });

    readingTabBtn?.addEventListener("click", () => {
      handlePanelTabClick("reading");
    });

    dictionaryTabBtn?.addEventListener("click", () => {
      handlePanelTabClick("dictionary");
    });

    sideTabsEl?.addEventListener("keydown", (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
        return;
      }

      e.preventDefault();

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        moveTabFocus(-1);
        return;
      }

      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        moveTabFocus(1);
        return;
      }

      if (e.key === "Home") {
        armsTabBtn?.focus();
        handlePanelTabClick("arms");
        return;
      }

      dictionaryTabBtn?.focus();
      handlePanelTabClick("dictionary");
    });

    skipToArmsLink?.addEventListener("click", (e) => {
      e.preventDefault();
      showPanelTab("arms");
      openMobilePanel();
      panelArmsEl?.focus();
    });

    answersEl?.addEventListener("click", (e) => {
      const cardEl = e.target.closest(".reading-card");
      if (!cardEl) return;

      const symbol = symbolByDeg(Number(cardEl.dataset.symbolDeg));
      if (!symbol) return;

      renderDictionarySymbol(symbol);
      showDictionaryPanel();
      openMobilePanel();
    });

    answersEl?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;

      const cardEl = e.target.closest(".reading-card");
      if (!cardEl) return;

      e.preventDefault();

      const symbol = symbolByDeg(Number(cardEl.dataset.symbolDeg));
      if (!symbol) return;

      renderDictionarySymbol(symbol);
      showDictionaryPanel();
      openMobilePanel();
    });

    symbolRingEl?.addEventListener("pointerup", (e) => {
      const symbolEl = e.target.closest(".symbol");
      if (!symbolEl) return;

      const symbolDeg = Number(symbolEl.dataset.symbolDeg);
      const symbol = symbolByDeg(symbolDeg);
      if (!symbol) return;

      const now = performance.now();
      const isSameSymbol = lastSymbolTap.deg === symbolDeg;
      const isDoubleTap = isSameSymbol && now - lastSymbolTap.time < 320;

      lastSymbolTap = {
        deg: symbolDeg,
        time: now,
      };

      if (!isDoubleTap) return;

      e.preventDefault();
      e.stopPropagation();

      openDictionaryForSymbol(symbol);
    });

  }

  /* Lifecycle */
  function init() {
    buildSymbols();
    buildDictionarySelect();
    renderDictionarySymbol(SYMBOL_RING[0]);
    showReadingEmptyState();
    updatePanelButtons();
  }

  /* Public API */
  return {
    init,
    bindEvents,
    announceStatus,
    isMobileLayout,
    showReadingPanel,
    showPanelTab,
    openMobilePanel,
    closeMobilePanel,
    isMobilePanelOpen,
    clearReadingAvailable,
    markReadingAvailable,
    updatePanelButtons,
    showReadingEmptyState,
    readingCardHtml,
    updateReadingCardDepth,
    highlightSymbol,
    openDictionaryForSymbol,
    updateSpotlight,
  };
}
