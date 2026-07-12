import { normalizeDeg, rand } from "../utils/shared.js";

/* Constants */
export const ANSWER_ARM_IDX = 3; //0-indexed

export function createAnswerArmController({ state, applyArm }) {
  /* Idle State */
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

  /* Reading Run State */
  function currentQuestionSymbolDegs(getQuestionDegs) {
    return getQuestionDegs();
  }

  function beginReadingRun(getQuestionDegs) {
    activeReading.id += 1;
    activeReading.questionSymbolDegs = currentQuestionSymbolDegs(getQuestionDegs);

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

  function cancelActiveReading({ pauseMs }) {
    if (!idle.isReading && !activeReading.questionSymbolDegs) return false;

    const now = performance.now();

    activeReading.id += 1;
    activeReading.questionSymbolDegs = null;

    idle.isReading = false;
    idle.velocity = 0;
    idle.lastTime = now;
    idle.pausedUntil = now + pauseMs;

    pickNewIdleTarget(now + pauseMs);
    return true;
  }

  function cancelReadingIfQuestionChanged(getQuestionDegs, { pauseMs }) {
    if (!idle.isReading || !activeReading.questionSymbolDegs) return false;

    const currentDegs = currentQuestionSymbolDegs(getQuestionDegs);

    const changed = currentDegs.some((deg, i) => {
      return deg !== activeReading.questionSymbolDegs[i];
    });

    if (!changed) return false;

    return cancelActiveReading({ pauseMs });
  }

  /* Animation Helpers */
  function setAnswerArmRawDeg(deg) {
    state.armDeg[ANSWER_ARM_IDX] = deg;
    applyArm(ANSWER_ARM_IDX);
  }

  function animateAnswerArmToRaw(targetDeg, durationMs, readingId, easeFn) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const startDeg = state.armDeg[ANSWER_ARM_IDX];
      const diff = targetDeg - startDeg;

      function frame(now) {
        if (readingId != null && !isReadingRunActive(readingId)) {
          resolve(false);
          return;
        }

        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = easeFn(t);

        setAnswerArmRawDeg(startDeg + diff * eased);

        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          setAnswerArmRawDeg(targetDeg);
          resolve(true);
        }
      }

      requestAnimationFrame(frame);
    });
  }

  /* Direction Helpers */
  function randomDirection() {
    return Math.random() < 0.5 ? -1 : 1;
  }

  function directedDiffToSymbol(fromDeg, symbolDeg, direction) {
    const from = normalizeDeg(fromDeg);
    const to = normalizeDeg(symbolDeg);

    if (direction === 1) {
      return (to - from + 360) % 360;
    }

    return -((from - to + 360) % 360);
  }

  /* Idle Motion */
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
    applyArm(ANSWER_ARM_IDX);
    requestAnimationFrame(idleLoop);
  }

  function startIdleLoop() {
    pickNewIdleTarget(performance.now());
    requestAnimationFrame(idleLoop);
  }

  function pauseIdle() {
    const now = performance.now();

    idle.velocity = 0;
    idle.lastTime = now;
    idle.pausedUntil = Number.POSITIVE_INFINITY;
  }

  function resumeIdle() {
    const now = performance.now();

    idle.velocity = 0;
    idle.lastTime = now;
    idle.pausedUntil = 0;
    pickNewIdleTarget(now);
  }

  /* Public API */
  return {
    idle,
    beginReadingRun,
    isReadingRunActive,
    finishReadingRun,
    cancelActiveReading,
    cancelReadingIfQuestionChanged,
    animateAnswerArmToRaw,
    randomDirection,
    directedDiffToSymbol,
    startIdleLoop,
    pauseIdle,
    resumeIdle,
  };
}
