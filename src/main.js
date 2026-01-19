import './style.css'
import { symbolForArmDeg } from './constants.js'


const faceEl = document.getElementById('face')
const arms = Array.from(document.querySelectorAll('.arm'))
const readoutEl = document.getElementById('readout')
const symbolsEl = document.getElementById('symbols')
const concentrateBtn = document.getElementById('concentrate')
const resetBtn = document.getElementById('reset')
const tickRing = document.getElementById('tickRing')
const dials = Array.from(document.querySelectorAll('.dial'))

const DIAL_SENSITIVITY = 0.75 // degrees per pixel
const WHEEL_SENSITIVITY = 0.08  // degrees per wheel deltaY unit 
const WHEEL_SENSITIVITY_FINE = 0.015 // with Shift


// ---- State ----
const state = {
  selectedArm: 0,
  // degrees, 0 = pointing right, 90 = down (because CSS rotate is clockwise)
  armDeg: [20, 140, 260],
  draggingArm: null,
  symbolCount: 36, // pretend there are 36 symbols around the face
  draggingDial: null,
  draggingDialPointerId: null,
  dragStartY: 0,
  dragStartX: 0,
  dragStartDeg: 0
}

// ---- Helpers ----
function normalizeDeg(d) {
  let x = d % 360
  if (x < 0) x += 360
  return x
}

function snapToSymbol(d) {
  const step = 360 / state.symbolCount
  return Math.round(d / step) * step
}

function setSelectedArm(idx) {
  state.selectedArm = idx
  arms.forEach((el, i) => el.classList.toggle('selected', i === idx))
  dials.forEach((el, i) => el.classList.toggle('selected', i === idx))
  render()
}

function getFaceCenter() {
  const r = faceEl.getBoundingClientRect()
  return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
}

function shortestDiffDeg(from, to) {
  // returns diff in range [-180, 180)
  return ((to - from + 540) % 360) - 180
}

function animateArmTo(idx, targetDeg, ms = 160) {
  const start = performance.now()
  const from = state.armDeg[idx]
  const diff = shortestDiffDeg(from, targetDeg)

  function easeOut(t) {
    // quick, gentle settle
    return 1 - Math.pow(1 - t, 3)
  }

  function frame(now) {
    const t = Math.min(1, (now - start) / ms)
    state.armDeg[idx] = normalizeDeg(from + diff * easeOut(t))
    render()
    if (t < 1) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

function snapArm(idx) {
  if (state.draggingArm !== null) return;
  if (state.draggingDial !== null) return;
  animateArmTo(idx, snapToSymbol(state.armDeg[idx]))
}

// wheel snap timers (one per arm)
const wheelSnapTimers = [null, null, null]
function scheduleWheelSnap(idx, delayMs = 120) {
  if (wheelSnapTimers[idx]) clearTimeout(wheelSnapTimers[idx])
  wheelSnapTimers[idx] = setTimeout(() => snapArm(idx), delayMs)
}

// Convert pointer position to a CSS-friendly degree angle.
// 0° is to the right, increases clockwise.
function degFromPointer(clientX, clientY) {
  const { cx, cy } = getFaceCenter()
  const dx = clientX - cx
  const dy = clientY - cy
  const rad = Math.atan2(dy, dx) // -pi..pi, 0 at (1,0), CCW positive
  const degCCW = rad * (180 / Math.PI)
  const degCW = normalizeDeg(degCCW) // CSS rotate is clockwise if we use this convention with y-down coordinates
  return degCW
}

function render() {
  state.armDeg = state.armDeg.map(normalizeDeg);

  for (let i = 0; i < arms.length; i++) {
    arms[i].style.transform = `translate(0, -50%) rotate(${state.armDeg[i]}deg)`
  }

  const step = 360 / state.symbolCount
  readoutEl.textContent =
    `selectedArm: ${state.selectedArm}\n` +
    `armDeg: ${state.armDeg.map(d => d.toFixed(1)).join(', ')}\n` +
    `symbolStep: ${step.toFixed(2)}°\n` +
    `snapped: ${state.armDeg.map(snapToSymbol).join(', ')}`
  
  const symbols = state.armDeg.map(symbolForArmDeg)

  symbolsEl.innerHTML = symbols
    .map((s, i) => {
      const label = `Arm ${i + 1}`
      return `
        <div class="symbol-row">
          <div>${label}</div>
          <div class="symbol-name">${s.name}</div>
        </div>
      `
    })
    .join('');

}

// ---- Tick marks (purely visual) ----
function buildTicks() {
  const N = state.symbolCount
  const host = document.createElement('div')
  host.style.position = 'absolute'
  host.style.inset = '0'
  host.style.borderRadius = '50%'

  for (let i = 0; i < N; i++) {
    const tick = document.createElement('div')
    tick.style.position = 'absolute'
    tick.style.left = '50%'
    tick.style.top = '50%'
    tick.style.width = i % 3 === 0 ? '10px' : '6px'
    tick.style.height = '2px'
    tick.style.transformOrigin = '0% 50%'
    tick.style.transform = `rotate(${(i * 360) / N}deg) translate(0, -50%) translate(180%, 0)`
    tick.style.background = 'rgba(0,0,0,0.35)'
    host.appendChild(tick)
  }
  tickRing.appendChild(host)
}

// ---- Interactions ----

// click an arm to select
arms.forEach((armEl, idx) => {
  armEl.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    setSelectedArm(idx)
    state.draggingArm = idx
    armEl.setPointerCapture(e.pointerId)
  })

  armEl.addEventListener('pointermove', (e) => {
    if (state.draggingArm !== idx) return
    const d = degFromPointer(e.clientX, e.clientY)
    state.armDeg[idx] = d
    render()
  })

  armEl.addEventListener('pointerup', () => {
    state.draggingArm = null
    snapArm(idx)
  })

  armEl.addEventListener('pointercancel', () => {
    state.draggingArm = null
    snapArm(idx)
  })
})

