export const SYMBOL_STEP_DEG = 10

// 0° is due north, increasing clockwise
export const SYMBOL_RING = [
  { deg: 0, name: 'Hourglass' },
  { deg: 10, name: 'Sun' },
  { deg: 20, name: 'Alpha & Omega' },
  { deg: 30, name: 'Marionette' },
  { deg: 40, name: 'Serpent' },
  { deg: 50, name: 'Cauldron' },
  { deg: 60, name: 'Anchor' },
  { deg: 70, name: 'Angel' },
  { deg: 80, name: 'Helmet' },
  { deg: 90, name: 'Beehive' },
  { deg: 100, name: 'Moon' },
  { deg: 110, name: 'Madonna' },
  { deg: 120, name: 'Apple' },
  { deg: 130, name: 'Sin' },
  { deg: 140, name: 'Bird' },
  { deg: 150, name: 'Bread' },
  { deg: 160, name: 'Ant' },
  { deg: 170, name: 'Bull' },
  { deg: 180, name: 'Candle' },
  { deg: 190, name: 'Cornucopia' },
  { deg: 200, name: 'Chameleon' },
  { deg: 210, name: 'Thunderbolt' },
  { deg: 220, name: 'Dolphin' },
  { deg: 230, name: 'Walled Garden' },
  { deg: 240, name: 'Globe' },
  { deg: 250, name: 'Sword' },
  { deg: 260, name: 'Griffin' },
  { deg: 270, name: 'Horse' },
  { deg: 280, name: 'Camel' },
  { deg: 290, name: 'Elephant' },
  { deg: 300, name: 'Crocodile' },
  { deg: 310, name: 'Baby' },
  { deg: 320, name: 'Compass' },
  { deg: 330, name: 'Lute' },
  { deg: 340, name: 'Tree' },
  { deg: 350, name: 'Wild Man' },
  // Note: 360 is the same position as 0, so we normally omit it to avoid duplicates.
  // If you want "Owl" explicitly at the wraparound, keep it as an alias:
  { deg: 360, name: 'Owl' },
]

// Convert your internal arm degrees (0°=east, clockwise) to "north-based" degrees (0°=north, clockwise).
export function eastBasedDegToNorthBasedDeg(eastDeg) {
  // east 0 -> north 0 means: northDeg = (eastDeg + 90) % 360
  return ((eastDeg + 90) % 360 + 360) % 360
}

// Snap a north-based degree to the nearest symbol slot.
export function snapNorthDegToSymbolDeg(northDeg) {
  return Math.round(northDeg / SYMBOL_STEP_DEG) * SYMBOL_STEP_DEG
}

// Get symbol name for a north-based degree (0..360 inclusive).
export function symbolForNorthDeg(northDeg) {
  const snapped = snapNorthDegToSymbolDeg(northDeg)

  // handle wrap: treat 360 as 0 for lookup, unless you explicitly want Owl at 360
  const lookupDeg = snapped === 360 ? 360 : snapped

  const hit = SYMBOL_RING.find(s => s.deg === lookupDeg)
  if (hit) return hit

  // fallback (shouldn't happen)
  return { deg: lookupDeg, name: 'Unknown' }
}

// Convenience: go straight from internal arm deg -> symbol
export function symbolForArmDeg(armDegEastBased) {
  const northDeg = eastBasedDegToNorthBasedDeg(armDegEastBased)
  return symbolForNorthDeg(northDeg)
}