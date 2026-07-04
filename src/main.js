import './style.css'
import { symbolForArmDeg, SYMBOL_RING } from './constants.js'
import arm0Url from './assets/arm-0.svg'
import arm1Url from './assets/arm-1.svg'
import arm2Url from './assets/arm-2.svg'
import arm3Url from './assets/arm-3.svg'

const faceEl = document.getElementById('face')
const arms = Array.from(document.querySelectorAll('.arm'))
const dials = Array.from(document.querySelectorAll('.dial'))
const symbolsEl = document.getElementById('symbols')
const symbolRingEl = document.getElementById('symbolRing')
const concentrateBtn = document.getElementById('concentrate')
const resetBtn = document.getElementById('reset')
const spotlightPrimaryEl = document.getElementById('spotlightPrimary')
const spotlightSecondaryEl = document.getElementById('spotlightSecondary')

// Answer panel
const panelNormalEl = document.getElementById('panelNormal')
const panelReadingEl = document.getElementById('panelReading')
const backToControlsBtn = document.getElementById('backToControls')
const answersEl = document.getElementById('answers')

// Spotlight elements (panel)
const spotlightImgEl = document.getElementById('spotlightImg')
const spotlightNameEl = document.getElementById('spotlightName')
const spotlightMediaEl = document.querySelector('.spotlight-media')

const DIAL_SENSITIVITY = 0.75
const WHEEL_SENSITIVITY = 0.08
const WHEEL_SENSITIVITY_FINE = 0.015
const SYMBOL_COUNT = 36
const ANSWER_ARM_IDX = 3

let armSelects = [];

// Attach SVGs
const armSvgUrls = [arm0Url, arm1Url, arm2Url, arm3Url]
arms.forEach((armEl, i) => {
  const img = armEl.querySelector('.arm-svg')
  if (!img) return
  img.src = armSvgUrls[i]
  img.draggable = false
})

// ---- State ----
const state = {
  selectedArm: 0,
  armDeg: [270, 30, 150, 320],
  drag: null, // { kind: 'arm'|'dial', idx, pointerId, startX, startY, startDeg }
}

// wheel snap timers (for arms 0..2)
const wheelSnapTimers = Array(3).fill(null)

// idle drift for arm 3
const idle = {
  velocity: 30,
  targetVel: -12,
  nextChangeAt: 0,
  lastTime: performance.now(),
  pausedUntil: 0,
  stopEase: null, // {startTime, duration, startVelocity}
  isReading: false,
}

// ---- Helpers ----
function normalizeDeg(d) {
  d %= 360
  return d < 0 ? d + 360 : d
}

function armDegForSymbol(symbol) {
  return normalizeDeg(symbol.deg - 90)
}

function armDegForNorthDeg(northDeg) {
  return normalizeDeg(northDeg - 90)
}

function showNormalPanel() {
  panelNormalEl.hidden = false
  panelReadingEl.hidden = true
}

function showReadingPanel() {
  panelNormalEl.hidden = true
  panelReadingEl.hidden = false
}

function shortestDiffDeg(from, to) {
  return ((to - from + 540) % 360) - 180
}

function snapToSymbol(d) {
  const step = 360 / SYMBOL_COUNT
  return Math.round(d / step) * step
}

function setSelectedArm(idx) {
  state.selectedArm = idx
  arms.slice(0, 3).forEach((el, i) => el.classList.toggle('selected', i === idx))
  dials.forEach((el, i) => el.classList.toggle('selected', i === idx))
  updateSpotlight()
}

function getFaceCenter() {
  const r = faceEl.getBoundingClientRect()
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
}

// pointer position -> degrees, 0 right, clockwise positive
function degFromPointer(clientX, clientY) {
  const { cx, cy } = getFaceCenter()
  const dx = clientX - cx
  const dy = clientY - cy
  const rad = Math.atan2(dy, dx)
  return normalizeDeg(rad * (180 / Math.PI))
}

function applyArm(idx) {
  arms[idx].style.transform = `rotate(${normalizeDeg(state.armDeg[idx])}deg)`
}

