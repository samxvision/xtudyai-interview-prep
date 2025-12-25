import type { Question } from '@/types';

// =================================================================
// LAYER 1: AGGRESSIVE EXPRESSION REMOVAL
// =================================================================

const IGNORE_PATTERNS = {
  expressions: [
    "tum batao", "aap bataiye", "kripya bataiye",
    "mujhe batao", "hamko batao", "please tell",
    "can you tell", "could you explain",
    "i want to know", "mujhe janna hai",
    "help me", "guide me"
  ],
  fillers: [
    "ki", "ye", "wo", "yaar", "bhai",
    "accha", "ok", "thik hai", "dekho", "suno",
    "actually", "basically", "you know"
  ],
  questionWords: [
    "kya", "kyun", "kaise", "kab", "kahan",
    "what", "why", "how", "when", "where", "which"
  ]
};

function aggressiveClean(text: string): string {
  let cleaned = text.toLowerCase().trim();
  
  // Remove expressions
  for (const expr of IGNORE_PATTERNS.expressions) {
    cleaned = cleaned.replace(new RegExp(`\\b${expr}\\b`, 'gi'), ' ');
  }
  
  // Remove fillers
  for (const filler of IGNORE_PATTERNS.fillers) {
    cleaned = cleaned.replace(new RegExp(`\\b${filler}\\b`, 'gi'), ' ');
  }
  
  // Clean up spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// =================================================================
// LAYER 2: INTENT WORD EXTRACTION
// =================================================================

const INTENT_WORD_MAP: Record<string, string[]> = {
  "kya hai": ["definition", "kya hai", "meaning"],
  "kya hota hai": ["definition", "kya hota hai", "meaning"],
  "what is": ["definition", "what is", "meaning"],
  "define": ["definition", "define"],
  "meaning": ["definition", "meaning"],
  "matlab": ["definition", "matlab", "meaning"],
  "kaise kaam karta": ["working", "kaise kaam karta", "principle"],
  "kaise kaam karti": ["working", "kaise kaam karti", "principle"],
  "how it works": ["working", "how works", "principle"],
  "working principle": ["working", "principle"],
  "kaise kare": ["procedure", "kaise kare", "method", "steps"],
  "kaise karte": ["procedure", "kaise karte", "method"],
  "how to": ["procedure", "how to", "method"],
  "procedure": ["procedure", "method", "steps"],
  "steps": ["procedure", "steps", "method"],
  "repair": ["repair", "fix", "thik karna"],
  "thik kare": ["repair", "thik kare", "fix"],
  "theek kare": ["repair", "theek kare", "fix"],
  "fix": ["repair", "fix"],
  "inspect": ["inspection", "check", "examine"],
  "check": ["inspection", "check", "verify"],
  "dekhte": ["inspection", "dekhte", "check"],
  "dekhna": ["inspection", "dekhna", "check"],
  "identify": ["identify", "detect", "pehchan"],
  "pehchan": ["identify", "pehchan", "detect"],
  "kaise pata": ["identify", "kaise pata", "detect"],
  "problem": ["problem", "issue", "fault"],
  "kharab": ["problem", "kharab", "damage"],
  "damage": ["problem", "damage", "defect"],
  "leak": ["problem", "leak", "leakage"],
  "difference": ["comparison", "difference", "vs"],
  "farak": ["comparison", "farak", "difference"],
  "compare": ["comparison", "compare", "vs"],
  "vs": ["comparison", "vs", "versus"],
  "types": ["types", "classification", "kinds"],
  "kitne type": ["types", "kitne type", "kinds"],
  "prakar": ["types", "prakar", "kinds"]
};

function extractIntentWords(text: string): { intentKeywords: string[], remainingText: string } {
  const intentKeywords: string[] = [];
  
  const sortedPatterns = Object.keys(INTENT_WORD_MAP)
    .sort((a, b) => b.length - a.length);
  
  for (const pattern of sortedPatterns) {
    if (text.includes(pattern)) {
      intentKeywords.push(...INTENT_WORD_MAP[pattern]);
      text = text.replace(pattern, ' ');
      break; 
    }
  }
  
  return {
    intentKeywords,
    remainingText: text.replace(/\s+/g, ' ').trim()
  };
}


// =================================================================
// LAYER 3: ENTITY EXTRACTION (UNCHANGED)
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

export function extractEntities(text: string): { entities: string[], remainingText: string } {
    let remainingText = text;
    const entitiesFound: string[] = [];

    const allEntities = [
        ...ENTITY_STATIC_EQUIPMENT, ...ENTITY_ROTATING_EQUIPMENT, ...ENTITY_PIPING, ...ENTITY_FLANGE_COMPONENTS,
        ...ENTITY_BOLTING, ...ENTITY_VESSEL_COMPONENTS, ...ENTITY_HX_INTERNALS, ...ENTITY_COLUMN_INTERNALS,
        ...ENTITY_TANK_COMPONENTS, ...ENTITY_FURNACE_COMPONENTS, ...ENTITY_NDT_TESTS, ...ENTITY_WELDING,
        ...ENTITY_MAINTENANCE, ...ENTITY_INSPECTION, ...ENTITY_DEFECTS, ...ENTITY_DOCUMENTS, ...ENTITY_STANDARDS,
        ...ENTITY_MATERIALS, ...ENTITY_VALVES, ...ENTITY_INSTRUMENTATION
    ].sort((a, b) => b.length - a.length);

    for (const entity of allEntities) {
        const regex = new RegExp(`\\b${entity}\\b`, 'gi');
        if (regex.test(remainingText)) {
            entitiesFound.push(entity);
            remainingText = remainingText.replace(regex, ' ');
        }
    }

    return {
        entities: [...new Set(entitiesFound)], // Return unique entities
        remainingText: remainingText.replace(/\s+/g, ' ').trim()
    };
}


// =================================================================
// LAYER 4: GENERATE SEARCH KEYWORDS
// =================================================================

function generateSearchKeywords(originalQuery: string): string[] {
  // Step 1: Clean
  const cleaned = aggressiveClean(originalQuery);
  
  // Step 2: Extract intent words
  const { intentKeywords, remainingText: afterIntent } = extractIntentWords(cleaned);
  
  // Step 3: Extract entities
  const { entities, remainingText: afterEntity } = extractEntities(afterIntent);
  
  // Step 4: Extract remaining meaningful words
  const remainingWords = afterEntity
    .split(' ')
    .filter(word => word.length > 2)
    .filter(word => !['the', 'and', 'or', 'in', 'on', 'at', 'to', 'for'].includes(word));
  
  // Step 5: Combine all
  const searchKeywords = [
    ...entities,
    ...intentKeywords,
    ...remainingWords
  ];
  
  // Remove duplicates and return
  return [...new Set(searchKeywords)];
}


// =================================================================
// LAYER 5: MATCH WITH DATABASE KEYWORDS
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

function calculateMatchScore(searchKeywords: string[], dbKeywords: string[]): number {
  if (searchKeywords.length === 0) return 0;
  let matchedCount = 0;
  
  for (const searchKey of searchKeywords) {
    let bestMatchFound = false;
    for (const dbKey of dbKeywords) {
      if (searchKey === dbKey) {
        bestMatchFound = true;
        break;
      }
      if (dbKey.includes(searchKey) || searchKey.includes(dbKey)) {
        bestMatchFound = true;
        break;
      }
      if (levenshteinDistance(searchKey, dbKey) <= 2 && searchKey.length > 3) {
        bestMatchFound = true;
        break;
      }
    }
    if (bestMatchFound) {
      matchedCount++;
    }
  }
  
  return (matchedCount / searchKeywords.length) * 100;
}


export function findExactMatch(userQuery: string, candidateQuestions: Question[]) {
  // Layers 1-4: Generate search keywords from user query
  const searchKeywords = generateSearchKeywords(userQuery);
  
  if (searchKeywords.length === 0) return [];

  const matches = [];

  for (const question of candidateQuestions) {
    const dbKeywords = [
      ...question.keywords_en,
      ...question.keywords_hi
    ].map(k => k.toLowerCase());

    const score = calculateMatchScore(searchKeywords, dbKeywords);

    if (score >= 90) { // Apply 90% threshold
      matches.push({
        type: 'question' as const,
        document: question,
        score: score,
        intent: [], 
      });
    }
  }

  // Sort by score to get the best match first
  matches.sort((a, b) => b.score - a.score);

  return matches;
}


// This function is no longer needed with the new system.
// Keeping it here commented out for reference, but it can be removed.
/*
export const removeExpressionNoise = (text: string): string => {
  return text; // Placeholder
}
*/

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim();
}
