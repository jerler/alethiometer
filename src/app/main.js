import { inject } from "@vercel/analytics";
import "../style.css";
import { SYMBOL_RING, symbolForDeg } from "../data/constants.js";
import arm0Url from "../assets/arm-0.svg";
import arm1Url from "../assets/arm-1.svg";
import arm2Url from "../assets/arm-2.svg";
import arm3Url from "../assets/arm-3.svg";
import dialFrame0Url from "../assets/dial-frame-0.png";
import dialFrame1Url from "../assets/dial-frame-1.png";
import dialFrame2Url from "../assets/dial-frame-2.png";
import { createArmsController } from "../modules/arms.js";
import { createPanelUI } from "../modules/panel-ui.js";
import { createAnswerArmController } from "../modules/answer-arm.js";
import {
  READING_TIMING,
  generateAnswerSequence,
  playAnswerSequence,
} from "../modules/reading-engine.js";
import { createTutorial } from "../modules/tutorial.js";

inject(); // vercel analytics

/* DOM References */
const elements = {
  faceEl: document.getElementById("face"),
  symbolsEl: document.getElementById("symbols"),
  symbolRingEl: document.getElementById("symbolRing"),
  concentrateBtn: document.getElementById("concentrate"),
  resetBtn: document.getElementById("reset"),
  spotlightPrimaryEl: document.getElementById("spotlightPrimary"),
  spotlightSecondaryEl: document.getElementById("spotlightSecondary"),
  panelConcentrateBtn: document.getElementById("panelConcentrate"),
  panelClearBtn: document.getElementById("panelClear"),
  panelArmsEl: document.getElementById("panelArms"),
  panelReadingEl: document.getElementById("panelReading"),
  answersEl: document.getElementById("answers"),
  armsTabBtn: document.getElementById("armsTab"),
  readingTabBtn: document.getElementById("readingTab"),
  sideTabsEl: document.querySelector(".side-tabs"),
  panelDictionaryEl: document.getElementById("panelDictionary"),
  dictionaryTabBtn: document.getElementById("dictionaryTab"),
  dictionarySelectEl: document.getElementById("dictionarySelect"),
  dictionaryDetailEl: document.getElementById("dictionaryDetail"),
  howToPlayBtn: document.getElementById("howToPlayBtn"),
  skipToArmsLink: document.getElementById("skipToArms"),
  a11yStatusEl: document.getElementById("a11yStatus"),
  spotlightImgEl: document.getElementById("spotlightImg"),
  spotlightNameEl: document.getElementById("spotlightName"),
  spotlightMediaEl: document.getElementById("spotlightMedia"),
};

/* Root Collections */
const arms = Array.from(document.querySelectorAll(".arm"));
const dials = Array.from(document.querySelectorAll(".dial"));

/* Interaction Config */
const DIAL_FRAME_URLS = [dialFrame0Url, dialFrame1Url, dialFrame2Url];
const DIAL_FRAME_STEP_DEG = 10;
const DIAL_SENSITIVITY = 0.75;
const WHEEL_SENSITIVITY = 0.08;
const WHEEL_SENSITIVITY_FINE = 0.015;

/* App State */
const state = {
  selectedArm: 0,
  armDeg: [0, 120, 240, 50],
  drag: null,
};

/* Static Asset Wiring */
const armSvgUrls = [arm0Url, arm1Url, arm2Url, arm3Url];
arms.forEach((armEl, i) => {
  const img = armEl.querySelector(".arm-svg");
  if (!img) return;
  img.src = armSvgUrls[i];
  img.draggable = false;
});

/* Action Delegates */
let clearReadingAction = () => {};
let runConcentrate = () => {};

/* Module Setup */
const panelUI = createPanelUI({
  state,
  elements,
  SYMBOL_RING,
  symbolForDeg,
  onConcentrate: () => runConcentrate(),
  onClearReading: () => clearReadingAction(),
});

