import alphaOmega from './assets/symbols/alphaOmega.png'
import anchor from './assets/symbols/anchor.png'
import angel from './assets/symbols/angel.png'
import ant from './assets/symbols/ant.png'
import apple from './assets/symbols/apple.png'
import baby from './assets/symbols/baby.png'
import beehive from './assets/symbols/beehive.png'
import bird from './assets/symbols/bird.png'
import bread from './assets/symbols/bread.png'
import bull from './assets/symbols/bull.png'
import camel from './assets/symbols/camel.png'
import candle from './assets/symbols/candle.png'
import cauldron from './assets/symbols/cauldron.png'
import chameleon from './assets/symbols/chameleon.png'
import compass from './assets/symbols/compass.png'
import cornucopia from './assets/symbols/cornucopia.png'
import crocodile from './assets/symbols/crocodile.png'
import dolphin from './assets/symbols/dolphin.png'
import elephant from './assets/symbols/elephant.png'
import father from './assets/symbols/father.png'
import garden from './assets/symbols/garden.png'
import globe from './assets/symbols/globe.png'
import griffin from './assets/symbols/griffin.png'
import helmet from './assets/symbols/helmet.png'
import horse from './assets/symbols/horse.png'
import hourglass from './assets/symbols/hourglass.png'
import lute from './assets/symbols/lute.png'
import madonna from './assets/symbols/madonna.png'
import moon from './assets/symbols/moon.png'
import marionette from './assets/symbols/marionette.png'
import owl from './assets/symbols/owl.png'
import serpent from './assets/symbols/serpent.png'
import sun from './assets/symbols/sun.png'
import sword from './assets/symbols/sword.png'
import thunderbolt from './assets/symbols/thunderbolt.png'
import tree from './assets/symbols/tree.png'

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
    secondaryMeanings: ['submission','force','control','entertainment','ridicule','exploitation','deception','performance','mask','use','coercion','role','constraint','dependence','strings attached','fear'] 
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
    secondaryMeanings: ['blessing','purity','conscience','mercy','guidance','forgiveness','hope','guardian','divinity','charity','spirituality','grace','virtue','salvation','kindness','faith','help','redemption','healing'] 
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
    secondaryMeanings: ['defence','narrow vision','safety','duty','war','restraint','conformity','soldier','honour','authority','vigilance','chivalry','discipline','chastity','uniform','guardedness','obedience','vow','code'] 
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
    secondaryMeanings: ['community','sweetness','cooperation','role hierarchy','matriarchy','wealth','royalty','sting','hive mind','dance','scouting','communication','collective mind','abundance','sacrifice','drones','belonging','swarm','fertility'] 
  },
  { 
    deg: 100, 
    name: 'Moon', 
    iconUrl: moon,
    appearance: {
      scale: 0.8
    },
    primaryMeaning: 'Night', 
    secondaryMeanings: ['change','reflection','dreams','phases','subconscious','magic','intuition','cold','pull','mystery','secrecy','the uncanny','illusion','cyclical','femininity','silence','return','silver','distance']
  },
  { 
    deg: 110, 
    name: 'Madonna', 
    iconUrl: madonna,
    appearance: {
      scale: 0.65,
      nudgeY: -15
    },
    preview: {
      scale: 1.25,
      nudgeY: -22
    },
    primaryMeaning: 'Femininity', 
    secondaryMeanings: ['empathy','dignity','gentleness','beauty','vanity','sanctuary','emotional intelligence','allure','grace','lust','patience','resolve','comfort','softness','nurture','devotion','modesty']
  },
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
    primaryMeaning: 'Temptation', 
    secondaryMeanings: ['knowledge','choice','consequence','forbidden','regret','indulgence','growth','curiosity','sin','offer','reward','pleasure','nourishment','food','health','freshness','harvest','youth','autumn'],
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
    primaryMeaning: 'Freedom', 
    secondaryMeanings: ['spring','message','omen','hope','spirit','flight','song','fragility','vision','escape','warning','perspective','the soul','transcendence','vulnerability','migration','divine message','travel','swiftness','the heavens'] 
  },
  { 
    deg: 140, 
    name: 'Bread', 
    iconUrl: bread,
    appearance: {
      rotate: -40,
      nudgeY: 3
    },
    preview: {
      scale: 1.4,
      nudgeX: 10
    },
    primaryMeaning: 'Nourishment', 
    secondaryMeanings: ['comfort','daily life','labour','survival','community','home','simplicity','family','craft','provision','hospitality','work','creation','tradition','trust','promise','sacrifice']
  },
  { 
    deg: 150, 
    name: 'Ant', 
    iconUrl: ant,
    appearance: {
      scale: 1.1,
      rotate: -135,
      nudgeY: 8
    },
    preview: {
      scale: 1.2,
      rotate: -135,
      nudgeY: 10
    },
    primaryMeaning: 'Mechanical work', 
    secondaryMeanings: ['endurance','diligence','strength','routine','insignificance','labour','efficiency','organization','logistics','collective effort','conformity','industry','persistence','tedium','discipline'] 
  },
  { 
    deg: 160, 
    name: 'Bull', 
    iconUrl: bull,
    appearance: {
      nudgeY: 7
    },
    preview: {
      scale: 1.3,
      nudgeY: 18
    },
    primaryMeaning: 'Strength', 
    secondaryMeanings: ['power','stamina','impulsivity','endurance','rage','untamable','aggression','charge','earth','cruelty','dominance','courage','groundedness','bluntness','steadfastness','uncoordination','large','heavy','danger']
  },
  { 
    deg: 170, 
    name: 'Candle', 
    iconUrl: candle,
    appearance: {
      scale: 0.6,
      nudgeY: -10
    },
    preview: {
      nudgeY: -40
    },
    primaryMeaning: 'Fire', 
    secondaryMeanings: ['dim light','learning','guidance','remembrance','hope','solitude','devotion','mourning','study','revelation','time','mortality','warmth','comfort','ritual','secret','oath','sacrifice','darkness']
  },
  { 
    deg: 180, 
    name: 'Cornucopia', 
    iconUrl: cornucopia,
    appearance: {
      nudgeY: 7
    },
    preview: {
      scale: 1.2,
    },
    primaryMeaning: 'Wealth', 
    secondaryMeanings: ['success','hospitality','abundance','excess','harvest','reward','gluttony','autumn','bounty','security','comfort','generosity','community','charity','blessing','luck','sharing','overflow','indulgence']
  },
  { 
    deg: 190, 
    name: 'Chameleon', 
    iconUrl: chameleon,
    appearance: {
      nudgeX: 3,
      nudgeY: 7
    },
    preview: {
      scale: 1.3,
    },
    primaryMeaning: 'Adaptation', 
    secondaryMeanings: ['camouflage','overlooked','air','identity','inconsistency','versatility','self-preservation','evasion','imitation','opportunism','mask','misdirection','concealment','role','disguise','deception','survival']
  },
  { 
    deg: 200, 
    name: 'Thunderbolt', 
    iconUrl: thunderbolt,
    appearance: {
      scale: 0.6,
      nudgeY: -13
    },
    preview: {
      scale: 0.9,
      nudgeY: -50
    },
    primaryMeaning: 'Inspiration', 
    secondaryMeanings: ['fate','chance','revelation','chaos','shock','disruption','impact','luck','violence','natural power','electricity','aftershock','storm','surprise','act of god','judgement','crisis','consequence']
  },
  { 
    deg: 210, 
    name: 'Dolphin', 
    iconUrl: dolphin,
    appearance: {
      scale: 0.76,
      nudgeX: -3
    },
    preview: {
      scale: 1.3,
      nudgeY: -15
    },
    primaryMeaning: 'Playfulness', 
    secondaryMeanings: ['water','succour','friendship','second chance','trust','recovery','aid','safe passage','companionship','intelligence','joy','freedom','guidance','deliverance','laughter','escort']
  },
  { 
    deg: 220, 
    name: 'Walled Garden', 
    iconUrl: garden,
    appearance: {
      nudgeY: 3
    },
    preview: {
      scale: 1.2,
      nudgeY: -18
    },
    primaryMeaning: 'Control', 
    secondaryMeanings: ['haven','cultivation','order','restriction','boundaries','domestication','safety','nature','innocence','sanctuary','containment','permission','rules','gatekeeping','purity','shelter','privacy','seclusion','fragility','naivety','paradise','exclusion']
  },
  { 
    deg: 230, 
    name: 'Globe', 
    iconUrl: globe,
    appearance: {
      scale: 0.7,
      nudgeY: -4
    },
    preview: {
      scale: 1.2,
      nudgeY: -12
    },
    primaryMeaning: 'Travel', 
    secondaryMeanings: ['politics','culture','travel','diplomacy','large scale','navigation','exploration','nations','trade','economy','law','sovereignty','fame','perspective','overview','influence','borders','interconnectedness'] 
  },
  { 
    deg: 240, 
    name: 'Sword', 
    iconUrl: sword,
    appearance: {
      scale: 0.4,
      nudgeY: -35,
      rotate: 200
    },
    preview: {
      scale: 0.58,
      nudgeY: -160,
      rotate: 200
    },
    primaryMeaning: 'Action', 
    secondaryMeanings: ['fight','severance','justice','action','decisiveness','conflict','violence','conquest','duel','cutting through','domination','attack','danger','sacrifice','war']
  },
  { 
    deg: 250, 
    name: 'Griffin', 
    iconUrl: griffin,
    appearance: {
      scale: 0.9,
      nudgeY: 3
    },
    preview: {
      scale: 1.2
    },
    primaryMeaning: 'Guardianship', 
    secondaryMeanings: ['treasure','watchfulness','vigilance','protection','territory','pride','royalty','courage','barrier','strength','mythical','ferocity','valor','defence','mythology']
  },
  { 
    deg: 260, 
    name: 'Horse', 
    iconUrl: horse,
    appearance: {
      nudgeY: 3
    },
    preview: {
      scale: 1.3
    },
    primaryMeaning: 'Freedom', 
    secondaryMeanings: ['journeys','speed','instinct','anxiety','drive','transportation','partnership','stamina','labour','burden','europe','nobility','trust','power','grace']
  },
  { 
    deg: 270, 
    name: 'Camel', 
    iconUrl: camel,
    appearance: {
      scale: 0.7,
      nudgeY: -5
    },
    preview: {
      scale: 1.1,
      nudgeY: -15,
    },
    primaryMeaning: 'Endurance', 
    secondaryMeanings: ['persistence','resilience','hardship','burden','long journey','preparedness','lasting','self-sufficiency','carry','drought','lack','pilgrimage','trade','slow and steady','perseverance','asia']
  },
  { 
    deg: 280, 
    name: 'Elephant', 
    iconUrl: elephant,
    appearance: {
      nudgeY: 6
    },
    preview: {
      scale: 1.3,
      nudgeY: 15
    },
    primaryMeaning: 'Memory', 
    secondaryMeanings: ['wisdom','calm','strength','dignity','kindness','endurance','restraint','the past','grief','empathy','power','charity','continence','africa']
  },
  { 
    deg: 290, 
    name: 'Crocodile', 
    iconUrl: crocodile,
    appearance: {
      nudgeX: 5
    },
    preview: {
      scale: 1.3,
    },
    primaryMeaning: 'Ambush', 
    secondaryMeanings: ['predation','danger','stealth','pretense','ancient','patience','ferocity','territory','opportunism','deception','america','waiting','rapacity','calculation','cold blooded','survival']
  },
  { 
    deg: 300, 
    name: 'Baby',
    iconUrl: baby,
    appearance: {
      scale: 0.9,
      nudgeX: 4
    },
    preview: {
      scale: 1.3
    },
    primaryMeaning: 'The future',
    secondaryMeanings: ['Beginnings','malleability','helplessness','potential','legacy','purity','growth','dependency','innocence','youth','vulnerability','hope','new life','uncertainty','nurture','freshness','naivety','learning','trust','family']
  },
  { 
    deg: 310, 
    name: 'Compass',
    iconUrl: compass,
    appearance:{
      scale: 0.3,
      nudgeY: -52,
      nudgeX: 1
    },
    preview: {
      scale: 0.53,
      nudgeY: -200
    },
    primaryMeaning: 'Accuracy',
    secondaryMeanings: ['planning','precision','evidence','proof','fact','measurement','calculation','engineering','design','logic','mathematics','science','drafting','reason','limits','boundary','circle','symmetry','balance','standard','rule']
  },
  { 
    deg: 320, 
    name: 'Lute', 
    iconUrl: lute,
    appearance: {
      scale: 0.45,
      nudgeY: -31,
      nudgeX: 3,
      rotate: 20
    },
    preview: {
      scale: 0.7,
      nudgeY: -120,
      rotate: 20
    },
    primaryMeaning: 'Entertainment', 
    secondaryMeanings: ['music','performance','expression','harmony','art','celebration','seduction','charm','storytelling','tradition','fame','culture','creativity','emotion','love','merriment']
  },
  { 
    deg: 330, 
    name: 'Tree', 
    iconUrl: tree,
    appearance: {
      scale: 0.7,
      nudgeY: -10
    },
    preview: {
      scale: 1.2,
      nudgeY: -28
    },
    primaryMeaning: 'Growth', 
    secondaryMeanings: ['shelter','history','roots','ancestry','stability','nature','seasons','lineage','origin','groundedness','life','renewal','interconnectedness','family','protection','house']
  },
  { 
    deg: 340, 
    name: 'Father',
    iconUrl: father,
    appearance: {
      scale: 0.5,
      nudgeY: -25
    },
    preview: {
      scale: 0.85,
      nudgeY: -90
    },
    primaryMeaning: 'Masculine',
    secondaryMeanings: ['responsibility','lust','protection','duty','pride','ego','impulse','appetite','dominance','family','strength','discipline','love','pragmatism','legacy']
  },
  { 
    deg: 350, 
    name: 'Owl',
    iconUrl: owl,
    appearance: {
      scale: 0.55,
      nudgeY: -20
    },
    preview: {
      scale: 0.9,
      nudgeY: -60,
    },
    primaryMeaning: 'Wisdom',
    secondaryMeanings: ['perception','knowledge','insight','study','watchfulness','intuition','judgement','counsel','winter','fear','omen','solitude','silence','scholarship']
  }
];

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