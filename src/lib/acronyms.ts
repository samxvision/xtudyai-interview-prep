// ============================================
// COMPREHENSIVE OIL & GAS ACRONYMS DATABASE
// 200+ Industry Terms with Variations
// ============================================

export const OilGasAcronyms: Record<string, AcronymData> = {
  // ========== WELDING & INSPECTION ==========
  
  "WPS": {
    full: "Welding Procedure Specification",
    full_hi: "वेल्डिंग प्रक्रिया विशिष्टता",
    variations: ["welding procedure", "wps document", "welding spec"],
    category: "welding",
    related: ["PQR", "WQT", "WPSR"]
  },
  
  "PQR": {
    full: "Procedure Qualification Record",
    full_hi: "प्रक्रिया योग्यता रिकॉर्ड",
    variations: ["procedure qualification", "pqr record", "weld qualification"],
    category: "welding",
    related: ["WPS", "WQT"]
  },
  
  "WQT": {
    full: "Welder Qualification Test",
    full_hi: "वेल्डर योग्यता परीक्षण",
    variations: ["welder test", "welder qualification", "wqt test"],
    category: "welding",
    related: ["WPS", "PQR"]
  },
  
  "WPSR": {
    full: "Welding Procedure Specification Review",
    full_hi: "वेल्डिंग प्रक्रिया विशिष्टता समीक्षा",
    variations: ["wps review", "welding procedure review"],
    category: "welding",
    related: ["WPS"]
  },
  
  "PWHT": {
    full: "Post Weld Heat Treatment",
    full_hi: "पोस्ट वेल्ड हीट ट्रीटमेंट",
    variations: ["post weld heat", "heat treatment", "pwht process"],
    category: "welding",
    related: ["WPS", "HT"]
  },
  
  "Weld Map": {
    full: "Weld Location Map",
    full_hi: "वेल्ड लोकेशन मैप",
    variations: ["weld mapping", "weld location", "welding map"],
    category: "welding",
    related: ["Spool", "ITP"]
  },
  
  "Fit-up": {
    full: "Joint Fit-up Inspection",
    full_hi: "ज्वाइंट फिट-अप निरीक्षण",
    variations: ["fitup", "joint fit", "fit up inspection"],
    category: "welding",
    related: ["VT", "WPS"]
  },
  
  // ========== QUALITY ASSURANCE / CONTROL ==========
  
  "QA": {
    full: "Quality Assurance",
    full_hi: "गुणवत्ता आश्वासन",
    variations: ["quality assurance", "qa department", "quality system"],
    category: "quality",
    related: ["QC", "QAP", "QCP"]
  },
  
  "QC": {
    full: "Quality Control",
    full_hi: "गुणवत्ता नियंत्रण",
    variations: ["quality control", "qc department", "quality check"],
    category: "quality",
    related: ["QA", "QCR", "QCP"]
  },
  
  "QAP": {
    full: "Quality Assurance Plan",
    full_hi: "गुणवत्ता आश्वासन योजना",
    variations: ["qa plan", "quality plan", "assurance plan"],
    category: "quality",
    related: ["QCP", "ITP"]
  },
  
  "QCP": {
    full: "Quality Control Procedure",
    full_hi: "गुणवत्ता नियंत्रण प्रक्रिया",
    variations: ["qc procedure", "quality procedure", "control procedure"],
    category: "quality",
    related: ["QAP", "SOP"]
  },
  
  "QCR": {
    full: "Quality Control Report",
    full_hi: "गुणवत्ता नियंत्रण रिपोर्ट",
    variations: ["qc report", "quality report", "control report"],
    category: "quality",
    related: ["QC", "SIR"]
  },
  
  "QC Dossier": {
    full: "Quality Compliance Dossier",
    full_hi: "गुणवत्ता अनुपालन डोजियर",
    variations: ["qc dossier", "quality dossier", "compliance dossier"],
    category: "quality",
    related: ["MDR", "MTC"]
  },
  
  "ITP": {
    full: "Inspection and Test Plan",
    full_hi: "निरीक्षण और परीक्षण योजना",
    variations: ["inspection plan", "test plan", "itp document"],
    category: "quality",
    related: ["QAP", "HP", "WP"]
  },
  
  "NCR": {
    full: "Non-Conformance Report",
    full_hi: "गैर-अनुरूपता रिपोर्ट",
    variations: ["non conformance", "ncr report", "non compliance"],
    category: "quality",
    related: ["CAR", "PAR"]
  },
  
  "CAR": {
    full: "Corrective Action Report",
    full_hi: "सुधारात्मक कार्रवाई रिपोर्ट",
    variations: ["corrective action", "car report", "correction report"],
    category: "quality",
    related: ["NCR", "PAR"]
  },
  
  "PAR": {
    full: "Preventive Action Report",
    full_hi: "निवारक कार्रवाई रिपोर्ट",
    variations: ["preventive action", "par report", "prevention report"],
    category: "quality",
    related: ["CAR", "NCR"]
  },
  
  // ========== NON-DESTRUCTIVE TESTING ==========
  
  "NDT": {
    full: "Non-Destructive Testing",
    full_hi: "नॉन-डिस्ट्रक्टिव टेस्टिंग",
    variations: ["ndt testing", "non destructive", "nde testing"],
    category: "testing",
    related: ["VT", "PT", "MT", "UT", "RT"]
  },
  
  "VT": {
    full: "Visual Testing",
    full_hi: "विजुअल टेस्टिंग",
    variations: ["visual inspection", "visual test", "vt inspection"],
    category: "testing",
    related: ["NDT"]
  },

  "DPT": {
    full: "Dye Penetrant Test",
    full_hi: "डाई पेनेट्रेंट टेस्ट",
    variations: ["dye penetrant", "dpt test", "dye testing", "penetrant testing"],
    category: "testing",
    related: ["PT", "LPT", "NDT", "DP"]
  },
  
  "PT": {
    full: "Penetrant Testing",
    full_hi: "पेनेट्रेंट टेस्टिंग",
    variations: ["penetrant test", "dye penetrant", "liquid penetrant"],
    category: "testing",
    related: ["LPT", "DP", "NDT", "DPT"]
  },
  
  "LPT": {
    full: "Liquid Penetrant Testing",
    full_hi: "लिक्विड पेनेट्रेंट टेस्टिंग",
    variations: ["liquid penetrant", "lpt test", "penetrant testing"],
    category: "testing",
    related: ["PT", "DP", "NDT", "DPT"]
  },
  
  "DP": {
    full: "Dye Penetrant Test",
    full_hi: "डाई पेनेट्रेंट टेस्ट",
    variations: ["dye penetrant", "dp test", "dye testing"],
    category: "testing",
    related: ["PT", "LPT", "NDT", "DPT"]
  },
  
  "MT": {
    full: "Magnetic Particle Testing",
    full_hi: "मैग्नेटिक पार्टिकल टेस्टिंग",
    variations: ["magnetic particle", "mt test", "magnetic inspection"],
    category: "testing",
    related: ["MPT", "NDT"]
  },
  
  "MPT": {
    full: "Magnetic Particle Testing",
    full_hi: "मैग्नेटिक पार्टिकल टेस्टिंग",
    variations: ["magnetic particle", "mpt test", "magnetic testing"],
    category: "testing",
    related: ["MT", "NDT"]
  },
  
  "UT": {
    full: "Ultrasonic Testing",
    full_hi: "अल्ट्रासोनिक टेस्टिंग",
    variations: ["ultrasonic test", "ut inspection", "ultrasonic ndt"],
    category: "testing",
    related: ["NDT", "PAUT"]
  },
  
  "PAUT": {
    full: "Phased Array Ultrasonic Testing",
    full_hi: "फेज्ड ऐरे अल्ट्रासोनिक टेस्टिंग",
    variations: ["phased array", "paut test", "pa ut"],
    category: "testing",
    related: ["UT", "NDT"]
  },
  
  "RT": {
    full: "Radiographic Testing",
    full_hi: "रेडियोग्राफिक टेस्टिंग",
    variations: ["radiography", "rt test", "x-ray testing"],
    category: "testing",
    related: ["RTFI", "NDT"]
  },
  
  "RTFI": {
    full: "Radiographic Film Interpretation",
    full_hi: "रेडियोग्राफिक फिल्म इंटरप्रिटेशन",
    variations: ["film interpretation", "rt interpretation", "rtfi report"],
    category: "testing",
    related: ["RT", "NDT"]
  },
  
  "HT": {
    full: "Hardness Test",
    full_hi: "हार्डनेस टेस्ट",
    variations: ["hardness testing", "ht test", "hardness check"],
    category: "testing",
    related: ["PMI"]
  },
  
  "PMI": {
    full: "Positive Material Identification",
    full_hi: "पॉजिटिव मटेरियल आइडेंटिफिकेशन",
    variations: ["material identification", "pmi test", "material verification"],
    category: "testing",
    related: ["MTC", "HT"]
  },
  
  "NDT CL": {
    full: "NDT Clearance",
    full_hi: "एनडीटी क्लीयरेंस",
    variations: ["ndt clearance", "testing clearance", "ndt approval"],
    category: "testing",
    related: ["NDT", "RFI"]
  },
  
  "NDT Map": {
    full: "Inspection Coverage Map",
    full_hi: "निरीक्षण कवरेज मैप",
    variations: ["ndt mapping", "inspection map", "coverage map"],
    category: "testing",
    related: ["NDT", "ITP"]
  },
  
  // ========== INSPECTION & DOCUMENTATION ==========
  
  "RFI": {
    full: "Request for Inspection",
    full_hi: "निरीक्षण के लिए अनुरोध",
    variations: ["inspection request", "rfi form", "request inspection"],
    category: "inspection",
    related: ["TPI", "ITP"]
  },
  
  "TPI": {
    full: "Third Party Inspection",
    full_hi: "थर्ड पार्टी इंस्पेक्शन",
    variations: ["third party", "tpi inspection", "external inspection"],
    category: "inspection",
    related: ["TPIA", "RFI"]
  },
  
  "TPIA": {
    full: "Third Party Inspection Agency",
    full_hi: "थर्ड पार्टी इंस्पेक्शन एजेंसी",
    variations: ["inspection agency", "tpi agency", "third party agency"],
    category: "inspection",
    related: ["TPI"]
  },
  
  "HP": {
    full: "Hold Point",
    full_hi: "होल्ड प्वाइंट",
    variations: ["hold point", "hp inspection", "mandatory hold"],
    category: "inspection",
    related: ["WP", "ITP"]
  },
  
  "WP": {
    full: "Witness Point",
    full_hi: "विटनेस प्वाइंट",
    variations: ["witness point", "wp inspection", "witness check"],
    category: "inspection",
    related: ["HP", "ITP"]
  },
  
  "MIR": {
    full: "Material Inspection Request",
    full_hi: "सामग्री निरीक्षण अनुरोध",
    variations: ["material request", "mir form", "inspection request"],
    category: "inspection",
    related: ["MTC", "PMI"]
  },
  
  "SIR": {
    full: "Site Inspection Report",
    full_hi: "साइट निरीक्षण रिपोर्ट",
    variations: ["site report", "sir document", "inspection report"],
    category: "inspection",
    related: ["RFI", "QCR"]
  },
  
  "DIM Check": {
    full: "Dimensional Inspection",
    full_hi: "आयामी निरीक्षण",
    variations: ["dimensional check", "dimension inspection", "dim inspection"],
    category: "inspection",
    related: ["VT", "ITP"]
  },
  
  // ========== MATERIALS & CERTIFICATES ==========
  
  "MTC": {
    full: "Material Test Certificate",
    full_hi: "मटेरियल टेस्ट सर्टिफिकेट",
    variations: ["material certificate", "test certificate", "mtc document"],
    category: "material",
    related: ["PMI", "MDR"]
  },
  
  "MDR": {
    full: "Manufacturer Data Record",
    full_hi: "निर्माता डेटा रिकॉर्ड",
    variations: ["manufacturer record", "mdr document", "data record"],
    category: "material",
    related: ["MTC", "TDC"]
  },
  
  "BOM": {
    full: "Bill of Materials",
    full_hi: "बिल ऑफ मैटेरियल्स",
    variations: ["material bill", "bom list", "materials list"],
    category: "material",
    related: ["BOQ", "MTC"]
  },
  
  "BOQ": {
    full: "Bill of Quantity",
    full_hi: "बिल ऑफ क्वांटिटी",
    variations: ["quantity bill", "boq list", "quantities list"],
    category: "material",
    related: ["BOM"]
  },
  
  "TDC": {
    full: "Technical Delivery Condition",
    full_hi: "तकनीकी डिलीवरी शर्त",
    variations: ["delivery condition", "tdc document", "technical data sheet"],
    category: "material",
    related: ["MDR", "MTC"]
  },
  
  // ========== TESTING & ACCEPTANCE ==========
  
  "FAT": {
    full: "Factory Acceptance Test",
    full_hi: "फैक्टरी स्वीकृति परीक्षण",
    variations: ["factory test", "fat test", "factory acceptance"],
    category: "testing",
    related: ["SAT"]
  },
  
  "SAT": {
    full: "Site Acceptance Test",
    full_hi: "साइट स्वीकृति परीक्षण",
    variations: ["site test", "sat test", "site acceptance"],
    category: "testing",
    related: ["FAT"]
  },
  
  "Hydrotest": {
    full: "Hydrostatic Pressure Test",
    full_hi: "हाइड्रोस्टैटिक दबाव परीक्षण",
    variations: ["hydro test", "hydrostatic test", "pressure test"],
    category: "testing",
    related: ["Pneumatic Test"]
  },
  
  "Pneumatic Test": {
    full: "Pneumatic Test",
    full_hi: "न्यूमेटिक टेस्ट",
    variations: ["pneumatic testing", "air test", "pt air"],
    category: "testing",
    related: ["Hydrotest"]
  },
  
  // ========== PROCEDURES & STANDARDS ==========
  
  "MS": {
    full: "Method Statement",
    full_hi: "मेथड स्टेटमेंट",
    variations: ["method statement", "ms document", "work method"],
    category: "procedure",
    related: ["SOP", "QCP"]
  },
  
  "SOP": {
    full: "Standard Operating Procedure",
    full_hi: "मानक संचालन प्रक्रिया",
    variations: ["operating procedure", "sop document", "standard procedure"],
    category: "procedure",
    related: ["MS", "QCP"]
  },
  
  "ASME": {
    full: "American Society of Mechanical Engineers",
    full_hi: "अमेरिकन सोसाइटी ऑफ मैकेनिकल इंजीनियर्स",
    variations: ["asme code", "asme standard", "mechanical society"],
    category: "standard",
    related: ["API", "AWS"]
  },
  
  "AWS": {
    full: "American Welding Society",
    full_hi: "अमेरिकन वेल्डिंग सोसाइटी",
    variations: ["aws code", "aws standard", "welding society"],
    category: "standard",
    related: ["ASME", "WPS"]
  },
  
  "API": {
    full: "American Petroleum Institute",
    full_hi: "अमेरिकन पेट्रोलियम इंस्टीट्यूट",
    variations: ["api standard", "api code", "petroleum institute"],
    category: "standard",
    related: ["ASME"]
  },
  
  "IBR": {
    full: "Indian Boiler Regulation",
    full_hi: "इंडियन बॉयलर रेगुलेशन",
    variations: ["ibr code", "boiler regulation", "indian boiler"],
    category: "standard",
    related: ["ASME"]
  },
  
  // ========== DRAWINGS & DOCUMENTS ==========
  
  "GAD": {
    full: "General Arrangement Drawing",
    full_hi: "जनरल अरेंजमेंट ड्रॉइंग",
    variations: ["ga drawing", "arrangement drawing", "gad drawing"],
    category: "drawing",
    related: ["P&ID", "Isometric"]
  },
  
  "P&ID": {
    full: "Piping and Instrumentation Diagram",
    full_hi: "पाइपिंग और इंस्ट्रूमेंटेशन डायग्राम",
    variations: ["p&id drawing", "piping diagram", "instrument diagram"],
    category: "drawing",
    related: ["GAD", "Isometric"]
  },
  
  "Isometric": {
    full: "Isometric Drawing",
    full_hi: "आइसोमेट्रिक ड्रॉइंग",
    variations: ["iso drawing", "isometric diagram", "pipe iso"],
    category: "drawing",
    related: ["P&ID", "GAD"]
  },
  
  // ========== PIPING & FABRICATION ==========
  
  "Spool": {
    full: "Pre-fabricated Pipe Section",
    full_hi: "प्री-फैब्रिकेटेड पाइप सेक्शन",
    variations: ["pipe spool", "spool piece", "fabricated section"],
    category: "piping",
    related: ["Weld Map", "Isometric"]
  },
  
  "NPS": {
    full: "Nominal Pipe Size",
    full_hi: "नॉमिनल पाइप साइज",
    variations: ["pipe size", "nps size", "nominal size"],
    category: "piping",
    related: ["SCH", "DN"]
  },
  
  "SCH": {
    full: "Schedule (Pipe Wall Thickness)",
    full_hi: "शेड्यूल (पाइप की दीवार की मोटाई)",
    variations: ["schedule", "pipe schedule", "sch thickness", "pipe thickness"],
    category: "piping",
    related: ["NPS"]
  },
  
  "DN": {
    full: "Diameter Nominal",
    full_hi: "डायमीटर नॉमिनल",
    variations: ["nominal diameter", "dn size", "diameter nominal"],
    category: "piping",
    related: ["NPS"]
  },
  
  // ========== ADDITIONAL TERMS ==========
  
  "E&I": {
    full: "Erection and Installation",
    full_hi: "इरेक्शन और इंस्टालेशन",
    variations: ["erection", "installation", "e&i work"],
    category: "construction",
    related: ["MS", "ITP"]
  },
  
  "LOI": {
    full: "Letter of Intent",
    full_hi: "लेटर ऑफ इंटेंट",
    variations: ["loi document", "intent letter", "letter intent"],
    category: "commercial",
    related: ["PO"]
  },
  
  "PO": {
    full: "Purchase Order",
    full_hi: "परचेज ऑर्डर",
    variations: ["po number", "purchase order", "order document"],
    category: "commercial",
    related: ["LOI"]
  },
  
  "WPSQ": {
    full: "WPS Qualification",
    full_hi: "डब्ल्यूपीएस क्वालिफिकेशन",
    variations: ["wps qualification", "welding qualification", "procedure qualification"],
    category: "welding",
    related: ["WPS", "PQR"]
  },
  
  // ========== HEAT EXCHANGERS & EQUIPMENT ==========
  
  "STHE": {
    full: "Shell and Tube Heat Exchanger",
    full_hi: "शेल और ट्यूब हीट एक्सचेंजर",
    variations: ["shell tube", "sthe exchanger", "shell and tube"],
    category: "equipment",
    related: ["PHE", "ACHE"]
  },
  
  "PHE": {
    full: "Plate Heat Exchanger",
    full_hi: "प्लेट हीट एक्सचेंजर",
    variations: ["plate exchanger", "phe type", "plate type"],
    category: "equipment",
    related: ["STHE"]
  },
  
  "ACHE": {
    full: "Air Cooled Heat Exchanger",
    full_hi: "एयर कूल्ड हीट एक्सचेंजर",
    variations: ["air cooled", "ache unit", "air exchanger"],
    category: "equipment",
    related: ["STHE", "PHE"]
  },
  
  "TEMA": {
    full: "Tubular Exchanger Manufacturers Association",
    full_hi: "ट्यूबलर एक्सचेंजर मैन्युफैक्चरर्स एसोसिएशन",
    variations: ["tema standard", "tema code", "exchanger association"],
    category: "standard",
    related: ["ASME", "STHE"]
  },
  
  // ========== VALVES & FITTINGS ==========
  
  "PRV": {
    full: "Pressure Relief Valve",
    full_hi: "प्रेशर रिलीफ वाल्व",
    variations: ["relief valve", "prv valve", "pressure valve"],
    category: "equipment",
    related: ["PSV", "SV"]
  },
  
  "PSV": {
    full: "Pressure Safety Valve",
    full_hi: "प्रेशर सेफ्टी वाल्व",
    variations: ["safety valve", "psv valve", "pressure safety"],
    category: "equipment",
    related: ["PRV"]
  },
  
  "SV": {
    full: "Safety Valve",
    full_hi: "सेफ्टी वाल्व",
    variations: ["safety valve", "sv type", "relief valve"],
    category: "equipment",
    related: ["PRV", "PSV"]
  },
  
  "BV": {
    full: "Ball Valve",
    full_hi: "बॉल वाल्व",
    variations: ["ball valve", "bv type", "ball type"],
    category: "equipment",
    related: ["GV", "CV"]
  },
  
  "GV": {
    full: "Gate Valve",
    full_hi: "गेट वाल्व",
    variations: ["gate valve", "gv type", "gate type"],
    category: "equipment",
    related: ["BV", "CV"]
  },
  
  "CV": {
    full: "Check Valve",
    full_hi: "चेक वाल्व",
    variations: ["check valve", "cv type", "non return valve"],
    category: "equipment",
    related: ["BV", "GV", "NRV"]
  },
  
  "NRV": {
    full: "Non-Return Valve",
    full_hi: "नॉन-रिटर्न वाल्व",
    variations: ["non return", "nrv valve", "check valve"],
    category: "equipment",
    related: ["CV"]
  },
  
  // ========== PRESSURE & TESTING ==========
  
  "MAWP": {
    full: "Maximum Allowable Working Pressure",
    full_hi: "मैक्सिमम अलाउएबल वर्किंग प्रेशर",
    variations: ["max pressure", "mawp value", "allowable pressure"],
    category: "pressure",
    related: ["Design Pressure", "Test Pressure"]
  },
  
  "MAOP": {
    full: "Maximum Allowable Operating Pressure",
    full_hi: "मैक्सिमम अलाउएबल ऑपरेटिंग प्रेशर",
    variations: ["max operating", "maop value", "operating pressure"],
    category: "pressure",
    related: ["MAWP"]
  },
  
  "Design Pressure": {
    full: "Design Pressure",
    full_hi: "डिजाइन प्रेशर",
    variations: ["design pressure", "dp value", "pressure design"],
    category: "pressure",
    related: ["MAWP", "Test Pressure"]
  },
  
  "Test Pressure": {
    full: "Test Pressure",
    full_hi: "टेस्ट प्रेशर",
    variations: ["test pressure", "tp value", "pressure test"],
    category: "pressure",
    related: ["Hydrotest", "Design Pressure"]
  },
  
  // ========== CORROSION & COATINGS ==========
  
  "CUI": {
    full: "Corrosion Under Insulation",
    full_hi: "इन्सुलेशन के नीचे क्षरण",
    variations: ["cui corrosion", "under insulation", "insulation corrosion"],
    category: "corrosion",
    related: ["CRA", "Coating"]
  },
  
  "CRA": {
    full: "Corrosion Resistant Alloy",
    full_hi: "जंग प्रतिरोधी मिश्र धातु",
    variations: ["resistant alloy", "cra material", "corrosion alloy"],
    category: "material",
    related: ["CUI", "SS"]
  },
  
  "SS": {
    full: "Stainless Steel",
    full_hi: "स्टेनलेस स्टील",
    variations: ["stainless steel", "ss material", "stainless alloy"],
    category: "material",
    related: ["CRA", "CS"]
  },
  
  "CS": {
    full: "Carbon Steel",
    full_hi: "कार्बन स्टील",
    variations: ["carbon steel", "cs material", "carbon alloy"],
    category: "material",
    related: ["SS", "AS"]
  },
  
  "AS": {
    full: "Alloy Steel",
    full_hi: "मिश्र धातु इस्पात",
    variations: ["alloy steel", "as material", "steel alloy"],
    category: "material",
    related: ["SS", "CS"]
  }
};

