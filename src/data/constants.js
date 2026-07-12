// Import all of the symbol pngs
const symbolIconModules = import.meta.glob('../assets/symbols/*.png', {
  eager: true,
  import: 'default',
})
const symbolIcons = Object.fromEntries(
  Object.entries(symbolIconModules).map(([path, url]) => {
    const file = path.split('/').pop()
    const key = file
      ? file
          .replace(/\.png$/i, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '')
      : ''
    return [key, url]
  }),
)

// Defines all of the symbols and their attributes; 0° is due north, increasing clockwise
const SYMBOL_RING_BASE = [
  { 
    deg: 0, 
    name: 'Hourglass', 
    primaryMeaning: 'time',
    secondaryMeanings: ['death','inevitability','urgency','mortality','patience','transition','countdown','finality','change','memory','aging','impermanence','cycles','fate','consequence','opportunity','the past','the present','the future','delay','timing','waiting','threshold','legacy','acceptance','duration','balance','ripening','expiration','waste','lateness','reversal','measurement','deadline','renewal','decay','ending','equilibrium','passing','transience','maturity','completion','limited time','time pressure','anticipation','suspense','procrastination','stagnation','progress','process','sequence','interval','moment','timeliness','second chance','reset','turning point','erosion','decline','scarcity','priorities','allocation','record','sand','falling'],
    altText: "An ornate golden hourglass, with sand flowing from the top to the bottom chamber. At the top of the hourglass rests a human skull.",
    description: "The Hourglass represents time as an unstoppable force, carrying all things towards an inevitable finality. As an impartial record keeper it speaks to both urgency as well as patience, as time continues to flow for all caught in its sand. It points to what is passing away, what must be endured, and what consequence is approaching. At a deeper level, it explores fate, memory, impermanence, and the balance between what has been spent and what still remains."
  },
  { 
    deg: 10, 
    name: 'Sun', 
    primaryMeaning: 'day', 
    secondaryMeanings: ['truth','clarity','life','power','heat','awakening','exposure','summer','certainty','authority','bright light','masculinity','guidance','beginning','vitality','radiance','renewal','hope','energy','growth','creation','illumination','revelation','visibility','confidence','fertility','health','joy','success','blessing','focus','noon','fire','scorching','drought','pride','warmth','glory','majesty','dominion','leadership','consciousness','optimism','achievement','prosperity','recognition','productivity','harvest','sovereignty','centrality','attention','scrutiny','overexposure','harsh truth','daybreak','sunrise','zenith','shadow','burning','desiccation','burnout','exhaustion','arrogance','vanity','ego','hubris','oppression','tyranny'],
    altText: "A bright yellow sun surrounded by rays of light",
    description: "The Sun represents the world brought fully into view, providing illumination and clarity to things otherwise hidden in shadow. It is the great awakener, calling life upward out of slumber into warmth, growth, confidence, and renewal. Its light offers truth and vitality, but can also scorch things that are best left unexposed. At a deeper level, the sun has been a symbol of authority and explores symbolism around authority, masculinity, and pride."
  },
  { 
    deg: 20, 
    name: 'Alpha & Omega', 
    primaryMeaning: 'sequence', 
    secondaryMeanings: ['education','communication','totality','predictability','beginning','ending','language','order','record','alphabet','hierarchy','definition','boundaries','completion','naming','knowledge','remembrance','classification','identity','law','authority','purpose','destiny','inevitability','threshold','legacy','canon','scripture','closure','continuum','literacy','preservation','chronology','transmission','system','eternity','rank','lexicon','first','last','precedence','priority','placement','position','index','catalogue','frame','bookends','progression','continuity','origin','finality','documentation','archive','encoding','interpretation','syntax','grammar','convention','standardization','taxonomy','enumeration','determinism','rigidity','exclusion','dogma','orthodoxy','bureaucracy'],
    altText: "The Greek letters Alpha and Omega, superimposed on each other in a golden brown ink",
    description: "Alpha and Omega is a symbol of finding meaning in sequence, where each mark takes its place within the greater order of the whole. It is the product of education and an enduring means of communication, capturing knowledge and perpetuating it through time. It speaks to the structures that define, rank, preserve, and communicate the intangible parts of our world. At a deeper level, it could refer to law, legacy, or a collective understanding of rules within a system."
  },
  { 
    deg: 30, 
    name: 'Marionette',
    primaryMeaning: 'obedience', 
    secondaryMeanings: ['entertainment','restraint','influence','performance','dependence','control','manipulation','deception','exploitation','coercion','strings attached','powerlessness','agency','role','constraint','compliance','obligation','conditioning','conformity','false self','artifice','ridicule','humiliation','objectification','leverage','pressure','command','captivity','fear','spectacle','pretence','control from afar','borrowed voice','mask','resistance','liberation','force','rebellion','helplessness','subservience','submission','servitude','domination','external authority','proxy','figurehead','scripted behaviour','illusion of choice','false freedom','hidden influence','autonomy','self-determination','escape','cutting ties','identity','anonymity','depersonalization','detachment','entrapment','passivity','inertia','instrumentality','replaceability','stage','theatre','storytelling','role-playing','rehearsal','artistry','craft','audience','applause','mockery'],
    altText: "A smiling wooden marionette puppet in a fancy red zigzag costume with a pointed hat, suspended by strings from a wooden crossbar.",
    description: "The Marionette represents obedience made visible, a figure moved for entertainment by restraints it cannot escape. It is the performer who acts out another's will while appearing to move on its own, speaking words that come from someone else's lips. It explores the relationship between coercion and dependence, for without the puppet master the puppet remains motionless. At a deeper level, you will find themes of power, fear, false selves, and the hidden strings that we find ourselves attached to."
  },
  { 
    deg: 40, 
    name: 'Serpent', 
    primaryMeaning: 'cunning', 
    secondaryMeanings: ['evil','natural wisdom','flexibility','danger','temptation','deceit','rebellion','secrecy','hidden knowledge','renewal','strategy','warning','venom','charm','shedding','transformation','healing','instinct','patience','ambush','forbidden','betrayal','rebirth','adaptation','earth','stealth','mystery','medicine','entanglement','underworld','seduction','constriction','silence','sin','camouflage','antidote','fear','poison','hypnosis','trap','spiral','cycles','duality','transgression','taboo','manipulation','survival','resilience','resourcefulness','calculation','control','pressure','suffocation','captivity','enchantment','desire','fertility','life force','eternity','regeneration','defiance','caution','concealment','coil','winding','skin'],
    altText: "An intricately coiled green serpent with a forked tongue, fangs, and menacing yellow eyes.",
    description: "The Serpent is an ancient symbol of cunning and evil. It is the tempter in the garden, flexible enough to escape restraint, charming enough to invite trust, and venomous enough to make that trust fatal. It symbolises danger, deceit, rebellion, and secrecy. But diving deeper into this symbol we find rebirth in the serpent's shedding skin, yielding transformation, healing, and the natural cycles of renewal that exist in all things."
  },
  { 
    deg: 50, 
    name: 'Cauldron', 
    primaryMeaning: 'alchemy', 
    secondaryMeanings: ['creation','achieved wisdom','nourishment','craft','magic','transformation','medicine','combination','patience','process','ritual','experiment','practice','preparation','vessel','containment','transmutation','witchcraft','remedy','poison','abundance','hearth','melting pot','trial','fermentation','distillation','heat','skill','synthesis','integration','incubation','essence','boil over','toxicity','sustenance','potential','ingredients','concoction','cooking','potion','mixture','recipe','brew','stirring','simmering','boiling','smoke','home','feast','hunger','thirst','cure','elixir','infusion','appetite','resourcefulness','discovery','mastery','discipline','timing','refinement','purification','concentration','solution','nurture','community','generosity','overflow','chaos','risk','failure'],
    altText: "A large black cauldron with a rounded belly and three visible legs. The cauldron is filled with a bubbling green liquid, and a wisp of steam rises from the surface.",
    description: "The Cauldron is a symbol for creation through craft, where raw ingredients are gathered, combined, and transformed through patience and practice. It is the vessel of alchemy and achieved wisdom, nourishing and healing through experimentation, ritual, and maybe even magic. Diving deeper into the symbolism we also find it representing abundance and the warmth of the hearth, or perhaps the chaos of a brew boiling over."
  },
  { 
    deg: 60, 
    name: 'Anchor', 
    primaryMeaning: 'resilience',
    secondaryMeanings: ['steadfastness','stability','hope','restraint','stuck','encumbrance','safety','dependability','grounding','endurance','commitment','burden','inertia','harbour','the deep','the unknown','obligation','holding fast','responsibility','survival','immobility','delay','storm','refuge','protection','attachment','foundation','waiting','homecoming','arrival','sinking','loyalty','resistance','pause','depth','mooring','persistence','security','stubbornness','prevention','weight','duty','anchorage','safe harbour','heaviness','sea','ship','stillness','tether','chain','constancy','fortitude','conviction','reassurance','faith','dependence','limitation','rootedness','drag','drift','release','submersion','suppression','emotional burden','unseen forces','dragging','stagnation'],
    altText: "A large metal anchor with a rope curved around the shank.", 
    description: "The Anchor represents the strength to hold fast against strife, but also the weight that keeps you fixed in place when it is time to move forward. It is a symbol of stability, endurance, and hope, offering safety in choppy waters, but for every current you resist, greater horizons are left unseen. At a deeper level, the Anchor explores burden, inertia, harbouring emotions, and the unknown forces that shape us lying deep beneath the surface."
  },
  { 
    deg: 70, 
    name: 'Angel',
    primaryMeaning: 'goodness', 
    secondaryMeanings: ['forgiveness','purity','conscience','messenger','guidance','guardian','mercy','judgement','hope','divinity','charity','spirituality','grace','virtue','blessing','salvation','faith','redemption','healing','protection','revelation','intervention','compassion','prayer','moral law','justice','deliverance','peace','intercession','absolution','atonement','miracle','divine will','sacred duty','humility','sacrifice','kindness','innocence','comfort','sanctuary','accountability','providence','repentance','retribution','calling','witness','service','devotion','obedience','watchfulness','vigilance','rescue','refuge','purification','temperance','serenity','harmony','awe','radiance','heaven','soul','afterlife','ascension','higher self','chastity','vision','omen','message','choir','light','halo','wings'],
    altText: "A winged angel with a flowing white and gold robe, long golden hair, and a halo above their head. The angel is holding a small golden cross in their hands.",
    description: "The Angel represents goodness given form, a presence of blessing, purity, and conscience that calls the soul toward what is merciful and right. It is the guardian at the threshold, offering guidance, forgiveness, and hope when the way forward feels dark or uncertain. At a deeper level, the Angel explores its more classical associations with ties to retribution and judgement, but also to redemption, as mercy and accountability are two sides of the same blessed coin"
  },
  { 
    deg: 80, 
    name: 'Helmet', 
    primaryMeaning: 'protection',
    secondaryMeanings: ['soldier','narrow vision','conformity','war','duty','safety','authority','restraint','defence','honour','vigilance','discipline','guardedness','obedience','readiness','identity','sacrifice','survival','rigidity','emotional armour','concealment','role','code','service','courage','order','chivalry','burden','limited perspective','blind spot','rank','command','anonymity','suppression','tradition','ceremony','loyalty','watchfulness','vow','uniform','armour','battle','threat','combat','patrol','military','knighthood','oath','chastity','alertness','defensiveness','hardness','visor','preparedness','hierarchy','danger','risk','self-control','detachment','restriction','vulnerability','depersonalization','intimidation','false security'],
    altText: "A polished metal helmet with a visor, gold trim, and bright red plumes on top.",
    description: "The Helmet has long been a symbol of authority, protection, and discipline, being the difference between life and death for a soldier on the battlefield. It offers safety in war, but narrows vision, hides identity, and demands obedience and conformity from its wearer. At a deeper level, the Helmet explores honour, rigidity, restraint, sacrifice, and the cost of safety for ourselves and for those vulnerable around us."
  },
  { 
    deg: 90, 
    name: 'Beehive',
    primaryMeaning: 'productive work', 
    secondaryMeanings: ['community','sweetness','wealth','cooperation','matriarchy','organization','sting','hive mind','interdependence','royalty','self-sacrifice','industry','diligence','purpose','specialization','efficiency','communication','belonging','service','abundance','fertility','division of labour','prosperity','pollination','growth','order','stewardship','protection','swarm','home','unity','economy','hierarchy','mutualism','collective purpose','coordination','dance','scouting','collective mind','duty','harvest','honey','wax','cultivation','discipline','structure','planning','preparation','defence','territory','shared purpose','interconnectedness','mutual dependence','civilization','society','queen','workers','drones','inheritance','legacy','resource management','governance','reproduction','continuity','colony','conformity','obedience','anonymity','overwork','exploitation','exclusion','ecology','biodiversity','fragility','collapse'],
    altText: "A golden beehive hanging from a tree branch",
    description: "The Beehive is a symbol of sweetness earned through diligence and hard work, bringing prosperity and abundance to all who belong within the hive. Yet every thriving colony demands sacrifice, asking each member to faithfully fulfill its role in service of the whole. At a deeper level, the Beehive explores hierarchy, interdependence, communication, stewardship, and the strength found in collective purpose."
  },
  { 
    deg: 100, 
    name: 'Moon', 
    primaryMeaning: 'night', 
    secondaryMeanings: ['phases','subconscious','cold','dreams','secrecy','reflection','magic','femininity','mystery','cycles','intuition','change','sleep','silence','emotion','illusion','transformation','tides','navigation','eclipse','shadow','hidden things','the unknown','prophecy','divination','omen','romance','longing','lunacy','the uncanny','renewal','fertility','solitude','rebirth','guidance','stillness','instinct','imagination','calm','patience','watchfulness','midnight','twilight','gravity','motherhood','silver','stars','the heavens','distance','serenity','liminality','concealment','rhythm','fluctuation','receptivity','enchantment','withdrawal','return','uncertainty','altered states','cyclical time'],
    altText: "A large full moon with a pale blue glow",
    description: "As the sister to the Sun, the Moon is a symbol of the night, casting its cold, reflected light over dreams and secrets while leaving much concealed in shadow. Its changing phases speak to cycles and transformation, connecting it with femininity, intuition, and magic. While the harsh light of the Sun reveals, the glow of the Moon merely suggests, governing what is felt more readily than objective fact. At greater depths, the Moon explores prophecy, longing, and the ebb and flow of tides within our lives."
  },
  { 
    deg: 110, 
    name: 'Madonna', 
    primaryMeaning: 'femininity', 
    secondaryMeanings: ['empathy','insight','safekeeping','nurture','patience','dignity','beauty','resolve','gentleness','grace','comfort','devotion','compassion','wisdom','intuition','care','healing','support','sanctuary','motherhood','creation','hope','faith','mercy','resilience','inner strength','agency','self-possession','receptivity','love','belonging','forgiveness','sacrifice','allure','reverence','kindness','understanding','encouragement','hospitality','home','family','growth','fertility','birth','charity','companionship','elegance','poise','serenity','harmony','balance','autonomy','boundaries','reciprocity','embodiment','sacredness','intercession','softness','modesty','selflessness','vanity','lust'],
    altText: "A woman wearing a flowing blue robe with open hands and long wavy hair. She is smiling and gazing downwards.",
    description: "The Madonna is a symbol of femininity, embodying the qualities of empathy, insight, and the desire to keep the vulnerable safe. She represents a strength that can be both gentle and fierce, nurturing without enabling. At greater depths, the Madonna explores creation, mercy, sacrifice, and the power of feminine energy in guiding and sustaining life."
  },
  { 
    deg: 120, 
    name: 'Apple', 
    primaryMeaning: 'temptation', 
    secondaryMeanings: ['knowledge','choice','consequence','forbidden','desire','regret','indulgence','autumn','curiosity','sin','free will','growth','discovery','awakening','truth','responsibility','cause and effect','offer','reward','pleasure','nourishment','health','harvest','fertility','abundance','potential','renewal','innocence','mortality','immortality','the fall','Eden','judgement','discord','golden apple','gravity','wisdom','revelation','freshness','cultivation','creation','life','nature','sweetness','bitterness','youth','transgression','disobedience','accountability','loss of innocence','test','restraint','appetite','seduction','corruption','vanity','envy','rivalry','competition','poison','orchard','seed','food'],
    altText: "A shiny red apple with a small green leaf on its stem. A small bite has been taken out of the center, revealing pale flesh inside.",
    description: "The Apple is an ancient symbol of temptation, presenting knowledge as something desired, forbidden, and impossible to obtain without consequence. It is the fruit of choice, representing both the sweetness of indulgence and the bitterness of regret. At greater depths it explores sin, free will, discovery, and lost innocence."
  },
  { 
    deg: 130, 
    name: 'Bird', 
    primaryMeaning: 'freedom', 
    secondaryMeanings: ['dawn','message','omen','perspective','hope','soul','fragility','spring','flight','transcendence','renewal','escape','warning','migration','guidance','vision','independence','new beginnings','aspiration','communication','liberation','travel','faith','vulnerability','navigation','imagination','peace','homecoming','watchfulness','discovery','curiosity','dreams','return','parenthood','grace','divine message','song','swiftness','messenger','observation','journey','exploration','lightness','beauty','air','wind','sky','the heavens','height','distance','nest','release','possibility','calling','overview','detachment','wayfinding','spirituality','afterlife','protection','instinct','adaptation','restlessness','wandering','exile'],
    altText: "A dark black bird with a sharp beak sits with wings folded, gazing to the right bathed in a golden light.",
    description: "The Bird is a symbol of freedom, soaring above the earth to gain a wider perspective. As a herald of dawn and spring, it carries messages, omens, and the promise of renewal, while its fragile body reminds us that liberty does not erase vulnerability. At greater depths it explores migration, transcendence, independence, the soul, and the instinctive pull toward distant horizons (and back home again)."
  },
  { 
    deg: 140, 
    name: 'Bread', 
    primaryMeaning: 'nourishment', 
    secondaryMeanings: ['comfort','mundanity','labour','survival','home','community','simplicity','hospitality','family','craft','provision','work','creation','tradition','trust','promise','sacrifice','sustenance','daily life','routine','necessity','hunger','sharing','generosity','welcome','fellowship','companionship','table','meal','feast','hearth','warmth','care','security','livelihood','wages','poverty','scarcity','abundance','harvest','wheat','grain','flour','kneading','baking','rising','fermentation','patience','transformation','reward','effort','dependability','humility','plainness','gratitude','blessing','faith','communion','covenant','body','charity','distribution','fairness','civilization'],
    altText: "A loaf of bread with a golden-brown crust and surrounded by strands of wheat. A few slices have been made revealing a soft white interior.",
    description: "Bread is a symbol of nourishment and sustenance, representing the basic necessities of life and the comfort of home. It embodies the labour and care involved in providing for oneself and others, and the community created when food is prepared and shared. At a deeper level, Bread explores tradition, hospitality, scarcity, gratitude, creation, and the dignity of daily life."
  },
  { 
    deg: 150, 
    name: 'Ant', 
    primaryMeaning: 'mechanical work', 
    secondaryMeanings: ['diligence','conformity','labour','insignificance','discipline','tedium','collective effort','overwork','industry','persistence','repetition','coordination','colony','workforce','burden','obedience','duty','order','routine','organization','provision','construction','communication','survival','resilience','self-sacrifice','interdependence','anonymity','replaceability','exhaustion','infestation','productivity','automation','system','hierarchy','multitude','uniformity','service','strength','determination','tenacity','efficiency','cooperation','specialization','division of labour','regimentation','bureaucracy','social order','resourcefulness','preparation','storage','accumulation','maintenance','infrastructure','foraging','tunnelling','trail','instinct','monotony','drudgery','depersonalization','expendability','subordination','crowding','invasion','collectivism','dependence','relentlessness'],
    altText: "A small dark red ant.",
    description: "The Ant is a symbol of mechanical work, finding strength through diligence, discipline, and collective effort. Its tireless labour sustains the colony, but repetition and conformity reduces the individual to a small, replaceable part within a much larger system. At a deeper level, the Ant explores themes of industry, routine, overwork, anonymity, and the burden of an unending labour."
  },
  { 
    deg: 160, 
    name: 'Bull', 
    primaryMeaning: 'strength', 
    secondaryMeanings: ['rage','endurance','destruction','intimidation','provocation','idolatry','agriculture','physicality','power','courage','groundedness','steadfastness','stubbornness','danger','force','momentum','defiance','resistance','territory','fertility','labour','sacrifice','instinct','pride','authority','competition','wealth','prosperity','earth','appetite','virility','ritual','bull market','speculation','violence','recklessness','aggression','charge','dominance','bluntness','unyielding','temper','fury','impulsiveness','rivalry','masculinity','worship','golden calf','cultivation','ploughing','productivity','abundance','determination','tenacity','stability','burden','service','domestication','restraint','submission','ownership','commodity','exploitation','bullfighting','spectacle','bloodsport','volatility','overconfidence','clumsiness'],
    altText: "The head of a large brown bull, gazing intently at you with long curved horns and a golden ring through its nose.",
    description: "The Bull is a symbol of strength, power, and endurance, representing both the animal's imposing physicality and the force it can exert. It embodies courage and determination, but also the potential for rage and destruction when threatened or provoked. At greater depths, the Bull explores agriculture, sacrifice, idolatry, labour, and the danger inherent to any power."
  },
  { 
    deg: 170, 
    name: 'Candle', 
    primaryMeaning: 'fire', 
    secondaryMeanings: ['dim light','learning','guidance','remembrance','hope','solitude','devotion','mourning','ritual','time','mortality','warmth','comfort','revelation','sacrifice','vigil','prayer','faith','reflection','illumination','darkness','focus','truth','inspiration','oath','secrecy','patience','stillness','sanctuary','grief','memorial','impermanence','fragility','life','soul','countdown','study','meditation','contemplation','attention','watchfulness','knowledge','wisdom','discovery','clarity','awakening','presence','silence','hearth','home','companionship','loss','honour','legacy','passing','spirit','reverence','witness','ceremony','altar','offering','promise','waiting','transience','consumption','transformation','melting','fading','extinguishing','shadow','night','flame','wax','wick','burning'],
    altText: "A simple white candle with a small flame burning at the top, surrounded by a soft glow and perched on a simple golden holder.",
    description: "The Candle is a symbol of fire, casting a dim light that offers guidance, hope, and comfort in the darkness. Its steady flame invites learning, reflection, and devotion, while the melting wax marks the passage of time and the fragile limits of life. At greater depths, the Candle explores remembrance, mourning, ritual, and the vigilance needed to keep a flame alive."
  },
  { 
    deg: 180, 
    name: 'Cornucopia', 
    primaryMeaning: 'wealth', 
    secondaryMeanings: ['harvest','generosity','excess','abundance','hospitality','security','success','autumn','tradition','bounty','prosperity','provision','sharing','community','blessing','gratitude','fertility','growth','cultivation','celebration','sustenance','comfort','reward','luxury','overflow','charity','stewardship','fairness','indulgence','gluttony','privilege','greed','hoarding','waste','scarcity','famine','plenty','nourishment','stability','surplus','resources','savings','inheritance','gift','offering','welcome','giving','distribution','consumption','complacency','entitlement','agriculture','produce','fruit','grain','feast','luck','satisfaction','fulfilment','fortune','opulence','riches'],
    altText: "A cornucopia overflowing with grapes, apples, corn, nuts, wheat, and a pumpkin, spilling out of the horn-shaped basket.",
    description: "The Cornucopia is a symbol of wealth, abundance, and generosity, overflowing with the bounty of the harvest. It represents prosperity, hospitality, and the comfort of having more than enough to share. At greater depths, the Cornucopia explores gratitude, indulgence, privilege, greed, and the discomfort that comes when trying to balance providing without hoarding."
  },
  { 
    deg: 190, 
    name: 'Chameleon', 
    primaryMeaning: 'adaptation', 
    secondaryMeanings: ['camouflage','identity','versatility','imitation','inconsistency','evasion','transformation','opportunism','self-preservation','survival','adjustment','resilience','flexibility','strategy','caution','patience','observation','awareness','perspective','context','change','uncertainty','belonging','alienation','conformity','compromise','diplomacy','authenticity','persona','deception','resourcefulness','vulnerability','sensitivity','isolation','escape','true colours','environment','perception','independence','growth','role','false self','manipulation','calculation','discovery','invisibility','disguise','masking','assimilation','reinvention','ambiguity','fluidity','concealment','misdirection','watchfulness','detachment'],
    altText: "A green and brown striped chameleon, curled up so its legs perch on its coiled tail.",
    description: "The Chameleon is a symbol of adaptation, changing its appearance to survive within shifting surroundings. Its camouflage speaks to versatility and self-preservation, but also to inconsistency and opportunism, allowing it to navigate complex and uncertain landscapes. At greater depths, the Chameleon explores identity, authenticity, conformity, deception, and the balance between blending in and standing out."
  },
  { 
    deg: 200, 
    name: 'Thunderbolt', 
    primaryMeaning: 'inspiration', 
    secondaryMeanings: ['fate','revelation','shock','natural power','luck','impact','chaos','disruption','suddenness','risk','awakening','chance','crisis','electricity','energy','danger','turning point','insight','idea','creativity','urgency','intervention','judgement','destruction','transformation','catalyst','breakthrough','warning','omen','divine will','opportunity','accident','decisiveness','instability','consequence','awe','realization','discovery','genius','impulse','coincidence','probability','surprise','violence','fire','force','power','speed','flash','illumination','storm','thunder','fear','terror','punishment','act of god','authority','wrath','retribution','justice','weapon','aftershock','fallout','volatility','momentum'],
    altText: "A bright yellow thunderbolt with a sharp, jagged shape.",
    description: "The brilliant Thunderbolt is a symbol of inspiration arriving with sudden and overwhelming force, changing the landscape in an instant. It carries the unpredictability of fate and luck, bringing revelation, shock, and disruption without warning. At a deeper level, the Thunderbolt is a symbol of destruction, awakening, opportunity, and the catalytic power that comes in a single decisive moment."
  },
  { 
    deg: 210, 
    name: 'Dolphin', 
    primaryMeaning: 'playfulness', 
    secondaryMeanings: ['friendship','intelligence','assistance','trust','joy','guidance','recovery','water','companionship','aid','communication','curiosity','cooperation','community','affection','protection','rescue','healing','second chance','renewal','hope','navigation','sea','freedom','grace','agility','deliverance','perception','laughter','harmony','optimism','succour','sociability','bond','loyalty','empathy','survival','voyage','journey','homecoming','harbour','waves','depth','breath','surface','movement','speed','leap','dance','song','echolocation','awareness','adaptability','cleverness','mischief','innocence','celebration','peace','good fortune','omen','messenger','guardian','sailors'],
    altText: "A light blue dolphin with a yellow underbelly that appears to be smiling as it swims by.",
    description: "The Dolphin is a symbol of playfulness, pairing joy and friendship with intelligence, trust, and a natural willingness to assist others. Its social nature connects it with communication and companionship, while its history of guiding humans through uncertain waters ties it to rescue, recovery, and safe passage. With grace, the Dolphin navigates both the literal and metaphorical waters of life. At a deeper level, the Dolphin explores healing, empathy, freedom, and the renewal of hope."
  },
  { 
    deg: 220, 
    name: 'Walled Garden', 
    primaryMeaning: 'control', 
    secondaryMeanings: ['domestication','seclusion','safety','dominance','perfection','order','sanctuary','beauty','rules','restriction','privacy','protection','exclusion','gatekeeping','purity','refuge','growth','planning','fragility','innocence','privilege','belonging','isolation','temptation','paradise','stewardship','nurture','preservation','access','threshold','captivity','surveillance','forbidden fruit','loss of innocence','wildness','freedom','shelter','care','harmony','design','maintenance','discipline','pruning','tending','cultivation','enclosure','boundaries','permission','ownership','territory','authority','obedience','dependence','sheltered life','naivety','ignorance','inexperience','Eden','fall from grace','escape','intrusion','invasion','decay','overgrowth','confinement','outsider','gate','wall','curation','idealization','artifice','vulnerability','entitlement','containment','stagnation','sterility'],
    altText: "A lush green garden surrounded by a tall stone wall, with a heavy wooden door in the center. A tree and neatly trimmed hedges with flowers can be seen poking over the top of the wall.",
    description: "The Walled Garden is a symbol of control, representing the desire to shape nature into a safe and perfect space that is protected (and secluded) from the outside world. Its walls create sanctuary and perfection, but they also estasblish dominance by deciding what may enter and how everything within is allowed to grow. It embodies domestication, order, and beauty, but also restriction, exclusion, and the fight against one's true nature. At a deeper level, the Walled Garden explores themes of privilege, isolation, privacy, captivity, and the duality between safety and freedom."
  },
  { 
    deg: 230, 
    name: 'Globe', 
    primaryMeaning: 'travel', 
    secondaryMeanings: ['politics','culture','perspective','interconnectedness','diplomacy','exploration','diversity','navigation','geography','economy','sovereignty','borders','discovery','migration','commerce','nations','exchange','communication','humanity','globalization','alliances','conflict','peace','colonization','stewardship','foreign lands','curiosity','distance','civilization','worldview','displacement','responsibility','unity','understanding','knowledge','trade','law','cartography','direction','voyage','adventure','journey','society','international relations','cooperation','interdependence','cosmopolitanism','internationalism','earth','planet','oceans','continents','frontiers','empires','imperialism','territory','orientation','mobility','exile','tourism','remoteness','scale','resources','environmentalism','geopolitics','leadership','influence','fame','global reach','shared destiny','home'],
    altText: "A globe of the Earth, resting on its axis showing the continents and oceans in a pale yellow and brown, mounted atop an ornate golden stand.",
    description: "The Globe is a symbol of travel, expanding the world beyond familiar horizons and inviting a wider perspecting on distant places, peoples, and cultures. It embodies curiosity, discovery, and the pursuit of knowledge, while also highlighting the complexities of diplomacy, trade, and global responsibility. At a deeper level, the Globe explores diversity, migration, commerce, sovereignty, and the shared destiny of humanity."
  },
  { 
    deg: 240,
    name: 'Sword', 
    primaryMeaning: 'action', 
    secondaryMeanings: ['conflict','severance','justice','decisiveness','violence','defence','courage','conquest','honour','precision','sacrifice','war','division','ending','clarity','truth','discernment','judgement','law','punishment','authority','victory','defeat','duty','oath','discipline','readiness','initiative','intervention','resolve','revenge','death','protection','liberation','rebellion','heroism','attack','danger','separation','finality','verdict','execution','command','power','domination','loyalty','service','skill','willpower','ambition','aggression','anger','retribution','rivalry','challenge','threat','intimidation','wound','bloodshed','guardianship','revolution','knighthood','ceremony','inheritance','legacy','boundary','consequence','irreversibility','cutting ties','duel','combat','martyrdom','sharpness'],
    altText: "A long silver sword with a golden hilt, pointing downwards and to the right. Red gems adorn both ends of the sword, as well as the center of the hilt, surrounded by wing engravings.",
    description: "The Sword is a symbol of action, cutting through uncertainty with decisiveness and the courage to confront conflict directly. Its blade can divide, defend, or deliver justice, making it an instrument of both protection and of violence, closely tied to conflict and war. At a deeper level, the Sword is a symbol of honour, sacrifice, authority, punishment, but also of liberation and the irreversible consequences of wielding destructive power."
  },
  { 
    deg: 250, 
    name: 'Griffin', 
    primaryMeaning: 'guardianship', 
    secondaryMeanings: ['vigilance','treasure','royalty','protection','courage','territory','pride','majesty','custodianship','sacred trust','threshold','worthiness','authority','honour','wealth','sanctuary','boundary','warning','stewardship','safekeeping','legacy','knowledge','sovereignty','fidelity','incorruptibility','duality','discernment','challenge','intimidation','ferocity','dominion','myth','heraldry','sentinel','gatekeeping','hoarding','watchfulness','nobility','power','gold','relic','gate','fortress','predation','hybrid','legend','oath','duty','inheritance','secrecy','trial','exclusivity','possession','defiance','readiness','awe'],
    altText: "A golden griffin with the body of a lion and the head and wings of an eagle, rearing back with claws extended and wings spread wide.",
    description: "The Griffin combines the strength and courage of the lion with the keen vision and vigilance of the eagle. It is a symbol of guardianship, standing with fierocity over treasures and sacred things entrusted to its care. Its royal bearing speaks to courage, pride, and authority, protecting its charge with both strength and discernment. At a deeper level, the Griffin is a symbol of worthiness, sovereignty, trust, and responsibility."
  },
  { 
    deg: 260, 
    name: 'Horse', 
    primaryMeaning: 'journey', 
    secondaryMeanings: ['partnership','instinct','speed','grace','transportation','endurance','Europe','nobility','freedom','trust','labour','burden','power','momentum','progress','exploration','adventure','companionship','cooperation','communication','loyalty','independence','wildness','spirit','vitality','determination','courage','competition','victory','escape','migration','service','obedience','civilization','prosperity','status','drive','stamina','strength','movement','wanderlust','travel','discipline','energy','pursuit','flight','race','autonomy','mobility','direction','urgency','control','restraint','mastery','domestication','chivalry','warfare','conquest','expansion','frontier','agriculture','industry','prestige','ceremony','plains','wind','herd','pasture','equestrianism','knighthood','captivity','exploitation'],
    altText: "A chestnut horse rearing up on its hind legs, white hair adorning its legs and nose.",
    description: "The Horse is a symbol of freedom expressed through movement, carrying its ride across great distances with speed and grace, both as the physical act of travel and the metaphorical pursuit of goals and aspirations. Its strength is shaped through partnership and trust between rider and steed, balancing its wild instinct with cooperation, service, and discipline. At a deeper level, the Horse explores independence, exploration, labour, competition, civilization, and the tension between untamed spirit and domestication."
  },
  { 
    deg: 270, 
    name: 'Camel', 
    primaryMeaning: 'endurance', 
    secondaryMeanings: ['scarcity','hardship','preparedness','isolation','persistence','burden','reserve','Asia','resilience','self-sufficiency','drought','pilgrimage','resourcefulness','survival','patience','desert','adaptation','long journey','conservation','faith','trade','restraint','provision','thirst','foresight','caravan','service','responsibility','nomadism','hospitality','reliability','migration','delayed gratification','humility','wealth','refuge','perseverance','privation','heat','wilderness','distance','commerce','transportation','cargo','storage','sustenance','frugality','thrift','discipline','duty','labour','steadiness','planning','readiness','journey','travel','navigation','oasis','destination','arrival','devotion','submission','kneeling','livelihood','temperance','stoicism','dependability'],
    altText: "A tall camel with two humps, standing in profile with its head turned to face us. Its fur is light brown, and it has long eyelashes and a tuft of hair on the top of its head and humps.",
    description: "The Camel is a symbol of endurance, carrying itself through scarcity, hardship, and isolation with patience and resilience. It represents the strength to persist with careful planning, bearing burdens without wasting what may be needed to survive through difficult journies. At a deeper level, the Camel explores pilgrimage, self-sufficiency, faith, trade, and restraint under duress."
  },
  { 
    deg: 280, 
    name: 'Elephant', 
    primaryMeaning: 'memory', 
    secondaryMeanings: ['wisdom','calm','dignity','grief','strength','empathy','majesty','Africa','charity','remembrance','ancestry','family','endurance','mourning','continence','leadership','history','community','gentleness','intelligence','protection','tradition','compassion','legacy','matriarchy','communication','resilience','stewardship','ritual','loyalty','journey','sacredness','good fortune','burden','captivity','reverence','kindness','restraint','experience','age','longevity','kinship','lineage','devotion','care','nurture','guidance','patience','emotional depth','recognition','learning','cooperation','responsibility','authority','presence','power','stability','steadfastness','groundedness','forgiveness','survival','migration','earth','water','labour','service','exploitation','ivory','sacrifice','prosperity','royalty','solemnity','gravity'],
    altText: "The head of a large grey elephant, with long curved tusks and wide ears. Its trunk lays calmly hanging down, and its expression is gentle.",
    description: "The Elephant is a symbol of memory, wisdom, and dignity, carrying the weight of history and ancestry with calm strength. Its immense strength is tempered by empathy and intelligence, while its close family bonds connect it with grief, remembrance, leadership, and ancestral legacy. At a deeper level, the Elephant explores captivity, sacredness, performance, and long-held grudges."
  },
  { 
    deg: 290, 
    name: 'Crocodile', 
    primaryMeaning: 'ambush', 
    secondaryMeanings: ['ferocity','patience','deception','danger','concealment','predation','opportunism','America','stealth','survival','strategy','instinct','timing','antiquity','territory','camouflage','stillness','hunger','power','intimidation','capture','entrapment','resilience','adaptation','ruthlessness','water','river','swamp','submersion','threshold','fear','death','crocodile tears','insincerity','remorselessness','tenacity','waiting','calculation','rapacity','violence','aggression','dominance','ambition','depth','primality','territoriality','perseverance','restraint','decisiveness','manipulation','false emotion','hypocrisy'],
    altText: "A large green crocodile with its jaws open, revealing sharp teeth along its long snout. Its tail curls behind it, and pointed scales run along its back. Its golden eyes stare forward with a predatory intensity.",
    description: "The Crocodile is a symbol of ambush, lying in wait with patience and stillness to strike with ferocity at the opportune moment. It represents danger that waits for the perfect moment to strike, using deception, careful timing, and opportunism to exploit vulnerability. As we explore deeper meanings, the Crocodile symbolises ancient survival, territory, intimidation, false emotion, and primal instincts."
  },
  { 
    deg: 300, 
    name: 'Baby',
    primaryMeaning: 'the future',
    secondaryMeanings: ['beginnings','potential','innocence','vulnerability','dependency','responsibility','hope','malleability','trust','growth','learning','possibility','care','renewal','family','curiosity','fragility','development','inheritance','wonder','nurture','change','belonging','creation','uncertainty','adaptation','protection','promise','parenthood','love','discovery','continuity','naivety','joy','legacy','becoming','youth','newness','freshness','guidance','acceptance','optimism','laughter','play','attachment','caregiving','purity','birth','helplessness','receptivity','formation','imitation','identity','transformation','sacrifice','need','unpredictability','inexperience','posterity','arrival','tomorrow'],
    altText: "A small baby with round rosy cheeks, wrapped in a simple white cloth. The baby's arms are open wide and its eyes look upwards.",
    description: "The Baby is a symbol of the future, carrying the innocence of a new beginning and the potential of a life not yet shaped. Its vulnerability and dependence create both trust and responsibility, asking others to nurture what is fragile while holding hope for what it may become. At a deeper level, the Baby explores growth, learning, family, legacy, uncertainty, and inheritance."
  },
  { 
    deg: 310, 
    name: 'Compass',
    primaryMeaning: 'accuracy',
    secondaryMeanings: ['proportion','planning','design','precision','measurement','logic','construction','science','mathematics','geometry','creation','reason','structure','proof','circle','order','engineering','balance','boundaries','drafting','method','symmetry','invention','limits','comparison','calibration','standard','problem solving','architecture','definition','consistency','craft','discipline','centre','ideal form','perfection','calculation','evidence','verification','scale','distance','radius','diameter','circumference','arc','curve','alignment','coordinates','blueprint','procedure','technique','skill','instrument','rule','constraint','division','separation','replication','adjustment','restraint','objectivity','rigour','certainty'],
    altText: "A tall mathematical compass with two sharp points, one of which has a pencil attached. The compass is open and ornately decorated with golden filigree.",
    description: "The Compass is a symbol of accuracy, careful measurement, and intelligent human design. It reflects the pursuit of perfection, the application of logic, and the importance of structure and order in both thought and creation. At a deeper level, the Compass represents mathematics, factual evidence, invention, discipline, and construction."
  },
  { 
    deg: 320, 
    name: 'Lute', 
    primaryMeaning: 'entertainment', 
    secondaryMeanings: ['expression','harmony','storytelling','celebration','seduction','tradition','performance','music','art','creativity','emotion','charm','beauty','inspiration','imagination','love','joy','passion','community','romance','companionship','memory','courtship','sorrow','dance','desire','nostalgia','intimacy','festivity','longing','folklore','persuasion','enchantment','craft','improvisation','wandering','song','melody','rhythm','merriment','allure','heartbreak','lament','feast','gathering','audience','applause','fame','recognition','reputation','culture','heritage','history','oral tradition','poetry','ballad','voice','communication','skill','practice','discipline','escapism','leisure','pleasure','travel','minstrel','bard','entertainer','patronage','courtly life','luxury'],
    altText: "A wooden lute with a round body, long neck, and seven strings. The lute is decorated with a carved rosette and golden tuning pegs, as well as a decorative pattern along its body.",
    description: "The Lute symbolises entertainment, giving expression to emotion through harmony, performance, and storytelling. Its music can bring people together in celebration, preserve tradition, or charm and seduce its audience. It embodies creativity, expression, and the power of art to inspire and connect people. At a deeper level, the Lute explores tradition, romance, community, nostalgia, sorrow, persuasion, and how music can be a universal language across cultures and generations."
  },
  { 
    deg: 330, 
    name: 'Tree', 
    primaryMeaning: 'growth', 
    secondaryMeanings: ['shelter','nature','ancestry','seasons','stability','renewal','history','roots','life','lineage','groundedness','time','interconnectedness','family','endurance','resilience','origin','branching','protection','home','longevity','wisdom','adaptation','continuity','legacy','fertility','abundance','harvest','death','rebirth','balance','ecosystem','cultivation','refuge','world tree','strength','patience','inheritance','posterity','offspring','seed','fruit','forest','sustenance','shade','nest','homecoming','tranquility','stillness','peace','beauty','cycles','change','weathering','regeneration','growth rings','tradition','heritage','community','foundation','aspiration','earth'],
    altText: "A large leafy tree with a thick knotted trunk and wide canopy of green leaves. The tree is surrounded by a small patch of grass showing a few scraggled roots.",
    description: "The Tree is the symbol for growth and history, drawing life from the earth while offering shelter, stability, and renewal through the changing seasons. Its roots reach into ancestry and history while its branches reflect the many paths through which families, ideas, and legacies stretch into the future. At a deeper level, the Tree explores family, endurance, interconnectedness, fertility, and the continuity of life through generations."
  },
  { 
    deg: 340, 
    name: 'Father',
    primaryMeaning: 'masculine',
    secondaryMeanings: ['responsibility','family','beauty','patience','support','discipline','legacy','love','care','encouragement','devotion','parenthood','nurture','presence','guidance','dependability','home','belonging','mentorship','tenderness','lineage','creation','growth','accountability','trust','acceptance','stability','integrity','comfort','inheritance','companionship','expectation','approval','sacrifice','absence','continuity','identity','wisdom','reliability','resilience','fairness','humility','reassurance','teaching','example','duty','honour','confidence','provision','security','restraint','affection','affirmation','vulnerability','forgiveness','playfulness','pride','kinship','ancestry','heritage','paternity','generativity','boundaries','structure','consistency','authority','tradition','pressure','distance','control','ambition','ego','lust','appetite','impulse'],
    altText: "A muscular man stands with long wavy hair and small beard, wearing a white cloth around his waist, tied with a brown scarf. One hand rests on his chest while the other extends out to you, his gaze soft and welcoming.",
    description: "The Father is a symbol of masculinity, embodying the enduring work of supporting and caring for a family. A symbol of love, lust, and legacy, the father explores devotion, dependability, and the nurturing labour of parenthood. At a deeper level, the Father explores accountability, expectation, and growth."
  },
  { 
    deg: 350, 
    name: 'Owl',
    primaryMeaning: 'wisdom',
    secondaryMeanings: ['perception','insight','silence','watchfulness','solitude','knowledge','winter','discernment','mystery','intuition','observation','night','judgement','intelligence','stealth','learning','reflection','hidden knowledge','counsel','stillness','omen','patience','truth','curiosity','foresight','perspective','secrecy','independence','warning','memory','darkness','experience','prophecy','revelation','the uncanny','death','awareness','vigilance','contemplation','reason','scholarship','study','research','education','academia','mentorship','guidance','prudence','maturity','clarity','discovery','focus','withdrawal','isolation','moonlight','hearing','detachment','vision','loneliness','precision','concealment','predation','fear','superstition','misfortune'],
    altText: "A large brown owl with brown spotted feathers and long black talons. Its wide yellow eyes stare directly at you with wings folded neatly at its sides.",
    description: "The Owl is a symbol of wisdom, seeing through darkness with keen perception and insight, able to see what others cannot. Its solitary nature and all-seeing eyes connect it with knowledge, discernment, and judgement. At greater depths, the Owl explores mystery, hidden knowledge, prophecy, secrecy, and the uncanny."
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