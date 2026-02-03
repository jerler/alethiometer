import apple from './assets/symbols/apple.png'
import anchor from './assets/symbols/anchor.png'
import ant from './assets/symbols/ant.png'
import bird from './assets/symbols/bird.png'
import sun from './assets/symbols/sun.png'

export const SYMBOL_STEP_DEG = 10

// 0° is due north, increasing clockwise
export const SYMBOL_RING = [
  { deg: 0, name: 'Hourglass', primaryMeaning: 'Time', secondaryMeanings: ['death','change', 'inevitability', 'limitation','cyclical'] },
  { 
    deg: 10, 
    name: 'Sun', 
    iconUrl: sun,
    appearance: {
      scale: 1.2
    },
    primaryMeaning: 'Day', 
    secondaryMeanings: ['bright light','authority', 'truth', 'heat','masculinity']
  },
  { deg: 20, name: 'Alpha & Omega', primaryMeaning: 'Sequence', secondaryMeanings: ['process','hierarchy','education'] },
  { deg: 30, name: 'Marionette', primaryMeaning: 'Obedience', secondaryMeanings: ['submission','forced','control (or lack of)','entertainment'] },
  { deg: 40, name: 'Serpent', primaryMeaning: 'Cunning', secondaryMeanings: ['evil','natural wisdom', 'flexibility'] },
  { deg: 50, name: 'Cauldron', primaryMeaning: 'Alchemy', secondaryMeanings: ['craft','achieved wisdom', 'creation', 'cooking', 'magic'] },
  { 
    deg: 60, 
    name: 'Anchor', 
    iconUrl: anchor, 
    appearance: {
      scale: 1.2,
      rotate: 63
    },
    primaryMeaning: 'Resilience', 
    secondaryMeanings: ['steadfastness','prevention','hope','unmoving', 'stubborn','the unknown'] 
  },
  { deg: 70, name: 'Angel', primaryMeaning: 'The good', secondaryMeanings: ['','disobedience'] },
  { deg: 80, name: 'Helmet', primaryMeaning: 'Protection', secondaryMeanings: ['defence','narrow vision','honour','war','chivalry','chastity'] },
  { deg: 90, name: 'Beehive', primaryMeaning: 'Productive work', secondaryMeanings: ['community','sweetness','light','matriarchy','hard work','scouting'] },
  { deg: 100, name: 'Moon', primaryMeaning: 'Night', secondaryMeanings: ['mystery','the uncanny','reflection','magic','cyclical','phase','feminity'] },
  { deg: 110, name: 'Madonna', primaryMeaning: 'Motherhood', secondaryMeanings: ['the feminine','worship'] },
  { 
    deg: 120, 
    name: 'Apple', 
    iconUrl: apple, 
    appearance: {
      rotate: -30,
      nudgeX: 3
    },
    primaryMeaning: 'Sin', 
    secondaryMeanings: ['knowedge','vanity'] 
  },
  { 
    deg: 130, 
    name: 'Bird', 
    iconUrl: bird,
    appearance: {
      scale: 0.7,
      rotate: 60,
      nudgeY: -12
    },
    primaryMeaning: 'The soul', 
    secondaryMeanings: ['spring','marriage'] 
  },
  { deg: 140, name: 'Bread', primaryMeaning: 'Nourishment', secondaryMeanings: ['Christ','sacrifice'] },
  { 
    deg: 150, 
    name: 'Ant', 
    iconUrl: ant,
    appearance: {
      scale: 1.1,
      rotate: -135,
      nudgeY: 6
    },
    primaryMeaning: 'Mechanical work', 
    secondaryMeanings: ['diligence','tedium'] 
  },
  { deg: 160, name: 'Bull', primaryMeaning: 'Earth', secondaryMeanings: ['power','honesty'] },
  { deg: 170, name: 'Candle', primaryMeaning: 'Fire', secondaryMeanings: ['faith','learning'] },
  { deg: 180, name: 'Cornucopia', primaryMeaning: 'Wealth', secondaryMeanings: ['autumn','hospitality'] },
  { deg: 190, name: 'Chameleon', primaryMeaning: 'Air', secondaryMeanings: ['greed','patience'] },
  { deg: 200, name: 'Thunderbolt', primaryMeaning: 'Inspiration', secondaryMeanings: ['fate','chance'] },
  { deg: 210, name: 'Dolphin', primaryMeaning: 'Water', secondaryMeanings: ['resurrection','succour'] },
  { deg: 220, name: 'Walled Garden', primaryMeaning: 'Nature', secondaryMeanings: ['innocence','order'] },
  { deg: 230, name: 'Globe', primaryMeaning: 'Politics', secondaryMeanings: ['sovereignty','fame'] },
  { deg: 240, name: 'Sword' , primaryMeaning: 'Justice', secondaryMeanings: ['fortitude','the church']},
  { deg: 250, name: 'Griffin', primaryMeaning: 'Treasure', secondaryMeanings: ['watchfulness','courage']},
  { deg: 260, name: 'Horse', primaryMeaning: 'Europe', secondaryMeanings: ['journeys','fidelity']},
  { deg: 270, name: 'Camel', primaryMeaning: 'Asia', secondaryMeanings: ['summer','perseverance']},
  { deg: 280, name: 'Elephant', primaryMeaning: 'Africa', secondaryMeanings: ['charity','continence']},
  { deg: 290, name: 'Crocodile', primaryMeaning: 'America', secondaryMeanings: ['rapacity','enterprise']},
  { deg: 300, name: 'Baby', primaryMeaning: 'The future', secondaryMeanings: ['malleability','helplessness']},
  { deg: 310, name: 'Compass', primaryMeaning: 'Measurement', secondaryMeanings: ['mathematics','science']},
  { deg: 320, name: 'Lute', primaryMeaning: 'Poetry', secondaryMeanings: ['rhetoric','philosophy']},
  { deg: 330, name: 'Tree', primaryMeaning: 'Firmness', secondaryMeanings: ['shelter','fertility']},
  { deg: 340, name: 'Wild man', primaryMeaning: 'Wild man', secondaryMeanings: ['the masculine','lust']},
  { deg: 350, name: 'Owl', primaryMeaning: 'Night', secondaryMeanings: ['winter','fear']},
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