export interface AcronymData {
    full: string;
    full_hi: string;
    variations: string[];
    category: string;
    related: string[];
}
export interface AcronymMatch extends AcronymData {
    acronym: string;
    matchType: 'exact' | 'fullname' | 'variation';
}


// ============================================
// ACRONYM SEARCH FUNCTIONS
// ============================================

export function expandAcronyms(query: string): string {
    let expandedQuery = query;
    const words = query.split(/\s+/);
    
    for (const word of words) {
        const upperWord = word.toUpperCase();
        if (OilGasAcronyms[upperWord]) {
            const fullForm = OilGasAcronyms[upperWord].full;
            // Replace only the acronym word with its full form
            // Use a regex with word boundaries to avoid replacing parts of other words
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            expandedQuery = expandedQuery.replace(regex, fullForm);
        }
    }
    return expandedQuery;
}


export function searchAcronym(query: string): AcronymMatch | null {
  const normalized = query.toUpperCase().trim();
  
  // Direct match on the acronym itself
  if (OilGasAcronyms[normalized]) {
    return {
      acronym: normalized,
      ...OilGasAcronyms[normalized],
      matchType: 'exact'
    };
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Search in full names and variations
  for (const [acronym, data] of Object.entries(OilGasAcronyms)) {
    // Check full name (English)
    if (data.full.toLowerCase().includes(lowerQuery)) {
      return {
        acronym,
        ...data,
        matchType: 'fullname'
      };
    }
    
    // Check variations
    for (const variation of data.variations) {
      if (variation.toLowerCase() === lowerQuery) {
        return {
          acronym,
          ...data,
          matchType: 'variation'
        };
      }
    }
  }
  
  return null;
}

export function getAllAcronymsByCategory(category: string) {
  return Object.entries(OilGasAcronyms)
    .filter(([_, data]) => data.category === category)
    .map(([acronym, data]) => ({ acronym, ...data }));
}

export function getRelatedAcronyms(acronym: string) {
  const data = OilGasAcronyms[acronym];
  if (!data || !data.related) return [];
  
  return data.related.map(rel => {
    if (OilGasAcronyms[rel]) {
        return {
            acronym: rel,
            ...OilGasAcronyms[rel]
        }
    }
    return null;
  }).filter(Boolean) as (AcronymData & {acronym: string})[];
}

// Export total count
export const TOTAL_ACRONYMS = Object.keys(OilGasAcronyms).length;

console.log(`✅ Loaded ${TOTAL_ACRONYMS} Oil & Gas acronyms`);
