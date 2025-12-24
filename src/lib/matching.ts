import type { Question } from '@/types';

// =================================================================
// LAYER 1: EXPRESSION / FILLER / POLITENESS WORDS
// =================================================================

const IGNORE_EN = [
  "please", "pls", "kindly", "pardon", "tell me", "can you", "could you", "would you", "will you",
  "i want to know", "i wanna know", "i need to know", "i would like to know", "i'd like to know",
  "help me", "just tell me", "do you know", "let me know", "guide me", "suggest me", "show me", "give me",
  "share with me", "brief me", "quickly tell me", "tell me something", "enlighten me", "any idea", 
  "have you idea", "do you have any idea", "is it possible", "is there any way", "can we", "what about", 
  "how about", "what if", "okay", "ok", "fine", "alright", "right", "correct", "yes", "yeah", "yep", 
  "sure", "exactly", "thanks", "thank you", "thanks a lot", "thank you so much", "much appreciated", 
  "appreciate it", "appreciated", "sorry", "excuse me", "pardon me", "hey", "hi", "hello", "good morning", 
  "good afternoon", "well", "so", "now", "then", "just", "actually", "basically", "technically", 
  "normally", "generally", "usually", "mostly", "typically", "like", "you know", "i mean", "as such",
  "in fact", "to be honest"
];

const IGNORE_HI = [
  "batao", "bataiye", "batana", "bata do", "bata dijiye", "samjhao", "samjhaiye", "samjhana", "samjha do",
  "dikhao", "dikhaiye", "dikha do", "sikhaiye", "sikha do", "sikhana", "mujhe", "hamko", "hume", "humein", 
  "mereko", "aapko", "tumko", "tumhe", "kripya", "kripaya", "zara", "thoda", "jara", "please", "ji",
  "kya aap", "kya tum", "kya aisa", "kya ye", "kaise hota hai batao", "ka idea hai", "kuch pata hai",
  "pata hai kya", "maloom hai", "accha", "achha", "acha", "theek hai", "thik hai", "haan", "haan ji", 
  "han", "nahi", "nhi", "bilkul", "sahi", "ekdum", "arre", "yaar", "bhai", "bro", "dost", "sir", "madam", 
  "sahab", "suno", "dekho", "sunno", "dekhiye", "suniye", "arey", "are", "matlab", "yaani", "toh", 
  "phir", "aur", "waise", "lekin", "par", "magar", "bas", "ekdum"
];

const IGNORE_HINGLISH = [
  "tum batao", "aap bataiye", "aap batao", "mujhe janna hai", "mujhe samajhna hai", "mujhe pata karna hai", 
  "mujhe dekhna hai", "bas itna bata do", "bas ye bata do", "thoda explain karo", "thoda samjhao",
  "simple me batao", "easy language me batao", "detail me batao", "brief me batao", "quickly batao", 
  "jaldi batao", "ek baat batao", "ek baat puchni hai", "ek cheez puchni hai", "ek doubt hai", 
  "mereko doubt hai", "mera doubt hai", "mereko samajh nahi aa raha", "samajh nahi aa raha", "confusion hai", 
  "clear karo", "iska idea do", "iska concept batao", "iska solution batao", "iska answer batao",
  "iska kya scene hai", "iska kya scene hota hai", "ye kaise hota hai", "ye hota kaise hai", 
  "ye possible hai kya", "aisa ho sakta hai kya", "iska kuch tareeka hai", "iska option kya hai",
  "iska best tareeka kya hai", "chalo ye batao", "ab ye batao", "next ye batao", "phir ye batao",
  "aur ek baat", "ek aur baat", "ek minute", "ruko ruko", "waise", "matlab", "yaani", "actually", 
  "basically", "technically", "normally", "generally", "usually", "mostly", "as such", "in general", 
  "typically", "practically", "theoretically", "you know", "i mean", "like", "as per my knowledge", 
  "according to me", "in my opinion", "mere hisaab se", "jitna mujhe pata hai", "meri jaankari me"
];

const IGNORE_SPEECH_FILLERS = [
  "uh", "uhh", "um", "umm", "ummm", "hmm", "hmmm", "hmmmm", "ah", "ahh", "oh", "ohh", "err", "errr",
  "let me think", "let me see", "give me a second", "give me a minute", "sochne do", "dekhte hain",
  "what i mean is", "what i'm saying is", "the thing is", "point is", "baat ye hai ki", "scene ye hai ki"
];

export function removeExpressionNoise(text: string) {
  let cleaned = text.toLowerCase().trim();
  const allIgnoreWords = [
    ...IGNORE_EN,
    ...IGNORE_HI,
    ...IGNORE_HINGLISH,
    ...IGNORE_SPEECH_FILLERS
  ];
  const sortedIgnore = allIgnoreWords.sort((a, b) => b.length - a.length);

  for (const phrase of sortedIgnore) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
    cleaned = cleaned.replace(regex, ' ');
  }
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

