import { normalizeDeg, randomInt } from "../utils/shared.js";
import { ANSWER_ARM_IDX } from "./answer-arm.js";

/* Timing */
export const READING_TIMING = {
  swingToSymbolMs: 1000,
  pauseOnFirstLandMs: 100,
  msPerFullTurn: 1500,
  pauseBetweenTurnsMs: 100,
  pauseAfterFinalTurnMs: 500,
  pauseBetweenSymbolsMinMs: 75,
  pauseBetweenSymbolsMaxMs: 250,
  finalPauseMs: 1000,
};

/* Animation / Wait Helpers */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomMs(min, max) {
  return randomInt(min, max);
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/* Sequence Generation */
function generateSymbolCount() {
  const weights = [
    { count: 1, weight: 8 },
    { count: 2, weight: 16 },
    { count: 3, weight: 22 },
    { count: 4, weight: 18 },
    { count: 5, weight: 8 },
    { count: 6, weight: 2 },
    { count: 7, weight: 2 },
    { count: 8, weight: 1 },
    { count: 9, weight: 1 },
    { count: 10, weight: 1 },
    { count: 11, weight: 1 },
    { count: 12, weight: 1 },
  ];

  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weights) {
    roll -= item.weight;
    if (roll <= 0) return item.count;
  }

  return 3;
}

function generateTurnCount() {
  const weights = [
    { turns: 3, weight: 15 },
    { turns: 2, weight: 25 },
    { turns: 1, weight: 25 },
    { turns: 0, weight: 35 },
  ];

  const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of weights) {
    roll -= item.weight;
    if (roll <= 0) return item.turns;
  }

  return 0;
}

function pickReadingSymbol(sequence, SYMBOL_RING) {
  const allowDuplicateChance = 0.25;

  let symbol;
  do {
    symbol = SYMBOL_RING[randomInt(0, SYMBOL_RING.length - 1)];

    const alreadyUsed = sequence.some((entry) => entry.symbol.deg === symbol.deg);

    if (!alreadyUsed || Math.random() < allowDuplicateChance) {
      return symbol;
    }
  } while (true);
}

/* Public Generators */
export function generateAnswerSequence(SYMBOL_RING) {
  const symbolCount = generateSymbolCount();
  const sequence = [];

  for (let i = 0; i < symbolCount; i++) {
    const symbol = pickReadingSymbol(sequence, SYMBOL_RING);
    const turns = generateTurnCount();

    sequence.push({ symbol, turns });
  }

  return sequence;
}

/* Reading Labels */
export function formatInterpretationDepth(level) {
  if (level <= 1) return "primary";
  if (level === 2) return "secondary";
  return "deep";
}

/* Reading Playback */
export async function playAnswerSequence({
  state,
  answerArm,
  getQuestionSymbolDegs,
  applyArm,
  sequence,
  onFirstLanding = () => {},
  onDepthChange = () => {},
}) {
  const readingId = answerArm.beginReadingRun(getQuestionSymbolDegs);

  let currentRawDeg = state.armDeg[ANSWER_ARM_IDX];

  for (let symbolIndex = 0; symbolIndex < sequence.length; symbolIndex++) {
    const { symbol, turns } = sequence[symbolIndex];
    const symbolDeg = symbol.deg;

    const direction = answerArm.randomDirection();

    const firstLandingDeg =
      currentRawDeg +
      answerArm.directedDiffToSymbol(currentRawDeg, symbolDeg, direction);

    const landed = await answerArm.animateAnswerArmToRaw(
      firstLandingDeg,
      READING_TIMING.swingToSymbolMs,
      readingId,
      easeInOutCubic,
    );

    if (!landed || !answerArm.isReadingRunActive(readingId)) return false;

    onFirstLanding({ symbol, turns, symbolIndex });
    await wait(
      turns > 0
        ? READING_TIMING.pauseOnFirstLandMs
        : READING_TIMING.pauseAfterFinalTurnMs,
    );

    currentRawDeg = firstLandingDeg;

    for (let i = 0; i < turns; i++) {
      const nextLandingDeg = currentRawDeg + direction * 360;
      const isLastTurnForThisSymbol = i === turns - 1;

      const completedTurn = await answerArm.animateAnswerArmToRaw(
        nextLandingDeg,
        READING_TIMING.msPerFullTurn,
        readingId,
        easeInOutCubic,
      );

      if (!completedTurn || !answerArm.isReadingRunActive(readingId)) return false;

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

  if (!answerArm.isReadingRunActive(readingId)) return false;

  answerArm.finishReadingRun(readingId);
  return true;
}
