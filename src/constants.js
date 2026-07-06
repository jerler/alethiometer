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
      nudgeY: -10,
      nudgeX: 0.5
    },
    preview: {
      scale: 1.1,
      nudgeY: -17,
    },
    primaryMeaning: 'time', 
    secondaryMeanings: ['death','inevitability','finality','urgency','mortality','ending','change','transition','patience','memory','aging','countdown','cycles','impermanence','fate',"consequence","delay","opportunity","legacy",'falling','glass','sand','balance','equilibrium',"waiting","threshold",'expiration','waste','timing','lateness','acceptance','reversal','measurement','duration','ripening','skeleton','desert','hole','pour'],
    description: "The Hourglass represents time as an unstoppable force, carrying all things towards an inevitable finality. As an impartial record keeper it speaks to both urgency as well as patience, as time continues to flow for all caught in its sand. It points to what is passing away, what must be endured, and what consequence is approaching. At a deeper level, it explores fate, memory, impermanence, and the fragile balance between what has been spent and what still remains."
  },
  { 
    deg: 10, 
    name: 'Sun', 
    iconUrl: sun,
    appearance: {
      scale: 1.2,
      nudgeY: 8
    },
    preview: {
      scale: 1.5
    },
    primaryMeaning: 'day', 
    secondaryMeanings: ['truth','clarity','life','power','heat','awakening','exposure','certainty','authority','bright light','summer','masculinity','guidance','beginning','glory','vitality','health','radiance','renewal','hope','joy','success','blessing','energy','fertility','growth','creation','scorching','illumination','revelation','visibility','confidence','pride','majesty','dominion','focus','noon','fire','arrogance','vanity','oppression','drought'],
    description: "The Sun represents the world brought fully into view, providing illumination and clarity to things otherwise hidden in shadow. It is the great awakener, calling life upward out of slumber into warmth, growth, confidence, and renewal. Its light offers truth and vitality, but can also scorch things that are best left unexposed. At a deeper level, it explores glory, authority, pride, creation, and the dangerous brilliance of a light strong enough to burn."
  },
  { 
    deg: 20, 
    name: 'Alpha & Omega', 
    iconUrl: alphaOmega,
    appearance: {
      scale: 0.85,
      nudgeY: 5,
      rotate: 3,
      nudgeX: 1
    },
    preview: {
      scale: 1.2,
      nudgeY: -5
    },
    primaryMeaning: 'sequence', 
    secondaryMeanings: ['education','communication','predictability','totality','hierarchy','language','record','beginning','ending','definition','boundaries','completion','naming','lexicon','remembrance','rank','destiny','inevitability','law','alphabet','purpose','authority','threshold','order','canon','legacy','scripture','knowledge','classification','identity','closure','frame','bookends','continuum','first','last','precedence','priority','placement','position','index','catalogue'],
    description: "Alpha and Omega represents meaning arranged into sequence, where each mark takes its place within the greater order of the whole. It is the product of education and an enduring means of communication, capturing knowledge and perpetuating it through time. It speaks to the structures that define, rank, preserve, and communicate the intangible parts of our world. At a deeper level, it could refer to law, legacy, and the hidden framework by which things are named, placed, and understood."
  },
  { 
    deg: 30, 
    name: 'Marionette',
    iconUrl: marionette,
    appearance: {
      scale: 0.60,
      nudgeY: -15
    },
    preview: {
      scale: 0.95,
      nudgeY: -24
    },
    primaryMeaning: 'obedience', 
    secondaryMeanings: ['entertainment','restraint','influence','performance','dependence','control','deception','exploitation','ridicule','force','mask','manipulation','agency','ventriloquism','constraint','strings attached','obligation','compliance','use','coercion','role','powerlessness','influence','handler','humiliation','fear','conditioning','puppet','stage','spectacle','pretence','artifice','false self','captivity','leverage','pressure','command','helplessness','objectification','control from afar'],
    description: "The Marionette represents obedience made visible, a figure moved for entertainment by restraints it cannot escape. It is the performer who acts out another's will while appearing to move on its own, speaking words that come from someone else's lips. It explores the relationship between coercion and dependence, for without the puppet master the puppet remains motionless. At a deeper level, you will find themes of power, fear, false selves, and the hidden strings that we find ourselves attached to."
  },
  { 
    deg: 40, 
    name: 'Serpent', 
    iconUrl: serpent,
    appearance: {
      scale: 0.6,
      nudgeY: -15
    },
    preview: {
      scale: 0.9,
      nudgeY: -26
    },
    primaryMeaning: 'cunning', 
    secondaryMeanings: ['evil','natural wisdom','flexibility','danger','temptation','deceit','rebellion','secrecy','hidden knowledge','charm','shedding','strategy','forbidden','warning','venom','constriction','renewal','earth','camouflage','trap','fear','seduction','hypnosis','rebirth','silence','sin','betrayal','instinct','transformation','adaptation','patience','ambush','poison','healing','medicine','skin','coil','winding','stealth','underworld','entanglement','spiral','mystery','antidote'],
    description: "The Serpent is an ancient symbol of cunning and evil. It is the tempter in the garden, flexible enough to escape restraint, charming enough to invite trust, and venomous enough to make that trust fatal. It symbolises danger, deceit, rebellion, and secrecy. But diving deeper into this symbol we find rebirth in the serpent's shedding skin, yielding transformation, healing, and a renewal that on the surface is often overlooked."
  },
  { 
    deg: 50, 
    name: 'Cauldron', 
    iconUrl: cauldron,
    appearance: {
      scale: 0.85,
      nudgeY: -6
    },
    preview: {
      scale: 1.4,
      nudgeY: -8
    },
    primaryMeaning: 'alchemy', 
    secondaryMeanings: ['craft','achieved wisdom','creation','cooking','magic','transformation','beverage','combination','melting pot','ritual','concoction','process','patience','heat','nourishment','medicine','poison','tool'] 
  },
  { 
    deg: 60, 
    name: 'Anchor', 
    iconUrl: anchor, 
    appearance: {
      scale: 1.2,
      rotate: 63,
      nudgeY: 10
    },
    preview: {
      rotate: 70,
      scale: 1.4,
      nudgeY: 4,
      nudgeX: -8
    },
    primaryMeaning: 'resilience', 
    secondaryMeanings: ['steadfastness','prevention','hope','restraint','stuck','encumbrance','safety','stubborn','pause','dependability','weight','obligation','endurance','inertia','burden','harbour','drag','the deep','the unknown'] 
  },
  { 
    deg: 70, 
    name: 'Angel',
    iconUrl: angel,
    appearance: {
      scale: 0.7,
      nudgeY: -9
    },
    preview: {
      scale: 1.2,
      nudgeY: -14
    },
    primaryMeaning: 'goodness', 
    secondaryMeanings: ['blessing','purity','conscience','mercy','guidance','forgiveness','hope','guardian','divinity','charity','spirituality','grace','virtue','salvation','kindness','faith','help','redemption','healing'] 
  },
  { 
    deg: 80, 
    name: 'Helmet', 
    iconUrl: helmet,
    appearance: {
      scale: 0.9,
      nudgeX: 2,
    },
    preview: {
      nudgeX: 6,
      scale: 1.3
    },
    primaryMeaning: 'protection', 
    secondaryMeanings: ['defence','narrow vision','safety','duty','war','restraint','conformity','soldier','honour','authority','vigilance','chivalry','discipline','chastity','uniform','guardedness','obedience','vow','code'] 
  },
  { 
    deg: 90, 
    name: 'Beehive',
    iconUrl: beehive,
    appearance: {
      scale: 0.8,
      nudgeY: -4
    },
    preview: {
      scale: 1.2,
    },
    primaryMeaning: 'productive work', 
    secondaryMeanings: ['community','sweetness','cooperation','role hierarchy','matriarchy','wealth','royalty','sting','hive mind','dance','scouting','communication','collective mind','abundance','sacrifice','drones','belonging','swarm','fertility'] 
  },
  { 
    deg: 100, 
    name: 'Moon', 
    iconUrl: moon,
    appearance: {
      nudgeY: 5
    },
    preview: {
      scale: 1.2,
    },
    primaryMeaning: 'night', 
    secondaryMeanings: ['change','reflection','dreams','phases','subconscious','magic','intuition','cold','pull','mystery','secrecy','the uncanny','illusion','cyclical','femininity','silence','return','silver','distance']
  },
  { 
    deg: 110, 
    name: 'Madonna', 
    iconUrl: madonna,
    appearance: {
      scale: 0.75,
      nudgeY: -4
    },
    preview: {
      scale: 1.25,
      nudgeY: -12
    },
    primaryMeaning: 'femininity', 
    secondaryMeanings: ['empathy','dignity','gentleness','beauty','vanity','sanctuary','emotional intelligence','allure','grace','lust','patience','resolve','comfort','softness','nurture','devotion','modesty']
  },
  { 
    deg: 120, 
    name: 'Apple', 
    iconUrl: apple, 
    appearance: {
      scale: 1.3,
      rotate: -25,
      nudgeX: 3,
      nudgeY: 6
    },
    preview: {
      scale: 1.3,
      rotate: -30,
      nudgeX: 8
    },
    primaryMeaning: 'temptation', 
    secondaryMeanings: ['knowledge','choice','consequence','forbidden','regret','indulgence','growth','curiosity','sin','offer','reward','pleasure','nourishment','food','health','freshness','harvest','youth','autumn'],
  },
  { 
    deg: 130, 
    name: 'Bird', 
    iconUrl: bird,
    appearance: {
      scale: 0.75,
      rotate: 55,
      nudgeY: -8
    },
    preview: {
      rotate: 55,
      scale: 1.12,
      nudgeY:-16
    },
    primaryMeaning: 'freedom', 
    secondaryMeanings: ['spring','message','omen','hope','spirit','flight','song','fragility','vision','escape','warning','perspective','the soul','transcendence','vulnerability','migration','divine message','travel','swiftness','the heavens'] 
  },
  { 
    deg: 140, 
    name: 'Bread', 
    iconUrl: bread,
    appearance: {
      rotate: -20,
      scale: 1.2,
      nudgeY: 4
    },
    preview: {
      scale: 1.4,
      nudgeX: 5
    },
    primaryMeaning: 'nourishment', 
    secondaryMeanings: ['comfort','daily life','labour','survival','community','home','simplicity','family','craft','provision','hospitality','work','creation','tradition','trust','promise','sacrifice']
  },
  { 
    deg: 150, 
    name: 'Ant', 
    iconUrl: ant,
    appearance: {
      scale: 1.2,
      rotate: -135,
      nudgeY: 14
    },
    preview: {
      scale: 1.4,
      rotate: -135,
      nudgeY: 5
    },
    primaryMeaning: 'mechanical work', 
    secondaryMeanings: ['endurance','diligence','strength','routine','insignificance','labour','efficiency','organization','logistics','collective effort','conformity','industry','persistence','tedium','discipline'] 
  },
  { 
    deg: 160, 
    name: 'Bull', 
    iconUrl: bull,
    appearance: {
      scale: 1.1,
      nudgeY: 10
    },
    preview: {
      scale: 1.3,
      nudgeY: 8
    },
    primaryMeaning: 'strength', 
    secondaryMeanings: ['power','stamina','impulsivity','endurance','rage','untamable','aggression','charge','earth','cruelty','dominance','courage','groundedness','bluntness','steadfastness','uncoordination','large','heavy','danger']
  },
  { 
    deg: 170, 
    name: 'Candle', 
    iconUrl: candle,
    appearance: {
      scale: 0.65,
      nudgeY: -10
    },
    preview: {
      nudgeY: -21
    },
    primaryMeaning: 'fire', 
    secondaryMeanings: ['dim light','learning','guidance','remembrance','hope','solitude','devotion','mourning','study','revelation','time','mortality','warmth','comfort','ritual','secret','oath','sacrifice','darkness']
  },
  { 
    deg: 180, 
    name: 'Cornucopia', 
    iconUrl: cornucopia,
    appearance: {
      scale: 1.1,
      nudgeY: 8
    },
    preview: {
      scale: 1.2,
    },
    primaryMeaning: 'wealth', 
    secondaryMeanings: ['success','hospitality','abundance','excess','harvest','reward','gluttony','autumn','bounty','security','comfort','generosity','community','charity','blessing','luck','sharing','overflow','indulgence']
  },
  { 
    deg: 190, 
    name: 'Chameleon', 
    iconUrl: chameleon,
    appearance: {
      nudgeX: 2,
      scale: 1.2,
      nudgeY: 7
    },
    preview: {
      scale: 1.3,
    },
    primaryMeaning: 'adaptation', 
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
      nudgeY: -21
    },
    primaryMeaning: 'inspiration', 
    secondaryMeanings: ['fate','chance','revelation','chaos','shock','disruption','impact','luck','violence','natural power','electricity','aftershock','storm','surprise','act of god','judgement','crisis','consequence']
  },
  { 
    deg: 210, 
    name: 'Dolphin', 
    iconUrl: dolphin,
    appearance: {
      scale: 0.9,
      nudgeY: 3,
      rotate: 20
    },
    preview: {
      scale: 1.3,
      rotate: -15,
      nudgeY: -4
    },
    primaryMeaning: 'playfulness', 
    secondaryMeanings: ['water','succour','friendship','second chance','trust','recovery','aid','safe passage','companionship','intelligence','joy','freedom','guidance','deliverance','laughter','escort']
  },
  { 
    deg: 220, 
    name: 'Walled Garden', 
    iconUrl: garden,
    appearance: {
      nudgeY: 8,
      scale: 1.1
    },
    preview: {
      scale: 1.2,
      nudgeY: -8
    },
    primaryMeaning: 'control', 
    secondaryMeanings: ['haven','cultivation','order','restriction','boundaries','domestication','safety','nature','innocence','sanctuary','containment','permission','rules','gatekeeping','purity','shelter','privacy','seclusion','fragility','naivety','paradise','exclusion']
  },
  { 
    deg: 230, 
    name: 'Globe', 
    iconUrl: globe,
    appearance: {
      scale: 0.75,
      nudgeY: -2
    },
    preview: {
      scale: 1.2,
      nudgeY: -6
    },
    primaryMeaning: 'travel', 
    secondaryMeanings: ['politics','culture','travel','diplomacy','large scale','navigation','exploration','nations','trade','economy','law','sovereignty','fame','perspective','overview','influence','borders','interconnectedness'] 
  },
  { 
    deg: 240,
    name: 'Sword', 
    iconUrl: sword,
    appearance: {
      scale: 0.4,
      nudgeY: -35,
      rotate: -30
    },
    preview: {
      scale: 0.6,
      nudgeY: -40,
      rotate: -30
    },
    primaryMeaning: 'action', 
    secondaryMeanings: ['fight','severance','justice','action','decisiveness','conflict','violence','conquest','duel','cutting through','domination','attack','danger','sacrifice','war']
  },
  { 
    deg: 250, 
    name: 'Griffin', 
    iconUrl: griffin,
    appearance: {
      nudgeY: 9
    },
    preview: {
      scale: 1.2
    },
    primaryMeaning: 'guardianship', 
    secondaryMeanings: ['treasure','watchfulness','vigilance','protection','territory','pride','royalty','courage','barrier','strength','mythical','ferocity','valor','defence','mythology']
  },
  { 
    deg: 260, 
    name: 'Horse', 
    iconUrl: horse,
    appearance: {
      nudgeY: 7
    },
    preview: {
      scale: 1.35
    },
    primaryMeaning: 'freedom', 
    secondaryMeanings: ['journeys','speed','instinct','anxiety','drive','transportation','partnership','stamina','labour','burden','europe','nobility','trust','power','grace']
  },
  { 
    deg: 270, 
    name: 'Camel', 
    iconUrl: camel,
    appearance: {
      scale: 0.75,
      nudgeY: -2
    },
    preview: {
      scale: 1.15,
      nudgeY: -9,
    },
    primaryMeaning: 'endurance', 
    secondaryMeanings: ['persistence','resilience','hardship','burden','long journey','preparedness','lasting','self-sufficiency','carry','drought','lack','pilgrimage','trade','slow and steady','perseverance','asia']
  },
  { 
    deg: 280, 
    name: 'Elephant', 
    iconUrl: elephant,
    appearance: {
      nudgeY: 10,
      nudgeX: 1,
      scale: 1.1,
    },
    preview: {
      scale: 1.3,
      nudgeY: 7
    },
    primaryMeaning: 'memory', 
    secondaryMeanings: ['wisdom','calm','strength','dignity','kindness','endurance','restraint','the past','grief','empathy','power','charity','continence','africa']
  },
  { 
    deg: 290, 
    name: 'Crocodile', 
    iconUrl: crocodile,
    appearance: {
      nudgeY: 12,
      scale: 1.2,
      nudgeX: 5
    },
    preview: {
      scale: 1.3,
    },
    primaryMeaning: 'ambush', 
    secondaryMeanings: ['predation','danger','stealth','pretense','ancient','patience','ferocity','territory','opportunism','deception','america','waiting','rapacity','calculation','cold blooded','survival']
  },
  { 
    deg: 300, 
    name: 'Baby',
    iconUrl: baby,
    appearance: {
      scale: 1.2,
      nudgeY: 12,
      nudgeX: 5
    },
    preview: {
      scale: 1.3
    },
    primaryMeaning: 'the future',
    secondaryMeanings: ['Beginnings','malleability','helplessness','potential','legacy','purity','growth','dependency','innocence','youth','vulnerability','hope','new life','uncertainty','nurture','freshness','naivety','learning','trust','family']
  },
  { 
    deg: 310, 
    name: 'Compass',
    iconUrl: compass,
    appearance:{
      scale: 0.35,
      nudgeY: -45,
      nudgeX: 1
    },
    preview: {
      scale: 0.55,
      nudgeY: -43
    },
    primaryMeaning: 'accuracy',
    secondaryMeanings: ['planning','precision','evidence','proof','fact','measurement','calculation','engineering','design','logic','mathematics','science','drafting','reason','limits','boundary','circle','symmetry','balance','standard','rule']
  },
  { 
    deg: 320, 
    name: 'Lute', 
    iconUrl: lute,
    appearance: {
      scale: 0.55,
      nudgeY: -22,
      nudgeX: 3,
      rotate: 20
    },
    preview: {
      scale: 0.7,
      nudgeY: -33,
      rotate: 20
    },
    primaryMeaning: 'entertainment', 
    secondaryMeanings: ['music','performance','expression','harmony','art','celebration','seduction','charm','storytelling','tradition','fame','culture','creativity','emotion','love','merriment']
  },
  { 
    deg: 330, 
    name: 'Tree', 
    iconUrl: tree,
    appearance: {
      scale: 0.8,
      nudgeY: -2
    },
    preview: {
      scale: 1.2,
      nudgeY: -12
    },
    primaryMeaning: 'growth', 
    secondaryMeanings: ['shelter','history','roots','ancestry','stability','nature','seasons','lineage','origin','groundedness','life','renewal','interconnectedness','family','protection','house']
  },
  { 
    deg: 340, 
    name: 'Father',
    iconUrl: father,
    appearance: {
      scale: 0.56,
      nudgeX: 1,
      nudgeY: -18
    },
    preview: {
      scale: 0.85,
      nudgeY: -29
    },
    primaryMeaning: 'masculine',
    secondaryMeanings: ['responsibility','lust','protection','duty','pride','ego','impulse','appetite','dominance','family','strength','discipline','love','pragmatism','legacy']
  },
  { 
    deg: 350, 
    name: 'Owl',
    iconUrl: owl,
    appearance: {
      scale: 0.55,
      nudgeY: -14
    },
    preview: {
      scale: 0.9,
      nudgeY: -23,
    },
    primaryMeaning: 'wisdom',
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