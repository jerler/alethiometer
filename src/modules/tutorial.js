const TUTORIAL_VERSION = "2";
const TUTORIAL_STORAGE_KEY = "alethiometer:tutorial-version";
const SVG_NS = "http://www.w3.org/2000/svg";

function canUseLocalStorage() {
  try {
    const testKey = `${TUTORIAL_STORAGE_KEY}:test`;
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function isElementVisible(element) {
  if (!element) return false;

  const styles = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    styles.display !== "none" &&
    styles.visibility !== "hidden" &&
    Number(styles.opacity) !== 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function expandRect(rect, padding = 8) {
  return {
    left: Math.max(0, rect.left - padding),
    top: Math.max(0, rect.top - padding),
    right: Math.min(window.innerWidth, rect.right + padding),
    bottom: Math.min(window.innerHeight, rect.bottom + padding),
    width: Math.min(window.innerWidth, rect.right + padding) - Math.max(0, rect.left - padding),
    height: Math.min(window.innerHeight, rect.bottom + padding) - Math.max(0, rect.top - padding),
  };
}

function overlapArea(a, b) {
  const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return width * height;
}

export function createTutorial({
  rootEl,
  state,
  elements,
  SYMBOL_RING,
  panelUI,
  armsController,
  answerArm,
}) {
  const maskBaseEl = rootEl?.querySelector("#tutorialMaskBase");
  const maskHolesEl = rootEl?.querySelector("#tutorialMaskHoles");
  const outlinesEl = rootEl?.querySelector("#tutorialOutlines");
  const cardEl = rootEl?.querySelector(".tutorial-card");
  const progressEl = rootEl?.querySelector("#tutorialProgress");
  const announcementEl = rootEl?.querySelector("#tutorialAnnouncement");
  const titleEl = rootEl?.querySelector("#tutorialTitle");
  const bodyEl = rootEl?.querySelector("#tutorialBody");
  const backBtn = rootEl?.querySelector("#tutorialBack");
  const nextBtn = rootEl?.querySelector("#tutorialNext");
  const skipBtn = rootEl?.querySelector("#tutorialSkip");
  const rememberRowEl = rootEl?.querySelector("#tutorialRememberRow");
  const rememberCheckbox = rootEl?.querySelector("#tutorialRemember");
  const rememberButton = rootEl?.querySelector("#tutorialRememberButton");

  const demoSymbol =
    SYMBOL_RING.find((symbol) => symbol.name.toLowerCase() === "serpent") ??
    SYMBOL_RING[0];

  let currentStepIndex = 0;
  let snapshot = null;
  let resizeFrame = null;
  let announcementFrame = null;
  let layoutTimer = null;

  const backgroundElements = [
    document.getElementById("skipToArms"),
    ...document.querySelectorAll(
      "#app > header, #app > aside, #app > main",
    ),
  ].filter(Boolean);

  function setBackgroundInert(isInert) {
    backgroundElements.forEach((element) => {
      element.inert = isInert;
    });
  }

  const steps = [
    {
      id: "introduction",
      title: "Welcome to the Alethiometer",
      body: () => `
        <p>
          An alethiometer is a mystical instrument that reveals truths, but only to those who know how to read it.
          Its answers are given through the layered meanings of its 36 symbols. Concentrate on your question and let the Dust of the universe flow through the golden compass.
        </p>
        <p>
          Inspired by the truth-telling device from
          <em>His Dark Materials</em> by Philip Pullman, this digital version
          invites you to practice your own reading, and uncover hidden truths
          in your life.
        </p>
        <p>
          This short guide will teach you the basics for how to become a skilled reader of the alethiometer. You can reopen it
          at any time with the <strong>?</strong> button.
        </p>
      `,
      targets: () => [],
    },
    {
      id: "question-arms",
      title: "Ask your question with three symbols",
      body: () => `
        <p>
          Each golden dial controls one of the three moveable question arms. Move a dial,
          drag an arm, use the mouse wheel or arrow keys, or choose a symbol
          directly from the <strong>Arms</strong> tab.
        </p>
        <p>
          Choose three symbols that best represent the heart of your question. 
          There is no single correct choice; understanding your own interpretations and 
          relationships with the symbols is a skill that deepens with practice.
        </p>
        <div class="tutorial-example">
          <div class="tutorial-example-label">For example</div>
          <p><q>How can I move through this change?</q></p>
          <ul>
            <li><strong>Hourglass</strong> for change and passing time</li>
            <li><strong>Anchor</strong> for what keeps you grounded</li>
            <li><strong>Bird</strong> for freedom or a new perspective</li>
          </ul>
        </div>
      `,
      prepare: () => {
        panelUI.showPanelTab("arms");
        if (panelUI.isMobileLayout()) panelUI.closeMobilePanel();
      },
      targets: () => [
        { selector: ".dial-0", padding: 8, radius: 18 },
        { selector: ".dial-1", padding: 8, radius: 18 },
        { selector: ".dial-2", padding: 8, radius: 18 },
        { selector: "#armsTab", padding: 5, radius: 14 },
      ],
    },
    {
      id: "concentrate",
      title: "Concentrate on the question",
      body: () =>
        panelUI.isMobileLayout()
          ? `
            <p>
              Take a breath, clear your mind, and focus on the question. Then double-tap the center of the
              alethiometer to begin the reading, or tap the <strong>Concentrate</strong> button at the bottom of the Arms tab.
            </p>
            <p>
              Double-tapping the center again while concentrating resets
              the compass back to its starting position.
            </p>
          `
          : `
            <p>
              Take a breath, clear your mind, and focus on the question. Then double-click the center of the
              alethiometer or press either <strong>Concentrate</strong> button.
            </p>
            <p>
              Double-click the center again (or clicking Reset) while concentrating resets
              the compass back to its starting position.
            </p>
          `,
      prepare: () => {
        panelUI.showPanelTab("arms");
        if (panelUI.isMobileLayout()) panelUI.closeMobilePanel();
      },
      targets: () => [
        {
          getRect: () => {
            const faceRect = elements.faceEl.getBoundingClientRect();
            const size = faceRect.width * 0.28;
            const left = faceRect.left + faceRect.width / 2 - size / 2;
            const top = faceRect.top + faceRect.height / 2 - size / 2;

            return {
              left,
              top,
              right: left + size,
              bottom: top + size,
              width: size,
              height: size,
            };
          },
          padding: 4,
          radius: 999,
        },
        {
          selector: "#concentrate",
          padding: 6,
          radius: 999,
          when: () => !panelUI.isMobileLayout(),
        },
        {
          selector: "#panelConcentrate",
          padding: 6,
          radius: 999,
          when: () => !panelUI.isMobileLayout(),
        },
      ],
    },
    {
      id: "reading",
      title: "Follow the answer arm",
      body: () => `
        <p>
          The universe responds to your question by guiding the fourth arm to new symbols to form an answer.
          Each symbol it visits is added to the <strong>Reading</strong> tab in the order it appears.
        </p>
        <p>
          Each additional turn before the arm settles on a symbol draws the interpretation of the meaning deeper. Landing once on a symbol suggests the reader should take a surface level (primary) interpretation of that symbol, while additional turns ask the reader to consider their deeper and more profound associations.
        </p>
        <div class="tutorial-example">
          <div class="tutorial-example-label">For example</div>
          <p><strong>Serpent</strong></p>
          <ul>
            <li>
              A <strong>primary</strong> meaning might suggest <strong>cunning</strong>.
            </li>
            <li>
              A <strong>secondary</strong> meaning might suggest <strong>temptation</strong>.
            </li>
            <li>
              A <strong>deep</strong> meaning might suggest <strong>rebirth</strong> or <strong>shedding one’s skin</strong>.
            </li>
          </ul>
        </div>
      `,
      mobileCardPosition: "lower",
      mobileLayoutDelayMs: 260,
      prepare: () => {
        showDemoReading();
        panelUI.showPanelTab("reading");
        if (panelUI.isMobileLayout()) panelUI.openMobilePanel();
      },
      targets: () => [
        { selector: "#readingTab", padding: 5, radius: 14 },
        { selector: "[data-tutorial-demo]", padding: 8, radius: 18 },
        {
          selector: ".arm-3 .arm-svg",
          padding: 8,
          radius: 14,
          when: () => !panelUI.isMobileLayout(),
        },
      ],
    },
    {
      id: "dictionary",
      title: "Explore the Dictionary",
      body: () => `
        <p>
          The Dictionary describes possible layers of meaning for every symbol.
          It is meant to be a guide to help get you started rather than be an authoritative source: you must combine its suggestions with
          your original question as well as your own interpretations and associations.
        </p>
        <p>
          You can also open a symbol here by selecting a reading card or by
          double-clicking or double-tapping a symbol on the alethiometer face.
        </p>
        <p>
          Remember, the Dictionary is a tool to help you interpret the symbols, but the true answers come from your own understanding and intuition! Trust your gut.
        </p>
      `,
      mobileCardPosition: "lower",
      mobileLayoutDelayMs: 260,
      prepare: () => {
        panelUI.openDictionaryForSymbol(demoSymbol);
      },
      targets: () => [
        { selector: "#dictionaryTab", padding: 5, radius: 14 },
        { selector: "#dictionarySelect", padding: 6, radius: 12 },
        { selector: ".dictionary-card", padding: 8, radius: 18 },
      ],
    },
    {
      id: "conclusion",
      title: "You are ready to read",
      body: () => `
        <p>
          Set the three moveable arms, concentrate on your question, and interpret the sequence made
          by the fourth arm. There is no single correct reading; fluency grows as
          you learn how the symbols speak to you.
        </p>
        <p>
          The <strong>?</strong> button will always reopen this guide.
        </p>
      `,
      targets: () => [],
    },
  ];

  function storageValue() {
    if (!canUseLocalStorage()) return null;
    return localStorage.getItem(TUTORIAL_STORAGE_KEY);
  }

  function shouldStartAutomatically() {
    return storageValue() !== TUTORIAL_VERSION;
  }

  function rememberTutorialChoice() {
    if (!canUseLocalStorage()) return;
    localStorage.setItem(TUTORIAL_STORAGE_KEY, TUTORIAL_VERSION);
  }

  function forgetTutorialChoice() {
    if (!canUseLocalStorage()) return;
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  }

  function announceStep(step) {
    if (!announcementEl) return;

    if (announcementFrame) {
      cancelAnimationFrame(announcementFrame);
    }

    announcementEl.textContent = "";

    announcementFrame = requestAnimationFrame(() => {
      announcementEl.textContent =
        `Step ${currentStepIndex + 1} of ${steps.length}: ${step.title}.`;

      announcementFrame = null;
    });
  }

  function activePanelName() {
    if (elements.readingTabBtn?.classList.contains("active")) return "reading";
    if (elements.dictionaryTabBtn?.classList.contains("active")) return "dictionary";
    return "arms";
  }

  function captureSnapshot() {
    snapshot = {
      activePanel: activePanelName(),
      mobilePanelOpen: panelUI.isMobilePanelOpen(),
      answerArmDeg: state.armDeg[3],
      answersHtml: elements.answersEl?.innerHTML ?? "",
      readingAvailable: elements.readingTabBtn?.classList.contains("has-reading") ?? false,
      dictionaryValue: elements.dictionarySelectEl?.value ?? "",
      previousFocus: document.activeElement,
    };
  }

  function restoreSnapshot() {
    if (!snapshot) return;

    state.armDeg[3] = snapshot.answerArmDeg;
    armsController.applyArm(3);

    if (elements.answersEl) {
      elements.answersEl.innerHTML = snapshot.answersHtml;
    }

    panelUI.updatePanelButtons();
    elements.readingTabBtn?.classList.toggle("has-reading", snapshot.readingAvailable);

    if (elements.dictionarySelectEl && snapshot.dictionaryValue) {
      elements.dictionarySelectEl.value = snapshot.dictionaryValue;
      elements.dictionarySelectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    panelUI.showPanelTab(snapshot.activePanel);

    if (panelUI.isMobileLayout()) {
      if (snapshot.mobilePanelOpen) panelUI.openMobilePanel();
      else panelUI.closeMobilePanel();
    }

    answerArm.resumeIdle();

    const focusTarget = snapshot.previousFocus;
    snapshot = null;

    if (focusTarget instanceof HTMLElement && focusTarget.isConnected) {
      focusTarget.focus();
    } else {
      elements.faceEl?.focus?.();
    }
  }

  function showDemoReading() {
    if (!elements.answersEl || !demoSymbol) return;

    state.armDeg[3] = demoSymbol.deg;
    armsController.applyArm(3);

    elements.answersEl.innerHTML = `
      <div class="reading-entry" data-tutorial-demo>
        <div class="reading-card-list">
          ${panelUI.readingCardHtml({ symbol: demoSymbol, symbolIndex: 0 })}
        </div>
      </div>
    `;

    // panelUI.updateReadingCardDepth(0, 2, elements.answersEl);
    panelUI.updatePanelButtons();
    panelUI.clearReadingAvailable();
  }

  function resolveTargetRect(target) {
    if (target.when && !target.when()) return null;

    let rect;

    if (target.getRect) {
      rect = target.getRect();
    } else {
      const element = document.querySelector(target.selector);
      if (!isElementVisible(element)) return null;
      rect = element.getBoundingClientRect();
    }

    if (!rect || rect.width <= 0 || rect.height <= 0) return null;

    const expanded = expandRect(rect, target.padding ?? 8);
    if (expanded.width <= 0 || expanded.height <= 0) return null;

    return {
      ...expanded,
      radius: target.radius ?? 14,
    };
  }

  function renderSpotlights() {
    if (!rootEl || rootEl.hidden) return;

    const step = steps[currentStepIndex];
    const targetRects = step.targets().map(resolveTargetRect).filter(Boolean);

    const width = window.innerWidth;
    const height = window.innerHeight;

    maskBaseEl?.setAttribute("width", String(width));
    maskBaseEl?.setAttribute("height", String(height));

    const svgEl = rootEl.querySelector(".tutorial-spotlight-svg");
    svgEl?.setAttribute("viewBox", `0 0 ${width} ${height}`);

    if (maskHolesEl) maskHolesEl.replaceChildren();
    if (outlinesEl) outlinesEl.replaceChildren();

    for (const rect of targetRects) {
      const holeEl = document.createElementNS(SVG_NS, "rect");
      holeEl.setAttribute("x", String(rect.left));
      holeEl.setAttribute("y", String(rect.top));
      holeEl.setAttribute("width", String(rect.width));
      holeEl.setAttribute("height", String(rect.height));
      holeEl.setAttribute("rx", String(rect.radius));
      holeEl.setAttribute("ry", String(rect.radius));
      holeEl.setAttribute("fill", "black");
      maskHolesEl?.appendChild(holeEl);

      const outlineEl = document.createElement("div");
      outlineEl.className = "tutorial-target-outline";
      outlineEl.style.left = `${rect.left}px`;
      outlineEl.style.top = `${rect.top}px`;
      outlineEl.style.width = `${rect.width}px`;
      outlineEl.style.height = `${rect.height}px`;
      outlineEl.style.borderRadius = `${rect.radius}px`;
      outlinesEl?.appendChild(outlineEl);
    }

    positionCard(targetRects);
  }

  function positionCard(targetRects) {
    if (!cardEl) return;

    const viewportPadding = 16;
    const gap = 18;

    cardEl.style.visibility = "hidden";
    cardEl.style.left = `${viewportPadding}px`;
    cardEl.style.top = `${viewportPadding}px`;

    const cardRect = cardEl.getBoundingClientRect();
    const cardWidth = Math.min(cardRect.width, window.innerWidth - viewportPadding * 2);
    const cardHeight = Math.min(cardRect.height, window.innerHeight - viewportPadding * 2);

    const step = steps[currentStepIndex];
    if (panelUI.isMobileLayout() && step.mobileCardPosition === "lower") {
      const centeredLeft = Math.max(viewportPadding, (window.innerWidth - cardWidth) / 2);
      const preferredTop = window.innerHeight * 0.47;
      const maxTop = window.innerHeight - cardHeight - viewportPadding;
      const top = Math.max(viewportPadding, Math.min(maxTop, preferredTop));

      cardEl.style.left = `${centeredLeft}px`;
      cardEl.style.top = `${top}px`;
      cardEl.style.visibility = "visible";
      return;
    }

    if (targetRects.length === 0) {
      cardEl.style.left = `${Math.max(viewportPadding, (window.innerWidth - cardWidth) / 2)}px`;
      cardEl.style.top = `${Math.max(viewportPadding, (window.innerHeight - cardHeight) / 2)}px`;
      cardEl.style.visibility = "visible";
      return;
    }

    const union = targetRects.reduce(
      (result, rect) => ({
        left: Math.min(result.left, rect.left),
        top: Math.min(result.top, rect.top),
        right: Math.max(result.right, rect.right),
        bottom: Math.max(result.bottom, rect.bottom),
      }),
      {
        left: window.innerWidth,
        top: window.innerHeight,
        right: 0,
        bottom: 0,
      },
    );

    const centeredX = Math.max(
      viewportPadding,
      Math.min(
        window.innerWidth - cardWidth - viewportPadding,
        (window.innerWidth - cardWidth) / 2,
      ),
    );

    const centeredY = Math.max(
      viewportPadding,
      Math.min(
        window.innerHeight - cardHeight - viewportPadding,
        (window.innerHeight - cardHeight) / 2,
      ),
    );

    const candidates = [
      { left: centeredX, top: viewportPadding },
      { left: centeredX, top: window.innerHeight - cardHeight - viewportPadding },
      { left: viewportPadding, top: centeredY },
      { left: window.innerWidth - cardWidth - viewportPadding, top: centeredY },
      {
        left: Math.max(viewportPadding, Math.min(window.innerWidth - cardWidth - viewportPadding, union.right + gap)),
        top: centeredY,
      },
      {
        left: Math.max(viewportPadding, Math.min(window.innerWidth - cardWidth - viewportPadding, union.left - cardWidth - gap)),
        top: centeredY,
      },
      {
        left: centeredX,
        top: Math.max(viewportPadding, Math.min(window.innerHeight - cardHeight - viewportPadding, union.bottom + gap)),
      },
      {
        left: centeredX,
        top: Math.max(viewportPadding, Math.min(window.innerHeight - cardHeight - viewportPadding, union.top - cardHeight - gap)),
      },
    ];

    const scoredCandidates = candidates.map((candidate) => {
      const candidateRect = {
        left: candidate.left,
        top: candidate.top,
        right: candidate.left + cardWidth,
        bottom: candidate.top + cardHeight,
      };

      const overlap = targetRects.reduce(
        (total, targetRect) => total + overlapArea(candidateRect, targetRect),
        0,
      );

      return { ...candidate, overlap };
    });

    scoredCandidates.sort((a, b) => a.overlap - b.overlap);
    const best = scoredCandidates[0];

    cardEl.style.left = `${best.left}px`;
    cardEl.style.top = `${best.top}px`;
    cardEl.style.visibility = "visible";
  }

  function updateStepContent() {
    const step = steps[currentStepIndex];
    const isFirst = currentStepIndex === 0;
    const isLast = currentStepIndex === steps.length - 1;
    const isMobile = panelUI.isMobileLayout();

    if (layoutTimer) {
      clearTimeout(layoutTimer);
      layoutTimer = null;
    }

    rootEl.dataset.tutorialStep = step.id;
    progressEl.textContent = `Step ${currentStepIndex + 1} of ${steps.length}`;
    titleEl.replaceChildren();

    const sparkleEl = document.createElement("span");
    sparkleEl.textContent = "✨";
    sparkleEl.setAttribute("aria-hidden", "true");

    titleEl.append(` ${step.title} `,sparkleEl);
    bodyEl.innerHTML = step.body();

    announceStep(step);
    backBtn.hidden = isFirst;
    skipBtn.hidden = !isFirst;
    rememberRowEl.hidden = !isLast || isMobile;
    rememberButton.hidden = !isLast || !isMobile;
    nextBtn.textContent = isLast ? "Finish" : "Next";

    cardEl.style.visibility = "hidden";
    maskHolesEl?.replaceChildren();
    outlinesEl?.replaceChildren();

    step.prepare?.();

    const finishRender = () => {
      requestAnimationFrame(() => {
        renderSpotlights();
        nextBtn.focus();
      });
    };

    if (isMobile && step.mobileLayoutDelayMs) {
      layoutTimer = window.setTimeout(finishRender, step.mobileLayoutDelayMs);
    } else {
      requestAnimationFrame(finishRender);
    }
  }

  function goToStep(index) {
    currentStepIndex = Math.max(0, Math.min(steps.length - 1, index));
    updateStepContent();
  }

  function close({ remember = false, forget = false } = {}) {
    if (!rootEl || rootEl.hidden) return;

    if (remember) rememberTutorialChoice();
    if (forget) forgetTutorialChoice();

    if (layoutTimer) {
      clearTimeout(layoutTimer);
      layoutTimer = null;
    }

    if (announcementFrame) {
      cancelAnimationFrame(announcementFrame);
      announcementFrame = null;
    }

    if (announcementEl) {
      announcementEl.textContent = "";
    }

    rootEl.hidden = true;
    setBackgroundInert(false);
    document.body.classList.remove("tutorial-open");
    window.removeEventListener("resize", scheduleSpotlightRender);
    window.removeEventListener("scroll", scheduleSpotlightRender, true);

    restoreSnapshot();
  }

  function start({ manual = false } = {}) {
    if (!rootEl || !rootEl.hidden) return false;

    if (answerArm.idle.isReading) {
      panelUI.announceStatus("Wait for the current reading to finish before opening the tutorial");
      return false;
    }

    if (!manual && !shouldStartAutomatically()) return false;

    captureSnapshot();
    answerArm.pauseIdle();

    currentStepIndex = 0;
    rootEl.hidden = false;
    setBackgroundInert(true);
    document.body.classList.add("tutorial-open");

    if (rememberCheckbox) rememberCheckbox.checked = true;

    window.addEventListener("resize", scheduleSpotlightRender);
    window.addEventListener("scroll", scheduleSpotlightRender, true);

    updateStepContent();
    return true;
  }

  function scheduleSpotlightRender() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(renderSpotlights);
  }

  function focusableElements() {
    return Array.from(
      cardEl.querySelectorAll(
        'button:not([hidden]):not(:disabled), input:not([hidden]):not(:disabled), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(isElementVisible);
  }

  function handleKeydown(event) {
    if (rootEl.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = focusableElements();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (!focusable.includes(active)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus();
      return;
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  backBtn?.addEventListener("click", () => goToStep(currentStepIndex - 1));

  nextBtn?.addEventListener("click", () => {
    const isLast = currentStepIndex === steps.length - 1;

    if (!isLast) {
      goToStep(currentStepIndex + 1);
      return;
    }

    if (panelUI.isMobileLayout()) {
      close();
      return;
    }

    const remember = rememberCheckbox?.checked ?? true;
    close({ remember, forget: !remember });
  });

  rememberButton?.addEventListener("click", () => {
    close({ remember: true });
  });

  skipBtn?.addEventListener("click", () => {
    close({ remember: true });
  });

  rootEl?.addEventListener("keydown", handleKeydown);

  return {
    start,
    startAutomatically: () => start({ manual: false }),
    resetStoredPreference: forgetTutorialChoice,
  };
}