import alphaOmega from './assets/symbols/alphaOmega.png'
import anchor from './assets/symbols/anchor.png'
import angel from './assets/symbols/angel.png'
import ant from './assets/symbols/ant.png'
import apple from './assets/symbols/apple.png'
import beehive from './assets/symbols/beehive.png'
import bird from './assets/symbols/bird.png'
import cauldron from './assets/symbols/cauldron.png'
import helmet from './assets/symbols/helmet.png'
import hourglass from './assets/symbols/hourglass.png'
import marionette from './assets/symbols/marionette.png'
import sun from './assets/symbols/sun.png'
import serpent from './assets/symbols/serpent.png'

export const SYMBOL_STEP_DEG = 10

// 0° is due north, increasing clockwise
export const SYMBOL_RING = [
  { 
    deg: 0, 
    name: 'Hourglass', 
    iconUrl: hourglass,
    appearance: {
      scale: 0.65,
      nudgeY: -15,
      nudgeX: 1.3
    },
    preview: {
      scale: 1.1,
      nudgeY: -38,
    },
    primaryMeaning: 'Time', 
    secondaryMeanings: ['death','inevitability','mortality','ending','urgency','patience','change','aging','memory','countdown','cycles','impermanence',"fate","consequence","delay","opportunity","legacy",'falling','glass','sand','transition',"balance","equilibrium"] 
  },
  { 
    deg: 10, 
    name: 'Sun', 
    iconUrl: sun,
    preview: {
      scale: 1.5
    },
    primaryMeaning: 'Day', 
    secondaryMeanings: ['truth','heat','bright light','power','certainty','awaken','exposure','guidance','authority','clarity','summer','masculinity','beginning','glory','life','vitality','health','renewal','hope','joy','success','blessing','energy','fertility','growth','creation','scorching']
  },
  { 
    deg: 20, 
    name: 'Alpha & Omega', 
    iconUrl: alphaOmega,
    appearance: {
      scale: 0.8,
      nudgeY: -3,
      nudgeX: 3,
    },
    preview: {
      scale: 1.2
    },
    primaryMeaning: 'Sequence', 
    secondaryMeanings: ['lexicon','hierarchy','education','boundaries','communication','totality','origin','ending','definition','completion','naming','alphabet','rank','destiny','inevitability','ink','threshold','purpose','authority'] 
  },
  { 
    deg: 30, 
    name: 'Marionette',
    iconUrl: marionette,
    appearance: {
      scale: 0.60,
      nudgeY: -20
    },
    preview: {
      scale: 1,
      nudgeY: -65
    },
    primaryMeaning: 'Obedience', 
    secondaryMeanings: ['submission','force','control','entertainment','ridicule','exploitation','deception','performance','entertainment','mask','use','coersion','role','constraint','dependence','strings attached','fear'] 
  },
  { 
    deg: 40, 
    name: 'Serpent', 
    iconUrl: serpent,
    appearance: {
      scale: 0.6,
      nudgeY: -20
    },
    preview: {
      scale: 0.9,
      nudgeY: -71
    },
    primaryMeaning: 'Cunning', 
    secondaryMeanings: ['evil','natural wisdom','flexibility','danger','temptation','deceit','rebellion','secrecy','hidden knowledge','strategy','shedding','renewal','poison','seduction','hypnosis','silence','sin','betrayal'] 
  },
  { 
    deg: 50, 
    name: 'Cauldron', 
    iconUrl: cauldron,
    appearance: {
      scale: 0.9,
      nudgeY: -9
    },
    preview: {
      scale: 1.2,
      nudgeY: -11
    },
    primaryMeaning: 'Alchemy', 
    secondaryMeanings: ['craft','achieved wisdom','creation','cooking','magic','transformation','beverage','combination','melting pot','ritual','concoction','process','patience','heat','nourishment','medicine','poison','tool'] 
  },
  { 
    deg: 60, 
    name: 'Anchor', 
    iconUrl: anchor, 
    appearance: {
      scale: 1.2,
      rotate: 63
    },
    preview: {
      rotate: 70,
      scale: 1.4,
      nudgeY: 7,
      nudgeX: -8
    },
    primaryMeaning: 'Resilience', 
    secondaryMeanings: ['steadfastness','prevention','hope','restraint','stuck','encumbrance','safety','stubborn','pause','dependability','weight','obligation','endurance','inertia','burden','harbour','drag','the deep','the unknown'] 
  },
  { 
    deg: 70, 
    name: 'Angel',
    iconUrl: angel,
    appearance: {
      scale: 0.7,
      nudgeY: -16
    },
    preview: {
      scale: 1.1,
      nudgeY: -28
    },
    primaryMeaning: 'Goodness', 
    secondaryMeanings: ['disobedience'] 
  },
  { 
    deg: 80, 
    name: 'Helmet', 
    iconUrl: helmet,
    appearance: {
      scale: 0.9,
      nudgeX: 2,
      nudgeY: -6
    },
    preview: {
      nudgeX: 15,
      scale: 1.2
    },
    primaryMeaning: 'Protection', 
    secondaryMeanings: ['defence','narrow vision','honour','war','chivalry','chastity'] 
  },
  { 
    deg: 90, 
    name: 'Beehive',
    iconUrl: beehive,
    appearance: {
      scale: 0.8,
      nudgeY: -10
    },
    preview: {
      scale: 1.2,
    },
    primaryMeaning: 'Productive work', 
    secondaryMeanings: ['community','sweetness','light','matriarchy','hard work','scouting'] 
  },
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
    preview: {
      scale: 1.3,
      rotate: -30,
      nudgeX: 11
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
    preview: {
      rotate: 49,
      scale: 1.14,
      nudgeY:-40
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
    preview: {
      scale: 1.2,
      rotate: -135,
      nudgeY: 10
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
  const lookupDeg = snapped % 360;

  const hit = SYMBOL_RING.find(s => s.deg === lookupDeg)
  if (hit) return hit;

  // fallback (shouldn't happen)
  return { deg: lookupDeg, name: 'Unknown' }
}

// Convenience: go straight from internal arm deg -> symbol
export function symbolForArmDeg(armDegEastBased) {
  const northDeg = eastBasedDegToNorthBasedDeg(armDegEastBased)
  return symbolForNorthDeg(northDeg)
}