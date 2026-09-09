import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "./api";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning 👋";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon 👋";
  }

  if (hour >= 17 && hour < 21) {
    return "Good evening 👋";
  }

  return "Good night 👋";
}

const initialHistory = Array.from({ length: 12 }, (_, i) => ({
  time: `${String(10 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
  ph: Number((7.0 + Math.sin(i * 0.7) * 0.22).toFixed(2)),
  tds: Math.round(245 + Math.sin(i * 0.55) * 38 + i * 2),
  temp: Number((25.1 + Math.cos(i * 0.5) * 1.1).toFixed(1)),
  turbidity: Number((1.8 + Math.sin(i * 0.6) * 0.7).toFixed(1)),
}));

const stations = [
  "Monitoring Station 01",
  "Monitoring Station 02",
  "Community Tank 01",
];

/* =========================
   LANGUAGE TRANSLATIONS
========================= */

const translations = {
  en: {
    dashboard: "Dashboard",
    history: "History",
    alerts: "Alerts",
    reports: "Reports",
    settings: "Settings",

    dashboardTitle: "WATER QUALITY MONITORING",
    
    dashboardText:
      "Monitor your water source and detect potential quality risks in real time.",

    export: "↓ Export CSV",
    live: "Live Monitoring Active",
    paused: "Simulation Paused",
    pause: "Ⅱ Pause",
    resume: "▶ Resume",

    ph: "pH Level",
    tds: "TDS Level",
    temperature: "Temperature",
    turbidity: "Turbidity",
    qualityScore: "Quality Score",

    normal: "Normal",
    critical: "Critical",
    good: "Good",
    elevated: "Elevated",
    high: "High",

    safeToUse: "SAFE TO USE",
    needsAttention: "NEEDS ATTENTION",
    unsafeWater: "UNSAFE WATER",

    overallQuality: "Overall Water Quality",
    parameterHealth: "Parameter Health",
    currentReading: "Current reading vs safe limits",

    phTrend: "pH Trend",
    recentReadings: "Recent sensor readings",
    viewHistory: "View history",

    recentAlerts: "Recent Alerts",
    everythingNormal: "Everything looks normal",
    viewAll: "View all",

    monitoringStation: "Monitoring Station",
    deviceReadiness: "Device readiness",
    connected: "Connected",

    noAlerts: "No active water-quality alerts",

    analytics: "ANALYTICS",
    sensorHistory: "Sensor History",
    reviewMeasurements:
      "Review recent pH, TDS, temperature and turbidity measurements.",

    latestPh: "Latest pH",
    latestTds: "Latest TDS",
    latestTemp: "Latest Temp",
    latestTurbidity: "Latest Turbidity",
    currentScore: "Current Score",

    readingLog: "Reading log",
    latestFirst: "Latest measurements first",

    time: "Time",
    score: "Score",
    status: "Status",

    safetyCenter: "SAFETY CENTER",
    alertsWarnings: "Alerts & Warnings",
    thresholdNotifications:
      "Threshold-based notifications from your monitoring station.",

    howAlertsWork: "How alerts work",
    alertInfo:
      "Alerts are generated automatically when sensor readings cross configured thresholds.",

    reporting: "REPORTING",
    waterReports: "Water Quality Reports",
    reportText:
      "Generate a simple dataset report for your monitoring station.",

    currentStation: "Current station",
    readingsAvailable: "readings available in this demo session.",
    downloadReport: "↓ Download CSV Report",

    reportContents: "Report contents",
    includedAutomatically: "Included automatically",

    timestamped: "Timestamped sensor readings",
    sensorParameters: "pH, TDS, temperature and turbidity",
    calculatedScore: "Calculated quality score",
    stationInfo: "Station information",

    hardwareReady: "Simulation-ready",
    nextIntegration: "Virtual sensor simulation",

    settingsTitle: "Settings",
    settingsText:
      "Configure the monitoring dashboard and alert thresholds.",

    monitoring: "Monitoring",
    dashboardBehaviour: "Dashboard behaviour",

    monitoringStation: "Monitoring station",
    liveSimulation: "Live simulation",
    liveSimulationText:
      "Refresh demo sensor values every 3 seconds.",

    alertThresholds: "Alert thresholds",
    frontendEngine: "Used by the frontend safety engine",

    phMinimum: "pH minimum",
    phMaximum: "pH maximum",
    tdsWarning: "TDS warning (ppm)",
    tdsCritical: "TDS critical (ppm)",
    tempMaximum: "Temperature maximum (°C)",
    turbidityMaximum: "Turbidity maximum (NTU)",

    hardwareNote: "Simulation note",

    language: "Language",
    english: "English",
    hindi: "Hindi",
    marathi: "Marathi",

    recommended: "Recommended",
    dissolvedSolids: "Dissolved solids",
    waterTemperature: "Current water temperature",
    waterClarity: "Water clarity",
    combinedScore: "Combined sensor score",

    popupTitle: "⚠️ Water Quality Alert",
    close: "Close",
    acknowledge: "Acknowledge",
  },

  hi: {
    dashboard: "डैशबोर्ड",
    history: "इतिहास",
    alerts: "अलर्ट",
    reports: "रिपोर्ट",
    settings: "सेटिंग्स",

    dashboardTitle: "जल गुणवत्ता निगरानी",
    greeting: "शुभ संध्या 👋",
    dashboardText:
      "अपने जल स्रोत की निगरानी करें और गुणवत्ता से जुड़े जोखिमों का पता लगाएं।",

    export: "↓ CSV निर्यात",
    live: "लाइव मॉनिटरिंग सक्रिय",
    paused: "सिमुलेशन रुका हुआ",
    pause: "Ⅱ रोकें",
    resume: "▶ शुरू करें",

    ph: "pH स्तर",
    tds: "TDS स्तर",
    temperature: "तापमान",
    turbidity: "टर्बिडिटी",
    qualityScore: "गुणवत्ता स्कोर",

    normal: "सामान्य",
    critical: "गंभीर",
    good: "अच्छा",
    elevated: "बढ़ा हुआ",
    high: "उच्च",

    safeToUse: "उपयोग के लिए सुरक्षित",
    needsAttention: "ध्यान देने की आवश्यकता",
    unsafeWater: "असुरक्षित पानी",

    overallQuality: "कुल जल गुणवत्ता",
    parameterHealth: "पैरामीटर स्थिति",
    currentReading: "वर्तमान रीडिंग बनाम सुरक्षित सीमा",

    phTrend: "pH ट्रेंड",
    recentReadings: "हाल की सेंसर रीडिंग",
    viewHistory: "इतिहास देखें",

    recentAlerts: "हाल के अलर्ट",
    everythingNormal: "सब कुछ सामान्य है",
    viewAll: "सभी देखें",

    monitoringStation: "मॉनिटरिंग स्टेशन",
    deviceReadiness: "डिवाइस स्थिति",
    connected: "कनेक्टेड",

    noAlerts: "कोई सक्रिय जल गुणवत्ता अलर्ट नहीं",

    analytics: "विश्लेषण",
    sensorHistory: "सेंसर इतिहास",
    reviewMeasurements:
      "हाल की pH, TDS, तापमान और टर्बिडिटी रीडिंग देखें।",

    latestPh: "नवीनतम pH",
    latestTds: "नवीनतम TDS",
    latestTemp: "नवीनतम तापमान",
    latestTurbidity: "नवीनतम टर्बिडिटी",
    currentScore: "वर्तमान स्कोर",

    readingLog: "रीडिंग लॉग",
    latestFirst: "नवीनतम रीडिंग पहले",

    time: "समय",
    score: "स्कोर",
    status: "स्थिति",

    safetyCenter: "सुरक्षा केंद्र",
    alertsWarnings: "अलर्ट और चेतावनियां",
    thresholdNotifications:
      "मॉनिटरिंग स्टेशन से प्राप्त सीमा आधारित सूचनाएं।",

    howAlertsWork: "अलर्ट कैसे काम करते हैं",
    alertInfo:
      "सेंसर रीडिंग निर्धारित सीमा पार करने पर अलर्ट अपने आप बनते हैं।",

    reporting: "रिपोर्टिंग",
    waterReports: "जल गुणवत्ता रिपोर्ट",
    reportText:
      "अपने मॉनिटरिंग स्टेशन के लिए डेटा रिपोर्ट तैयार करें।",

    currentStation: "वर्तमान स्टेशन",
    readingsAvailable: "रीडिंग इस डेमो में उपलब्ध हैं।",
    downloadReport: "↓ CSV रिपोर्ट डाउनलोड",

    reportContents: "रिपोर्ट में",
    includedAutomatically: "स्वचालित रूप से शामिल",

    timestamped: "समय सहित सेंसर रीडिंग",
    sensorParameters: "pH, TDS, तापमान और टर्बिडिटी",
    calculatedScore: "गणना किया गया गुणवत्ता स्कोर",
    stationInfo: "स्टेशन जानकारी",

    hardwareReady: "सिमुलेशन तैयार",
    nextIntegration: "वर्चुअल सेंसर सिमुलेशन",

    settingsTitle: "सेटिंग्स",
    settingsText:
      "मॉनिटरिंग डैशबोर्ड और अलर्ट सीमाओं को कॉन्फ़िगर करें।",

    monitoring: "मॉनिटरिंग",
    dashboardBehaviour: "डैशबोर्ड व्यवहार",

    monitoringStation: "मॉनिटरिंग स्टेशन",
    liveSimulation: "लाइव सिमुलेशन",
    liveSimulationText:
      "हर 3 सेकंड में डेमो सेंसर वैल्यू अपडेट करें।",

    alertThresholds: "अलर्ट सीमाएं",
    frontendEngine: "फ्रंटएंड सुरक्षा इंजन द्वारा उपयोग",

    phMinimum: "न्यूनतम pH",
    phMaximum: "अधिकतम pH",
    tdsWarning: "TDS चेतावनी (ppm)",
    tdsCritical: "TDS गंभीर सीमा (ppm)",
    tempMaximum: "अधिकतम तापमान (°C)",
    turbidityMaximum: "अधिकतम टर्बिडिटी (NTU)",

    hardwareNote: "सिमुलेशन नोट",

    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    marathi: "मराठी",

    recommended: "अनुशंसित",
    dissolvedSolids: "घुले हुए ठोस पदार्थ",
    waterTemperature: "वर्तमान जल तापमान",
    waterClarity: "जल की स्पष्टता",
    combinedScore: "संयुक्त सेंसर स्कोर",

    popupTitle: "⚠️ जल गुणवत्ता अलर्ट",
    close: "बंद करें",
    acknowledge: "स्वीकार करें",
  },

  mr: {
    dashboard: "डॅशबोर्ड",
    history: "इतिहास",
    alerts: "अलर्ट",
    reports: "अहवाल",
    settings: "सेटिंग्ज",

    dashboardTitle: "पाणी गुणवत्ता निरीक्षण",
    greeting: "शुभ संध्याकाळ 👋",
    dashboardText:
      "पाण्याच्या स्रोताचे निरीक्षण करा आणि गुणवत्तेशी संबंधित धोके शोधा.",

    export: "↓ CSV निर्यात",
    live: "लाइव्ह मॉनिटरिंग सक्रिय",
    paused: "सिम्युलेशन थांबले",
    pause: "Ⅱ थांबवा",
    resume: "▶ सुरू करा",

    ph: "pH पातळी",
    tds: "TDS पातळी",
    temperature: "तापमान",
    turbidity: "टर्बिडिटी",
    qualityScore: "गुणवत्ता स्कोअर",

    normal: "सामान्य",
    critical: "गंभीर",
    good: "चांगले",
    elevated: "वाढलेले",
    high: "जास्त",

    safeToUse: "वापरण्यास सुरक्षित",
    needsAttention: "लक्ष देणे आवश्यक",
    unsafeWater: "असुरक्षित पाणी",

    overallQuality: "एकूण पाणी गुणवत्ता",
    parameterHealth: "पॅरामीटर स्थिती",
    currentReading: "सध्याचे मोजमाप व सुरक्षित मर्यादा",

    phTrend: "pH ट्रेंड",
    recentReadings: "अलीकडील सेन्सर मोजमाप",
    viewHistory: "इतिहास पहा",

    recentAlerts: "अलीकडील अलर्ट",
    everythingNormal: "सर्व काही सामान्य आहे",
    viewAll: "सर्व पहा",

    monitoringStation: "मॉनिटरिंग स्टेशन",
    deviceReadiness: "डिव्हाइस स्थिती",
    connected: "कनेक्टेड",

    noAlerts: "सध्या कोणतेही सक्रिय पाणी गुणवत्ता अलर्ट नाहीत",

    analytics: "विश्लेषण",
    sensorHistory: "सेन्सर इतिहास",
    reviewMeasurements:
      "अलीकडील pH, TDS, तापमान आणि टर्बिडिटी मोजमाप पहा.",

    latestPh: "नवीनतम pH",
    latestTds: "नवीनतम TDS",
    latestTemp: "नवीनतम तापमान",
    latestTurbidity: "नवीनतम टर्बिडिटी",
    currentScore: "सध्याचा स्कोअर",

    readingLog: "मोजमाप लॉग",
    latestFirst: "नवीनतम मोजमाप प्रथम",

    time: "वेळ",
    score: "स्कोअर",
    status: "स्थिती",

    safetyCenter: "सुरक्षा केंद्र",
    alertsWarnings: "अलर्ट आणि चेतावणी",
    thresholdNotifications:
      "मॉनिटरिंग स्टेशनकडून मिळणाऱ्या मर्यादा आधारित सूचना.",

    howAlertsWork: "अलर्ट कसे काम करतात",
    alertInfo:
      "सेन्सर मोजमाप निश्चित मर्यादा ओलांडल्यास अलर्ट आपोआप तयार होतात.",

    reporting: "अहवाल",
    waterReports: "पाणी गुणवत्ता अहवाल",
    reportText:
      "मॉनिटरिंग स्टेशनसाठी डेटा अहवाल तयार करा.",

    currentStation: "सध्याचे स्टेशन",
    readingsAvailable: "मोजमाप या डेमोमध्ये उपलब्ध आहेत.",
    downloadReport: "↓ CSV अहवाल डाउनलोड",

    reportContents: "अहवालामध्ये",
    includedAutomatically: "आपोआप समाविष्ट",

    timestamped: "वेळेसह सेन्सर मोजमाप",
    sensorParameters: "pH, TDS, तापमान आणि टर्बिडिटी",
    calculatedScore: "गणना केलेला गुणवत्ता स्कोअर",
    stationInfo: "स्टेशन माहिती",

    hardwareReady: "सिम्युलेशन तयार",
    nextIntegration: "व्हर्च्युअल सेंसर सिम्युलेशन",

    settingsTitle: "सेटिंग्ज",
    settingsText:
      "मॉनिटरिंग डॅशबोर्ड आणि अलर्ट मर्यादा कॉन्फिगर करा.",

    monitoring: "मॉनिटरिंग",
    dashboardBehaviour: "डॅशबोर्ड व्यवहार",

    monitoringStation: "मॉनिटरिंग स्टेशन",
    liveSimulation: "लाइव्ह सिम्युलेशन",
    liveSimulationText:
      "दर 3 सेकंदांनी डेमो सेन्सर मूल्ये अपडेट करा.",

    alertThresholds: "अलर्ट मर्यादा",
    frontendEngine: "फ्रंटएंड सुरक्षा इंजिनद्वारे वापरले जाते",

    phMinimum: "किमान pH",
    phMaximum: "कमाल pH",
    tdsWarning: "TDS चेतावणी (ppm)",
    tdsCritical: "TDS गंभीर मर्यादा (ppm)",
    tempMaximum: "कमाल तापमान (°C)",
    turbidityMaximum: "कमाल टर्बिडिटी (NTU)",

    hardwareNote: "सिम्युलेशन सूचना",

    language: "भाषा",
    english: "इंग्रजी",
    hindi: "हिंदी",
    marathi: "मराठी",

    recommended: "शिफारस केलेले",
    dissolvedSolids: "विरघळलेले घन पदार्थ",
    waterTemperature: "सध्याचे पाण्याचे तापमान",
    waterClarity: "पाण्याची स्पष्टता",
    combinedScore: "संयुक्त सेन्सर स्कोअर",

    popupTitle: "⚠️ पाणी गुणवत्ता अलर्ट",
    close: "बंद करा",
    acknowledge: "मान्य करा",
  },
};

/* =========================
   WATER QUALITY ENGINE
========================= */

function getStatus(ph, tds, temp, turbidity, thresholds) {
  const issues = [];

  if (ph < thresholds.phMin || ph > thresholds.phMax) {
    issues.push(
      `pH is outside the ${thresholds.phMin}–${thresholds.phMax} range (${ph.toFixed(
        1
      )})`
    );
  }

  if (tds > thresholds.tdsMax) {
    issues.push(`TDS is critically high (${Math.round(tds)} ppm)`);
  } else if (tds > thresholds.tdsWarn) {
    issues.push(`TDS is elevated (${Math.round(tds)} ppm)`);
  }

  if (temp > thresholds.tempMax) {
    issues.push(
      `Temperature is high (${temp.toFixed(1)}°C)`
    );
  }

  if (turbidity > thresholds.turbidityMax) {
    issues.push(
      `Turbidity is high (${turbidity.toFixed(1)} NTU)`
    );
  }

  let score = 100;

  score -= Math.min(
    35,
    Math.abs(ph - 7.2) * 18
  );

  score -= Math.min(
    35,
    Math.max(0, tds - 220) / 10
  );

  score -= Math.min(
    15,
    Math.max(0, temp - 28) * 1.5
  );

  score -= Math.min(
    20,
    Math.max(0, turbidity - 1) * 5
  );

  score = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  const type =
    score >= 80 && issues.length === 0
      ? "safe"
      : score >= 55
      ? "warning"
      : "danger";

  return {
    score,
    type,
    label:
      type === "safe"
        ? "SAFE TO USE"
        : type === "warning"
        ? "NEEDS ATTENTION"
        : "UNSAFE WATER",

    short:
      type === "safe"
        ? "Normal"
        : type === "warning"
        ? "Warning"
        : "Critical",

    message:
      type === "safe"
        ? "Current parameters are within the monitored acceptable range."
        : type === "warning"
        ? "One or more parameters need attention. Review the alerts below."
        : "Critical water-quality conditions detected. Do not use until checked.",

    issues,
  };
}

/* =========================
   MAIN APP
========================= */

function App() {
  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [live, setLive] = useState(true);
  const [station, setStation] = useState(stations[0]);

  const [language, setLanguage] = useState("en");

  const [ph, setPh] = useState(7.2);
  const [tds, setTds] = useState(268);
  const [temp, setTemp] = useState(25.8);

  // NEW: Turbidity
  const [turbidity, setTurbidity] = useState(1.8);

  const [history, setHistory] = useState(initialHistory);
  const [dismissed, setDismissed] = useState([]);

  const [thresholds, setThresholds] = useState({
    phMin: 6.5,
    phMax: 8.5,
    tdsWarn: 300,
    tdsMax: 500,
    tempMax: 35,

    // NEW
    turbidityMax: 5,
  });

  const [backendOnline, setBackendOnline] = useState(false);
  const [dbStatus, setDbStatus] = useState("disconnected");
  const [lastSaved, setLastSaved] = useState(null);

  // Popup state
  const [popupAlert, setPopupAlert] = useState(null);
  // Remember which active alerts have already been shown as popups.
  // This prevents the same alert from opening again every 3 seconds
  // while the simulated value is still outside the threshold.
  const shownPopupAlerts = useRef(new Set());

  const t = translations[language];

  const quality = useMemo(
    () =>
      getStatus(
        ph,
        tds,
        temp,
        turbidity,
        thresholds
      ),
    [
      ph,
      tds,
      temp,
      turbidity,
      thresholds,
    ]
  );

  /* =========================
     API HEALTH + HISTORY
  ========================= */

  useEffect(() => {
    let cancelled = false;

    api
      .health()
      .then((health) => {
        if (!cancelled) {
          setBackendOnline(true);
          setDbStatus(
            health.database || "connected"
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBackendOnline(false);
        }
      });

    api
      .history(station, 12)
      .then((result) => {
        if (
          cancelled ||
          !result.readings?.length
        ) {
          return;
        }

        setHistory(
          result.readings.map((r) => ({
            time: new Date(
              r.createdAt
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),

            ph: Number(r.ph),

            tds: Math.round(r.tds),

            temp: Number(
              r.temperature
            ),

            // If backend already sends turbidity
            turbidity: Number(
              r.turbidity ?? 1.8
            ),
          }))
        );

        const latest =
          result.readings.at(-1);

        setPh(Number(latest.ph));
        setTds(
          Math.round(latest.tds)
        );
        setTemp(
          Number(latest.temperature)
        );

        setTurbidity(
          Number(
            latest.turbidity ?? 1.8
          )
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [station]);

  /* =========================
     LIVE SIMULATION + MONGODB SAVE
  ========================= */

  useEffect(() => {
    if (!live) return undefined;

    const timer = setInterval(() => {
      // Generate ONE complete virtual-sensor reading.
      // The same object is shown in the UI and saved to MongoDB,
      // so one simulation cycle creates exactly one database record.
      const nextReading = {
        station,
        ph: Number(
          Math.max(
            6.0,
            Math.min(
              9.0,
              ph + (Math.random() - 0.5) * 0.16
            )
          ).toFixed(2)
        ),
        tds: Math.round(
          Math.max(
            120,
            Math.min(
              650,
              tds + (Math.random() - 0.48) * 20
            )
          )
        ),
        temperature: Number(
          Math.max(
            20,
            Math.min(
              39,
              temp + (Math.random() - 0.5) * 0.35
            )
          ).toFixed(1)
        ),
        turbidity: Number(
          Math.max(
            0.2,
            Math.min(
              10,
              turbidity + (Math.random() - 0.45) * 0.5
            )
          ).toFixed(1)
        ),
        source: "simulation",
      };

      // Update dashboard from this exact reading.
      setPh(nextReading.ph);
      setTds(nextReading.tds);
      setTemp(nextReading.temperature);
      setTurbidity(nextReading.turbidity);

      const historyItem = {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ph: nextReading.ph,
        tds: nextReading.tds,
        temp: nextReading.temperature,
        turbidity: nextReading.turbidity,
      };

      // Update local history immediately for a responsive UI.
      setHistory((prev) => [
        ...prev.slice(-11),
        historyItem,
      ]);

      // Save exactly the same complete reading once to MongoDB.
      api
        .saveReading(nextReading)
        .then(() => {
          setBackendOnline(true);
          setDbStatus("connected");
          setLastSaved(new Date());
        })
        .catch(() => {
          setBackendOnline(false);
          setDbStatus("disconnected");
        });
    }, 3000);

    return () => clearInterval(timer);
  }, [live, station, ph, tds, temp, turbidity]);

  /* =========================
     ALERTS
  ========================= */

  const alerts = useMemo(() => {
    const list = [];

    if (ph < thresholds.phMin || ph > thresholds.phMax) {
      list.push({
        id: "ph",
        type: "danger",
        title: "pH outside safe range",
        text: `Current pH is ${ph.toFixed(1)}. Recommended range is ${thresholds.phMin}–${thresholds.phMax}.`,
        parameter: "pH",
        value: ph.toFixed(1),
        message: "pH level is outside the safe range.",
        healthRisks: [
          "Possible skin and eye irritation",
          "Possible stomach or gastrointestinal discomfort",
          "Prolonged exposure may cause irritation"
        ]
      });
    }

    if (tds > thresholds.tdsMax) {
      list.push({
        id: "tds-critical",
        type: "danger",
        title: "Critical TDS level",
        text: `TDS has reached ${Math.round(tds)} ppm, above the ${thresholds.tdsMax} ppm limit.`,
        parameter: "TDS",
        value: `${Math.round(tds)} ppm`,
        message: "Critical TDS level detected.",
        healthRisks: [
          "Long-term water-quality concern",
          "May affect taste and acceptability of water",
          "Very high dissolved solids may indicate poor water quality"
        ]
      });
    } else if (tds > thresholds.tdsWarn) {
      list.push({
        id: "tds-warning",
        type: "warning",
        title: "Elevated TDS detected",
        text: `TDS is ${Math.round(tds)} ppm. Consider checking the water source.`,
        parameter: "TDS",
        value: `${Math.round(tds)} ppm`,
        message: "Elevated TDS level detected.",
        healthRisks: [
          "Long-term water-quality concern",
          "May affect taste and acceptability of water"
        ]
      });
    }

    if (temp > thresholds.tempMax) {
      list.push({
        id: "temp",
        type: "warning",
        title: "High water temperature",
        text: `Temperature is ${temp.toFixed(1)}°C, above the ${thresholds.tempMax}°C monitoring threshold.`,
        parameter: "Temperature",
        value: `${temp.toFixed(1)}°C`,
        message: "High water temperature detected.",
        healthRisks: [
          "Higher temperature can support microbial growth",
          "May increase the risk of microbial contamination"
        ]
      });
    }

    if (turbidity > thresholds.turbidityMax) {
      list.push({
        id: "turbidity",
        type: "danger",
        title: "High Turbidity Detected",
        text: `Turbidity is ${turbidity.toFixed(1)} NTU. Water clarity is poor and the source should be checked.`,
        parameter: "Turbidity",
        value: `${turbidity.toFixed(1)} NTU`,
        message: "High turbidity detected.",
        healthRisks: [
          "Possible microbial contamination risk",
          "May increase the risk of diarrheal illness if pathogens are present",
          "Possible gastrointestinal infection risk",
          "Water should be tested or treated before consumption"
        ]
      });
    }

    return list.filter((a) => !dismissed.includes(a.id));
  }, [ph, tds, temp, turbidity, thresholds, dismissed]);

  /* =========================
     AUTOMATIC POPUP
  ========================= */

  useEffect(() => {
    const activeAlertIds = new Set(alerts.map((alert) => alert.id));

    // If an alert is no longer active, allow it to trigger a popup again
    // if the same condition happens later.
    shownPopupAlerts.current.forEach((id) => {
      if (!activeAlertIds.has(id)) {
        shownPopupAlerts.current.delete(id);
      }
    });

    // Show only one popup for each newly active alert.
    // A changing sensor value will NOT reopen the same popup repeatedly.
    const newDangerAlert = alerts.find(
      (alert) =>
        alert.type === "danger" &&
        !shownPopupAlerts.current.has(alert.id)
    );

    if (!newDangerAlert) return;

    shownPopupAlerts.current.add(newDangerAlert.id);
    setPopupAlert(newDangerAlert);
  }, [alerts]);

  /* =========================
     EXPORT CSV
  ========================= */

  const exportCsv = () => {
    const rows = [
      [
        "Time",
        "pH",
        "TDS (ppm)",
        "Temperature (°C)",
        "Turbidity (NTU)",
        "Quality Score",
      ],
    ];

    history.forEach((r) =>
      rows.push([
        r.time,
        r.ph,
        r.tds,
        r.temp,
        r.turbidity ?? "",
        getStatus(
          r.ph,
          r.tds,
          r.temp,
          r.turbidity ?? 1.8,
          thresholds
        ).score,
      ])
    );

    const csv = rows
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download = `aquashield-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`app ${
        dark ? "dark" : ""
      }`}
    >
      {/* =========================
          TOP BAR
      ========================= */}

      <header className="topbar">
        <button
          className="brand"
          onClick={() =>
            setPage("dashboard")
          }
        >
          <span className="brand-mark">
            💧
          </span>

          <span>
            <b>AquaShield</b>
            <small>
              Smart Water Monitoring
            </small>
          </span>
        </button>

        <nav>
          {[
            [
              "dashboard",
              "⌂",
              t.dashboard,
            ],
            [
              "history",
              "◷",
              t.history,
            ],
            [
              "alerts",
              "⚠",
              t.alerts,
            ],
            [
              "reports",
              "▤",
              t.reports,
            ],
            [
              "settings",
              "⚙",
              t.settings,
            ],
          ].map(
            ([
              id,
              icon,
              label,
            ]) => (
              <button
                key={id}
                className={
                  page === id
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  setPage(id)
                }
              >
                <span>{icon}</span>
                {label}

                {id === "alerts" &&
                  alerts.length >
                    0 && (
                    <em>
                      {
                        alerts.length
                      }
                    </em>
                  )}
              </button>
            )
          )}
        </nav>

        <div className="top-actions">
          {/* LANGUAGE */}
          <select
            value={language}
            onChange={(e) =>
              setLanguage(
                e.target.value
              )
            }
            title={t.language}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              border:
                "1px solid #d0d7de",
              background:
                "inherit",
              cursor: "pointer",
            }}
          >
            <option value="en">
              🇬🇧 English
            </option>

            <option value="hi">
              🇮🇳 हिंदी
            </option>

            <option value="mr">
              🇮🇳 मराठी
            </option>
          </select>

          <button
            className="icon-btn"
            onClick={() =>
              setDark(!dark)
            }
            title="Toggle dark mode"
          >
            {dark ? "☀" : "☾"}
          </button>

          <span
            className={`system ${
              backendOnline
                ? "backend-ok"
                : "backend-off"
            }`}
          >
            <i />

            {backendOnline
              ? `Database ${dbStatus}`
              : "Demo Mode • API Offline"}
          </span>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="container">
        {page === "dashboard" && (
          <Dashboard
            {...{
              ph,
              tds,
              temp,
              turbidity,
              quality,
              history,
              alerts,
              live,
              setLive,
              station,
              setStation,
              exportCsv,
              setPage,
              setDismissed,
              backendOnline,
              lastSaved,
              t,
            }}
          />
        )}

        {page === "history" && (
          <HistoryPage
            history={history}
            quality={quality}
            t={t}
          />
        )}

        {page === "alerts" && (
          <AlertsPage
            alerts={alerts}
            setDismissed={
              setDismissed
            }
            t={t}
          />
        )}

        {page === "reports" && (
          <ReportsPage
            history={history}
            exportCsv={exportCsv}
            station={station}
            t={t}
          />
        )}

        {page === "settings" && (
          <SettingsPage
            {...{
              thresholds,
              setThresholds,
              station,
              setStation,
              live,
              setLive,
              language,
              setLanguage,
              t,
            }}
          />
        )}
      </main>

      <footer>
        <b>AquaShield</b>

        <span>
          Full-stack IoT dashboard •
          MongoDB + API ready
        </span>

        <span>
          Last update:{" "}
          {new Date().toLocaleTimeString()}
        </span>
      </footer>

      {/* =========================
          ALERT POPUP
      ========================= */}

      {popupAlert && (
        <AlertPopup
          alert={popupAlert}
          onClose={() =>
            setPopupAlert(null)
          }
          t={t}
        />
      )}
    </div>
  );
}