function easeIdleToStop(durationMs = 450, pauseMs = 2000) {
  const now = performance.now()

  idle.stopEase = {
    startTime: now,
    duration: durationMs,
    startVelocity: idle.velocity,
  }

  idle.pausedUntil = now + durationMs + pauseMs
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
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function randomMs(min, max) {
  return randomInt(min, max)
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function setAnswerArmRawDeg(deg) {
  state.armDeg[ANSWER_ARM_IDX] = deg
  arms[ANSWER_ARM_IDX].style.transform = `rotate(${deg}deg)`
}

function animateAnswerArmToRaw(targetDeg, durationMs) {
  return new Promise(resolve => {
    const startTime = performance.now()
    const startDeg = state.armDeg[ANSWER_ARM_IDX]
    const diff = targetDeg - startDeg

    function frame(now) {
      const t = Math.min(1, (now - startTime) / durationMs)
      const eased = easeInOutCubic(t)

      setAnswerArmRawDeg(startDeg + diff * eased)

      if (t < 1) {
        requestAnimationFrame(frame)
      } else {
        setAnswerArmRawDeg(targetDeg)
        resolve()
      }
    }

    requestAnimationFrame(frame)
  })
}

function buildArmSelectors() {
  symbolsEl.innerHTML = ''
  armSelects = []

  for (let i = 0; i < 3; i++) {
    const row = document.createElement('div')
    row.className = 'symbol-row arm-control-row'

    const label = document.createElement('label')
    label.htmlFor = `armSelect-${i}`
    label.textContent = `Arm ${i + 1}`

    const select = document.createElement('select')
    select.id = `armSelect-${i}`
    select.className = 'arm-symbol-select'
    select.dataset.arm = String(i)

    for (const symbol of SYMBOL_RING) {
      const option = document.createElement('option')
      option.value = String(symbol.deg)
      option.textContent = symbol.name
      select.appendChild(option)
    }

    select.addEventListener('change', (e) => {
      const symbolDeg = Number(e.target.value)

      setSelectedArm(i)
      animateArmTo(i, armDegForNorthDeg(symbolDeg), 220)
    })

    select.addEventListener('keydown', (e) => {
      const forwardKeys = ['ArrowDown', 'ArrowRight']
      const backwardKeys = ['ArrowUp', 'ArrowLeft']

      if (!forwardKeys.includes(e.key) && !backwardKeys.includes(e.key)) return

      e.preventDefault()

      const currentIndex = select.selectedIndex
      const lastIndex = select.options.length - 1

      let nextIndex

      if (forwardKeys.includes(e.key)) {
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1
      } else {
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1
      }

      select.selectedIndex = nextIndex
      select.dispatchEvent(new Event('change', { bubbles: true }))
    })
    row.appendChild(label)
    row.appendChild(select)
    symbolsEl.appendChild(row)

    armSelects.push(select)
  }
}

function updateArmSelectors() {
  armSelects.forEach((select, i) => {
    const symbol = symbolForArmDeg(state.armDeg[i])
    select.value = String(symbol.deg)
  })
}

function render() {
  // normalize in place, then apply transforms
  for (let i = 0; i < state.armDeg.length; i++) state.armDeg[i] = normalizeDeg(state.armDeg[i])
  for (let i = 0; i < arms.length; i++) applyArm(i)

  updateArmSelectors();
  updateSpotlight();
}

function animateArmTo(idx, targetDeg, ms = 160) {
  const start = performance.now()
  const from = state.armDeg[idx]
  const diff = shortestDiffDeg(from, targetDeg)

  const easeOut = (t) => 1 - Math.pow(1 - t, 3)

  function frame(now) {
    const t = Math.min(1, (now - start) / ms)
    state.armDeg[idx] = normalizeDeg(from + diff * easeOut(t))
    render()
    if (t < 1) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

function snapArm(idx) {
  if (state.drag) return
  animateArmTo(idx, snapToSymbol(state.armDeg[idx]))
}

function randomDirection() {
  return Math.random() < 0.5 ? -1 : 1
}

// direction: 1 = clockwise, -1 = counter-clockwise
function directedDiffToSymbol(fromDeg, symbolDeg, direction) {
  const from = normalizeDeg(fromDeg)
  const to = normalizeDeg(symbolDeg)

  if (direction === 1) {
    return (to - from + 360) % 360
  }

  return -((from - to + 360) % 360)
}

function scheduleWheelSnap(idx, delayMs = 120) {
  if (wheelSnapTimers[idx]) clearTimeout(wheelSnapTimers[idx])
  wheelSnapTimers[idx] = setTimeout(() => snapArm(idx), delayMs)
}

function armIdxFromWheelEvent(e) {
  const el = document.elementFromPoint(e.clientX, e.clientY)
  const svg = el?.closest?.('.arm-svg')
  if (!svg) return null
  const armEl = svg.closest('.arm')
  if (!armEl) return null
  return Number(armEl.dataset.arm)
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

// ---- Symbols ring ----
function buildSymbols() {
  symbolRingEl.innerHTML = ''
  for (const s of SYMBOL_RING) {
    if (!s.iconUrl) continue

    const el = document.createElement('div')
    el.className = 'symbol'
    el.style.setProperty('--deg', `${s.deg}deg`)

    const a = s.appearance || {}
    if (a.scale != null) el.style.setProperty('--sym-scale', String(a.scale))
    if (a.rotate != null) el.style.setProperty('--sym-rot', `${a.rotate}deg`)
    if (a.opacity != null) el.style.setProperty('--sym-opacity', String(a.opacity))

    const BASE_SYMBOL_SIZE = 40

    if (a.nudgeX != null) {
      el.style.setProperty('--sym-nudge-x', `${a.nudgeX / BASE_SYMBOL_SIZE}em`)
    }

    if (a.nudgeY != null) {
      el.style.setProperty('--sym-nudge-y', `${a.nudgeY / BASE_SYMBOL_SIZE}em`)
    }

    const img = document.createElement('img')
    img.src = s.iconUrl
    img.alt = s.name

    el.appendChild(img)
    symbolRingEl.appendChild(el)
  }
}

// ---- Idle arm (arm 3) ----
function rand(min, max) { return min + Math.random() * (max - min) }

function pickNewIdleTarget(now) {
  const dir = Math.random() < 0.55 ? -1 : 1
  const speed = Math.random() < 0.15 ? rand(18, 45) : rand(9, 16)
  idle.targetVel = dir * speed
  idle.nextChangeAt = now + rand(900, 2600)
}

function stepIdle(dt) {
  const chase = 2.2
  idle.velocity += (idle.targetVel - idle.velocity) * (1 - Math.exp(-chase * dt))
  state.armDeg[ANSWER_ARM_IDX] = normalizeDeg(state.armDeg[ANSWER_ARM_IDX] + idle.velocity * dt)
}

function idleLoop(now) {
  if (idle.isReading) {
    idle.lastTime = now
    requestAnimationFrame(idleLoop)
    return
  }

  const dt = Math.min(0.05, (now - idle.lastTime) / 1000)
  idle.lastTime = now;

  if (idle.stopEase) {
    const elapsed = now - idle.stopEase.startTime
    const t = Math.min(1, elapsed / idle.stopEase.duration)

    // ease-out: fast at first, gentle at the end
    const eased = 1 - Math.pow(1 - t, 3)

    idle.velocity = idle.stopEase.startVelocity * (1 - eased)
    state.armDeg[ANSWER_ARM_IDX] = normalizeDeg(
      state.armDeg[ANSWER_ARM_IDX] + idle.velocity * dt
    )

    applyArm(ANSWER_ARM_IDX)

    if (t >= 1) {
      idle.velocity = 0
      idle.stopEase = null
    }

    requestAnimationFrame(idleLoop)
    return
  }

  if (now < idle.pausedUntil) {
    requestAnimationFrame(idleLoop)
    return
  }

  if (now >= idle.nextChangeAt) pickNewIdleTarget(now)

  stepIdle(dt)
  applyArm(ANSWER_ARM_IDX) // only update idle arm
  requestAnimationFrame(idleLoop)
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateAnswerSequence() {
  let remainingTurns = randomInt(1, 12)
  const totalTurns = remainingTurns
  const sequence = []

  while (remainingTurns > 0) {
    const turns = randomInt(1, Math.min(3, remainingTurns))
    const symbol = SYMBOL_RING[randomInt(0, SYMBOL_RING.length - 1)]

    sequence.push({
      symbol,
      turns,
    })

    remainingTurns -= turns
  }

  return {
    totalTurns,
    sequence,
  }
}

function formatInterpretationDepth(turns) {
  if (turns === 1) return 'primary'
  if (turns === 2) return 'secondary'
  return 'deep'
}

function formatTurns(turns) {
  if (turns === 1) return '1 turn'
  return `${turns} turns`
}

async function playAnswerSequence(sequence) {
  idle.isReading = true
  idle.stopEase = null
  idle.velocity = 0

  let currentRawDeg = state.armDeg[ANSWER_ARM_IDX]

  for (let symbolIndex = 0; symbolIndex < sequence.length; symbolIndex++) {
    const { symbol, turns } = sequence[symbolIndex];
    const symbolDeg = armDegForSymbol(symbol)

    // Pick a fresh direction for moving between symbols.
    // 1 = clockwise, -1 = counter-clockwise
    const direction = randomDirection()

    // Move to the target symbol using the chosen direction.
    const firstLandingDeg =
      currentRawDeg + directedDiffToSymbol(currentRawDeg, symbolDeg, direction)

    await animateAnswerArmToRaw(firstLandingDeg, READING_TIMING.swingToSymbolMs)

    await wait(
      turns > 0
        ? READING_TIMING.pauseOnFirstLandMs
        : READING_TIMING.pauseAfterFinalTurnMs
    )

    currentRawDeg = firstLandingDeg

    // Repeated turns on this same symbol keep the same direction.
    for (let i = 0; i < turns; i++) {
      const nextLandingDeg = currentRawDeg + direction * 360
      const isLastTurnForThisSymbol = i === turns - 1

      await animateAnswerArmToRaw(
        nextLandingDeg,
        READING_TIMING.msPerFullTurn
      )

      currentRawDeg = nextLandingDeg

      await wait(
        isLastTurnForThisSymbol
          ? READING_TIMING.pauseAfterFinalTurnMs
          : READING_TIMING.pauseBetweenTurnsMs
      )
    }
    if (symbolIndex < sequence.length - 1) {
      await wait(randomMs(
        READING_TIMING.pauseBetweenSymbolsMinMs,
        READING_TIMING.pauseBetweenSymbolsMaxMs
      ))
    }
  }

  state.armDeg[ANSWER_ARM_IDX] = normalizeDeg(state.armDeg[ANSWER_ARM_IDX])
  applyArm(ANSWER_ARM_IDX)

  await wait(READING_TIMING.finalPauseMs)

  idle.lastTime = performance.now()
  idle.velocity = 0
  pickNewIdleTarget(performance.now())
  idle.isReading = false
}

// ---- Spotlight auto-scale (alpha bbox) ----
const previewAutoCache = new Map() // iconUrl -> { scale, nudgeX, nudgeY }
let spotlightUpdateToken = 0
let lastSpotlightIconUrl = null

async function computeAutoPreview(iconUrl, {
  alphaThreshold = 8,
  targetFill = 0.88,
} = {}) {
  if (previewAutoCache.has(iconUrl)) return previewAutoCache.get(iconUrl)

  const img = new Image()
  img.src = iconUrl
  await img.decode()

  const w = img.naturalWidth || img.width
  const h = img.naturalHeight || img.height

  // Downscale for speed (still accurate enough)
  const maxDim = 180
  const scaleDown = Math.min(1, maxDim / Math.max(w, h))
  const cw = Math.max(1, Math.round(w * scaleDown))
  const ch = Math.max(1, Math.round(h * scaleDown))

  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.clearRect(0, 0, cw, ch)
  ctx.drawImage(img, 0, 0, cw, ch)

  const { data } = ctx.getImageData(0, 0, cw, ch)

  let minX = cw, minY = ch, maxX = -1, maxY = -1
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const a = data[(y * cw + x) * 4 + 3]
      if (a > alphaThreshold) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < 0) {
    const fallback = { scale: 1, nudgeX: 0, nudgeY: 0 }
    previewAutoCache.set(iconUrl, fallback)
    return fallback
  }

  const bboxW = (maxX - minX + 1)
  const bboxH = (maxY - minY + 1)

  const bboxMax = Math.max(bboxW, bboxH)
  const imgMax = Math.max(cw, ch)

  // Scale so bbox occupies targetFill of the (downscaled) image box,
  // then your CSS % sizing handles the rest.
  const autoScale = (imgMax / bboxMax) * targetFill

  // auto-center (conservative)
  const bboxCx = (minX + maxX) / 2
  const bboxCy = (minY + maxY) / 2
  const imgCx = (cw - 1) / 2
  const imgCy = (ch - 1) / 2
  const nudgeX = (imgCx - bboxCx) * 0.10
  const nudgeY = (imgCy - bboxCy) * 0.10

  const result = { scale: autoScale, nudgeX, nudgeY }
  previewAutoCache.set(iconUrl, result)
  return result
}

function applyAutoReadingCardPreviews(rootEl) {
  const cardMediaEls = Array.from(rootEl.querySelectorAll('.reading-card-image-wrap'))

  cardMediaEls.forEach((mediaEl) => {
    const iconUrl = mediaEl.dataset.cardIconUrl
    if (!iconUrl) return

    computeAutoPreview(iconUrl, {
      alphaThreshold: 8,
      targetFill: 0.78,
    }).then((auto) => {
      mediaEl.style.setProperty('--card-scale', String(auto.scale))
      mediaEl.style.setProperty('--card-nudge-x', `${auto.nudgeX}px`)
      mediaEl.style.setProperty('--card-nudge-y', `${auto.nudgeY}px`)
    })
  })
}

function updateSpotlight() {
  const idx = state.selectedArm
  if (idx == null || idx > 2) return
  if (!spotlightMediaEl || !spotlightImgEl || !spotlightNameEl) return

  const s = symbolForArmDeg(state.armDeg[idx])
  spotlightNameEl.textContent = s?.name ?? '—';
  spotlightPrimaryEl.textContent = s?.primaryMeaning ? `${s.primaryMeaning}` : '—'

  const secs = Array.isArray(s?.secondaryMeanings) ? s.secondaryMeanings.filter(Boolean) : []
  // Exaggerated trail: 80% then -10% each meaning, clamped
  const startOpacity = 0.80
  const step = 0.10
  const minOpacity = 0.15

  spotlightSecondaryEl.innerHTML = secs.map((txt, i) => {
    const op = Math.max(minOpacity, startOpacity - i * step)
    return `<span class="meaning-item" style="opacity:${op}">${escapeHtml(txt)}</span>`
  }).join('')

  if (!s?.iconUrl) {
    spotlightImgEl.removeAttribute('src')
    spotlightImgEl.alt = ''
    spotlightImgEl.style.visibility = 'hidden'
    spotlightMediaEl.style.removeProperty('--prev-scale')
    spotlightMediaEl.style.removeProperty('--prev-rot')
    spotlightMediaEl.style.removeProperty('--prev-nudge-x')
    spotlightMediaEl.style.removeProperty('--prev-nudge-y')
    spotlightMediaEl.style.removeProperty('--prev-fit');
    spotlightPrimaryEl.textContent = '—';
    spotlightSecondaryEl.textContent = '—';
    lastSpotlightIconUrl = null
    return
  }

  const p = s.preview || {}

  // update image + name immediately
  spotlightImgEl.src = s.iconUrl
  spotlightImgEl.alt = s.name
  spotlightImgEl.style.visibility = 'visible'

  // apply immediate vars
  spotlightMediaEl.style.setProperty('--prev-rot', `${p.rotate ?? 0}deg`)
  spotlightMediaEl.style.setProperty('--prev-fit', p.fit ?? 'contain')

  const manualScale = (p.scale ?? 1)
  const manualNX = (p.nudgeX ?? 0)
  const manualNY = (p.nudgeY ?? 0)

  const useAuto = (p.autoScale ?? true)

  // If icon hasn't changed, don't recompute autoscale; keep current
  const iconUrl = s.iconUrl
  const iconChanged = iconUrl !== lastSpotlightIconUrl
  lastSpotlightIconUrl = iconUrl

  if (!useAuto) {
    spotlightMediaEl.style.setProperty('--prev-scale', String(manualScale))
    spotlightMediaEl.style.setProperty('--prev-nudge-x', `${manualNX}px`)
    spotlightMediaEl.style.setProperty('--prev-nudge-y', `${manualNY}px`)
    return
  }

  if (!iconChanged) return

  // async compute with token to avoid races
  const token = ++spotlightUpdateToken
  computeAutoPreview(iconUrl, {
    alphaThreshold: p.alphaThreshold ?? 8,
    targetFill: p.targetFill ?? 0.88,
  }).then((auto) => {
    if (token !== spotlightUpdateToken) return

    // ensure still showing same icon
    const cur = symbolForArmDeg(state.armDeg[state.selectedArm])
    if (!cur?.iconUrl || cur.iconUrl !== iconUrl) return

    const finalScale = auto.scale * manualScale
    const finalNX = auto.nudgeX + manualNX
    const finalNY = auto.nudgeY + manualNY

    spotlightMediaEl.style.setProperty('--prev-scale', String(finalScale))
    spotlightMediaEl.style.setProperty('--prev-nudge-x', `${finalNX}px`)
    spotlightMediaEl.style.setProperty('--prev-nudge-y', `${finalNY}px`)
  })
}

// ---- Interactions ----

// Arms 0..2 drag to rotate
arms.slice(0, 3).forEach((armEl, idx) => {
  armEl.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    setSelectedArm(idx)
    state.drag = { kind: 'arm', idx, pointerId: e.pointerId }
    armEl.setPointerCapture(e.pointerId)
  })

  armEl.addEventListener('pointermove', (e) => {
    if (!state.drag || state.drag.kind !== 'arm' || state.drag.idx !== idx) return
    state.armDeg[idx] = degFromPointer(e.clientX, e.clientY)
    render()
  })

  function endArmDrag() {
    if (!state.drag || state.drag.kind !== 'arm' || state.drag.idx !== idx) return
    state.drag = null
    snapArm(idx)
  }

  armEl.addEventListener('pointerup', endArmDrag)
  armEl.addEventListener('pointercancel', endArmDrag)
})

// Dials 0..2 drag/wheel
dials.forEach((dialEl, idx) => {
  dialEl.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    setSelectedArm(idx)
    state.drag = {
      kind: 'dial',
      idx,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      startDeg: state.armDeg[idx],
    }
    dialEl.setPointerCapture(e.pointerId)
  })

  dialEl.addEventListener('pointermove', (e) => {
    const d = state.drag
    if (!d || d.kind !== 'dial' || d.idx !== idx || d.pointerId !== e.pointerId) return
    if ((e.buttons & 1) !== 1) return

    let delta
    if (idx === 0) {
      delta = (e.clientX - d.startX) * DIAL_SENSITIVITY
    } else {
      delta = -(e.clientY - d.startY) * DIAL_SENSITIVITY
    }

    state.armDeg[idx] = normalizeDeg(d.startDeg + delta)
    render()
  })

  function endDialDrag() {
    const d = state.drag
    if (!d || d.kind !== 'dial' || d.idx !== idx) return
    state.drag = null
    snapArm(idx)
  }

  dialEl.addEventListener('pointerup', endDialDrag)
  dialEl.addEventListener('pointercancel', endDialDrag)
  dialEl.addEventListener('lostpointercapture', endDialDrag)

  dialEl.addEventListener('wheel', (e) => {
    // allow browser zoom (Ctrl/⌘ + wheel / trackpad pinch)
    if (e.ctrlKey || e.metaKey) return

    e.preventDefault()
    e.stopPropagation()
    setSelectedArm(idx)

    const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY
    state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k)
    render()
    scheduleWheelSnap(idx)
  }, { passive: false })
})

