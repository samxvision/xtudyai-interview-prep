
// This map stores common voice recognition mistakes and their correct versions.
// Key: The incorrect phrase (lowercase)
// Value: The correct phrase
// This allows for easy updates and maintenance of voice correction logic.

export const correctionMap = new Map([
  // Heat Exchanger
  ["heat stranger", "heat exchanger"],
  ["he stranger", "heat exchanger"],
  ["hate changer", "heat exchanger"],
  ["heat excanger", "heat exchanger"],
  ["hit exchanger", "heat exchanger"],
  ["heat exg", "heat exchanger"],

  // ASME
  ["s mi", "asme"],
  ["esimi", "asme"],
  ["a s m e", "asme"],

  // Serration Area
  ["sarration area", "serration area"],
  ["seration area", "serration area"],

  // DPT / PT
  ["die penetrant test", "dye penetrant test"],
  ["penitrant testing", "penetrant testing"],
  ["dpt testing", "dye penetrant testing"],

  // MT / MPT
  ["magnetic partical testing", "magnetic particle testing"],
  ["magnatic particle", "magnetic particle testing"],
  
  // UT
  ["ultra sonic testing", "ultrasonic testing"],
  ["ultra sound test", "ultrasonic testing"],

  // RT
  ["radio graphic testing", "radiographic testing"],
  ["xray testing", "radiographic testing"],

  // General
  ["presure vessel", "pressure vessel"],
  ["distilation column", "distillation column"],
  ["hydro statik testing", "hydrostatic testing"],
  ["pnumatic test", "pneumatic test"],
  ["thikness measurement", "thickness measurement"],
  ["weld inspaction", "weld inspection"],
  ["procedur", "procedure"],
  ["standerd", "standard"],
  ["aceptance", "acceptance"],
  ["criteriya", "criteria"],
]);