/* =========================
   DASHBOARD
========================= */

function Dashboard({
  ph,
  tds,
  temp,
  turbidity,
  quality,
  history,
  alerts,
  live,
  setLive,
  station,
  setStation,
  exportCsv,
  setPage,
  setDismissed,
  backendOnline,
  lastSaved,
  t,
}) {
  return (
    <>
      <div className="page-head">
        <div>
          <p className="eyebrow">
            {t.dashboardTitle}
          </p>

          <h1>
            {getGreeting()}
          </h1>

          <p>
            {t.dashboardText}
          </p>
        </div>

        <div className="head-actions">
          <select
            value={station}
            onChange={(e) =>
              setStation(
                e.target.value
              )
            }
          >
            {stations.map((s) => (
              <option key={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            className="primary"
            onClick={exportCsv}
          >
            {t.export}
          </button>
        </div>
      </div>

      <div className="live-bar">
        <div className="live-copy">
          <i
            className={
              live
                ? "live-dot pulse"
                : "live-dot"
            }
          />

          <div>
            <b>
              {live
                ? t.live
                : t.paused}
            </b>

            <span>
              {backendOnline
                ? `Readings are being saved to MongoDB${
                    lastSaved
                      ? ` • Last saved ${lastSaved.toLocaleTimeString()}`
                      : ""
                  }`
                : live
                ? "Demo sensor values refresh every 3 seconds • API not connected"
                : "Resume to continue simulated sensor updates"}
            </span>
          </div>
        </div>

        <button
          className="toggle"
          onClick={() =>
            setLive(!live)
          }
        >
          {live
            ? t.pause
            : t.resume}
        </button>
      </div>

      {/* =========================
          METRICS
      ========================= */}

      <section className="metrics">
        <Metric
          title={t.ph}
          value={ph.toFixed(1)}
          unit="pH"
          icon="🧪"
          status={
            ph >= 6.5 &&
            ph <= 8.5
              ? t.normal
              : t.critical
          }
          type={
            ph >= 6.5 &&
            ph <= 8.5
              ? "safe"
              : "danger"
          }
          note="Recommended 6.5 – 8.5"
        />

        <Metric
          title={t.tds}
          value={Math.round(tds)}
          unit="ppm"
          icon="💧"
          status={
            tds <= 300
              ? t.good
              : tds <= 500
              ? t.elevated
              : t.critical
          }
          type={
            tds <= 300
              ? "safe"
              : tds <= 500
              ? "warning"
              : "danger"
          }
          note={t.dissolvedSolids}
        />

        <Metric
          title={t.temperature}
          value={temp.toFixed(1)}
          unit="°C"
          icon="🌡️"
          status={
            temp <= 35
              ? t.normal
              : t.high
          }
          type={
            temp <= 35
              ? "safe"
              : "danger"
          }
          note={t.waterTemperature}
        />

        {/* NEW TURBIDITY CARD */}
        <Metric
          title={t.turbidity}
          value={turbidity.toFixed(1)}
          unit="NTU"
          icon="🌊"
          status={
            turbidity <= 5
              ? t.normal
              : t.critical
          }
          type={
            turbidity <= 5
              ? "safe"
              : "danger"
          }
          note={t.waterClarity}
        />

        <Metric
          title={t.qualityScore}
          value={quality.score}
          unit="/100"
          icon="✓"
          status={
            quality.short
          }
          type={
            quality.type
          }
          note={t.combinedScore}
        />
      </section>

      <section
        className={`quality-banner ${quality.type}`}
      >
        <div className="quality-icon">
          {quality.type ===
          "safe"
            ? "✓"
            : quality.type ===
              "warning"
            ? "!"
            : "×"}
        </div>

        <div className="quality-text">
          <span>
            {t.overallQuality}
          </span>

          <h2>
            {quality.label ===
            "SAFE TO USE"
              ? t.safeToUse
              : quality.label ===
                "NEEDS ATTENTION"
              ? t.needsAttention
              : t.unsafeWater}
          </h2>

          <p>
            {quality.message}
          </p>
        </div>

        <div className="score">
          <strong>
            {quality.score}
          </strong>

          <span>/100</span>

          <div className="score-track">
            <i
              style={{
                width: `${quality.score}%`,
              }}
            />
          </div>
        </div>
      </section>

      <div className="grid-2">
        <section className="panel">
          <PanelHead
            title={t.phTrend}
            subtitle={
              t.recentReadings
            }
            action={
              t.viewHistory
            }
            onClick={() =>
              setPage("history")
            }
          />

          <LineChart
            data={history}
            dataKey="ph"
            min={6}
            max={9}
          />
        </section>

        <section className="panel">
          <PanelHead
            title={t.parameterHealth}
            subtitle={
              t.currentReading
            }
          />

          <HealthRow
            label="pH"
            value={ph.toFixed(1)}
            range="6.5 – 8.5"
            pct={Math.min(
              100,
              Math.max(
                0,
                ((ph - 5) / 5) *
                  100
              )
            )}
            type={
              ph >= 6.5 &&
              ph <= 8.5
                ? "safe"
                : "danger"
            }
          />

          <HealthRow
            label="TDS"
            value={`${Math.round(
              tds
            )} ppm`}
            range="≤ 300 preferred"
            pct={Math.min(
              100,
              (tds / 600) *
                100
            )}
            type={
              tds <= 300
                ? "safe"
                : tds <= 500
                ? "warning"
                : "danger"
            }
          />

          <HealthRow
            label={t.turbidity}
            value={`${turbidity.toFixed(
              1
            )} NTU`}
            range="≤ 5 NTU"
            pct={Math.min(
              100,
              (turbidity / 10) *
                100
            )}
            type={
              turbidity <= 5
                ? "safe"
                : "danger"
            }
          />

          <HealthRow
            label={t.temperature}
            value={`${temp.toFixed(
              1
            )}°C`}
            range="≤ 35°C"
            pct={Math.min(
              100,
              (temp / 40) *
                100
            )}
            type={
              temp <= 35
                ? "safe"
                : "danger"
            }
          />
        </section>
      </div>

      <div className="grid-2 lower">
        <section className="panel">
          <PanelHead
            title={t.recentAlerts}
            subtitle={
              alerts.length
                ? `${alerts.length} active alert${
                    alerts.length >
                    1
                      ? "s"
                      : ""
                  }`
                : t.everythingNormal
            }
            action={t.viewAll}
            onClick={() =>
              setPage("alerts")
            }
          />

          {alerts.length ===
          0 ? (
            <Empty
              text={t.noAlerts}
            />
          ) : (
            alerts
              .slice(0, 3)
              .map((a) => (
                <Alert
                  key={a.id}
                  alert={a}
                  onDismiss={() =>
                    setDismissed(
                      (d) => [
                        ...d,
                        a.id,
                      ]
                    )
                  }
                />
              ))
          )}
        </section>

        <section className="panel station-panel">
          <PanelHead
            title={
              t.monitoringStation
            }
            subtitle={
              t.deviceReadiness
            }
          />

          <div className="station-card">
            <div className="station-avatar">
              📡
            </div>

            <div>
              <b>{station}</b>
              <span>
                Community water
                source
              </span>
            </div>

            <strong>
              <i />{" "}
              {t.connected}
            </strong>
          </div>

          <div className="device-row">
            <span>
              Virtual Sensors
            </span>
            <b>Active</b>
          </div>

          <div className="device-row">
            <span>
              pH sensor
            </span>
            <b>
              Simulated / Active
            </b>
          </div>

          <div className="device-row">
            <span>
              TDS sensor
            </span>
            <b>
              Simulated / Active
            </b>
          </div>

          <div className="device-row">
            <span>
              Turbidity sensor
            </span>
            <b>
              Simulated / Active
            </b>
          </div>

          <div className="device-row">
            <span>
              Temperature
            </span>
            <b>
              Simulated / Active
            </b>
          </div>
        </section>
      </div>
    </>
  );
}

/* =========================
   METRIC
========================= */

function Metric({
  title,
  value,
  unit,
  icon,
  status,
  type,
  note,
}) {
  return (
    <article className="metric">
      <div className="metric-top">
        <span className="metric-icon">
          {icon}
        </span>

        <span
          className={`pill ${type}`}
        >
          <i />
          {status}
        </span>
      </div>

      <p>{title}</p>

      <h2>
        {value}
        <small>{unit}</small>
      </h2>

      <span className="note">
        {note}
      </span>

      <div
        className={`mini ${type}`}
      />
    </article>
  );
}

/* =========================
   EMPTY STATE
========================= */

function Empty({ text }) {
  return (
    <div
      style={{
        padding: "28px 16px",
        textAlign: "center",
        opacity: 0.7,
        fontSize: "14px",
      }}
    >
      {text}
    </div>
  );
}

/* =========================
   PANEL HEADER
========================= */

function PanelHead({
  title,
  subtitle,
  action,
  onClick,
}) {
  return (
    <div className="panel-head">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      {action && (
        <button
          onClick={onClick}
        >
          {action} →
        </button>
      )}
    </div>
  );
}

/* =========================
   CHART
========================= */

function LineChart({
  data,
  dataKey,
  min,
  max,
}) {
  const w = 700;
  const h = 235;

  const pad = {
    l: 38,
    r: 12,
    t: 15,
    b: 30,
  };

  const pts = data
    .map((d, i) => {
      const x =
        pad.l +
        (i /
          Math.max(
            1,
            data.length - 1
          )) *
          (w -
            pad.l -
            pad.r);

      const y =
        pad.t +
        (1 -
          (d[dataKey] - min) /
            (max - min)) *
          (h -
            pad.t -
            pad.b);

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="chart"
      >
        <rect
          x={pad.l}
          y={
            pad.t +
            0.3 *
              (h -
                pad.t -
                pad.b)
          }
          width={
            w -
            pad.l -
            pad.r
          }
          height={
            0.4 *
            (h -
              pad.t -
              pad.b)
          }
          className="safe-zone"
        />

        {[min, (min + max) / 2, max].map(
          (v) => {
            const y =
              pad.t +
              (1 -
                (v - min) /
                  (max - min)) *
                (h -
                  pad.t -
                  pad.b);

            return (
              <g key={v}>
                <line
                  x1={pad.l}
                  x2={
                    w -
                    pad.r
                  }
                  y1={y}
                  y2={y}
                  className="gridline"
                />

                <text
                  x="4"
                  y={y + 3}
                  className="axis"
                >
                  {v}
                </text>
              </g>
            );
          }
        )}

        <polyline
          points={pts}
          className="chart-line"
        />

        {data.map(
          (d, i) => {
            const [x, y] =
              pts
                .split(" ")
                [i].split(
                  ","
                );

            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3.5"
                className="point"
              />
            );
          }
        )}
      </svg>

      <div className="chart-times">
        <span>
          {data[0]?.time}
        </span>

        <span>
          {
            data[
              Math.floor(
                data.length /
                  2
              )
            ]?.time
          }
        </span>

        <span>
          {
            data[
              data.length - 1
            ]?.time
          }
        </span>
      </div>
    </div>
  );
}

/* =========================
   HEALTH ROW
========================= */

function HealthRow({
  label,
  value,
  range,
  pct,
  type,
}) {
  return (
    <div className="health-row">
      <div>
        <b>{label}</b>
        <span>{range}</span>
      </div>

      <strong
        className={type}
      >
        {value}
      </strong>

      <div className="health-track">
        <i
          className={type}
          style={{
            width: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================
   ALERT
========================= */

function Alert({
  alert,
  onDismiss,
}) {
  return (
    <div
      className={`alert ${alert.type}`}
    >
      <span className="alert-symbol">
        {alert.type ===
        "danger"
          ? "!"
          : "⚠"}
      </span>

      <div>
        <b>{alert.title}</b>
        <p>{alert.text}</p>
      </div>

      <button
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
}

/* =========================
   POPUP
========================= */

function AlertPopup({ alert, onClose, t }) {
  if (!alert) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "min(500px, 100%)",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--card, #ffffff)",
          borderRadius: "18px",
          padding: "28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          border: alert.type === "danger" ? "2px solid #ef4444" : "2px solid #f59e0b",
          animation: "popupIn 0.25s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: alert.type === "danger" ? "#fee2e2" : "#fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
            }}
          >
            {alert.type === "danger" ? "🚨" : "⚠️"}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "22px" }}>{t.popupTitle}</h2>
            <span style={{ fontSize: "13px", opacity: 0.7 }}>
              AquaShield Monitoring • {alert.parameter}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close alert"
            style={{ border: "none", background: "transparent", fontSize: "24px", cursor: "pointer", opacity: 0.7 }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: alert.type === "danger" ? "#fef2f2" : "#fffbeb",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "18px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "8px", color: alert.type === "danger" ? "#dc2626" : "#d97706" }}>
            {alert.title}
          </h3>
          <p style={{ margin: 0, lineHeight: 1.6 }}>{alert.text}</p>
          {alert.value && (
            <p style={{ margin: "10px 0 0", fontWeight: 700 }}>
              Detected value: {alert.value}
            </p>
          )}
        </div>

        {alert.healthRisks?.length > 0 && (
          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "18px",
            }}
          >
            <h3 style={{ margin: "0 0 8px", color: "#c2410c", fontSize: "17px" }}>
              🩺 Possible Health Risks
            </h3>
            <p style={{ margin: "0 0 10px", lineHeight: 1.6, fontSize: "14px" }}>
              Drinking untreated water with this condition may increase the risk of:
            </p>
            <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.7 }}>
              {alert.healthRisks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          style={{
            background: "var(--muted, #f8fafc)",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "18px",
            fontSize: "13px",
            lineHeight: 1.6,
          }}
        >
          ⚠️ <strong>Safety Warning:</strong> This is an early water-quality warning, not a medical diagnosis. Test or treat the water before consumption.
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "9px", border: "1px solid #d1d5db", background: "transparent", cursor: "pointer" }}
          >
            {t.close}
          </button>
          <button
            onClick={onClose}
            style={{ padding: "10px 20px", borderRadius: "9px", border: "none", background: alert.type === "danger" ? "#dc2626" : "#d97706", color: "white", cursor: "pointer", fontWeight: 600 }}
          >
            {t.acknowledge}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   HISTORY PAGE
========================= */

function HistoryPage({
  history,
  quality,
  t,
}) {
  return (
    <>
      <PageTitle
        eyebrow={t.analytics}
        title={
          t.sensorHistory
        }
        text={
          t.reviewMeasurements
        }
      />

      <div className="history-cards">
        <MiniStat
          label={t.latestPh}
          value={history
            .at(-1)
            ?.ph.toFixed(1)}
        />

        <MiniStat
          label={t.latestTds}
          value={`${history.at(-1)?.tds} ppm`}
        />

        <MiniStat
          label={t.latestTemp}
          value={`${history.at(-1)?.temp}°C`}
        />

        <MiniStat
          label={t.latestTurbidity}
          value={`${history
            .at(-1)
            ?.turbidity?.toFixed(
              1
            )} NTU`}
        />

        <MiniStat
          label={t.currentScore}
          value={`${quality.score}/100`}
        />
      </div>

      <section className="panel">
        <PanelHead
          title={t.phTrend}
          subtitle={
            "Last 12 readings"
          }
        />

        <LineChart
          data={history}
          dataKey="ph"
          min={6}
          max={9}
        />
      </section>

      <section className="panel table-panel">
        <PanelHead
          title={t.readingLog}
          subtitle={
            t.latestFirst
          }
        />

        <table>
          <thead>
            <tr>
              <th>{t.time}</th>
              <th>pH</th>
              <th>TDS</th>
              <th>
                Temperature
              </th>
              <th>
                Turbidity
              </th>
              <th>
                {t.score}
              </th>
              <th>
                {t.status}
              </th>
            </tr>
          </thead>

          <tbody>
            {[...history]
              .reverse()
              .map((r, i) => {
                const q =
                  getStatus(
                    r.ph,
                    r.tds,
                    r.temp,
                    r.turbidity ??
                      1.8,
                    {
                      phMin: 6.5,
                      phMax: 8.5,
                      tdsWarn: 300,
                      tdsMax: 500,
                      tempMax: 35,
                      turbidityMax: 5,
                    }
                  );

                return (
                  <tr
                    key={`${r.time}-${i}`}
                  >
                    <td>
                      {r.time}
                    </td>

                    <td>
                      {r.ph.toFixed(
                        2
                      )}
                    </td>

                    <td>
                      {r.tds} ppm
                    </td>

                    <td>
                      {r.temp}°C
                    </td>

                    <td>
                      {(
                        r.turbidity ??
                        1.8
                      ).toFixed(
                        1
                      )}{" "}
                      NTU
                    </td>

                    <td>
                      <b>
                        {q.score}
                      </b>
                      /100
                    </td>

                    <td>
                      <span
                        className={`table-status ${q.type}`}
                      >
                        {q.short}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </section>
    </>
  );
}

/* =========================
   MINI STAT
========================= */

function MiniStat({
  label,
  value,
}) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

/* =========================
   ALERT PAGE
========================= */

function AlertsPage({
  alerts,
  setDismissed,
  t,
}) {
  return (
    <>
      <PageTitle
        eyebrow={t.safetyCenter}
        title={
          t.alertsWarnings
        }
        text={
          t.thresholdNotifications
        }
      />

      <section className="panel">
        {alerts.length ===
        0 ? (
          <Empty
            text={t.noAlerts}
          />
        ) : (
          alerts.map((a) => (
            <Alert
              key={a.id}
              alert={a}
              onDismiss={() =>
                setDismissed(
                  (d) => [
                    ...d,
                    a.id,
                  ]
                )
              }
            />
          ))
        )}
      </section>

      <div className="info-box">
        <b>
          {t.howAlertsWork}
        </b>

        <span>
          {t.alertInfo}
        </span>
      </div>
    </>
  );
}

/* =========================
   REPORT PAGE
========================= */

function ReportsPage({
  history,
  exportCsv,
  station,
  t,
}) {
  return (
    <>
      <PageTitle
        eyebrow={t.reporting}
        title={
          t.waterReports
        }
        text={
          t.reportText
        }
      />

      <section className="report-hero">
        <div>
          <span>
            {t.currentStation}
          </span>

          <h2>{station}</h2>

          <p>
            {history.length}{" "}
            {t.readingsAvailable}
          </p>
        </div>

        <button
          className="primary"
          onClick={exportCsv}
        >
          {t.downloadReport}
        </button>
      </section>

      <div className="grid-2">
        <section className="panel">
          <PanelHead
            title={
              t.reportContents
            }
            subtitle={
              t.includedAutomatically
            }
          />

          {[
            t.timestamped,
            t.sensorParameters,
            t.calculatedScore,
            t.stationInfo,
          ].map((x) => (
            <div
              className="check-row"
              key={x}
            >
              ✓{" "}
              <span>{x}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <PanelHead
            title={
              t.hardwareReady
            }
            subtitle={
              t.nextIntegration
            }
          />

          <p className="report-copy">
            AquaShield is
            currently running in
            Simulation Mode.
            Virtual pH, TDS,
            temperature and
            turbidity sensors
            generate readings
            every 3 seconds.
            Each complete
            reading is sent
            through the API and
            stored in MongoDB.
          </p>
        </section>
      </div>
    </>
  );
}

/* =========================
   SETTINGS PAGE
========================= */

function SettingsPage({
  thresholds,
  setThresholds,
  station,
  setStation,
  live,
  setLive,
  language,
  setLanguage,
  t,
}) {
  const update = (
    key,
    val
  ) =>
    setThresholds({
      ...thresholds,
      [key]: Number(val),
    });

  return (
    <>
      <PageTitle
        eyebrow="SYSTEM CONFIGURATION"
        title={t.settingsTitle}
        text={
          t.settingsText
        }
      />

      <div className="grid-2">
        <section className="panel settings">
          <PanelHead
            title={t.monitoring}
            subtitle={
              t.dashboardBehaviour
            }
          />

          <label>
            {t.monitoringStation}

            <select
              value={station}
              onChange={(e) =>
                setStation(
                  e.target.value
                )
              }
            >
              {stations.map(
                (s) => (
                  <option
                    key={s}
                  >
                    {s}
                  </option>
                )
              )}
            </select>
          </label>

          {/* LANGUAGE SETTING */}

          <label
            style={{
              marginTop:
                "15px",
            }}
          >
            {t.language}

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value
                )
              }
            >
              <option value="en">
                {t.english}
              </option>

              <option value="hi">
                {t.hindi}
              </option>

              <option value="mr">
                {t.marathi}
              </option>
            </select>
          </label>

          <div className="setting-toggle">
            <div>
              <b>
                {t.liveSimulation}
              </b>

              <span>
                {
                  t.liveSimulationText
                }
              </span>
            </div>

            <button
              className={
                live
                  ? "switch on"
                  : "switch"
              }
              onClick={() =>
                setLive(!live)
              }
            >
              <i />
            </button>
          </div>
        </section>

        <section className="panel settings">
          <PanelHead
            title={
              t.alertThresholds
            }
            subtitle={
              t.frontendEngine
            }
          />

          <Threshold
            label={t.phMinimum}
            value={
              thresholds.phMin
            }
            onChange={(v) =>
              update(
                "phMin",
                v
              )
            }
            step=".1"
          />

          <Threshold
            label={t.phMaximum}
            value={
              thresholds.phMax
            }
            onChange={(v) =>
              update(
                "phMax",
                v
              )
            }
            step=".1"
          />

          <Threshold
            label={t.tdsWarning}
            value={
              thresholds.tdsWarn
            }
            onChange={(v) =>
              update(
                "tdsWarn",
                v
              )
            }
            step="10"
          />

          <Threshold
            label={t.tdsCritical}
            value={
              thresholds.tdsMax
            }
            onChange={(v) =>
              update(
                "tdsMax",
                v
              )
            }
            step="10"
          />

          <Threshold
            label={t.tempMaximum}
            value={
              thresholds.tempMax
            }
            onChange={(v) =>
              update(
                "tempMax",
                v
              )
            }
            step=".5"
          />

          {/* NEW TURBIDITY THRESHOLD */}

          <Threshold
            label={
              t.turbidityMaximum
            }
            value={
              thresholds.turbidityMax
            }
            onChange={(v) =>
              update(
                "turbidityMax",
                v
              )
            }
            step=".1"
          />
        </section>
      </div>

      <div className="info-box">
        <b>
          {t.hardwareNote}
        </b>

        <span>
          These are
          frontend/demo
          thresholds. For
          production
          deployment,
          calibrate pH,
          TDS and
          turbidity sensors
          and validate
          limits against
          your applicable
          water-quality
          standard.
        </span>
      </div>
    </>
  );
}

/* =========================
   THRESHOLD
========================= */

function Threshold({
  label,
  value,
  onChange,
  step,
}) {
  return (
    <label className="threshold">
      <span>{label}</span>

      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </label>
  );
}

/* =========================
   PAGE TITLE
========================= */

function PageTitle({
  eyebrow,
  title,
  text,
}) {
  return (
    <div className="page-title">
      <p className="eyebrow">
        {eyebrow}
      </p>

      <h1>{title}</h1>

      <p>{text}</p>
    </div>
  );
}

export default App;