import React, { createContext, useContext, useState } from "react";

export type Language = "EN" | "HI";

export type TranslationKey =
  | "find_your_tyre"
  | "smart_locator"
  | "fleet_portal"
  | "partner_portal"
  | "engineered_to_control"
  | "control"
  | "elements"
  | "intro_text"
  | "search_placeholder"
  | "powered_by"
  | "launch_wizard"
  | "close_wizard"
  | "step"
  | "of"
  | "back"
  | "continue"
  | "reveal_recommendation"
  | "recommendation_title"
  | "nearest_fitment"
  | "book_fitment_slot"
  | "restart_wizard"
  | "locator_title"
  | "nearest_fitment_italic"
  | "locator_intro"
  | "locator_placeholder"
  | "locator_fallback"
  | "book_slot"
  | "in_stock"
  | "units"
  | "limited"
  | "today"
  | "tomorrow"
  | "wait"
  | "mins"
  | "hr_wait"
  | "fleet_title"
  | "fleet_italic"
  | "fleet_intro"
  | "fleet_size"
  | "avg_monthly_run"
  | "vehicles"
  | "km_vehicle"
  | "projected_saving"
  | "tyre_replacements"
  | "uptime_gained"
  | "co2_avoided"
  | "vs_benchmark"
  | "optimized_rotation"
  | "fewer_roadside"
  | "lower_rolling"
  | "enterprise_onboarding"
  | "activate_toteline"
  | "toteline_intro"
  | "talk_to_fleet"
  | "pune_mh"
  | "contact_us"
  | "name"
  | "phone"
  | "email"
  | "company"
  | "submit"
  | "close"
  | "select_priority"
  | "select_rim"
  | "select_weather"
  | "select_terrain"
  | "select_vehicle"
  | "comfort"
  | "toughness"
  | "balanced"
  | "urban"
  | "highway"
  | "off_road"
  | "monsoon"
  | "dry"
  | "mixed"
  | "selected"
  | "booking_confirmed"
  | "booking_id"
  | "show_qr"
  | "success_booking"
  | "partner_login"
  | "dealer_login"
  | "operator_login"
  | "username"
  | "password"
  | "login"
  | "verify_otp"
  | "otp_sent"
  | "enter_otp"
  | "fleet_desc";