export const ENTITY_SEMANTIC_MAP = {
  
  /* ========================================
     HEAT EXCHANGERS
     ======================================== */
  
  "heat_exchanger": {
    coreTerms: ["heat exchanger", "heat exchange"],
    partialTerms: ["exchanger"], // ✅ NOT "heat" alone
    relatedTerms: ["cooler", "heater", "hx unit", "thermal exchanger"],
    abbreviations: ["hx", "he"],
    commonTypos: [
      "heat excanger", "heat exchnger", "heat ex changer",
      "heat changer", "he at exchanger", "hate exchanger",
      "hate ex changer", "hit exchanger", "heat exg",
      "heat extanger", "heat exchangr", "heat exchange unit",
      "exchager", "exchnager"
    ]
  },

  "shell_and_tube_heat_exchanger": {
    coreTerms: ["shell and tube heat exchanger", "shell and tube"],
    partialTerms: ["shell tube exchanger"],
    relatedTerms: ["tube bundle", "tube sheet", "sthe"],
    abbreviations: ["sthe"],
    commonTypos: [
      "shell tube exchanger", "shell n tube", "shell & tube",
      "shall and tube", "shell end tube", "shell tube hx",
      "cell and tube exchanger", "shell and tub"
    ]
  },

  "plate_heat_exchanger": {
    coreTerms: ["plate heat exchanger", "plate exchanger"],
    partialTerms: ["plate type"],
    relatedTerms: ["gasket plate", "gasketed plate", "compact exchanger"],
    abbreviations: ["phe"],
    commonTypos: [
      "plate heat excanger", "plate hx", "pleat heat exchanger",
      "flate heat exchanger", "plate heat exchange", "plat exchanger"
    ]
  },

  "air_cooled_heat_exchanger": {
    coreTerms: ["air cooled heat exchanger", "air cooler"],
    partialTerms: ["air cooled", "fin fan"],
    relatedTerms: ["fin fan cooler", "afc"],
    abbreviations: ["ache", "afc"],
    commonTypos: [
      "air cool heat exchanger", "air cooled hx", "air cooler exchanger",
      "finfan exchanger", "fan fin exchanger", "air colled exchanger",
      "fin fan", "air fin cooler"
    ]
  },

  "double_pipe_heat_exchanger": {
    coreTerms: ["double pipe heat exchanger", "double pipe"],
    partialTerms: ["double pipe"],
    relatedTerms: ["pipe in pipe", "hairpin exchanger"],
    abbreviations: [],
    commonTypos: [
      "double pipe exchanger", "double pipe hx", "pipe pipe exchanger",
      "double line exchanger", "double piping exchanger"
    ]
  },

  /* ========================================
     PRESSURE VESSELS & SEPARATORS
     ======================================== */

  "pressure_vessel": {
    coreTerms: ["pressure vessel"],
    partialTerms: ["vessel"], // ✅ "vessel" alone can expand
    relatedTerms: ["drum", "separator", "reactor"],
    abbreviations: ["pv"],
    commonTypos: [
      "presure vessel", "pressure vesal", "preasure vessel",
      "pressure vassel", "pressur vessel", "pv vessel",
      "pressre vessel"
    ]
  },

  "horizontal_pressure_vessel": {
    coreTerms: ["horizontal pressure vessel", "horizontal vessel"],
    partialTerms: ["horizontal"],
    relatedTerms: ["saddle support", "saddle mounted"],
    abbreviations: [],
    commonTypos: [
      "horizontal pv", "horizental vessel", "horizontal pressure vesal",
      "horizental pv"
    ]
  },

  "vertical_pressure_vessel": {
    coreTerms: ["vertical pressure vessel", "vertical vessel"],
    partialTerms: ["vertical"],
    relatedTerms: ["skirt support", "skirt mounted"],
    abbreviations: [],
    commonTypos: [
      "vertical pv", "vartical vessel", "vertical pressure vesal",
      "vartical pv"
    ]
  },

  "separator": {
    coreTerms: ["separator"],
    partialTerms: ["separate"],
    relatedTerms: ["knock out drum", "ko drum", "separation vessel"],
    abbreviations: [],
    commonTypos: [
      "seperator", "seprator", "saprator", "separator vessel",
      "separate drum", "separater"
    ]
  },

  "knock_out_drum": {
    coreTerms: ["knock out drum", "knockout drum"],
    partialTerms: ["ko drum"],
    relatedTerms: ["separator", "kod"],
    abbreviations: ["kod"],
    commonTypos: [
      "knok out drum", "noak out drum", "ko dram",
      "knockout dram", "knock-out drum"
    ]
  },

  "flash_drum": {
    coreTerms: ["flash drum", "flash separator"],
    partialTerms: ["flash"],
    relatedTerms: ["flash vessel", "separator"],
    abbreviations: [],
    commonTypos: [
      "flask drum", "flash dram", "flesh drum",
      "flash drum vessel", "flash seperator"
    ]
  },

  "reactor": {
    coreTerms: ["reactor", "reactor vessel"],
    partialTerms: ["react"],
    relatedTerms: ["process vessel", "reaction vessel"],
    abbreviations: [],
    commonTypos: [
      "reacter", "reactar", "reactor vessel",
      "reaction drum", "reactr"
    ]
  },

  /* ========================================
     COLUMNS & TOWERS
     ======================================== */

  "column": {
    coreTerms: ["column", "tower"],
    partialTerms: ["column", "tower"],
    relatedTerms: ["tray column", "packed column", "distillation"],
    abbreviations: [],
    commonTypos: [
      "colum", "colmn", "collum", "tower column",
      "colom", "coloum"
    ]
  },

  "distillation_column": {
    coreTerms: ["distillation column", "distillation tower"],
    partialTerms: ["distillation", "fractionation"],
    relatedTerms: ["tray column", "fractionator", "frac column"],
    abbreviations: ["dc"],
    commonTypos: [
      "distilation column", "destillation column",
      "distilition column", "distill column", "distilation tower"
    ]
  },

  "absorption_column": {
    coreTerms: ["absorption column", "absorber"],
    partialTerms: ["absorption", "absorber"],
    relatedTerms: ["gas absorber", "absorption tower"],
    abbreviations: [],
    commonTypos: [
      "absorbtion column", "absortion column", "absorb column",
      "absober", "absorption tower"
    ]
  },

  "stripper_column": {
    coreTerms: ["stripper column", "stripper"],
    partialTerms: ["stripper", "stripping"],
    relatedTerms: ["regeneration column", "stripper tower"],
    abbreviations: [],
    commonTypos: [
      "striper column", "striping column", "stripper tower",
      "strip column"
    ]
  },

  "packed_column": {
    coreTerms: ["packed column", "packed tower"],
    partialTerms: ["packing", "packed"],
    relatedTerms: ["structured packing", "random packing"],
    abbreviations: [],
    commonTypos: [
      "packet column", "pack column", "packed colum",
      "packing column", "packing tower"
    ]
  },

  "tray_column": {
    coreTerms: ["tray column", "tray tower"],
    partialTerms: ["tray"],
    relatedTerms: ["bubble cap", "sieve tray", "valve tray"],
    abbreviations: [],
    commonTypos: [
      "trey column", "tray colum", "tray colmn",
      "tree column", "tray tower"
    ]
  },

  /* ========================================
     STORAGE TANKS
     ======================================== */

  "storage_tank": {
    coreTerms: ["storage tank", "tank"],
    partialTerms: ["tank", "storage"],
    relatedTerms: ["oil tank", "product tank"],
    abbreviations: [],
    commonTypos: [
      "store tank", "storage tonk", "storag tank",
      "tank vessel", "storage tanker"
    ]
  },

  "fixed_roof_tank": {
    coreTerms: ["fixed roof tank", "cone roof tank"],
    partialTerms: ["fixed roof"],
    relatedTerms: ["storage tank", "atmospheric tank"],
    abbreviations: [],
    commonTypos: [
      "fix roof tank", "fixed rout tank", "fixed tank roof",
      "fixed roof storage"
    ]
  },

  "floating_roof_tank": {
    coreTerms: ["floating roof tank"],
    partialTerms: ["floating roof"],
    relatedTerms: ["storage tank", "frt", "external floating roof"],
    abbreviations: ["frt", "efrt"],
    commonTypos: [
      "floating rout tank", "float roof tank", "floating tank roof",
      "floatng roof tank"
    ]
  },

  "internal_floating_roof_tank": {
    coreTerms: ["internal floating roof tank"],
    partialTerms: ["internal floating roof", "ifr"],
    relatedTerms: ["ifrt", "storage tank"],
    abbreviations: ["ifrt", "ifr"],
    commonTypos: [
      "internal floating rout", "internal float roof",
      "ifr tank", "internal floating"
    ]
  },

  "spherical_tank": {
    coreTerms: ["spherical tank", "sphere"],
    partialTerms: ["sphere tank"],
    relatedTerms: ["pressure storage", "horton sphere"],
    abbreviations: [],
    commonTypos: [
      "spherecal tank", "spherical tonk", "sphere vessel",
      "sperical tank"
    ]
  },

  "bullet_tank": {
    coreTerms: ["bullet tank", "bullet"],
    partialTerms: ["bullet"],
    relatedTerms: ["lpg tank", "lpg bullet", "pressure storage"],
    abbreviations: [],
    commonTypos: [
      "bulit tank", "bullet tonk", "bullet vessel",
      "lpg bullet"
    ]
  },

  /* ========================================
     FURNACES & BOILERS
     ======================================== */

  "furnace": {
    coreTerms: ["furnace", "process heater"],
    partialTerms: ["heater"],
    relatedTerms: ["fired heater", "process furnace"],
    abbreviations: [],
    commonTypos: [
      "furnes", "furnace heater", "farnas", "furnance",
      "furnas"
    ]
  },

  "process_heater": {
    coreTerms: ["process heater", "fired heater"],
    partialTerms: ["heater"],
    relatedTerms: ["furnace", "process furnace"],
    abbreviations: [],
    commonTypos: [
      "process hiter", "proces heater", "process heatr",
      "fired hiter"
    ]
  },

  "boiler": {
    coreTerms: ["boiler", "steam boiler"],
    partialTerms: ["steam boiler"],
    relatedTerms: ["steam generator", "water tube boiler"],
    abbreviations: [],
    commonTypos: [
      "boilar", "boiller", "steam boler", "boyler"
    ]
  },

  "waste_heat_boiler": {
    coreTerms: ["waste heat boiler"],
    partialTerms: ["whb"],
    relatedTerms: ["heat recovery", "hrsg"],
    abbreviations: ["whb"],
    commonTypos: [
      "waste heat boler", "waste heater boiler",
      "west heat boiler", "waste heat recovery boiler"
    ]
  },

  "heat_recovery_steam_generator": {
    coreTerms: ["heat recovery steam generator"],
    partialTerms: ["hrsg"],
    relatedTerms: ["waste heat boiler", "steam generator"],
    abbreviations: ["hrsg"],
    commonTypos: [
      "heat recovery steam genrator", "hrsg unit",
      "heat recovery boiler", "heat recovery generator"
    ]
  },

  /* ========================================
     ROTATING EQUIPMENT
     ======================================== */

  "centrifugal_pump": {
    coreTerms: ["centrifugal pump"],
    partialTerms: ["centrifugal", "pump"],
    relatedTerms: ["process pump", "water pump"],
    abbreviations: ["cp"],
    commonTypos: [
      "centrifugal pamp", "centrifugal pum", "centrifugel pump",
      "sentifugal pump", "central pump", "centrifugal pumping",
      "pump centrifugal", "centrifugul pump"
    ]
  },

  "reciprocating_pump": {
    coreTerms: ["reciprocating pump"],
    partialTerms: ["reciprocating", "recip"],
    relatedTerms: ["plunger pump", "piston pump", "recip pump"],
    abbreviations: ["rp"],
    commonTypos: [
      "reciprocate pump", "reciprocating pamp", "resiprocating pump",
      "recip pump", "piston pamp", "plunger pamp"
    ]
  },

  "gear_pump": {
    coreTerms: ["gear pump"],
    partialTerms: ["gear"],
    relatedTerms: ["positive displacement pump", "pd pump"],
    abbreviations: [],
    commonTypos: [
      "gear pamp", "geer pump", "gear pumping",
      "gear type pump", "geer pamp"
    ]
  },

  "screw_pump": {
    coreTerms: ["screw pump"],
    partialTerms: ["screw"],
    relatedTerms: ["pd pump", "positive displacement"],
    abbreviations: [],
    commonTypos: [
      "screew pump", "screw pamp", "skrew pump",
      "screw type pump"
    ]
  },

  "centrifugal_compressor": {
    coreTerms: ["centrifugal compressor"],
    partialTerms: ["centrifugal", "compressor"],
    relatedTerms: ["process compressor", "turbo compressor"],
    abbreviations: ["cc"],
    commonTypos: [
      "centrifugal compresor", "centrifugel compressor",
      "sentifugal compressor", "compressor centrifugal",
      "centrifugal comprsr"
    ]
  },

  "reciprocating_compressor": {
    coreTerms: ["reciprocating compressor"],
    partialTerms: ["reciprocating", "compressor"],
    relatedTerms: ["piston compressor", "recip compressor"],
    abbreviations: ["rc"],
    commonTypos: [
      "reciprocate compressor", "recip compressor",
      "resiprocating compressor", "piston compresor"
    ]
  },

  "screw_compressor": {
    coreTerms: ["screw compressor"],
    partialTerms: ["screw"],
    relatedTerms: ["air compressor", "rotary screw"],
    abbreviations: [],
    commonTypos: [
      "screw compresor", "skrew compressor", "screw comprsr",
      "screw air compressor"
    ]
  },

  "steam_turbine": {
    coreTerms: ["steam turbine"],
    partialTerms: ["steam", "turbine"],
    relatedTerms: ["driver turbine", "turbine driver"],
    abbreviations: ["st"],
    commonTypos: [
      "steam terbine", "steam turbin", "steam turbine driver",
      "stem turbine", "steem turbine"
    ]
  },

  "gas_turbine": {
    coreTerms: ["gas turbine"],
    partialTerms: ["gas", "turbine"],
    relatedTerms: ["power turbine", "gt"],
    abbreviations: ["gt"],
    commonTypos: [
      "gas terbine", "gas turbin", "gass turbine",
      "gas turbine engine"
    ]
  },

  "electric_motor": {
    coreTerms: ["electric motor", "motor"],
    partialTerms: ["motor"],
    relatedTerms: ["drive motor", "induction motor"],
    abbreviations: ["em"],
    commonTypos: [
      "electrical motor", "electric moter", "electrik motor",
      "motor electric", "elektric motor"
    ]
  },

  /* ========================================
     NDT TESTING
     ======================================== */

  "visual_testing": {
    coreTerms: ["visual testing", "visual inspection"],
    partialTerms: ["visual", "vt"],
    relatedTerms: ["eye inspection", "surface check", "vi"],
    abbreviations: ["vt", "vi"],
    commonTypos: [
      "vizual testing", "visual testng", "visual inspaction",
      "vt testing", "visual chek", "visual cheking"
    ]
  },

  "ultrasonic_testing": {
    coreTerms: ["ultrasonic testing"],
    partialTerms: ["ultrasonic", "ultra sound"],
    relatedTerms: ["ut testing", "ut test"],
    abbreviations: ["ut"],
    commonTypos: [
      "ultra sonic testing", "ultrasonik testing",
      "ultra sound test", "ut test", "ultra sonic test",
      "ultrasound testing"
    ]
  },

  "ultrasonic_thickness_testing": {
    coreTerms: ["ultrasonic thickness testing", "thickness measurement"],
    partialTerms: ["thickness", "ut thickness"],
    relatedTerms: ["wall thickness", "thickness gauging"],
    abbreviations: ["utt", "utg"],
    commonTypos: [
      "ultrasonic thicknes testing", "thikness test ut",
      "ut thickness test", "ultrasonic thickness"
    ]
  },

  "phased_array_ut": {
    coreTerms: ["phased array ut", "phased array ultrasonic"],
    partialTerms: ["phased array", "paut"],
    relatedTerms: ["advanced ut", "pa ut"],
    abbreviations: ["paut"],
    commonTypos: [
      "phase array ut", "phased arrey ut", "pased array ut",
      "phased ut", "paut testing"
    ]
  },

  "time_of_flight_diffraction": {
    coreTerms: ["time of flight diffraction"],
    partialTerms: ["tofd"],
    relatedTerms: ["advanced ut", "tofd testing"],
    abbreviations: ["tofd"],
    commonTypos: [
      "time of flight defraction", "tofd test", "tofd ut",
      "time flight ut", "time of fligt"
    ]
  },

  "magnetic_particle_testing": {
    coreTerms: ["magnetic particle testing", "magnetic particle inspection"],
    partialTerms: ["magnetic", "mt"],
    relatedTerms: ["mpi", "mt test"],
    abbreviations: ["mt", "mpi"],
    commonTypos: [
      "magnetic partical testing", "magnetic test mt",
      "mpi testing", "magnetic particle test", "magnatic particle"
    ]
  },

  "dye_penetrant_testing": {
    coreTerms: ["dye penetrant test", "liquid penetrant test"],
    partialTerms: ["penetrant", "pt", "dpt"],
    relatedTerms: ["liquid penetrant testing", "pt test"],
    abbreviations: ["pt", "lpt", "dpt"],
    commonTypos: [
      "die penetrant test", "penitrant testing", "penetrent test",
      "pt testing", "dpt testing", "liquid penetrant"
    ]
  },

  "radiographic_testing": {
    coreTerms: ["radiographic testing", "radiography"],
    partialTerms: ["radiography", "rt", "xray"],
    relatedTerms: ["x ray test", "rt test"],
    abbreviations: ["rt"],
    commonTypos: [
      "radio graphic testing", "radiography test",
      "xray testing", "x-ray test", "rt testing"
    ]
  },

  "eddy_current_testing": {
    coreTerms: ["eddy current testing"],
    partialTerms: ["eddy current", "ect"],
    relatedTerms: ["ect test"],
    abbreviations: ["ect"],
    commonTypos: [
      "eddy curent testing", "eddy current test",
      "eddy currant test", "ect testing"
    ]
  },

  /* ========================================
     PRESSURE TESTING
     ======================================== */

  "hydrostatic_testing": {
    coreTerms: ["hydrostatic testing", "hydrotest"],
    partialTerms: ["hydro test", "hydrostatic"],
    relatedTerms: ["pressure test", "water test"],
    abbreviations: [],
    commonTypos: [
      "hydro statik testing", "hydro pressure test",
      "hydro testing", "hydrostatic test", "hydrotesting"
    ]
  },

  "pneumatic_test": {
    coreTerms: ["pneumatic test", "pneumatic testing"],
    partialTerms: ["pneumatic"],
    relatedTerms: ["air test", "air pressure test"],
    abbreviations: [],
    commonTypos: [
      "pnumatic test", "newmatic test", "pneumetic test",
      "air pressure test", "pneumatic testing"
    ]
  },

  "leak_test": {
    coreTerms: ["leak test", "leak testing"],
    partialTerms: ["leak"],
    relatedTerms: ["soap test", "bubble test"],
    abbreviations: [],
    commonTypos: [
      "leak tast", "leek test", "leakage test",
      "lick test", "leak testing"
    ]
  },

  "vacuum_box_testing": {
    coreTerms: ["vacuum box testing", "vacuum box test"],
    partialTerms: ["vacuum test", "vacuum box"],
    relatedTerms: ["leak test", "weld testing"],
    abbreviations: [],
    commonTypos: [
      "vacum box testing", "vacuum leak test",
      "vacuum box test", "vacuum testing"
    ]
  },

  /* ========================================
     DEFECTS & DAMAGE
     ======================================== */

  "corrosion": {
    coreTerms: ["corrosion"],
    partialTerms: ["rust", "corrode"],
    relatedTerms: ["metal loss", "rusting"],
    abbreviations: [],
    commonTypos: [
      "corosion", "corrossion", "corrusion",
      "corrosion damage", "rusting corrosion"
    ]
  },

  "pitting_corrosion": {
    coreTerms: ["pitting corrosion", "pitting"],
    partialTerms: ["pitting", "pit"],
    relatedTerms: ["localized corrosion", "pit corrosion"],
    abbreviations: [],
    commonTypos: [
      "piting corrosion", "petting corrosion",
      "pit corrosion", "pitting rust"
    ]
  },

  "erosion_corrosion": {
    coreTerms: ["erosion corrosion"],
    partialTerms: ["erosion", "corrosion"],
    relatedTerms: ["high velocity damage", "flow damage"],
    abbreviations: [],
    commonTypos: [
      "erosion corosion", "erosion corrosion damage",
      "flow corrosion", "erosive corrosion"
    ]
  },

  "crack": {
    coreTerms: ["crack", "cracking"],
    partialTerms: ["crack"],
    relatedTerms: ["fracture", "crack indication"],
    abbreviations: [],
    commonTypos: [
      "crak", "crackng", "metal crack",
      "surface crack", "craking"
    ]
  },

  "stress_corrosion_cracking": {
    coreTerms: ["stress corrosion cracking"],
    partialTerms: ["scc"],
    relatedTerms: ["chloride cracking", "scc damage"],
    abbreviations: ["scc"],
    commonTypos: [
      "stress corosion cracking", "stress cracking",
      "s c c", "scc cracking"
    ]
  },

  "leakage": {
    coreTerms: ["leakage", "leak"],
    partialTerms: ["leak"],
    relatedTerms: ["through wall", "leak point"],
    abbreviations: [],
    commonTypos: [
      "leakeg", "leekage", "leaking",
      "leak problem", "leakeage"
    ]
  },

  /* ========================================
     HEAT EXCHANGER INTERNALS
     ======================================== */

  
    "tube_bundle": {
    coreTerms: ["tube bundle"],
    partialTerms: ["bundle"],
    relatedTerms: ["tube assembly", "heat exchanger bundle"],
    abbreviations: [],
    commonTypos: [
      "tube bundel", "tube bungle", "tub bundle",
      "bundle tube", "tube bundal"
    ]
  },

  "tube_sheet": {
    coreTerms: ["tube sheet", "tubesheet"],
    partialTerms: ["tubesheet"],
    relatedTerms: ["tube to sheet", "tube plate"],
    abbreviations: [],
    commonTypos: [
      "tube sheat", "tube shhet", "tube sheet plate",
      "tube sit", "tube sheat"
    ]
  },

  "baffle": {
    coreTerms: ["baffle", "baffle plate"],
    partialTerms: ["baffle"],
    relatedTerms: ["support baffle", "segmental baffle"],
    abbreviations: [],
    commonTypos: [
      "baffel", "baffel plates", "baffle plate",
      "baffal", "baffale"
    ]
  },

  "channel_head": {
    coreTerms: ["channel head"],
    partialTerms: ["channel"],
    relatedTerms: ["front head", "channel cover"],
    abbreviations: [],
    commonTypos: [
      "channel hed", "channel haid", "channel cover head",
      "channal head"
    ]
  },

  "floating_head": {
    coreTerms: ["floating head"],
    partialTerms: ["floating"],
    relatedTerms: ["rear head", "back head"],
    abbreviations: [],
    commonTypos: [
      "floating hed", "floating haid", "floating end head",
      "floatin head"
    ]
  },

  /* ========================================
     FLANGE COMPONENTS
     ======================================== */

  "flange": {
    coreTerms: ["flange"],
    partialTerms: ["flanged"],
    relatedTerms: ["pipe flange", "flange joint"],
    abbreviations: [],
    commonTypos: [
      "flang", "flenge", "flange joint",
      "flanj", "flanged"
    ]
  },

  "flange_face": {
    coreTerms: ["flange face"],
    partialTerms: ["face"],
    relatedTerms: ["gasket seating", "flange surface"],
    abbreviations: [],
    commonTypos: [
      "flange fes", "flange surface", "flange face area",
      "flang face"
    ]
  },

  "serration_area": {
    coreTerms: ["serration area", "serration"],
    partialTerms: ["serration"],
    relatedTerms: ["grooved joint", "flange finish"],
    abbreviations: [],
    commonTypos: [
      "sarration", "sarration area", "seration area",
      "serrated zone", "serration groov", "serration"
    ]
  },

  "gasket": {
    coreTerms: ["gasket"],
    partialTerms: ["sealing"],
    relatedTerms: ["flange gasket", "spiral wound"],
    abbreviations: [],
    commonTypos: [
      "gaskit", "gas kit", "gasket seal",
      "gaskat", "gaskket"
    ]
  },

  /* ========================================
     COLUMN INTERNALS
     ======================================== */

  "tray": {
    coreTerms: ["tray", "column tray"],
    partialTerms: ["tray"],
    relatedTerms: ["internal tray", "distillation tray"],
    abbreviations: [],
    commonTypos: [
      "trey", "tray plate", "tray internal",
      "tray colum", "tre"
    ]
  },

  "bubble_cap_tray": {
    coreTerms: ["bubble cap tray"],
    partialTerms: ["bubble cap"],
    relatedTerms: ["tray type", "bubble tray"],
    abbreviations: [],
    commonTypos: [
      "bubble cap trey", "bubblecap tray", "bubble cup tray",
      "bubbel cap"
    ]
  },

  "sieve_tray": {
    coreTerms: ["sieve tray"],
    partialTerms: ["sieve"],
    relatedTerms: ["perforated tray", "hole tray"],
    abbreviations: [],
    commonTypos: [
      "seive tray", "siv tray", "sieve trey",
      "sive tray"
    ]
  },

  "packing": {
    coreTerms: ["packing", "column packing"],
    partialTerms: ["packing"],
    relatedTerms: ["structured packing", "random packing"],
    abbreviations: [],
    commonTypos: [
      "packng", "packing material", "packing column",
      "paking"
    ]
  },

  "downcomer": {
    coreTerms: ["downcomer"],
    partialTerms: ["down comer"],
    relatedTerms: ["liquid downflow", "tray downcomer"],
    abbreviations: [],
    commonTypos: [
      "down comer", "downcomar", "down camber",
      "downcomber"
    ]
  },

  /* ========================================
     INSPECTION & QA/QC
     ======================================== */

  "internal_inspection": {
    coreTerms: ["internal inspection"],
    partialTerms: ["internal"],
    relatedTerms: ["inside inspection", "internal check"],
    abbreviations: [],
    commonTypos: [
      "internel inspection", "internal inspaction",
      "inside check", "internal inspaction"
    ]
  },

  "external_inspection": {
    coreTerms: ["external inspection"],
    partialTerms: ["external"],
    relatedTerms: ["outside inspection", "external check"],
    abbreviations: [],
    commonTypos: [
      "externel inspection", "external inspaction",
      "outside check"
    ]
  },

  "shutdown_inspection": {
    coreTerms: ["shutdown inspection"],
    partialTerms: ["shutdown"],
    relatedTerms: ["plant shutdown", "turnaround"],
    abbreviations: ["ta"],
    commonTypos: [
      "shut down inspection", "shutdown inspaction",
      "sd inspection", "shutdwn inspection"
    ]
  },

  "thickness_measurement": {
    coreTerms: ["thickness measurement"],
    partialTerms: ["thickness"],
    relatedTerms: ["ut thickness", "wall thickness", "thickness check"],
    abbreviations: ["tmm"],
    commonTypos: [
      "thikness measurement", "thickness measurment",
      "thickness checking", "thicknes measurement"
    ]
  },

  "weld_inspection": {
    coreTerms: ["weld inspection"],
    partialTerms: ["weld"],
    relatedTerms: ["welding inspection", "weld check"],
    abbreviations: [],
    commonTypos: [
      "weld inspaction", "welding inspaction",
      "weld checking", "weild inspection"
    ]
  },

  /* ========================================
     OPERATIONS & MAINTENANCE
     ======================================== */

  "bundle_extraction": {
    coreTerms: ["bundle extraction", "bundle pulling"],
    partialTerms: ["bundle pull"],
    relatedTerms: ["bundle removal", "tube bundle removal"],
    abbreviations: [],
    commonTypos: [
      "bundle extraction", "bundle pulling",
      "tube bundle removal", "bundle pull out"
    ]
  },

  "retubing": {
    coreTerms: ["retubing"],
    partialTerms: ["re tubing"],
    relatedTerms: ["tube replacement", "tube change"],
    abbreviations: [],
    commonTypos: [
      "re tubbing", "re tubing work",
      "tube change", "retubing work"
    ]
  },

  "tube_plugging": {
    coreTerms: ["tube plugging"],
    partialTerms: ["plugging"],
    relatedTerms: ["tube isolation", "plug tube"],
    abbreviations: [],
    commonTypos: [
      "tube pluging", "tube plug",
      "plugging tube", "tube blocking"
    ]
  },

  "chemical_cleaning": {
    coreTerms: ["chemical cleaning"],
    partialTerms: ["chemical clean"],
    relatedTerms: ["acid cleaning", "chemical wash"],
    abbreviations: [],
    commonTypos: [
      "chemical cleanning", "chemical wash",
      "acid cleaning", "chemicle cleaning"
    ]
  },

  "mechanical_cleaning": {
    coreTerms: ["mechanical cleaning"],
    partialTerms: ["mechanical clean"],
    relatedTerms: ["manual cleaning", "physical cleaning"],
    abbreviations: [],
    commonTypos: [
      "mechanical cleanning", "manual cleaning",
      "mechanical wash", "mechanic cleaning"
    ]
  },

  /* ========================================
     DOCUMENTS
     ======================================== */

  "inspection_test_plan": {
    coreTerms: ["inspection test plan", "inspection and test plan"],
    partialTerms: ["itp"],
    relatedTerms: ["quality plan", "test plan"],
    abbreviations: ["itp"],
    commonTypos: [
      "inspection test paln", "inspaction test plan",
      "i t p", "inspection testing plan"
    ]
  },

  "welding_procedure_specification": {
    coreTerms: ["welding procedure specification"],
    partialTerms: ["wps"],
    relatedTerms: ["welding procedure", "weld procedure"],
    abbreviations: ["wps"],
    commonTypos: [
      "welding procedure spec", "w p s",
      "weld procedure", "welding procedur"
    ]
  },

  "procedure_qualification_record": {
    coreTerms: ["procedure qualification record"],
    partialTerms: ["pqr"],
    relatedTerms: ["welding qualification", "procedure record"],
    abbreviations: ["pqr"],
    commonTypos: [
      "procedure qualification recod", "p q r",
      "welding pqr", "procedur qualification"
    ]
  },

  "material_test_certificate": {
    coreTerms: ["material test certificate"],
    partialTerms: ["mtc"],
    relatedTerms: ["mill certificate", "material certificate"],
    abbreviations: ["mtc"],
    commonTypos: [
      "material test certifcate", "m t c",
      "mill test certificate", "mtc certificate"
    ]
  },

  "non_conformance_report": {
    coreTerms: ["non conformance report"],
    partialTerms: ["ncr"],
    relatedTerms: ["quality deviation", "ncr report"],
    abbreviations: ["ncr"],
    commonTypos: [
      "non conformity report", "n c r",
      "quality ncr", "non conformance"
    ]
  },

  /* ========================================
     RBI & FFS
     ======================================== */

  "risk_based_inspection": {
    coreTerms: ["risk based inspection"],
    partialTerms: ["rbi"],
    relatedTerms: ["risk assessment", "rbi assessment"],
    abbreviations: ["rbi"],
    commonTypos: [
      "risk base inspection", "risk based inspaction",
      "r b i", "rbi inspection"
    ]
  },

  "fitness_for_service": {
    coreTerms: ["fitness for service"],
    partialTerms: ["ffs"],
    relatedTerms: ["integrity assessment", "ffs assessment"],
    abbreviations: ["ffs"],
    commonTypos: [
      "fitnes for service", "fitness service",
      "f f s", "ffs assessment"
    ]
  },

  "remaining_life_assessment": {
    coreTerms: ["remaining life assessment"],
    partialTerms: ["remaining life"],
    relatedTerms: ["life calculation", "life assessment"],
    abbreviations: [],
    commonTypos: [
      "remaning life", "remaining life calc",
      "balance life", "remaining life assesment"
    ]
  }
}

    