// Scroll anywhere on face to rotate selected arm (or hovered arm)
faceEl.addEventListener('wheel', (e) => {
  if (e.ctrlKey || e.metaKey) return
  e.preventDefault()

  const hoveredIdx = armIdxFromWheelEvent(e)
  const idx = (hoveredIdx != null && hoveredIdx < 3) ? hoveredIdx : state.selectedArm
  if (idx !== state.selectedArm) setSelectedArm(idx)

  const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY
  state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + e.deltaY * k)
  render()
  scheduleWheelSnap(idx)
}, { passive: false })

concentrateBtn.addEventListener('click', async () => {
  if (!answersEl) return
  if (idle.isReading) return

  const { totalTurns, sequence } = generateAnswerSequence()

  const entry = document.createElement('div')
  entry.className = 'reading-entry'

  entry.innerHTML = `
    <div class="reading-card-list">
      ${sequence.map(({ symbol, turns }) => {
        const p = symbol.preview || {}
        const rotate = p.rotate ?? 0
        const fit = p.fit ?? 'contain'
        const depth = formatInterpretationDepth(turns)

        return `
          <div class="reading-card">
            <div
              class="reading-card-image-wrap"
              data-card-icon-url="${symbol.iconUrl}"
              style="
                --card-scale: 1;
                --card-rot: ${rotate}deg;
                --card-nudge-x: 0px;
                --card-nudge-y: 0px;
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
                data-depth="${formatInterpretationDepth(turns)}"
              >
                ${formatInterpretationDepth(turns)}
              </div>
            </div>
          </div>
        `
      }).join('')}
    </div>
  `

  answersEl.innerHTML = ''
  answersEl.appendChild(entry)
  showReadingPanel()
  applyAutoReadingCardPreviews(entry)

  await playAnswerSequence(sequence)
})

resetBtn.addEventListener('click', () => {
  setSelectedArm(0)
  animateArmTo(0, 270, 220)
  animateArmTo(1, 30, 220)
  animateArmTo(2, 150, 220)
})

backToControlsBtn.addEventListener('click', () => {
  showNormalPanel()
})

// ---- init ----
buildArmSelectors()
buildSymbols()
setSelectedArm(0)
render()
pickNewIdleTarget(performance.now());
requestAnimationFrame(idleLoop);