// =================================================================
// LAYER 2: MASTER ENTITY DICTIONARY
// =================================================================
const ENTITY_STATIC_EQUIPMENT = ["pressure vessel", "vertical vessel", "horizontal vessel", "reactor", "reactor vessel", "cstr", "pfr", "heat exchanger", "hx", "shell and tube heat exchanger", "shell and tube", "plate heat exchanger", "plate and frame", "double pipe heat exchanger", "air cooler", "air fin cooler", "fin fan cooler", "afc", "air cooled heat exchanger", "ache", "distillation column", "column", "tower", "fractionation column", "fractionating tower", "fractionator", "frac tower", "absorption column", "absorber", "stripping column", "stripper", "scrubber", "scrubbing column", "extraction column", "drying column", "dryer", "separator", "separation drum", "knock out drum", "ko drum", "kod", "flash drum", "flash separator", "surge drum", "surge vessel", "decanter", "phase separator", "filter separator", "cyclone separator", "storage tank", "tank", "fixed roof tank", "cone roof tank", "floating roof tank", "external floating roof tank", "efrt", "internal floating roof tank", "ifrt", "dome roof tank", "bullet tank", "bullet", "lpg bullet", "sphere", "spherical tank", "horton sphere", "day tank", "service tank", "reboiler", "thermosyphon reboiler", "kettle reboiler", "kettle type reboiler", "condenser", "overhead condenser", "reflux condenser", "partial condenser", "total condenser", "furnace", "fired heater", "process heater", "cabin heater", "box heater", "vertical heater", "vertical furnace", "horizontal heater", "reformer", "reformer furnace", "cracking furnace", "boiler", "steam boiler", "water tube boiler", "fire tube boiler", "package boiler", "waste heat recovery boiler", "whrb", "hrsg", "heat recovery steam generator", "stack", "chimney", "flare stack", "vent stack", "filter", "cartridge filter", "bag filter", "sand filter", "activated carbon filter", "silo", "hopper", "mixer", "static mixer", "crystallizer"];
const ENTITY_ROTATING_EQUIPMENT = ["pump", "centrifugal pump", "centrifugal", "reciprocating pump", "recip pump", "positive displacement pump", "pd pump", "gear pump", "screw pump", "lobe pump", "diaphragm pump", "plunger pump", "submersible pump", "sump pump", "metering pump", "dosing pump", "slurry pump", "vacuum pump", "compressor", "centrifugal compressor", "reciprocating compressor", "recip compressor", "screw compressor", "rotary screw compressor", "axial compressor", "air compressor", "gas compressor", "turbine", "steam turbine", "gas turbine", "back pressure turbine", "condensing turbine", "blower", "roots blower", "fan", "centrifugal fan", "axial fan", "induced draft fan", "id fan", "forced draft fan", "fd fan", "motor", "electric motor", "induction motor", "synchronous motor", "vfd", "variable frequency drive", "gearbox", "gear reducer", "speed reducer", "coupling", "flexible coupling", "gear coupling", "disc coupling", "fluid coupling"];
const ENTITY_PIPING = ["pipe", "pipeline", "piping", "process line", "utility line", "transfer line", "service line", "carbon steel pipe", "cs pipe", "stainless steel pipe", "ss pipe", "ss304", "ss316", "alloy steel pipe", "chrome moly pipe", "pvc pipe", "hdpe pipe", "grp pipe", "frp pipe", "elbow", "90 degree elbow", "45 degree elbow", "long radius elbow", "short radius elbow", "bend", "180 degree bend", "tee", "equal tee", "reducing tee", "cross", "reducer", "concentric reducer", "eccentric reducer", "swage", "swage nipple", "coupling", "socket", "half coupling", "union", "barrel nipple", "stub end", "lap joint stub end", "cap", "pipe cap", "plug", "bull plug", "flange", "weld neck flange", "wn flange", "wnrf", "slip on flange", "so flange", "sorf", "blind flange", "bl flange", "socket weld flange", "sw flange", "lap joint flange", "lj flange", "threaded flange", "screwed flange", "orifice flange", "spectacle blind", "spade and spacer", "gasket", "spiral wound gasket", "swg", "spwd gasket", "ring type joint gasket", "rtj gasket", "rtj", "graphite gasket", "compressed asbestos free gasket", "caf", "rubber gasket", "neoprene gasket", "ptfe gasket", "teflon gasket", "metallic gasket", "soft iron gasket", "expansion joint", "bellows", "expansion bellows", "metallic expansion joint", "rubber expansion joint", "hose", "flexible hose", "metal hose", "rubber hose", "pipe support", "support", "shoe", "pipe shoe", "hanger", "spring hanger", "constant spring hanger", "trunnion", "saddle", "clamp", "u bolt", "guide", "snubber", "sway brace", "anchor", "restraint"];
const ENTITY_FLANGE_COMPONENTS = ["flange face", "face finish", "raised face", "rf", "raised face flange", "flat face", "ff", "full face", "rtj groove", "ring groove", "ring type joint groove", "serration", "serration area", "phonographic serration", "concentric serration", "spiral serration", "gasket seating surface", "gasket surface", "seating face", "contact face", "bolt hole", "bolt circle", "stud hole", "tapped hole", "hub", "flange hub", "neck", "bore", "flange bore", "alignment", "flange alignment"];
const ENTITY_BOLTING = ["bolt", "stud bolt", "stud", "hex bolt", "hexagon bolt", "machine bolt", "carriage bolt", "anchor bolt", "foundation bolt", "eye bolt", "u bolt", "nut", "hex nut", "heavy hex nut", "lock nut", "jam nut", "castle nut", "wing nut", "washer", "flat washer", "spring washer", "lock washer", "belleville washer", "thread", "bolt thread", "torque", "bolt torque", "tensioning", "bolt tensioning", "tightening", "bolt tightening"];
const ENTITY_VESSEL_COMPONENTS = ["shell", "vessel shell", "cylindrical shell", "head", "dish end", "end closure", "elliptical head", "ellipsoidal head", "2:1 elliptical head", "torispherical head", "tori head", "dished head", "hemispherical head", "hemi head", "conical head", "cone head", "flat head", "flat end", "nozzle", "nozzle neck", "manway", "manhole", "personnel access", "handhole", "inspection opening", "davit", "davit arm", "reinforcement pad", "repad", "reinforcing pad", "weld pad", "nozzle reinforcement", "name plate", "identification plate", "lifting lug", "lug", "trunnion lug", "earthing lug", "grounding lug", "ladder", "platform", "walkway", "support", "vessel support", "skirt", "support skirt", "cylindrical skirt", "saddle", "saddle support", "leg", "leg support", "support leg", "anchor bolt", "base plate", "grout pad"];
const ENTITY_HX_INTERNALS = ["tube", "heat exchanger tube", "tube bundle", "bundle", "u tube", "u bend tube", "straight tube", "finned tube", "fin tube", "tube sheet", "tubesheet", "fixed tube sheet", "stationary tube sheet", "floating tube sheet", "floating head", "channel head", "channel", "front head", "bonnet", "rear head", "return head", "shell cover", "end cover", "baffle", "baffle plate", "segmental baffle", "single segmental baffle", "double segmental baffle", "longitudinal baffle", "disc and doughnut baffle", "tie rod", "tie bolt", "spacer", "spacer tube", "pass partition plate", "pass partition", "impingement plate", "impingement baffle", "sealing strip", "sealing device", "vent connection", "vent nozzle", "drain connection", "drain nozzle", "tube side inlet", "tube side outlet", "tube side pass", "shell side inlet", "shell side outlet", "shell side pass"];
const ENTITY_COLUMN_INTERNALS = ["tray", "distillation tray", "sieve tray", "perforated tray", "valve tray", "float valve tray", "bubble cap tray", "bubble cap", "chimney tray", "downcomer", "down pipe", "weir", "outlet weir", "inlet weir", "tray support ring", "support beam", "tray deck", "tray floor", "packing", "tower packing", "random packing", "dumped packing", "structured packing", "grid packing", "packing support plate", "support grid", "packing retainer", "hold down plate", "distributor", "liquid distributor", "spray nozzle", "spray header", "collector", "liquid collector", "redistributor", "demister", "mist eliminator", "vane pack", "wire mesh demister", "mesh pad", "feed nozzle", "feed point", "draw off nozzle", "side draw", "reflux nozzle", "top product nozzle", "bottom product nozzle"];
const ENTITY_TANK_COMPONENTS = ["bottom plate", "tank bottom", "annular plate", "annular ring", "bottom shell course", "shell course", "shell ring", "shell plate", "side plate", "roof plate", "roof structure", "cone roof", "conical roof", "dome roof", "domed roof", "floating roof", "internal floating roof", "pontoon", "pontoon compartment", "deck plate", "deck", "rim seal", "primary seal", "secondary seal", "weather seal", "foam seal", "wiper seal", "guide pole", "gauge pole", "roof drain", "emergency drain", "roof vent", "pressure vacuum valve", "pv valve", "breather valve", "anti rotation device", "deck leg", "roof support", "column support", "shell nozzle", "roof nozzle", "inlet nozzle", "outlet nozzle", "gauge hatch", "sample connection", "ring wall", "concrete ring wall", "tank foundation", "sand pad", "cathodic protection", "sacrificial anode"];
const ENTITY_FURNACE_COMPONENTS = ["radiant coil", "radiant section", "convection coil", "convection section", "shield coil", "shock tube", "burner", "gas burner", "oil burner", "burner tip", "burner throat", "flame", "fire box", "combustion chamber", "radiant chamber", "refractory", "refractory lining", "insulation", "ceramic fiber", "castable refractory", "expansion joint", "metallic expansion joint", "stack", "chimney", "stack damper", "damper", "induced draft fan", "forced draft fan", "soot blower", "steam soot blower", "inspection door", "peep hole"];
const ENTITY_NDT_TESTS = ["ndt", "non destructive testing", "non destructive test", "non destructive examination", "nde", "visual inspection", "visual testing", "vt", "visual examination", "vi", "dye penetrant test", "dpt", "liquid penetrant test", "liquid penetrant testing", "lpt", "pt", "color contrast penetrant", "fluorescent penetrant", "magnetic particle test", "magnetic particle testing", "mt", "mpt", "magnetic particle inspection", "mpi", "wet fluorescent mt", "dry powder mt", "ultrasonic testing", "ultrasonic test", "ut", "straight beam ut", "angle beam ut", "paut", "phased array ultrasonic testing", "tofd", "time of flight diffraction", "thickness measurement", "ultrasonic thickness", "radiography", "radiographic testing", "rt", "x ray", "gamma ray", "film radiography", "digital radiography", "hardness test", "hardness testing", "brinell hardness", "rockwell hardness", "vickers hardness", "pmi", "pmi test", "positive material identification", "material verification", "spectroscopy", "eddy current test", "eddy current testing", "ect", "et", "leak test", "leak testing", "bubble test", "soap bubble test", "vacuum box test", "ammonia test", "helium leak test", "hydrotest", "hydrostatic test", "hydrostatic testing", "hydro testing", "pneumatic test", "pneumatic testing", "air test", "spark test", "holiday test", "coating thickness", "dft", "ferrite test", "ferrite measurement"];
const ENTITY_WELDING = ["weld", "welding", "butt weld", "butt joint", "fillet weld", "fillet", "groove weld", "full penetration weld", "partial penetration weld", "seal weld", "tack weld", "plug weld", "slot weld", "repair weld", "reweld", "overlay weld", "weld overlay", "cladding", "weld cladding", "buttering", "root pass", "root bead", "hot pass", "filler pass", "fill pass", "capping pass", "cap pass", "cover pass", "weld joint", "welded joint", "joint preparation", "edge preparation", "bevel", "j bevel", "v bevel", "u bevel", "root gap", "root opening", "root face", "land", "included angle", "groove angle", "welding electrode", "electrode", "filler wire", "filler metal", "welding rod", "filler rod", "consumable", "welding consumable", "smaw", "stick welding", "arc welding", "gtaw", "tig", "tig welding", "gmaw", "mig", "mig welding", "fcaw", "flux cored welding", "saw", "submerged arc welding", "wps", "welding procedure specification", "pqr", "procedure qualification record", "wpq", "welder performance qualification", "welder qualification", "weld map", "joint map"];
const ENTITY_MAINTENANCE = ["maintenance", "preventive maintenance", "pm", "corrective maintenance", "breakdown maintenance", "predictive maintenance", "condition based maintenance", "repair", "fixing", "temporary repair", "permanent repair", "emergency repair", "replacement", "change out", "bundle pull", "bundle replacement", "retube", "retubing", "tube replacement", "gasket replacement", "regasketing", "bolt replacement", "overlay", "weld overlay", "build up", "metal build up", "hardfacing", "hard facing", "machining", "re machining", "in situ machining", "on site machining", "lapping", "flange face lapping", "grinding", "surface grinding", "polishing", "tube plugging", "plugging tubes", "tray replacement", "packing replacement", "refractory repair", "refractory relining", "coating repair", "recoating", "painting", "touch up painting", "blasting", "sand blasting", "grit blasting", "corrosion protection", "cathodic protection", "coating application", "galvanizing", "hot dip galvanizing", "anodizing", "cleaning", "equipment cleaning", "chemical cleaning", "acid cleaning", "mechanical cleaning", "hydro jetting", "water jetting", "steam cleaning", "degreasing", "flushing", "alignment", "shaft alignment", "coupling alignment", "piping alignment", "flange alignment", "tightening", "bolt tightening", "torque tightening", "torquing", "bolt tensioning", "hydraulic tensioning", "shutdown", "turnaround", "ta", "plant shutdown", "unit shutdown", "outage", "opening", "equipment opening", "box up", "boxing up", "closing"];
const ENTITY_INSPECTION = ["inspection", "examination", "visual inspection", "visual examination", "internal inspection", "internal examination", "external inspection", "external examination", "pre shutdown inspection", "post shutdown inspection", "during shutdown inspection", "in service inspection", "periodic inspection", "routine inspection", "fit up inspection", "fit up check", "alignment check", "final inspection", "pre commissioning inspection", "thickness measurement", "thickness check", "ut thickness", "ultrasonic thickness", "corrosion mapping", "cml", "corrosion monitoring location", "remaining thickness", "hardness check", "hardness testing", "pmi", "pmi check", "material verification", "dye penetrant test", "dpt check", "magnetic particle test", "mt check", "surface crack detection", "ultrasonic testing", "ut check", "radiography", "rt check", "weld inspection", "leak test", "leak testing", "hydrotest", "hydrostatic test", "hydrostatic testing", "pressure test", "pneumatic test", "air test", "vacuum box test", "spark test", "holiday test", "holiday detection", "coating inspection", "coating thickness measurement", "dft measurement", "fugitive emission check", "emission testing", "environmental monitoring"];
const ENTITY_DEFECTS = ["crack", "cracking", "surface crack", "internal crack", "stress crack", "fatigue crack", "thermal crack", "cold crack", "hot crack", "hydrogen cracking", "delayed cracking", "leakage", "leak", "leaking", "pin hole leak", "weeping", "through wall leak", "gasket leak", "flange leak", "gland leak", "seal leak", "corrosion", "general corrosion", "uniform corrosion", "pitting", "pitting corrosion", "crevice corrosion", "stress corrosion cracking", "scc", "intergranular corrosion", "igc", "galvanic corrosion", "microbiologically influenced corrosion", "mic", "erosion", "erosion corrosion", "cavitation", "cavitation erosion", "impingement", "impingement erosion", "grooving", "dent", "denting", "bulging", "blistering", "deformation", "plastic deformation", "distortion", "warpage", "buckling", "misalignment", "offset", "overheating", "hot spot", "burn through", "burn out", "thermal shock", "creep", "creep damage", "scaling", "scale formation", "deposit", "fouling", "coking", "coke formation", "undercut", "undercutting", "overlap", "cold lap", "lack of fusion", "incomplete fusion", "lof", "lack of penetration", "incomplete penetration", "lop", "porosity", "worm hole", "blow hole", "slag inclusion", "inclusion", "lamination", "delamination", "burn through", "void", "cavity", "segregation", "cold shut", "seam", "lap", "coating failure", "disbondment", "blistering", "peeling", "chalking", "fading", "holiday", "pin hole", "failure", "rupture", "burst", "explosion", "collapse", "seizure", "stuck", "vibration", "excessive vibration", "noise", "abnormal noise", "plugging", "choking", "blockage", "fouling", "tube fouling", "binding", "sticking", "stuck valve"];
const ENTITY_DOCUMENTS = ["inspection report", "examination report", "shutdown report", "turnaround report", "maintenance report", "repair report", "remedial work report", "fit up report", "alignment report", "final inspection report", "completion report", "ndt report", "ut report", "ultrasonic report", "pt report", "dpt report", "penetrant test report", "mt report", "magnetic particle report", "rt report", "radiography report", "pmi report", "hydrotest report", "pressure test report", "pneumatic test report", "leak test report", "thickness report", "thickness measurement report", "corrosion report", "corrosion assessment", "hardness report", "deviation report", "deviation request", "non conformity report", "ncr", "non conformance report", "corrective action report", "car", "corrective action request", "closure report", "ncr closure", "release note", "release certificate", "acceptance report", "acceptance certificate", "material acceptance", "mat", "job completion certificate", "jcc", "work completion certificate", "handover document", "handover certificate", "punch list", "snag list", "wps", "welding procedure specification", "pqr", "procedure qualification record", "wpq", "welder performance qualification", "itp", "inspection and test plan", "qcp", "quality control plan", "qap", "quality assurance plan", "method statement", "work method statement", "procedure", "work procedure", "risk assessment", "ra", "jha", "job hazard analysis", "jsa", "job safety analysis", "permit to work", "ptw", "work permit", "moc", "management of change", "design change", "modification", "drawing", "engineering drawing", "as built drawing", "as built", "fabrication drawing", "fab drawing", "ga drawing", "general arrangement", "detail drawing", "piping isometric", "iso drawing", "isometric", "p&id", "piping and instrumentation diagram", "pfd", "process flow diagram", "datasheet", "equipment datasheet", "material datasheet", "specification", "technical specification", "standard", "code", "mtr", "mill test report", "material test report", "mtc", "material test certificate", "certificate of compliance", "coc", "calibration certificate"];
const ENTITY_STANDARDS = ["asme", "asme code", "asme section viii", "asme sec 8", "asme b31.3", "asme b31.1", "asme section ix", "asme sec 9", "asme section v", "asme sec 5", "api", "api standard", "api 650", "api 620", "api 510", "api 570", "api 653", "astm", "astm standard", "astm a105", "astm a106", "astm a53", "astm a182", "astm a234", "astm a240", "astm a516", "astm a515", "iso", "iso standard", "ansi", "ansi standard", "din", "din standard", "bs", "british standard", "nace", "nace standard", "tema", "hei"];
const ENTITY_MATERIALS = ["carbon steel", "cs", "mild steel", "ms", "a106", "a53", "sa106", "sa53", "a516 gr 70", "a515", "stainless steel", "ss", "ss304", "ss316", "ss316l", "ss321", "ss347", "duplex", "super duplex", "alloy steel", "chrome moly", "cr mo", "p11", "p22", "p5", "p9", "1.25cr 0.5mo", "2.25cr 1mo", "copper", "brass", "bronze", "aluminum", "aluminium", "monel", "inconel", "hastelloy", "titanium", "cast iron", "ci", "ductile iron", "di", "rubber", "neoprene", "ptfe", "teflon", "pvc", "hdpe", "grp", "frp", "fiberglass"];
const ENTITY_VALVES = ["valve", "gate valve", "globe valve", "ball valve", "plug valve", "butterfly valve", "knife gate valve", "control valve", "cv", "pressure reducing valve", "prv", "pressure relief valve", "safety valve", "pressure safety valve", "psv", "relief valve", "check valve", "non return valve", "nrv", "swing check valve", "lift check valve", "dual plate check valve", "needle valve", "diaphragm valve", "pinch valve", "solenoid valve", "valve body", "valve bonnet", "valve stem", "valve disc", "valve seat", "valve trim", "gland", "gland packing", "actuator", "valve actuator"];
const ENTITY_INSTRUMENTATION = ["instrument", "instrumentation", "pressure gauge", "pressure indicator", "pressure transmitter", "pressure switch", "temperature gauge", "thermometer", "temperature transmitter", "thermocouple", "rtd", "resistance temperature detector", "level gauge", "level indicator", "level transmitter", "level switch", "sight glass", "level glass", "flow meter", "flow transmitter", "orifice plate", "orifice meter", "rotameter", "control panel", "dcs", "plc", "scada"];

