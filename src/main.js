import './style.css'

const faceEl = document.getElementById('face')
const arms = Array.from(document.querySelectorAll('.arm'))
const readoutEl = document.getElementById('readout')
const concentrateBtn = document.getElementById('concentrate')
const resetBtn = document.getElementById('reset')
const tickRing = document.getElementById('tickRing')
const dials = Array.from(document.querySelectorAll('.dial'))
const DIAL_SENSITIVITY = 0.75 // degrees per pixel

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
  })

  armEl.addEventListener('pointercancel', () => {
    state.draggingArm = null
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
    state.dragStartDeg = state.armDeg[idx];

    dialEl.setPointerCapture(e.pointerId)
  })

  dialEl.addEventListener('pointermove', (e) => {
    if (state.draggingDial !== idx) return;
    if (state.draggingDialPointerId !== e.pointerId ) return;
    if ((e.buttons & 1) !== 1) return; //stops the arm from moving just by hovering over the dials

    const deltaY = e.clientY - state.dragStartY;

    // Drag UP (deltaY negative) => clockwise => INCREASE degrees
    const next = state.dragStartDeg + (-deltaY * DIAL_SENSITIVITY)

    state.armDeg[idx] = normalizeDeg(next)
    render()
  })

  function endDialDrag() {
    state.draggingDial = null
    state.draggingDialPointerId = null
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

    const speed = e.shiftKey ? 0.2 : 1.0
    const delta = Math.sign(e.deltaY) * speed

    state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + delta)
    render()
  }, { passive: false })
})

// scroll anywhere on face to rotate selected arm
faceEl.addEventListener('wheel', (e) => {
  e.preventDefault()
  const speed = e.shiftKey ? 0.2 : 1.0 // hold shift for fine tuning
  const delta = Math.sign(e.deltaY) * speed
  const idx = state.selectedArm
  state.armDeg[idx] = normalizeDeg(state.armDeg[idx] + delta)
  render()
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
  const step = 360 / state.symbolCount
  const targets = [0, 1, 2].map(() => {
    const slot = Math.floor(Math.random() * state.symbolCount)
    return slot * step
  })
  animateToTargets(targets, 1100)
})

resetBtn.addEventListener('click', () => {
  state.armDeg = [20, 140, 260]
  setSelectedArm(0)
  render()
})

// ---- init ----
buildTicks()
setSelectedArm(0)
render()
