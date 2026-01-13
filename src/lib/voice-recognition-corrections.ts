
// This map stores common voice recognition mistakes and their correct versions.
// Key: The incorrect phrase (lowercase)
// Value: The correct phrase
// This allows for easy updates and maintenance of voice correction logic.

export const correctionMap = new Map<string, string>([
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