function getEntityCategory(entity: string) {
  if (ENTITY_STATIC_EQUIPMENT.includes(entity)) return "STATIC_EQUIPMENT"
  if (ENTITY_ROTATING_EQUIPMENT.includes(entity)) return "ROTATING_EQUIPMENT"
  if (ENTITY_PIPING.includes(entity)) return "PIPING"
  if (ENTITY_FLANGE_COMPONENTS.includes(entity)) return "FLANGE"
  if (ENTITY_NDT_TESTS.includes(entity)) return "NDT"
  if (ENTITY_WELDING.includes(entity)) return "WELDING"
  if (ENTITY_MAINTENANCE.includes(entity)) return "MAINTENANCE"
  if (ENTITY_DEFECTS.includes(entity)) return "DEFECT"
  if (ENTITY_VALVES.includes(entity)) return "VALVE"
  if (ENTITY_INSTRUMENTATION.includes(entity)) return "INSTRUMENT"
  return "OTHER"
}

export function extractEntities(text: string) {
  const entities: { text: string; start: number; end: number; category: string }[] = [];
  const positions: { start: number, end: number }[] = [];
  const allEntities = [
    ...ENTITY_STATIC_EQUIPMENT, ...ENTITY_ROTATING_EQUIPMENT, ...ENTITY_PIPING, ...ENTITY_FLANGE_COMPONENTS,
    ...ENTITY_BOLTING, ...ENTITY_VESSEL_COMPONENTS, ...ENTITY_HX_INTERNALS, ...ENTITY_COLUMN_INTERNALS,
    ...ENTITY_TANK_COMPONENTS, ...ENTITY_FURNACE_COMPONENTS, ...ENTITY_NDT_TESTS, ...ENTITY_WELDING,
    ...ENTITY_MAINTENANCE, ...ENTITY_INSPECTION, ...ENTITY_DEFECTS, ...ENTITY_DOCUMENTS, ...ENTITY_STANDARDS,
    ...ENTITY_MATERIALS, ...ENTITY_VALVES, ...ENTITY_INSTRUMENTATION
  ];
  const uniqueEntities = [...new Set(allEntities)].sort((a, b) => b.length - a.length);
  let markedText = text.toLowerCase();

  for (const entity of uniqueEntities) {
    const regex = new RegExp(`\\b${entity}\\b`, 'gi');
    const matches = [...markedText.matchAll(regex)];
    for (const match of matches) {
      if (match.index === undefined) continue;
      const start = match.index;
      const end = start + entity.length;
      const isOverlap = positions.some(pos => (start >= pos.start && start < pos.end) || (end > pos.start && end <= pos.end));
      if (!isOverlap) {
        entities.push({
          text: entity,
          start: start,
          end: end,
          category: getEntityCategory(entity)
        });
        positions.push({ start, end });
        markedText = markedText.substring(0, start) + `_ENTITY_${entities.length}_` + markedText.substring(end);
      }
    }
  }

  return {
    entities: entities.map(e => e.text),
    entitiesWithPosition: entities,
    markedText: markedText
  };
}

