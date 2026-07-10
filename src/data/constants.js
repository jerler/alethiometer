// Import all of the symbol pngs
const symbolIconModules = import.meta.glob('../assets/symbols/*.png', {
  eager: true,
  import: 'default',
})
const symbolIcons = Object.fromEntries(
  Object.entries(symbolIconModules).map(([path, url]) => {
    const file = path.split('/').pop()
    const key = file ? file.replace(/\.png$/i, '') : ''
    return [key, url]
  }),
)

// Defines all of the symbols and their attributes; 0° is due north, increasing clockwise
const SYMBOL_RING_BASE = [
  { 
    deg: 0, 
    name: 'Hourglass', 
    primaryMeaning: 'time',
    secondaryMeanings: ['death','inevitability','finality','urgency','mortality','ending','change','transition','patience','memory','aging','countdown','cycles','impermanence','fate',"consequence","delay","opportunity","legacy",'falling','glass','sand','balance','equilibrium',"waiting","threshold",'expiration','waste','timing','lateness','acceptance','reversal','measurement','duration','ripening','skeleton','desert','hole','pour'],
    altText: "An ornate golden hourglass, with sand flowing from the top to the bottom chamber. At the top of the hourglass rests a human skull.",
    description: "The Hourglass represents time as an unstoppable force, carrying all things towards an inevitable finality. As an impartial record keeper it speaks to both urgency as well as patience, as time continues to flow for all caught in its sand. It points to what is passing away, what must be endured, and what consequence is approaching. At a deeper level, it explores fate, memory, impermanence, and the balance between what has been spent and what still remains."
  },
  { 
    deg: 10, 
    name: 'Sun', 
    primaryMeaning: 'day', 
    secondaryMeanings: ['truth','clarity','life','power','heat','awakening','exposure','certainty','authority','bright light','summer','masculinity','guidance','beginning','glory','vitality','health','radiance','renewal','hope','joy','success','blessing','energy','fertility','growth','creation','scorching','illumination','revelation','visibility','confidence','pride','majesty','dominion','focus','noon','fire','arrogance','vanity','oppression','drought'],
    altText: "A bright yellow sun surrounded by rays of light",
    description: "The Sun represents the world brought fully into view, providing illumination and clarity to things otherwise hidden in shadow. It is the great awakener, calling life upward out of slumber into warmth, growth, confidence, and renewal. Its light offers truth and vitality, but can also scorch things that are best left unexposed. At a deeper level, the sun has been a symbol of authority and explores symbolism around authority, masculinity, and pride."
  },
  { 
    deg: 20, 
    name: 'Alpha & Omega', 
    primaryMeaning: 'sequence', 
    secondaryMeanings: ['education','communication','predictability','totality','hierarchy','language','record','beginning','ending','definition','boundaries','completion','naming','lexicon','remembrance','rank','destiny','inevitability','law','alphabet','purpose','authority','threshold','order','canon','legacy','scripture','knowledge','classification','identity','closure','frame','bookends','continuum','first','last','precedence','priority','placement','position','index','catalogue'],
    altText: "The Greek letters Alpha and Omega, superimposed on each other in a golden brown ink",
    description: "Alpha and Omega is a symbol of finding meaning in sequence, where each mark takes its place within the greater order of the whole. It is the product of education and an enduring means of communication, capturing knowledge and perpetuating it through time. It speaks to the structures that define, rank, preserve, and communicate the intangible parts of our world. At a deeper level, it could refer to law, legacy, or a collective understanding of rules within a system."
  },
  { 
    deg: 30, 
    name: 'Marionette',
    primaryMeaning: 'obedience', 
    secondaryMeanings: ['entertainment','restraint','influence','performance','dependence','control','deception','exploitation','ridicule','force','mask','manipulation','agency','ventriloquism','constraint','strings attached','obligation','compliance','use','coercion','role','powerlessness','influence','handler','humiliation','fear','conditioning','puppet','stage','spectacle','pretence','artifice','false self','captivity','leverage','pressure','command','helplessness','objectification','control from afar'],
    altText: "A smiling wooden marionette puppet in a fancy red zigzag costume with a pointed hat, suspended by strings from a wooden crossbar.",
    description: "The Marionette represents obedience made visible, a figure moved for entertainment by restraints it cannot escape. It is the performer who acts out another's will while appearing to move on its own, speaking words that come from someone else's lips. It explores the relationship between coercion and dependence, for without the puppet master the puppet remains motionless. At a deeper level, you will find themes of power, fear, false selves, and the hidden strings that we find ourselves attached to."
  },
  { 
    deg: 40, 
    name: 'Serpent', 
    primaryMeaning: 'cunning', 
    secondaryMeanings: ['evil','natural wisdom','flexibility','danger','temptation','deceit','rebellion','secrecy','hidden knowledge','charm','shedding','strategy','forbidden','warning','venom','constriction','renewal','earth','camouflage','trap','fear','seduction','hypnosis','rebirth','silence','sin','betrayal','instinct','transformation','adaptation','patience','ambush','poison','healing','medicine','skin','coil','winding','stealth','underworld','entanglement','spiral','mystery','antidote'],
    altText: "An intricately coiled green serpent with a forked tongue, fangs, and menacing yellow eyes.",
    description: "The Serpent is an ancient symbol of cunning and evil. It is the tempter in the garden, flexible enough to escape restraint, charming enough to invite trust, and venomous enough to make that trust fatal. It symbolises danger, deceit, rebellion, and secrecy. But diving deeper into this symbol we find rebirth in the serpent's shedding skin, yielding transformation, healing, and the natural cycles of renewal that exist in all things."
  },
  { 
    deg: 50, 
    name: 'Cauldron', 
    primaryMeaning: 'alchemy', 
    secondaryMeanings: ['creation','achieved wisdom','nourishment','craft','magic','transformation','medicine','combination','patience','ingredients','practice','ritual','experiment','melting pot','boil over','concoction','process','cooking','heat','poison','tool','beverage','potion','mixture','recipe','trial','brew','skill','stirring','simmering','boiling','smoke','vessel','containment','fermentation','distillation','transmutation','witchcraft','hearth','home','feast','hunger','thirst','abundance','remedy','cure','toxicity','preparation','essence','bubble','serving','stew','broth','elixir','infusion','appetite','sustenance'],
    altText: "A large black cauldron with a rounded belly and three visible legs. The cauldron is filled with a bubbling green liquid, and a wisp of steam rises from the surface.",
    description: "The Cauldron is a symbol for creation through craft, where raw ingredients are gathered, combined, and transformed through patience and practice. It is the vessel of alchemy and achieved wisdom, nourishing and healing through experimentation, ritual, and maybe even magic. Diving deeper into the symbolism we also find it representing abundance and the warmth of the hearth, or perhaps the chaos of a brew boiling over."
  },
  { 
    deg: 60, 
    name: 'Anchor', 
    primaryMeaning: 'resilience',
    secondaryMeanings: ['steadfastness','stability','hope','restraint','stuck','encumbrance','safety','prevention','stubborn','pause','dependability','weight','obligation','endurance','inertia','burden','harbour','drag','the deep','the unknown','security','mooring','grounding','holding fast','anchorage','safe harbour','refuge','protection','commitment','duty','responsibility','loyalty','persistence','survival','resistance','immobility','delay','heaviness','dragging','sinking','depth','sea','storm','ship','homecoming','arrival','waiting','stillness','foundation','attachment','tether','chain'],
    altText: "A large metal anchor with a rope curved around the shank.", 
    description: "The Anchor represents the strength to hold fast against strife, but also the weight that keeps you fixed in place when it is time to move forward. It is a symbol of stability, endurance, and hope, offering safety in choppy waters, but for every current you resist, greater horizons are left unseen. At a deeper level, anchor explores burden, inertia, harbouring emotions, and the unknown forces that shape us lying deep beneath the surface"
  },
  { 
    deg: 70, 
    name: 'Angel',
    primaryMeaning: 'goodness', 
    secondaryMeanings: ['forgiveness','purity','conscience','messenger','guidance','guardian','mercy','judgement','hope','divinity','charity','spirituality','grace','virtue','blessing','salvation','kindness','faith','help','redemption','healing','protection','message','revelation','intervention','watchfulness','comfort','innocence','prayer','wings','halo','light','witness','calling','compassion','deliverance','sanctuary','peace','moral law','intercession','absolution','repentance','atonement','providence','miracle','vision','omen','awe','radiance','heaven','soul','afterlife','ascension','higher self','divine will','sacred duty','service','devotion','humility','sacrifice','obedience','vigilance','choir','harmony','serenity','rescue','refuge','purification','chastity','temperance'],
    altText: "A winged angel with a flowing white and gold robe, long golden hair, and a halo above their head. The angel is holding a small golden cross in their hands.",
    description: "The Angel represents goodness given form, a presence of blessing, purity, and conscience that calls the soul toward what is merciful and right. It is the guardian at the threshold, offering guidance, forgiveness, and hope when the way forward feels dark or uncertain. At a deeper level, the Angel explores its more classical associations with ties to retribution and judgement, but also to redemption, as mercy and accountability are two sides of the same blessed coin"
  },
  { 
    deg: 80, 
    name: 'Helmet', 
    primaryMeaning: 'protection',
    secondaryMeanings: ['soldier','authority','conformity','war','duty','safety','narrow vision','restraint','defence','honour','vigilance','chivalry','discipline','chastity','uniform','guardedness','obedience','vow','code','armour','battle','readiness','watchfulness','service','rank','command','loyalty','sacrifice','courage','survival','threat','combat','patrol','visor','blind spot','limited perspective','concealment','identity','anonymity','role','order','military','knighthood','ceremony','oath','tradition','rigidity','suppression','emotional armour','defensiveness','hardness','burden','alertness'],
    altText: "A polished metal helmet with a visor, gold trim, and bright red plumes on top.",
    description: "The Helmet has long been a symbol of strength, defence, and discipline, being the decider between life and death for soldiers in the heat of battle. It offers safety in war, but narrows vision, hides identity, and demands conformity from its wearer, shaping the soldier by their duty to be part of something larger than the self. A helmet is worn when danger is near, and thus it speaks to authority, obedience, discipline, and the vigilance required to keep yourself safe. At a deeper level, the Helmet explores honour, rigidity, restraint, sacrifice, and the cost of freedom for ourselves and for those vulnerable around us."
  },
  { 
    deg: 90, 
    name: 'Beehive',
    primaryMeaning: 'productive work', 
    secondaryMeanings: ['community','sweetness','cooperation','role hierarchy','matriarchy','wealth','royalty','sting','hive mind','dance','scouting','communication','collective mind','abundance','sacrifice','drones','belonging','swarm','fertility'],
    altText: "A golden beehive hanging from a tree branch",
  },
  { 
    deg: 100, 
    name: 'Moon', 
    primaryMeaning: 'night', 
    secondaryMeanings: ['change','reflection','dreams','phases','subconscious','magic','intuition','cold','pull','mystery','secrecy','the uncanny','illusion','cyclical','femininity','silence','return','silver','distance'],
    altText: "A large full moon with a pale blue glow",
  },
  { 
    deg: 110, 
    name: 'Madonna', 
    primaryMeaning: 'femininity', 
    secondaryMeanings: ['empathy','dignity','gentleness','beauty','vanity','sanctuary','emotional intelligence','allure','grace','lust','patience','resolve','comfort','softness','nurture','devotion','modesty'],
    altText: "A woman wearing a flowing blue robe with open hands and long wavy hair. She is smiling and gazing downwards.",
  },
  { 
    deg: 120, 
    name: 'Apple', 
    primaryMeaning: 'temptation', 
    secondaryMeanings: ['knowledge','choice','consequence','forbidden','regret','indulgence','growth','curiosity','sin','offer','reward','pleasure','nourishment','food','health','freshness','harvest','youth','autumn'],
    altText: "A shiny red apple with a small green leaf on its stem. A small bite has been taken out of the center, revealing pale flesh inside.",
  },
  { 
    deg: 130, 
    name: 'Bird', 
    primaryMeaning: 'freedom', 
    secondaryMeanings: ['spring','message','omen','hope','spirit','flight','song','fragility','vision','escape','warning','perspective','the soul','transcendence','vulnerability','migration','divine message','travel','swiftness','the heavens'],
    altText: "A dark black bird with a sharp beak sits with wings folded, gazing to the right bathed in a golden light.",
  },
  { 
    deg: 140, 
    name: 'Bread', 
    primaryMeaning: 'nourishment', 
    secondaryMeanings: ['comfort','daily life','labour','survival','community','home','simplicity','family','craft','provision','hospitality','work','creation','tradition','trust','promise','sacrifice'],
    altText: "A loaf of bread with a golden-brown crust and surrounded by strands of wheat. A few slices have been made revealing a soft white interior.",
  },
  { 
    deg: 150, 
    name: 'Ant', 
    primaryMeaning: 'mechanical work', 
    secondaryMeanings: ['endurance','diligence','strength','routine','insignificance','labour','efficiency','organization','logistics','collective effort','conformity','industry','persistence','tedium','discipline'],
    altText: "A small dark red ant.",
  },
  { 
    deg: 160, 
    name: 'Bull', 
    primaryMeaning: 'strength', 
    secondaryMeanings: ['power','stamina','impulsivity','endurance','rage','untamable','aggression','charge','earth','cruelty','dominance','courage','groundedness','bluntness','steadfastness','uncoordination','large','heavy','danger'],
    altText: "The head of a large brown bull, gazing intently at you with long curved horns and a golden ring through its nose.",
  },
  { 
    deg: 170, 
    name: 'Candle', 
    primaryMeaning: 'fire', 
    secondaryMeanings: ['dim light','learning','guidance','remembrance','hope','solitude','devotion','mourning','study','revelation','time','mortality','warmth','comfort','ritual','secret','oath','sacrifice','darkness'],
    altText: "A simple white candle with a small flame burning at the top, surrounded by a soft glow and perched on a simple golden holder.",
  },
  { 
    deg: 180, 
    name: 'Cornucopia', 
    primaryMeaning: 'wealth', 
    secondaryMeanings: ['success','hospitality','abundance','excess','harvest','reward','gluttony','autumn','bounty','security','comfort','generosity','community','charity','blessing','luck','sharing','overflow','indulgence'],
    altText: "A cornucopia overflowing with grapes, apples, corn, nuts, wheat, and a pumpkin, spilling out of the horn-shaped basket.",
  },
  { 
    deg: 190, 
    name: 'Chameleon', 
    primaryMeaning: 'adaptation', 
    secondaryMeanings: ['camouflage','overlooked','air','identity','inconsistency','versatility','self-preservation','evasion','imitation','opportunism','mask','misdirection','concealment','role','disguise','deception','survival'],
    altText: "A green and brown striped chameleon, curled up so its legs perch on its coiled tail."
  },
  { 
    deg: 200, 
    name: 'Thunderbolt', 
    primaryMeaning: 'inspiration', 
    secondaryMeanings: ['fate','chance','revelation','chaos','shock','disruption','impact','luck','violence','natural power','electricity','aftershock','storm','surprise','act of god','judgement','crisis','consequence'],
    altText: "A jagged yellow thunderbolt",
  },
  { 
    deg: 210, 
    name: 'Dolphin', 
    primaryMeaning: 'playfulness', 
    secondaryMeanings: ['water','succour','friendship','second chance','trust','recovery','aid','safe passage','companionship','intelligence','joy','freedom','guidance','deliverance','laughter','escort'],
    altText: "A light blue dolphin with a yellow underbelly that appears to be smiling as it swims by.",
  },
  { 
    deg: 220, 
    name: 'Walled Garden', 
    primaryMeaning: 'control', 
    secondaryMeanings: ['haven','cultivation','order','restriction','boundaries','domestication','safety','nature','innocence','sanctuary','containment','permission','rules','gatekeeping','purity','shelter','privacy','seclusion','fragility','naivety','paradise','exclusion'],
    altText: "A lush green garden surrounded by a tall stone wall, with a heavy wooden door in the center. A tree and neatly trimmed hedges with flowers can be seen poking over the top of the wall.",
  },
  { 
    deg: 230, 
    name: 'Globe', 
    primaryMeaning: 'travel', 
    secondaryMeanings: ['politics','culture','travel','diplomacy','large scale','navigation','exploration','nations','trade','economy','law','sovereignty','fame','perspective','overview','influence','borders','interconnectedness'],
    altText: "A globe of the Earth, resting on its axis showing the continents and oceans in a pale yellow and brown, mounted atop an ornate golden stand.",
  },
  { 
    deg: 240,
    name: 'Sword', 
    primaryMeaning: 'action', 
    secondaryMeanings: ['fight','severance','justice','action','decisiveness','conflict','violence','conquest','duel','cutting through','domination','attack','danger','sacrifice','war'],
    altText: "A long silver sword with a golden hilt, pointing downwards and to the right. Red gems adorn both ends of the sword, as well as the center of the hilt, surrounded by wing engravings.",
  },
  { 
    deg: 250, 
    name: 'Griffin', 
    primaryMeaning: 'guardianship', 
    secondaryMeanings: ['treasure','watchfulness','vigilance','protection','territory','pride','royalty','courage','barrier','strength','mythical','ferocity','valor','defence','mythology'],
    altText: "A golden griffin with the body of a lion and the head and wings of an eagle, rearing back with claws extended and wings spread wide.",
  },
  { 
    deg: 260, 
    name: 'Horse', 
    primaryMeaning: 'freedom', 
    secondaryMeanings: ['journeys','speed','instinct','anxiety','drive','transportation','partnership','stamina','labour','burden','europe','nobility','trust','power','grace'],
    altText: "A chestnut horse rearing up on its hind legs, white hair adorning its legs and nose.",
  },
  { 
    deg: 270, 
    name: 'Camel', 
    primaryMeaning: 'endurance', 
    secondaryMeanings: ['persistence','resilience','hardship','burden','long journey','preparedness','lasting','self-sufficiency','carry','drought','lack','pilgrimage','trade','slow and steady','perseverance','asia'],
    altText: "A tall camel with two humps, standing in profile with its head turned to face us. Its fur is light brown, and it has long eyelashes and a tuft of hair on the top of its head and humps.",
  },
  { 
    deg: 280, 
    name: 'Elephant', 
    primaryMeaning: 'memory', 
    secondaryMeanings: ['wisdom','calm','strength','dignity','kindness','endurance','restraint','the past','grief','empathy','power','charity','continence','africa'],
    altText: "The head of a large grey elephant, with long curved tusks and wide ears. Its trunk lays calmly hanging down, and its expression is gentle.",
  },
  { 
    deg: 290, 
    name: 'Crocodile', 
    primaryMeaning: 'ambush', 
    secondaryMeanings: ['predation','danger','stealth','pretense','ancient','patience','ferocity','territory','opportunism','deception','america','waiting','rapacity','calculation','cold blooded','survival'],
    altText: "A large green crocodile with its mouth open, showing sharp teeth and a long snout. Its tail curls behind it with pointed scales tracing along its back. Its golden eyes gaze at you with a predatory stare.",
  },
  { 
    deg: 300, 
    name: 'Baby',
    primaryMeaning: 'the future',
    secondaryMeanings: ['Beginnings','malleability','helplessness','potential','legacy','purity','growth','dependency','innocence','youth','vulnerability','hope','new life','uncertainty','nurture','freshness','naivety','learning','trust','family'],
    altText: "A small baby with round rosy cheeks, wrapped in a simple white cloth. The baby's arms are open wide and its eyes look upwards.",
  },
  { 
    deg: 310, 
    name: 'Compass',
    primaryMeaning: 'accuracy',
    secondaryMeanings: ['planning','precision','evidence','proof','fact','measurement','calculation','engineering','design','logic','mathematics','science','drafting','reason','limits','boundary','circle','symmetry','balance','standard','rule'],
    altText: "A tall mathematical compass with two sharp points, one of which has a pencil attached. The compass is open and ornately decorated with golden filigree.",
  },
  { 
    deg: 320, 
    name: 'Lute', 
    primaryMeaning: 'entertainment', 
    secondaryMeanings: ['music','performance','expression','harmony','art','celebration','seduction','charm','storytelling','tradition','fame','culture','creativity','emotion','love','merriment'],
    altText: "A wooden lute with a round body, long neck, and seven strings. The lute is decorated with a carved rosette and golden tuning pegs, as well as a decorative pattern along its body."
  },
  { 
    deg: 330, 
    name: 'Tree', 
    primaryMeaning: 'growth', 
    secondaryMeanings: ['shelter','history','roots','ancestry','stability','nature','seasons','lineage','origin','groundedness','life','renewal','interconnectedness','family','protection','house'],
    altText: "A large leafy tree with a thick knotted trunk and wide canopy of green leaves. The tree is surrounded by a small patch of grass showing a few scraggled roots.",
  },
  { 
    deg: 340, 
    name: 'Father',
    primaryMeaning: 'masculine',
    secondaryMeanings: ['responsibility','lust','protection','duty','pride','ego','impulse','appetite','dominance','family','strength','discipline','love','pragmatism','legacy'],
    altText: "A muscular man stands with long wavy hair and small beard, waring a white cloth around his waist, tied with a brown scarf. One hand rests on his chest while the other extends out to you, his gaze soft and welcoming."
  },
  { 
    deg: 350, 
    name: 'Owl',
    primaryMeaning: 'wisdom',
    secondaryMeanings: ['perception','knowledge','insight','study','watchfulness','intuition','judgement','counsel','winter','fear','omen','solitude','silence','scholarship'],
    altText: "A large brown owl with brown spotted feathres and long black talons. Its wide yellow eyes stare directly at you with wings folded neatly at its sides."
  }
];


/**
 * Exports: The symbol ring, the step size in degrees, and a helper function to get the symbol for a given degree
 */

// Add the icon png to each symbol
export const SYMBOL_RING = SYMBOL_RING_BASE.map((symbol) => ({
  ...symbol,
  iconUrl: (() => {
    const key = String(symbol.name).toLowerCase().replace(/[^a-z0-9]+/g, '')
    const iconUrl = symbolIcons[key]

    if (!iconUrl) {
      throw new Error(`Missing symbol icon for key: ${key}`)
    }

    return iconUrl
  })(),
}))

export const SYMBOL_STEP_DEG = 10;

// Helper: Get symbol for a degree
export function symbolForDeg(northDeg) {
  const lookupDeg = ((Math.round(northDeg / SYMBOL_STEP_DEG) * SYMBOL_STEP_DEG) % 360 + 360) % 360
  const hit = SYMBOL_RING.find((symbol) => symbol.deg === lookupDeg)
  if (hit) return hit

  // fallback (shouldn't happen)
  return { deg: lookupDeg, name: 'Unknown' }
}