const translations: Record<Language, Record<TranslationKey, string>> = {
  EN: {
    find_your_tyre: "Find Your Tyre",
    smart_locator: "Smart Locator",
    fleet_portal: "Fleet Portal",
    partner_portal: "Partner Portal",
    engineered_to_control: "Engineered to",
    control: "control",
    elements: "the elements.",
    intro_text: "India's most advanced tyre intelligence platform — built for monsoon highways, urban grids, and untamed terrain.",
    search_placeholder: "Enter vehicle model (e.g., Creta, Nexon...)",
    powered_by: "Powered by Bridy AI: Instantly resolving data formulas for severe monsoon highways and heavy structural off-road scenarios.",
    launch_wizard: "Launch 5-Step Smart Selector Wizard",
    close_wizard: "Close Smart Selector",
    step: "Step",
    of: "of",
    back: "Back",
    continue: "Continue",
    reveal_recommendation: "Reveal Recommendation",
    recommendation_title: "Bridy AI Recommendation",
    nearest_fitment: "Nearest Fitment Centre",
    book_fitment_slot: "Book Fitment Slot",
    restart_wizard: "Restart Wizard",
    locator_title: "Find your nearest",
    nearest_fitment_italic: "fitment",
    locator_intro: "Live inventory, certified technicians, and pre-booked bays across Bridgestone Select and Express partners.",
    locator_placeholder: "Search by city, pincode or store name…",
    locator_fallback: "No fitment centres match that search. Try a different city or pincode.",
    book_slot: "Book Slot",
    in_stock: "In Stock",
    units: "Units",
    limited: "Limited",
    today: "Today",
    tomorrow: "Tomorrow",
    wait: "wait",
    mins: "mins",
    hr_wait: "hr wait",
    fleet_title: "Run a fleet that",
    fleet_italic: "never stops earning",
    fleet_intro: "Model your annual tyre lifecycle, retread economics, and uptime gain with Bridgestone's Toteline telematics.",
    fleet_size: "Fleet Size",
    avg_monthly_run: "Average Monthly Run",
    vehicles: "vehicles",
    km_vehicle: "km / vehicle",
    projected_saving: "Projected Annual Saving",
    tyre_replacements: "Tyre Replacements / yr",
    uptime_gained: "Uptime Gained",
    co2_avoided: "CO₂ Avoided",
    vs_benchmark: "vs benchmark fleet TCO",
    optimized_rotation: "optimised rotation cadence",
    fewer_roadside: "fewer roadside events",
    lower_rolling: "lower rolling resistance",
    enterprise_onboarding: "Enterprise Onboarding",
    activate_toteline: "Activate Toteline for your fleet in 48 hours.",
    toteline_intro: "Dedicated account manager, on-site survey, and a live pilot across 10 vehicles — zero commitment.",
    talk_to_fleet: "Talk to Fleet Desk",
    pune_mh: "Pune, MH",
    contact_us: "Contact Us",
    name: "Full Name",
    phone: "Phone Number",
    email: "Email Address",
    company: "Company Name",
    submit: "Submit Request",
    close: "Close",
    select_priority: "Driving Priority",
    select_rim: "Rim Size",
    select_weather: "Weather Profile",
    select_terrain: "Primary Terrain",
    select_vehicle: "Vehicle Type",
    comfort: "Comfort",
    toughness: "Toughness",
    balanced: "Balanced",
    urban: "Urban",
    highway: "Highway",
    off_road: "Off-Road",
    monsoon: "Monsoon",
    dry: "Dry",
    mixed: "Mixed",
    selected: "Selected",
    booking_confirmed: "Booking Confirmed!",
    booking_id: "Booking ID",
    show_qr: "Show this QR code at the fitment centre",
    success_booking: "Your slot has been reserved. A confirmation SMS with details has been sent.",
    partner_login: "Partner Portal Login",
    dealer_login: "Dealer Login",
    operator_login: "Fleet Operator Login",
    username: "Username or Email",
    password: "Password",
    login: "Sign In",
    verify_otp: "Verify via OTP",
    otp_sent: "OTP sent to registered mobile",
    enter_otp: "Enter 6-Digit OTP",
    fleet_desc: "Model your annual tyre lifecycle, retread economics, and uptime gain with Bridgestone's Toteline telematics."
  },
  HI: {
    find_your_tyre: "टायर खोजें",
    smart_locator: "स्मार्ट लोकेटर",
    fleet_portal: "फ्लीट पोर्टल",
    partner_portal: "पार्टनर पोर्टल",
    engineered_to_control: "तत्वों को",
    control: "नियंत्रित",
    elements: "करने के लिए निर्मित।",
    intro_text: "भारत का सबसे उन्नत टायर इंटेलिजेंस प्लेटफॉर्म — मानसून राजमार्गों, शहरी ग्रिडों और दुर्गम रास्तों के लिए निर्मित।",
    search_placeholder: "वाहन का मॉडल दर्ज करें (जैसे, Creta, Nexon...)",
    powered_by: "ब्रिडी एआई द्वारा संचालित: मानसून और कठिन ऑफ-रोड परिस्थितियों के लिए तुरंत डेटा हल करना।",
    launch_wizard: "5-चरण स्मार्ट चयन विज़ार्ड शुरू करें",
    close_wizard: "स्मार्ट चयन बंद करें",
    step: "चरण",
    of: "का",
    back: "पीछे",
    continue: "आगे बढ़ें",
    reveal_recommendation: "अनुशंसा देखें",
    recommendation_title: "ब्रिडी एआई अनुशंसा",
    nearest_fitment: "निकटतम फिटमेंट केंद्र",
    book_fitment_slot: "फिटमेंट स्लॉट बुक करें",
    restart_wizard: "विज़ार्ड पुनः प्रारंभ करें",
    locator_title: "अपना निकटतम",
    nearest_fitment_italic: "फिटमेंट",
    locator_intro: "ब्रिजस्टोन सिलेक्ट और एक्सप्रेस भागीदारों पर लाइव स्टॉक, प्रमाणित तकनीशियन और प्री-बुक बे।",
    locator_placeholder: "शहर, पिनकोड या स्टोर के नाम से खोजें…",
    locator_fallback: "खोज से मेल खाता कोई फिटमेंट केंद्र नहीं मिला। दूसरा शहर या पिनकोड आज़माएं।",
    book_slot: "स्लॉट बुक करें",
    in_stock: "स्टॉक में",
    units: "यूनिट",
    limited: "सीमित",
    today: "आज",
    tomorrow: "कल",
    wait: "प्रतीक्षा",
    mins: "मिनट",
    hr_wait: "घंटे प्रतीक्षा",
    fleet_title: "ऐसा फ्लीट चलाएं जो",
    fleet_italic: "कभी कमाना बंद न करे",
    fleet_intro: "ब्रिजस्टोन के टोटलाइन टेलीमैटिक्स के साथ अपने वार्षिक टायर लाइफसाइकिल, रिट्रेड इकोनॉमिक्स और अपटाइम लाभ को मॉडल करें।",
    fleet_size: "फ्लीट का आकार",
    avg_monthly_run: "औसत मासिक रन",
    vehicles: "वाहन",
    km_vehicle: "किमी / वाहन",
    projected_saving: "अनुमानित वार्षिक बचत",
    tyre_replacements: "टायर प्रतिस्थापन / वर्ष",
    uptime_gained: "प्राप्त अपटाइम",
    co2_avoided: "बचाई गई CO₂",
    vs_benchmark: "बनाम मानक फ्लीट कुल स्वामित्व लागत (TCO)",
    optimized_rotation: "इष्टतम रोटेशन कैडेंस",
    fewer_roadside: "कम सड़क किनारे की घटनाएं",
    lower_rolling: "कम रोलिंग प्रतिरोध",
    enterprise_onboarding: "एंटरप्राइज ऑनबोर्डिंग",
    activate_toteline: "48 घंटों में अपने फ्लीट के लिए टोटलाइन सक्रिय करें।",
    toteline_intro: "समर्पित खाता प्रबंधक, ऑन-साइट सर्वेक्षण, और 10 वाहनों में लाइव पायलट — शून्य प्रतिबद्धता।",
    talk_to_fleet: "फ्लीट डेस्क से बात करें",
    pune_mh: "पुणे, महाराष्ट्र",
    contact_us: "संपर्क करें",
    name: "पूरा नाम",
    phone: "फ़ोन नंबर",
    email: "ईमेल पता",
    company: "कंपनी का नाम",
    submit: "अनुरोध भेजें",
    close: "बंद करें",
    select_priority: "ड्राइविंग प्राथमिकता",
    select_rim: "रिम का आकार",
    select_weather: "मौसम प्रोफाइल",
    select_terrain: "मुख्य भूभाग",
    select_vehicle: "वाहन का प्रकार",
    comfort: "आराम",
    toughness: "मजबूती",
    balanced: "संतुलित",
    urban: "शहरी",
    highway: "राजमार्ग",
    off_road: "ऑफ-रोड",
    monsoon: "मानसून",
    dry: "सूखा",
    mixed: "मिश्रित",
    selected: "चयनित",
    booking_confirmed: "बुकिंग की पुष्टि हो गई है!",
    booking_id: "बुकिंग आईडी",
    show_qr: "फिटमेंट केंद्र पर यह क्यूआर कोड दिखाएं",
    success_booking: "आपका स्लॉट आरक्षित कर दिया गया है। विवरण के साथ एक पुष्टिकरण एसएमएस भेज दिया गया है।",
    partner_login: "पार्टनर पोर्टल लॉगिन",
    dealer_login: "डीलर लॉगिन",
    operator_login: "फ्लीट ऑपरेटर लॉगिन",
    username: "यूज़रनेम या ईमेल",
    password: "पासवर्ड",
    login: "साइन इन करें",
    verify_otp: "ओटीपी द्वारा सत्यापित करें",
    otp_sent: "पंजीकृत मोबाइल पर ओटीपी भेजा गया",
    enter_otp: "6-अंकीय ओटीपी दर्ज करें",
    fleet_desc: "ब्रिजस्टोन के टोटलाइन टेलीमैटिक्स के साथ अपने वार्षिक टायर लाइफसाइकिल, रिट्रेड इकोनॉमिक्स और अपटाइम लाभ को मॉडल करें।"
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bridgestone_lang");
      return (saved as Language) || "EN";
    }
    return "EN";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("bridgestone_lang", lang);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations["EN"][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