// =================================================================
// LAYER 3: INTENT DETECTION
// =================================================================

const INTENT_PATTERNS: { [key: string]: { patterns: string[], weight: number, group: string } } = {
    DEFINITION: { patterns: ["kya hai", "kya hota hai", "iska matlab kya", "iska meaning kya", "matlab", "ka matlab", "simple meaning", "basic meaning", "term ka matlab", "terminology", "concept kya hai", "what is", "what does it mean", "meaning of", "define", "definition", "basic definition", "simple definition", "technical meaning", "terminology of", "concept of"], weight: 50, group: "PRIMARY" },
    WORKING: { patterns: ["kaise kaam karta", "kaise kaam karti", "kaam kaise hota", "operate kaise hota", "operation kaise hota", "working kya hai", "principle kya hai", "mechanism kya hai", "logic kya hai", "how it works", "working principle", "principle of operation", "operating principle", "how does it work", "function", "mechanism", "operation", "system working", "working mechanism"], weight: 48, group: "PRIMARY" },
    REPAIR: { patterns: ["repair", "repair kaise kare", "thik kar", "thik kare", "theek kar", "theek kare", "kaise thik", "sudhar", "sudharna", "maintenance", "maintain kaise kare", "rectify", "rectification", "rework", "overhaul", "repairing ka tarika", "how to repair", "fix", "how to fix", "corrective maintenance", "repair method", "repair procedure", "troubleshooting", "fixing method"], weight: 45, group: "PRIMARY" },
    PROCEDURE: { patterns: ["kaise kare", "kaise karte", "kaise kiya jata", "karne ka tarika", "tarika", "tareeka", "process", "method", "steps", "step by step", "workflow", "sequence", "standard procedure", "sop", "how to", "procedure", "sequence of steps", "standard operating procedure", "procedure to follow", "process flow"], weight: 40, group: "PRIMARY" },
    PROBLEM: { patterns: ["kharab", "kharabi", "problem", "issue", "fault", "fail", "failure", "damage", "defect", "galti", "leak", "leakage", "break", "not working", "work nahi kar raha", "issue aa raha", "problem aa rahi", "failed", "malfunction", "breakdown", "abnormal condition"], weight: 35, group: "SECONDARY" },
    IDENTIFICATION: { patterns: ["identify", "pehchan", "kaise pata", "kaise check", "check kare", "inspect", "inspection", "verify", "detect", "kaise detect", "kaise dekhe", "kaise find kare", "identification", "how to identify", "how to inspect", "how to check"], weight: 30, group: "SECONDARY" },
    DECISION: { patterns: ["acceptable hai", "reject", "rejection", "accept", "acceptance", "pass", "fail criteria", "limit", "allowable", "tolerance", "criteria", "standard ke according", "code ke hisab se", "chal jayega ya nahi", "use kar sakte ya nahi", "acceptable", "pass or fail", "acceptance criteria", "rejection criteria", "allowable limit", "tolerance limit", "as per code", "as per standard", "code requirement"], weight: 32, group: "DECISIONAL" },
    COMPARISON: { patterns: ["difference", "farak", "compare", "comparison", "vs", "versus", "better", "best", "konsa better", "konsa best", "advantage", "disadvantage", "pros and cons", "difference between", "which is better", "best option", "advantages", "disadvantages", "comparison between"], weight: 28, group: "PRIMARY" },
    APPLICATION: { patterns: ["use", "usage", "application", "kaha use hota", "kaha lagta", "kis liye", "kyu use", "purpose", "role kya", "used for", "used in", "function of", "where used", "practical use"], weight: 26, group: "SECONDARY" },
    SAFETY: { patterns: ["safety", "precaution", "risk", "hazard", "danger", "safety measure", "precaution lena", "safe hai ya nahi", "safety measures", "safety precaution", "risk involved", "unsafe condition"], weight: 25, group: "SECONDARY" },
    COST_TIME: { patterns: ["cost", "kharcha", "kitna paisa", "time lagega", "kitna time", "duration", "downtime", "practical hai", "possible hai", "expense", "time required", "feasible", "practical", "viable", "economical"], weight: 22, group: "SECONDARY" },
    REPORTING: { patterns: ["report", "reporting", "format", "kaise likhe", "kaise banaye", "documentation", "record", "observation kaise likhe", "remark kaise likhe", "report format", "how to write report", "inspection report", "repair report", "ndt report", "documentation process"], weight: 24, group: "PRIMARY" },
    TYPES: { patterns: ["types", "prakar", "kitne type", "kya kya types", "classification", "category", "categories", "varieties", "kinds", "types of", "kinds of"], weight: 38, group: "PRIMARY" },
    CAUSES: { patterns: ["reason", "karan", "wajah", "kyu hota", "kyun hota", "kaise hota", "cause", "causes", "why", "why does it happen", "root cause"], weight: 33, group: "SECONDARY" }
};
const INTENT_GROUPS = { PRIMARY: ["DEFINITION", "WORKING", "PROCEDURE", "REPAIR", "COMPARISON", "REPORTING", "TYPES"], SECONDARY: ["PROBLEM", "IDENTIFICATION", "APPLICATION", "SAFETY", "COST_TIME", "CAUSES"], DECISIONAL: ["DECISION"] };