const armsController = createArmsController({
  state,
  arms,
  dials,
  faceEl: elements.faceEl,
  symbolsEl: elements.symbolsEl,
  symbolForDeg,
  SYMBOL_RING,
  dialFrameUrls: DIAL_FRAME_URLS,
  dialFrameStepDeg: DIAL_FRAME_STEP_DEG,
  dialSensitivity: DIAL_SENSITIVITY,
  wheelSensitivity: WHEEL_SENSITIVITY,
  wheelSensitivityFine: WHEEL_SENSITIVITY_FINE,
  onSelectionChange: () => {
    panelUI.updateSpotlight();
  },
  onStateChanged: () => {
    panelUI.updateSpotlight();

    const didCancel = answerArm.cancelReadingIfQuestionChanged(
      armsController.currentQuestionSymbolDegs,
      { pauseMs: READING_TIMING.pauseAfterFinalTurnMs },
    );

    if (didCancel) {
      panelUI.showReadingEmptyState();
      panelUI.clearReadingAvailable();
    }
  },
  onDescribeSymbol: (symbol) => {
    panelUI.openDictionaryForSymbol(symbol);
  },
});

const answerArm = createAnswerArmController({
  state,
  applyArm: armsController.applyArm,
});

const tutorial = createTutorial({
  rootEl: document.getElementById("tutorialOverlay"),
  state,
  elements,
  SYMBOL_RING,
  panelUI,
  armsController,
  answerArm,
});

/* Face Interaction Helpers */
function isNearFaceCenter(e) {
  const rect = elements.faceEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const distance = Math.hypot(dx, dy);

  const centerRadius = rect.width * 0.22;
  return distance <= centerRadius;
}

/* App Actions */
clearReadingAction = () => {
  answerArm.cancelActiveReading({
    pauseMs: READING_TIMING.pauseAfterFinalTurnMs,
  });

  panelUI.showReadingEmptyState();
  panelUI.clearReadingAvailable();
  panelUI.updatePanelButtons();
};

runConcentrate = async () => {
  if (!elements.answersEl) return;
  if (answerArm.idle.isReading) return;

  const sequence = generateAnswerSequence(SYMBOL_RING);

  const entry = document.createElement("div");
  entry.className = "reading-entry";
  entry.innerHTML = `<div class="reading-card-list"></div>`;

  elements.answersEl.innerHTML = "";
  elements.answersEl.appendChild(entry);

  if (panelUI.isMobileLayout()) {
    panelUI.markReadingAvailable();
    elements.readingTabBtn?.focus();
    panelUI.announceStatus("Reading is available in the Reading tab");
  } else {
    panelUI.clearReadingAvailable();
    panelUI.showReadingPanel();
    elements.panelReadingEl?.focus();
  }

  panelUI.updatePanelButtons();

  const cardListEl = entry.querySelector(".reading-card-list");
  if (!cardListEl) return;

  const readingCompleted = await playAnswerSequence({
    state,
    answerArm,
    getQuestionSymbolDegs: armsController.currentQuestionSymbolDegs,
    applyArm: armsController.applyArm,
    sequence,
    onFirstLanding: ({ symbol, symbolIndex }) => {
      panelUI.highlightSymbol(symbol);

      cardListEl.insertAdjacentHTML(
        "beforeend",
        panelUI.readingCardHtml({ symbol, symbolIndex }),
      );

      panelUI.updatePanelButtons();
      panelUI.markReadingAvailable();
    },
    onDepthChange: ({ symbol, symbolIndex, depthLevel }) => {
      panelUI.highlightSymbol(symbol);
      panelUI.updateReadingCardDepth(symbolIndex, depthLevel, entry);
    },
  });

  if (readingCompleted) {
    panelUI.announceStatus("Reading finished");
  }
};

/* Event Listeners */
elements.concentrateBtn.addEventListener("click", runConcentrate);

elements.howToPlayBtn.addEventListener("click", () => {
  tutorial.start({ manual: true });
});

elements.resetBtn.addEventListener("click", () => {
  clearReadingAction();
  armsController.resetQuestionArms();
});

let lastFaceTapAt = 0;
elements.faceEl.addEventListener("pointerup", (e) => {
  if (!isNearFaceCenter(e)) return;

  const now = performance.now();
  const isDoubleTap = now - lastFaceTapAt < 320;
  lastFaceTapAt = now;

  if (!isDoubleTap) return;

  e.preventDefault();

  if (answerArm.idle.isReading) {
    elements.resetBtn.click();
  } else {
    elements.concentrateBtn.click();
  }
});

/* Lifecycle */
panelUI.init();
panelUI.bindEvents();
armsController.init();
armsController.bindInteractions();
panelUI.updateSpotlight();
answerArm.startIdleLoop();
requestAnimationFrame(() => tutorial.startAutomatically());