// Dials: click/drag/wheel to control the corresponding arm
dials.forEach((dialEl, idx) => {
  dialEl.addEventListener('pointerdown', (e) => {
    e.preventDefault()
    setSelectedArm(idx)

    state.draggingDial = idx;
    state.draggingDialPointerId = e.pointerId;
    state.dragStartY = e.clientY;
    state.dragStartX = e.clientX;
    state.dragStartDeg = state.armDeg[idx];

    dialEl.setPointerCapture(e.pointerId)
  })

  dialEl.addEventListener('pointermove', (e) => {
    if (state.draggingDial !== idx) return;
    if (state.draggingDialPointerId !== e.pointerId ) return;
    if ((e.buttons & 1) !== 1) return; //stops the arm from moving just by hovering over the dials

    let delta;
    if (idx === 0) {
      // Top dial - right = clockwise rotation, left = counterclockwise rotation
      const deltaX = e.clientX - state.dragStartX;
      delta = deltaX * DIAL_SENSITIVITY;
    } else {
      // Other two dials - up = clockwise, down = counterclockwise
      const deltaY = e.clientY - state.dragStartY;
      delta = -deltaY * DIAL_SENSITIVITY;
    }

    state.armDeg[idx] = normalizeDeg(state.dragStartDeg + delta)
    render()
  })

  function endDialDrag() {
    const idxToSnap = state.draggingDial;
    state.draggingDial = null;
    state.draggingDialPointerId = null;
    if (idxToSnap !== null ) snapArm(idxToSnap)
  }

  dialEl.addEventListener('pointerup', endDialDrag)
  dialEl.addEventListener('pointercancel', endDialDrag)
  dialEl.addEventListener('lostpointercapture', endDialDrag)

  // dialEl.addEventListener('pointerup', () => {
  //   state.dragginDial = null
  // })
  // dialEl.addEventListener('pointercancel', () => {
  //   state.draggingDial = null
  // })


  dialEl.addEventListener('wheel', (e) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedArm(idx)

    const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY
    const delta = e.deltaY * k  // use real wheel magnitude

    state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + delta)
    render()
    scheduleWheelSnap(idx)
  }, { passive: false })
})

// scroll anywhere on face to rotate selected arm
faceEl.addEventListener('wheel', (e) => {
  e.preventDefault()
  const k = e.shiftKey ? WHEEL_SENSITIVITY_FINE : WHEEL_SENSITIVITY
  const delta = e.deltaY * k
  const idx = state.selectedArm

  state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + delta)
  render()
  scheduleWheelSnap(idx)
}, { passive: false })

// Concentrate: animate arms to random snapped symbol angles
function animateToTargets(targetDegs, ms = 900) {
  const start = performance.now()
  const from = [...state.armDeg]

  function easeInOut(t) {
    // smoothstep-ish
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  function frame(now) {
    const t = Math.min(1, (now - start) / ms)
    const k = easeInOut(t)

    for (let i = 0; i < 3; i++) {
      // choose shortest rotation direction
      let a = from[i]
      let b = targetDegs[i]
      let diff = ((b - a + 540) % 360) - 180
      state.armDeg[i] = normalizeDeg(a + diff * k)
    }

    render()
    if (t < 1) requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}

concentrateBtn.addEventListener('click', () => {
  
});

resetBtn.addEventListener('click', () => {
  setSelectedArm(0);
  animateToTargets([20, 140, 260], 500)
  render()
})

// ---- init ----
buildTicks()
setSelectedArm(0)
render()