function detectIntent(text: string) {
  const cleanedText = text.toLowerCase();
  const detectedIntents: { type: string, weight: number, group: string, matchedPatterns: string[], matchCount: number }[] = [];
  for (const [intentName, intentData] of Object.entries(INTENT_PATTERNS)) {
    const matches: string[] = [];
    for (const pattern of intentData.patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(cleanedText)) matches.push(pattern);
    }
    if (matches.length > 0) {
      detectedIntents.push({ type: intentName, weight: intentData.weight, group: intentData.group, matchedPatterns: matches, matchCount: matches.length });
    }
  }
  return detectedIntents;
}

function resolveIntentConflicts(detectedIntents: any[]) {
    if (detectedIntents.length === 0) return { primaryIntent: null, allIntents: [], confidence: 0 };
    const scored = detectedIntents.map(intent => {
        let score = intent.weight;
        if (intent.matchCount > 1) score += 10 * (intent.matchCount - 1);
        if (INTENT_GROUPS.PRIMARY.includes(intent.type)) score += 15;
        if (INTENT_GROUPS.DECISIONAL.includes(intent.type)) score += 10;
        return { ...intent, finalScore: score };
    }).sort((a, b) => b.finalScore - a.finalScore);
    
    const primaryCandidates = scored.filter(i => i.type !== "PROBLEM" && i.type !== "CAUSES");
    const primaryIntent = primaryCandidates.length > 0 ? primaryCandidates[0] : scored[0];
    const supportingIntents = scored.filter(i => i.type !== primaryIntent.type).slice(0, 3);
    
    return { primaryIntent, supportingIntents, allIntents: scored, confidence: primaryIntent.finalScore };
}


