import type { Question } from '@/types';

const MOCK_DATABASE: Question[] = [
  {
    id: 'q1-heat-exchanger',
    question_en: "What is a Heat Exchanger?",
    question_hi: "हीट एक्सचेंजर क्या होता है?",
    normalized_en: "what is a heat exchanger",
    normalized_hi: "हीट एक्सचेंजर क्या होता है",
    keywords_en: ["heat exchanger", "definition", "function", "purpose"],
    keywords_hi: ["हीट एक्सचेंजर", "परिभाषा", "कार्य", "उद्देश्य"],
    shortAnswer_en: "A heat exchanger is a device used to transfer heat between two or more fluids. The fluids may be separated by a solid wall to prevent mixing or they may be in direct contact.",
    shortAnswer_hi: "हीट एक्सचेंजर एक उपकरण है जिसका उपयोग दो या दो से अधिक तरल पदार्थों के बीच गर्मी स्थानांतरित करने के लिए किया जाता है। तरल पदार्थ मिश्रण को रोकने के लिए एक ठोस दीवार से अलग हो सकते हैं या वे सीधे संपर्क में हो सकते हैं।",
    longAnswer_en: "In-depth explanation: Heat exchangers are essential in various industries for cooling, heating, and energy recovery. They operate on the principle of thermal conduction. There are many types, including shell and tube, plate, and finned tube exchangers. The choice of exchanger depends on factors like fluid properties, pressure, temperature, and cost.",
    longAnswer_hi: "गहन व्याख्या: हीट एक्सचेंजर्स शीतलन, हीटिंग और ऊर्जा पुनर्प्राप्ति के लिए विभिन्न उद्योगों में आवश्यक हैं। वे थर्मल चालन के सिद्धांत पर काम करते हैं। शेल और ट्यूब, प्लेट, और फिनड ट्यूब एक्सचेंजर्स सहित कई प्रकार हैं। एक्सचेंजर का चुनाव द्रव गुण, दबाव, तापमान और लागत जैसे कारकों पर निर्भर करता है।",
    summaryPoints_en: [
      "Transfers heat between fluids.",
      "Can have direct or indirect contact.",
      "Crucial for energy efficiency.",
      "Types: Shell & Tube, Plate.",
      "Selection based on application needs.",
    ],
    summaryPoints_hi: [
      "तरल पदार्थों के बीच गर्मी का हस्तांतरण करता है।",
      "प्रत्यक्ष या अप्रत्यक्ष संपर्क हो सकता है।",
      "ऊर्जा दक्षता के लिए महत्वपूर्ण।",
      "प्रकार: शेल और ट्यूब, प्लेट।",
      "आवेदन की जरूरतों के आधार पर चयन।",
    ],
    category: "PROCESS EQUIPMENT",
    difficulty: "easy",
    tags: ["heat transfer", "equipment"],
    source: "API Standard 661",
    viewCount: 1024,
  },
  {
    id: 'q2-pqr-wps',
    question_en: "What is the difference between PQR and WPS?",
    question_hi: "PQR और WPS में क्या अंतर है?",
    normalized_en: "what is the difference between pqr and wps",
    normalized_hi: "pqr और wps में क्या अंतर है",
    keywords_en: ["pqr", "wps", "difference", "welding", "procedure", "qualification", "record", "specification"],
    keywords_hi: ["pqr", "wps", "अंतर", "वेल्डिंग", "प्रक्रिया", "योग्यता", "रिकॉर्ड", "विनिर्देश"],
    shortAnswer_en: "A WPS (Welding Procedure Specification) is a set of instructions for a welder to make a production weld. A PQR (Procedure Qualification Record) is the record of the actual test weld performed and tested to qualify the WPS.",
    shortAnswer_hi: "WPS (वेल्डिंग प्रक्रिया विशिष्टता) एक वेल्डर के लिए उत्पादन वेल्ड बनाने के लिए निर्देशों का एक सेट है। PQR (प्रक्रिया योग्यता रिकॉर्ड) WPS को योग्य बनाने के लिए किए गए और परीक्षण किए गए वास्तविक परीक्षण वेल्ड का रिकॉर्ड है।",
    longAnswer_en: "A WPS is like a recipe; it provides all the necessary variables (base metal, filler metal, voltage, amperage, travel speed, etc.) for a specific welding application. It's a guide for the welder. The PQR is the proof that the 'recipe' (WPS) works. It documents the welding variables used for a test coupon, and the results of the subsequent mechanical and non-destructive tests. A PQR cannot be changed, but one PQR can support multiple WPSs within the range of qualified variables.",
    longAnswer_hi: "WPS एक रेसिपी की तरह है; यह एक विशिष्ट वेल्डिंग एप्लिकेशन के लिए सभी आवश्यक चर (बेस मेटल, फिलर मेटल, वोल्टेज, एम्परेज, यात्रा की गति, आदि) प्रदान करता है। यह वेल्डर के लिए एक गाइड है। PQR इस बात का प्रमाण है कि 'रेसिपी' (WPS) काम करती है। यह एक परीक्षण कूपन के लिए उपयोग किए गए वेल्डिंग चर और बाद के यांत्रिक और गैर-विनाशकारी परीक्षणों के परिणामों का दस्तावेजीकरण करता है। PQR को बदला नहीं जा सकता है, लेकिन एक PQR योग्य चरों की सीमा के भीतर कई WPS का समर्थन कर सकता है।",
    summaryPoints_en: [
      "WPS is a 'how-to' guide for welders.",
      "PQR is a 'proof of testing' record.",
      "WPS contains parameters for production welds.",
      "PQR documents the test weld and results.",
      "One PQR can qualify multiple WPSs.",
      "PQR is a record of actual variables; WPS specifies ranges."
    ],
    summaryPoints_hi: [
      "WPS वेल्डर के लिए एक 'कैसे करें' गाइड है।",
      "PQR एक 'परीक्षण का प्रमाण' रिकॉर्ड है।",
      "WPS में उत्पादन वेल्ड के लिए पैरामीटर होते हैं।",
      "PQR परीक्षण वेल्ड और परिणामों का दस्तावेजीकरण करता है।",
      "एक PQR कई WPS को योग्य बना सकता है।",
      "PQR वास्तविक चर का रिकॉर्ड है; WPS रेंज निर्दिष्ट करता है।"
    ],
    category: "WELDING",
    difficulty: "medium",
    tags: ["welding", "documentation", "asme ix"],
    source: "ASME Section IX",
    viewCount: 2500,
  },
  {
    id: 'q3-hydrotest-pressure',
    question_en: "How do you calculate hydrotest pressure?",
    question_hi: "हाइड्रोटेस्ट दबाव की गणना कैसे करें?",
    normalized_en: "how do you calculate hydrotest pressure",
    normalized_hi: "हाइड्रोटेस्ट दबाव की गणना कैसे करें",
    keywords_en: ["hydrotest", "pressure", "calculation", "asme", "b31.3", "piping", "formula"],
    keywords_hi: ["हाइड्रोटेस्ट", "दबाव", "गणना", "asme", "b31.3", "पाइपिंग", "सूत्र"],
    shortAnswer_en: "According to ASME B31.3, the minimum hydrotest pressure is calculated as 1.5 times the design pressure, adjusted for temperature. The formula is: P_test = 1.5 * P_design * (S_test_temp / S_design_temp).",
    shortAnswer_hi: "ASME B31.3 के अनुसार, न्यूनतम हाइड्रोटेस्ट दबाव की गणना डिजाइन दबाव के 1.5 गुना के रूप में की जाती है, जिसे तापमान के लिए समायोजित किया जाता है। सूत्र है: P_test = 1.5 * P_design * (S_test_temp / S_design_temp)।",
    longAnswer_en: "The calculation for hydrostatic test pressure in process piping is governed by codes like ASME B31.3. The formula P_test = 1.5 * P_design * (S_t / S_d) is critical. Here, P_design is the design pressure. S_t is the allowable stress value at the test temperature, and S_d is the allowable stress value at the design temperature. This stress ratio correction factor is important because the material's strength changes with temperature. It ensures the pipe is not overstressed during testing, especially if the test temperature is significantly different from the design temperature. The test pressure should not exceed a value that would cause general yielding.",
    longAnswer_hi: "प्रोसेस पाइपिंग में हाइड्रोस्टैटिक परीक्षण दबाव की गणना ASME B31.3 जैसे कोड द्वारा नियंत्रित होती है। सूत्र P_test = 1.5 * P_design * (S_t / S_d) महत्वपूर्ण है। यहां, P_design डिजाइन दबाव है। S_t परीक्षण तापमान पर स्वीकार्य तनाव मान है, और S_d डिजाइन तापमान पर स्वीकार्य तनाव मान है। यह तनाव अनुपात सुधार कारक महत्वपूर्ण है क्योंकि सामग्री की ताकत तापमान के साथ बदलती है। यह सुनिश्चित करता है कि परीक्षण के दौरान पाइप पर अधिक दबाव न पड़े, खासकर यदि परीक्षण तापमान डिजाइन तापमान से काफी अलग हो। परीक्षण दबाव उस मान से अधिक नहीं होना चाहिए जो सामान्य उपज का कारण बने।",
    summaryPoints_en: [
      "Based on ASME B31.3 for process piping.",
      "Minimum test pressure is 1.5x design pressure.",
      "Requires temperature correction factor.",
      "Formula: P_test = 1.5 * P_design * (S_t / S_d).",
      "S_t is allowable stress at test temperature.",
      "S_d is allowable stress at design temperature.",
    ],
    summaryPoints_hi: [
      "प्रोसेस पाइपिंग के लिए ASME B31.3 पर आधारित।",
      "न्यूनतम परीक्षण दबाव 1.5x डिजाइन दबाव है।",
      "तापमान सुधार कारक की आवश्यकता है।",
      "सूत्र: P_test = 1.5 * P_design * (S_t / S_d)।",
      "S_t परीक्षण तापमान पर स्वीकार्य तनाव है।",
      "S_d डिजाइन तापमान पर स्वीकार्य तनाव है।",
    ],
    category: "PIPING",
    difficulty: "hard",
    tags: ["testing", "pressure test", "asme b31.3"],
    source: "ASME B31.3",
    viewCount: 1890,
  },
];

export const fetchQuestions = async (): Promise<Question[]> => {
  // In a real app, you would fetch this from Firestore
  // e.g., const snapshot = await getDocs(collection(db, 'questions'));
  // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as Omit<Question, 'id'> }));
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_DATABASE);
    }, 500); // Simulate network delay
  });
};