// =================================================================
// LAYER 4: CONTEXT MODIFIERS (CONDITIONS)
// =================================================================

const CONDITION_PATTERNS = {
  IF_DAMAGED: { patterns: ["agar kharab", "agar damage", "if damaged", "if broken", "agar fail", "if fail", "kharab ho jaye", "damage ho jaye"], modifier: "CONDITIONAL_DAMAGE" },
  IF_LEAK: { patterns: ["agar leak", "if leak", "if leaking", "leak ho jaye", "leakage ho"], modifier: "CONDITIONAL_LEAK" },
  DURING_OPERATION: { patterns: ["operation mein", "during operation", "running mein", "during running", "chalne par", "service mein"], modifier: "DURING_OPERATION" },
  AFTER_INSTALL: { patterns: ["installation ke baad", "after installation", "lagane ke baad", "after fitting", "assembly ke baad"], modifier: "AFTER_INSTALLATION" },
  BEFORE_INSTALL: { patterns: ["installation se pehle", "before installation", "lagane se pehle", "before fitting"], modifier: "BEFORE_INSTALLATION" },
  DURING_SHUTDOWN: { patterns: ["shutdown mein", "during shutdown", "turnaround mein", "ta mein", "outage mein"], modifier: "DURING_SHUTDOWN" },
  WHEN_NEW: { patterns: ["naya", "new", "fresh", "first time", "pehli baar"], modifier: "WHEN_NEW" },
  WHEN_OLD: { patterns: ["purana", "old", "aged", "long service", "bahut time se"], modifier: "WHEN_OLD" }
};

function detectConditions(text: string) {
  const cleanedText = text.toLowerCase();
  const detectedConditions: { condition: string, modifier: string, matchedPattern: string }[] = [];
  for (const [condName, condData] of Object.entries(CONDITION_PATTERNS)) {
    for (const pattern of condData.patterns) {
      const regex = new RegExp(`\\b${pattern}\\b`, 'i');
      if (regex.test(cleanedText)) {
        detectedConditions.push({ condition: condName, modifier: condData.modifier, matchedPattern: pattern });
        break;
      }
    }
  }
  return detectedConditions;
}


// =================================================================
// LAYER 5: FINAL SCORING + MATCHING ALGORITHM
// =================================================================

function levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            matrix[i][j] = s1[i - 1] === s2[j - 1]
                ? matrix[i - 1][j - 1]
                : Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
        }
    }
    return matrix[len1][len2];
}

function calculateSemanticScore(userQuery: string, dbQuestion: Question) {
  let totalScore = 0;
  const breakdown: any[] = [];
  
  const cleanedUserQuery = userQuery;
  const cleanedDbQuestion = dbQuestion.normalized_en + ' ' + dbQuestion.normalized_hi;

  const { entities: userEntities, markedText } = extractEntities(cleanedUserQuery);
  const { entities: dbEntities } = extractEntities(cleanedDbQuestion);

  // Entity Matching (40 points)
  const commonEntities = userEntities.filter(ue =>
    dbEntities.some(de => 
      de.includes(ue) || 
      ue.includes(de) ||
      levenshteinDistance(ue, de) <= 2
    )
  );
  if (userEntities.length > 0) {
    const entityScore = (commonEntities.length / userEntities.length) * 40;
    totalScore += entityScore;
    breakdown.push({ layer: "ENTITY_MATCH", score: entityScore, matched: commonEntities });
  }

  // Precision Penalty
  const extraDbEntities = dbEntities.filter(de => !userEntities.some(ue => de.includes(ue) || ue.includes(de)));
  if (extraDbEntities.length > 0 && userEntities.length > 0) {
    const penalty = Math.min(extraDbEntities.length * 5, 20); // Adjusted penalty
    totalScore -= penalty;
    breakdown.push({ layer: "PRECISION_PENALTY", score: -penalty, detail: `Found extra entities: ${extraDbEntities.join(', ')}` });
  }


  // Intent Matching (30 points)
  const userIntentResolved = resolveIntentConflicts(detectIntent(cleanedUserQuery));
  const dbIntentResolved = resolveIntentConflicts(detectIntent(cleanedDbQuestion));
  if (userIntentResolved.primaryIntent && dbIntentResolved.primaryIntent) {
    if (userIntentResolved.primaryIntent.type === dbIntentResolved.primaryIntent.type) {
      totalScore += 30;
      breakdown.push({ layer: "INTENT_MATCH_PRIMARY", score: 30, matched: userIntentResolved.primaryIntent.type });
    }
  }

  // Keyword Overlap (20 points)
  const userTokens = markedText.replace(/_ENTITY_\d+_/g, '').split(' ').filter(w => w.length > 2);
  const dbKeywords = [...dbQuestion.keywords_en, ...dbQuestion.keywords_hi].map(k => k.toLowerCase());
  const matchedKeywords = userTokens.filter(token => dbKeywords.some(kw => kw.includes(token) || token.includes(kw)));
  if (userTokens.length > 0) {
    const keywordScore = Math.min((matchedKeywords.length / userTokens.length) * 20, 20);
    totalScore += keywordScore;
    breakdown.push({ layer: "KEYWORD_OVERLAP", score: keywordScore, matched: matchedKeywords });
  }
  
  // Context Modifier Bonus (10 points)
  const userConditions = detectConditions(cleanedUserQuery);
  const dbConditions = detectConditions(cleanedDbQuestion);
  const commonConditions = userConditions.filter(uc => dbConditions.some(dc => dc.condition === uc.condition));
  if (commonConditions.length > 0) {
    const contextScore = Math.min(commonConditions.length * 5, 10);
    totalScore += contextScore;
    breakdown.push({ layer: "CONTEXT_MODIFIER", score: contextScore, matched: commonConditions.map(c => c.condition) });
  }

  totalScore = Math.max(0, Math.min(totalScore, 100)); // Ensure score is between 0 and 100

  return {
    score: totalScore,
    breakdown,
    userIntents: userIntentResolved,
  };
}

// MAIN SEARCH FUNCTION
export function findBestMatch(userQuery: string, candidateQuestions: Question[]) {
  const results: any[] = [];
  for (const question of candidateQuestions) {
    const scoreResult = calculateSemanticScore(userQuery, question);
    if (scoreResult.score >= 60) { // Threshold for a decent match
      results.push({
        type: 'question',
        document: question,
        score: scoreResult.score,
        intent: scoreResult.userIntents.primaryIntent ? [scoreResult.userIntents.primaryIntent.type] : [],
      });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}
