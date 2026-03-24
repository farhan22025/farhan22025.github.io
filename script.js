const typingTarget = document.getElementById("typing-text");
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
const revealItems = [...document.querySelectorAll(".reveal")];
const skillItems = [...document.querySelectorAll(".skill-item")];
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const yearTarget = document.getElementById("current-year");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

const time24Target = document.getElementById("time-24");
const time12Target = document.getElementById("time-12");
const footerTimeTarget = document.getElementById("footer-time");
const mapFallbackNote = document.getElementById("map-fallback-note");

const chatbotTeaser = document.getElementById("chatbot-teaser");
const chatbotLauncher = document.getElementById("chatbot-launcher");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotSuggestions = document.getElementById("chatbot-suggestions");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMeta = document.getElementById("chatbot-meta");
const chatbotStatusTarget = document.getElementById("chatbot-status");

const typingPhrases = [
  "scalable data-ready systems.",
  "backend workflows with structure.",
  "clean foundations for analytics.",
  "data-driven backend products."
];

const themeMetaColors = {
  dark: "#071520",
  light: "#edf8fb"
};

const sectionLabels = {
  "#home": "Open Home",
  "#about": "Open About",
  "#skills": "Open Skills",
  "#workspace": "Open Workspace",
  "#projects": "Open Projects",
  "#writings": "Open Writings",
  "#activities": "Open Activities",
  "#education": "Open Education",
  "#map-section": "Open Map",
  "#contact": "Open Hire Me"
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "can",
  "do",
  "does",
  "for",
  "from",
  "has",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "tell",
  "that",
  "the",
  "this",
  "to",
  "what",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your"
]);

const chatbotTextAliasRules = [
  [/\bassalamu alaikum\b/g, " hello "],
  [/\bassalamualaikum\b/g, " hello "],
  [/\bsalaam\b/g, " hello "],
  [/\bhi there\b/g, " hello "],
  [/\bhey there\b/g, " hello "],
  [/\bhello there\b/g, " hello "],
  [/\be-mail\b/g, " email "],
  [/\bmail\b/g, " email "],
  [/\bcv\b/g, " resume "],
  [/\bphone number\b/g, " phone "],
  [/\bmobile number\b/g, " phone "],
  [/\bcontact number\b/g, " phone "],
  [/\bcontact details?\b/g, " contact "],
  [/\bgithub profile\b/g, " github "],
  [/\bsource code\b/g, " github site source "],
  [/\bsite source\b/g, " github site source "],
  [/\bresearch papers?\b/g, " writings research papers "],
  [/\bwriteups?\b/g, " writings research "],
  [/\bclubs?\b/g, " activities club "],
  [/\bcommunities\b/g, " activities community "],
  [/\bwhat can you do\b/g, " help "],
  [/\bhow can you help\b/g, " help "],
  [/\bwhat can i ask\b/g, " help "],
  [/\bhow do i reach\b/g, " contact "],
  [/\bhow can i reach\b/g, " contact "],
  [/\bhow do i contact\b/g, " contact "],
  [/\bhow can i contact\b/g, " contact "],
  [/\bhow do i hire\b/g, " hire contact "],
  [/\bhow can i hire\b/g, " hire contact "],
  [/\b(?:his|him|he|your)\b/g, " farhan "]
];

const chatbotGreetingPhrases = [
  "hi",
  "hello",
  "hey",
  "good morning",
  "good afternoon",
  "good evening"
];

const chatbotHelpPhrases = [
  "help",
  "what can you do",
  "how can you help",
  "what can i ask"
];

const chatbotThanksPhrases = [
  "thanks",
  "thank you",
  "thankyou",
  "thx",
  "appreciate it"
];

const chatbotFarewellPhrases = [
  "bye",
  "goodbye",
  "see you",
  "talk later"
];

let typingPhraseIndex = 0;
let typingCharacterIndex = 0;
let typingDeleting = false;

const mapState = {
  instance: null,
  tileLayer: null,
  retryTimer: null,
  attempts: 0,
  maxAttempts: 14,
  resizeBound: false
};

const chatbotState = {
  config: null,
  initialized: false,
  greeted: false,
  open: false,
  lastIntent: null,
  typingTimer: null,
  teaserTimer: null
};

const dhakaTime24Formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

const dhakaTime12Formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true
});

function normalizeText(text) {
  let normalized = String(text || "")
    .toLowerCase()
    .replace(/['’]/g, "");

  chatbotTextAliasRules.forEach(([pattern, replacement]) => {
    normalized = normalized.replace(pattern, replacement);
  });

  return normalized.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenizeText(text) {
  return normalizeText(text)
    .split(" ")
    .filter(Boolean)
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

function uniqueValues(values) {
  return [...new Set(values.filter(Boolean))];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesPhrase(queryNormalized, phrase) {
  if (!queryNormalized || !phrase) {
    return false;
  }

  const normalizedPhrase = normalizeText(phrase);

  if (!normalizedPhrase) {
    return false;
  }

  if (queryNormalized === normalizedPhrase) {
    return true;
  }

  return new RegExp(`(^|\\s)${escapeRegExp(normalizedPhrase)}($|\\s)`).test(queryNormalized);
}

function includesAnyPhrase(queryNormalized, phrases) {
  return phrases.some((phrase) => includesPhrase(queryNormalized, normalizeText(phrase)));
}

function includesAnyToken(queryTokens, candidates) {
  return candidates.some((candidate) => queryTokens.includes(candidate));
}

function includesAllTokens(queryTokens, candidates) {
  return candidates.every((candidate) => queryTokens.includes(candidate));
}

function getChatbotIntentById(intentId) {
  return chatbotState.config?.intents.find((intent) => intent.id === intentId) || null;
}

function getChatbotLinkSet() {
  const config = chatbotState.config || {};
  const resumeUrl = config.resumeUrl || "assets/farhan-cv-resume.pdf";
  const githubUrl = config.githubUrl || "https://github.com/farhan22025";
  const siteSourceUrl = config.siteSourceUrl || githubUrl;
  const facebookUrl = config.facebookUrl || "https://www.facebook.com/share/171d7mt7rZ/";
  const whatsappUrl =
    config.whatsappUrl ||
    "https://wa.me/8801610772313?text=Hi%20Farhan%2C%20I%20visited%20your%20portfolio%20and%20wanted%20to%20connect.";

  return {
    about: { label: "Open About", href: "#about" },
    skills: { label: "Open Skills", href: "#skills" },
    projects: { label: "Open Projects", href: "#projects" },
    writings: { label: "Open Writings", href: "#writings" },
    activities: { label: "Open Activities", href: "#activities" },
    education: { label: "Open Education", href: "#education" },
    map: { label: "Open Map", href: "#map-section" },
    hire: { label: "Open Hire Me", href: "#contact" },
    resume: { label: "Open Resume", href: resumeUrl },
    github: { label: "Open GitHub", href: githubUrl },
    siteSource: { label: "Open Site Source", href: siteSourceUrl },
    facebook: { label: "Open Facebook", href: facebookUrl },
    whatsapp: { label: "Open WhatsApp", href: whatsappUrl }
  };
}

function createChatbotResponse(answer, links = [], quickReplies = null, intentId = null) {
  return {
    answer,
    links,
    intentId,
    quickReplies:
      Array.isArray(quickReplies) && quickReplies.length
        ? quickReplies
        : chatbotState.config?.quickReplies || []
  };
}

function createIntentResponse(intentId) {
  const intent = getChatbotIntentById(intentId);

  if (!intent) {
    return null;
  }

  return createChatbotResponse(
    intent.answer,
    intent.links || [],
    intent.quickReplies || chatbotState.config.quickReplies,
    intent.id || intentId
  );
}

function typeLoop() {
  if (!typingTarget) {
    return;
  }

  const currentPhrase = typingPhrases[typingPhraseIndex];
  const speed = typingDeleting ? 45 : 90;
  typingTarget.textContent = currentPhrase.slice(0, typingCharacterIndex);

  if (!typingDeleting && typingCharacterIndex < currentPhrase.length) {
    typingCharacterIndex += 1;
    window.setTimeout(typeLoop, speed);
    return;
  }

  if (typingDeleting && typingCharacterIndex > 0) {
    typingCharacterIndex -= 1;
    window.setTimeout(typeLoop, 35);
    return;
  }

  if (!typingDeleting) {
    typingDeleting = true;
    window.setTimeout(typeLoop, 1350);
    return;
  }

  typingDeleting = false;
  typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
  window.setTimeout(typeLoop, 240);
}

function updateThemeMeta(theme) {
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", themeMetaColors[theme] || themeMetaColors.dark);
  }
}

function updateThemeToggle(theme) {
  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector(".theme-toggle__icon");
  const label = themeToggle.querySelector(".theme-toggle__label");
  const isDark = theme === "dark";

  if (icon) {
    icon.textContent = isDark ? "\u263e" : "\u2600";
  }

  if (label) {
    label.textContent = isDark ? "Dark" : "Light";
  }

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
  themeToggle.setAttribute("aria-pressed", String(!isDark));
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("farhan-theme", theme);
  updateThemeToggle(theme);
  updateThemeMeta(theme);
  refreshMapTiles();
}

function toggleMobileMenu(forceClose = false) {
  if (!navMenu || !navToggle) {
    return;
  }

  const shouldOpen = forceClose ? false : !navMenu.classList.contains("is-open");
  navMenu.classList.toggle("is-open", shouldOpen);
  navToggle.setAttribute("aria-expanded", String(shouldOpen));
}

function navigateToHash(hash) {
  const target = document.querySelector(hash);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
}

function bindInPageLinks() {
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) {
        return;
      }

      event.preventDefault();
      toggleMobileMenu(true);
      navigateToHash(href);
    });
  });
}

function setActiveSection() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const scrollPosition = window.scrollY + 160;
  let activeId = sections[0]?.id || "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`);
  });
}

function revealEntry(entry, observer) {
  if (!entry.isIntersecting) {
    return;
  }

  entry.target.classList.add("is-visible");
  observer.unobserve(entry.target);
}

function animateSkillBar(entry, observer) {
  if (!entry.isIntersecting) {
    return;
  }

  const fill = entry.target.querySelector(".skill-fill");
  const progress = `${entry.target.dataset.progress || 0}%`;

  if (fill) {
    fill.style.width = progress;
  }

  observer.unobserve(entry.target);
}

function initRevealAnimations() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    skillItems.forEach((item) => {
      const fill = item.querySelector(".skill-fill");
      if (fill) {
        fill.style.width = `${item.dataset.progress || 0}%`;
      }
    });
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => revealEntry(entry, observer));
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => animateSkillBar(entry, observer));
  }, {
    threshold: 0.35
  });

  skillItems.forEach((item) => skillObserver.observe(item));
}

function updateDhakaClock() {
  const now = new Date();
  const time24 = dhakaTime24Formatter.format(now);
  const time12 = dhakaTime12Formatter.format(now);

  if (time24Target) {
    time24Target.textContent = time24;
  }

  if (time12Target) {
    time12Target.textContent = time12;
  }

  if (footerTimeTarget) {
    footerTimeTarget.textContent = `Dhaka time: ${time24} | ${time12}`;
  }
}

function initClock() {
  updateDhakaClock();
  window.setInterval(updateDhakaClock, 1000);
}

function updateMapFallback(message, isError = false) {
  if (!mapFallbackNote) {
    return;
  }

  mapFallbackNote.textContent = message;
  mapFallbackNote.classList.toggle("is-error", isError);
}

function buildMarker(variant) {
  return window.L.divIcon({
    className: "",
    html: `<span class="map-marker map-marker--${variant}" aria-hidden="true"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -12]
  });
}

function getTileConfig() {
  const theme = document.documentElement.dataset.theme || "dark";

  return {
    url:
      theme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  };
}

function refreshMapTiles() {
  if (!mapState.instance || !window.L) {
    return;
  }

  if (mapState.tileLayer) {
    mapState.instance.removeLayer(mapState.tileLayer);
  }

  const tileConfig = getTileConfig();
  mapState.tileLayer = window.L.tileLayer(tileConfig.url, {
    attribution: tileConfig.attribution,
    maxZoom: 18
  }).addTo(mapState.instance);
}

function initMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement || !window.L) {
    return false;
  }

  if (mapState.instance) {
    mapState.instance.invalidateSize();
    updateMapFallback("Interactive map ready. You can also use the quick links if you prefer.");
    return true;
  }

  try {
    const dhaka = [23.8103, 90.4125];
    const diuAshulia = [23.8761, 90.3208];

    mapState.instance = window.L.map(mapElement, {
      zoomControl: false,
      scrollWheelZoom: false,
      preferCanvas: true
    });

    refreshMapTiles();

    window.L.marker(dhaka, { icon: buildMarker("home") })
      .addTo(mapState.instance)
      .bindPopup("<strong>Dhaka, Bangladesh</strong><br>Current location");

    window.L.marker(diuAshulia, { icon: buildMarker("campus") })
      .addTo(mapState.instance)
      .bindPopup("<strong>Daffodil International University</strong><br>Ashulia study location");

    window.L.polyline([dhaka, diuAshulia], {
      color: "#40d3c8",
      weight: 3,
      opacity: 0.75,
      dashArray: "10 10"
    }).addTo(mapState.instance);

    mapState.instance.fitBounds(window.L.latLngBounds([dhaka, diuAshulia]).pad(0.45));
    window.L.control.zoom({ position: "bottomright" }).addTo(mapState.instance);

    if (!mapState.resizeBound) {
      window.addEventListener("resize", () => {
        if (mapState.instance) {
          mapState.instance.invalidateSize();
        }
      });
      mapState.resizeBound = true;
    }

    updateMapFallback("Interactive map ready. Use the quick links if you want Google Maps.");
    return true;
  } catch (error) {
    updateMapFallback(
      "Interactive map is temporarily unavailable. Use the Dhaka and DIU quick links for direct access.",
      true
    );
    return false;
  }
}

function ensureMap() {
  if (mapState.instance) {
    if (mapState.retryTimer) {
      window.clearTimeout(mapState.retryTimer);
      mapState.retryTimer = null;
    }

    mapState.instance.invalidateSize();
    return;
  }

  if (initMap()) {
    mapState.attempts = 0;
    return;
  }

  mapState.attempts += 1;

  if (mapState.attempts >= mapState.maxAttempts) {
    updateMapFallback(
      "Interactive map could not load right now. The Dhaka and DIU quick links still work.",
      true
    );
    return;
  }

  if (mapState.retryTimer) {
    window.clearTimeout(mapState.retryTimer);
  }

  updateMapFallback("Loading interactive map. If it delays, the Dhaka and DIU quick links still work.");
  mapState.retryTimer = window.setTimeout(ensureMap, 800);
}

function initForm() {
  if (!form || !formStatus) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(form).get("name") || "there";
    formStatus.textContent = `Thanks, ${name}. This form is a frontend demo, so the fastest real contact route is email or WhatsApp from the Hire Me section.`;
    form.reset();
  });
}

function getDefaultChatbotConfig() {
  return {
    assistantName: "Farhan Portfolio Assistant",
    assistantStatus: "Ready for portfolio questions",
    ownerName: "Farhan Alam",
    contactEmail: "alam22205341122@diu.edu.bd",
    secondaryEmail: "f05076963@gmail.com",
    phone: "+8801610772313",
    resumeUrl: "assets/farhan-cv-resume.pdf",
    githubUrl: "https://github.com/farhan22025",
    siteSourceUrl: "https://github.com/farhan22025/farhan22025.github.io",
    facebookUrl: "https://www.facebook.com/share/171d7mt7rZ/",
    whatsappUrl:
      "https://wa.me/8801610772313?text=Hi%20Farhan%2C%20I%20visited%20your%20portfolio%20and%20wanted%20to%20connect.",
    greeting:
      "Hello. I am Farhan's portfolio assistant. I can answer questions about his experience, skills, projects, education, and contact details.",
    offTopicMessage:
      "I'm specifically trained to answer questions about Farhan Alam's portfolio and experience. For general questions, you might want to try a standard search. Want to see his resume instead?",
    unknownMessage:
      "I'm not quite sure about that. The best way to get that answered is to email Farhan directly at alam22205341122@diu.edu.bd.",
    quickReplies: [
      { label: "Download Resume", message: "Can I view Farhan's resume?" },
      { label: "View Projects", message: "What projects has Farhan built?" },
      { label: "Contact Info", message: "How can I contact Farhan?" }
    ],
    offTopicKeywords: ["politics", "weather", "history", "news", "sports"],
    codeKeywords: ["write code", "debug my code", "leetcode", "algorithm"],
    jailbreakKeywords: ["ignore previous instructions", "act as", "system prompt"],
    intents: [
      {
        phrases: ["who is farhan", "tell me about farhan"],
        keywords: ["farhan", "software engineer", "backend"],
        answer:
          "Farhan Alam is a Software Engineer based in Dhaka, Bangladesh, focused on backend systems, database design, and data-oriented engineering growth.",
        links: [{ label: "Open About", href: "#about" }],
        quickReplies: [{ label: "Projects", message: "What projects has Farhan built?" }]
      }
    ]
  };
}

function prepareChatbotConfig() {
  const baseConfig =
    window.portfolioChatbotConfig && typeof window.portfolioChatbotConfig === "object"
      ? window.portfolioChatbotConfig
      : getDefaultChatbotConfig();

  return {
    ...getDefaultChatbotConfig(),
    ...baseConfig,
    quickReplies: Array.isArray(baseConfig.quickReplies)
      ? baseConfig.quickReplies
      : getDefaultChatbotConfig().quickReplies,
    intents: (Array.isArray(baseConfig.intents) ? baseConfig.intents : []).map((intent) => ({
      ...intent,
      normalizedPhrases: uniqueValues((intent.phrases || []).map(normalizeText)),
      normalizedKeywords: uniqueValues((intent.keywords || []).map(normalizeText))
    }))
  };
}

function setChatbotStatus(text) {
  if (chatbotStatusTarget) {
    chatbotStatusTarget.textContent = text;
  }
}

function hideChatbotTeaser() {
  if (!chatbotTeaser) {
    return;
  }

  chatbotTeaser.classList.add("is-hidden");
}

function scheduleTeaserHide() {
  if (!chatbotTeaser) {
    return;
  }

  if (chatbotState.teaserTimer) {
    window.clearTimeout(chatbotState.teaserTimer);
  }

  chatbotState.teaserTimer = window.setTimeout(hideChatbotTeaser, 7000);
}

function setChatbotOpen(isOpen) {
  if (!chatbotPanel || !chatbotLauncher) {
    return;
  }

  chatbotState.open = isOpen;
  chatbotPanel.classList.toggle("is-open", isOpen);
  chatbotLauncher.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    hideChatbotTeaser();
    seedChatbotConversation();
    window.setTimeout(() => {
      if (chatbotInput) {
        chatbotInput.focus();
      }

      scrollChatToBottom();
    }, 120);
  }
}

function scrollChatToBottom() {
  if (chatbotMessages) {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }
}

function createChatLink(link) {
  const anchor = document.createElement("a");
  anchor.className = "chatbot-link";
  anchor.href = link.href;
  anchor.textContent = link.label || sectionLabels[link.href] || "Open Link";

  if (link.href.startsWith("#")) {
    anchor.addEventListener("click", (event) => {
      event.preventDefault();
      setChatbotOpen(false);
      navigateToHash(link.href);
    });
  } else {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }

  return anchor;
}

function createChatMessage(role, text, links = []) {
  if (!chatbotMessages) {
    return null;
  }

  const article = document.createElement("article");
  article.className = `chatbot-message chatbot-message--${role}`;

  const label = document.createElement("span");
  label.className = "chatbot-message__label";
  label.textContent = role === "user" ? "You" : "Assistant";
  article.appendChild(label);

  String(text || "")
    .split(/\n+/)
    .filter(Boolean)
    .forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      article.appendChild(paragraph);
    });

  if (links.length) {
    const linkRow = document.createElement("div");
    linkRow.className = "chatbot-message__links";
    links.forEach((link) => linkRow.appendChild(createChatLink(link)));
    article.appendChild(linkRow);
  }

  chatbotMessages.appendChild(article);
  scrollChatToBottom();
  return article;
}

function createTypingMessage() {
  if (!chatbotMessages) {
    return null;
  }

  const article = document.createElement("article");
  article.className = "chatbot-message chatbot-message--bot chatbot-message--typing";

  const label = document.createElement("span");
  label.className = "chatbot-message__label";
  label.textContent = "Assistant";
  article.appendChild(label);

  const typing = document.createElement("div");
  typing.className = "chatbot-typing";

  for (let index = 0; index < 3; index += 1) {
    typing.appendChild(document.createElement("span"));
  }

  article.appendChild(typing);
  chatbotMessages.appendChild(article);
  scrollChatToBottom();
  return article;
}

function renderQuickReplies(replies) {
  if (!chatbotSuggestions) {
    return;
  }

  const items = Array.isArray(replies) && replies.length
    ? replies
    : chatbotState.config.quickReplies;

  chatbotSuggestions.innerHTML = "";

  items.slice(0, 6).forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chatbot-suggestion";
    button.textContent = item.label;
    button.addEventListener("click", () => {
      setChatbotOpen(true);

      if (item.href) {
        if (item.href.startsWith("#")) {
          setChatbotOpen(false);
          navigateToHash(item.href);
        } else {
          window.open(item.href, "_blank", "noopener,noreferrer");
        }
        return;
      }

      if (chatbotInput && item.message) {
        chatbotInput.value = item.message;
      }

      if (item.message) {
        handleChatbotQuestion(item.message);
      }
    });
    chatbotSuggestions.appendChild(button);
  });
}

function seedChatbotConversation() {
  if (chatbotState.greeted || !chatbotMessages || !chatbotState.config) {
    return;
  }

  chatbotMessages.innerHTML = "";
  const links = getChatbotLinkSet();
  createChatMessage("bot", chatbotState.config.greeting, [
    links.projects,
    links.resume,
    links.hire
  ]);
  renderQuickReplies(chatbotState.config.quickReplies);
  chatbotState.greeted = true;
}

function includesConfiguredPhrase(query, phrases) {
  return phrases.some((phrase) => includesPhrase(query, normalizeText(phrase)));
}

function scoreIntent(intent, queryNormalized, queryTokens) {
  let score = 0;

  intent.normalizedPhrases.forEach((phrase) => {
    if (!phrase) {
      return;
    }

    if (queryNormalized === phrase) {
      score += 100;
      return;
    }

    if (queryNormalized.includes(phrase)) {
      score += phrase.length > 8 ? 46 : 20;
      return;
    }

    const phraseTokens = tokenizeText(phrase);
    const matchedTokens = phraseTokens.filter((token) => queryTokens.includes(token)).length;

    if (matchedTokens) {
      score += matchedTokens * 6;

      if (matchedTokens === phraseTokens.length && phraseTokens.length > 1) {
        score += 16;
      }
    }
  });

  intent.normalizedKeywords.forEach((keyword) => {
    if (!keyword) {
      return;
    }

    if (keyword.includes(" ")) {
      if (queryNormalized.includes(keyword)) {
        score += 14;
        return;
      }

      const keywordTokens = tokenizeText(keyword);
      const matchedTokens = keywordTokens.filter((token) => queryTokens.includes(token)).length;

      if (matchedTokens) {
        score += matchedTokens * 4;
      }
      return;
    }

    if (queryTokens.includes(keyword)) {
      score += 10;
    }
  });

  return score;
}

function isOffTopicQuery(queryNormalized, queryTokens = []) {
  const config = chatbotState.config;
  const codeActionTokens = ["write", "generate", "debug", "fix", "build", "make", "solve"];
  const codeObjectTokens = ["code", "script", "program", "app", "algorithm"];
  const hasCodeAction = includesAnyToken(queryTokens, codeActionTokens);
  const hasCodeObject = includesAnyToken(queryTokens, codeObjectTokens);

  return (
    includesConfiguredPhrase(queryNormalized, config.offTopicKeywords.map(normalizeText)) ||
    includesConfiguredPhrase(queryNormalized, config.codeKeywords.map(normalizeText)) ||
    includesConfiguredPhrase(queryNormalized, config.jailbreakKeywords.map(normalizeText)) ||
    (hasCodeAction && hasCodeObject)
  );
}

function resolveChatbotMetaResponse(queryNormalized) {
  const config = chatbotState.config;
  const ownerName = config.ownerName || "Farhan Alam";
  const links = getChatbotLinkSet();

  if (includesAnyPhrase(queryNormalized, chatbotGreetingPhrases)) {
    return createChatbotResponse(
      `Hello. I can help you explore ${ownerName}'s skills, projects, writings, education, and contact details. You can ask about the resume, a featured project, or the best way to reach him.`,
      [links.projects, links.resume, links.hire],
      [
        { label: "Top Skills", message: "What are Farhan's main skills?" },
        { label: "View Projects", message: "What projects has Farhan built?" },
        { label: "Contact Info", message: "How can I contact Farhan?" }
      ],
      "greeting"
    );
  }

  if (includesAnyPhrase(queryNormalized, chatbotHelpPhrases)) {
    return createChatbotResponse(
      `You can ask me about ${ownerName}'s skills, featured projects, writings, education, location, resume, or hiring contact details.`,
      [links.skills, links.projects, links.hire],
      [
        { label: "Resume", message: "Can I see the resume?" },
        { label: "Deepfake Thesis", message: "Tell me about the deepfake thesis." },
        { label: "Contact", message: "What email should I use?" }
      ],
      "help"
    );
  }

  if (includesAnyPhrase(queryNormalized, chatbotThanksPhrases)) {
    return createChatbotResponse(
      `You're welcome. If you want, I can still point you to ${ownerName}'s resume, featured projects, or direct contact details.`,
      [links.resume, links.projects, links.hire],
      chatbotState.config.quickReplies,
      "thanks"
    );
  }

  if (includesAnyPhrase(queryNormalized, chatbotFarewellPhrases)) {
    return createChatbotResponse(
      `Happy to help. You can come back anytime for ${ownerName}'s projects, resume, or hiring details.`,
      [links.projects, links.resume, links.hire],
      chatbotState.config.quickReplies,
      "farewell"
    );
  }

  return null;
}

function resolveRuleBasedChatbotResponse(queryNormalized, queryTokens) {
  const config = chatbotState.config;
  const ownerName = config.ownerName || "Farhan Alam";
  const contactEmail = config.contactEmail || "alam22205341122@diu.edu.bd";
  const secondaryEmail = config.secondaryEmail || "";
  const phone = config.phone || "+8801610772313";
  const links = getChatbotLinkSet();

  if (includesAnyToken(queryTokens, ["email"])) {
    return createChatbotResponse(
      `Use ${contactEmail} as the primary email. ${secondaryEmail ? `${secondaryEmail} is the secondary email if you need an alternate route.` : ""}`.trim(),
      [links.hire, links.resume],
      [
        { label: "Phone Number", message: "What is his phone number?" },
        { label: "WhatsApp", message: "Can I contact Farhan on WhatsApp?" },
        { label: "Resume", message: "Can I see the resume?" }
      ],
      "contact-email"
    );
  }

  if (includesAnyToken(queryTokens, ["phone", "whatsapp", "call"])) {
    return createChatbotResponse(
      `${ownerName}'s direct phone number is ${phone}. The Hire Me section also includes a WhatsApp Business button for a faster direct message.`,
      [links.hire, links.whatsapp],
      [
        { label: "Primary Email", message: "What email should I use?" },
        { label: "Contact Info", message: "How can I contact Farhan?" },
        { label: "Resume", message: "Can I see the resume?" }
      ],
      "contact-phone"
    );
  }

  if (includesAnyToken(queryTokens, ["contact", "hire", "facebook"])) {
    return createChatbotResponse(
      `The best contact route is ${contactEmail}. The portfolio also provides the secondary email${secondaryEmail ? ` ${secondaryEmail},` : ""} phone, WhatsApp, Facebook, GitHub, and the hosted resume in the Hire Me section.`,
      [links.hire, links.facebook, links.whatsapp],
      [
        { label: "Primary Email", message: "What email should I use?" },
        { label: "Phone Number", message: "What is his phone number?" },
        { label: "GitHub", message: "Where is Farhan's GitHub?" }
      ],
      "contact"
    );
  }

  if (includesAnyToken(queryTokens, ["resume", "pdf"])) {
    return createChatbotResponse(
      `Yes. ${ownerName}'s resume is available directly on the portfolio and opens as a hosted PDF.`,
      [links.resume, links.hire],
      [
        { label: "Contact", message: "How can I contact Farhan?" },
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "GitHub", message: "Where is Farhan's GitHub?" }
      ],
      "resume"
    );
  }

  if (includesAnyToken(queryTokens, ["github", "repo", "repository", "source"])) {
    return createChatbotResponse(
      `${ownerName}'s GitHub profile and the source for this portfolio are both available from the site.`,
      [links.github, links.siteSource],
      [
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "Writings", message: "What is in the writings section?" },
        { label: "Resume", message: "Can I see the resume?" }
      ],
      "github"
    );
  }

  if (includesAnyToken(queryTokens, ["site", "portfolio", "html", "css", "javascript", "theme", "chatbot"])) {
    return createIntentResponse("site");
  }

  if (
    includesAnyToken(queryTokens, ["location", "map", "dhaka", "bangladesh", "ashulia", "based"]) ||
    includesPhrase(queryNormalized, "where is farhan")
  ) {
    return createIntentResponse("location");
  }

  if (includesAnyToken(queryTokens, ["education", "study", "studied", "university", "cgpa", "degree"])) {
    return createIntentResponse("education");
  }

  if (includesAnyToken(queryTokens, ["activity", "activities", "club", "community", "volunteer", "hackathon"])) {
    return createIntentResponse("activities");
  }

  if (includesAnyToken(queryTokens, ["writing", "writings", "research", "paper", "papers", "notes"])) {
    return createIntentResponse("writings");
  }

  if (includesAnyToken(queryTokens, ["deepfake", "thesis", "gpu", "vision"])) {
    return createIntentResponse("deepfake");
  }

  if (includesAllTokens(queryTokens, ["smart", "waste"]) || includesAnyToken(queryTokens, ["erd", "uml"])) {
    return createIntentResponse("smart-waste");
  }

  if (includesAllTokens(queryTokens, ["coffee", "shop"]) || includesAnyToken(queryTokens, ["pos"])) {
    return createIntentResponse("coffee-shop");
  }

  if (includesAnyToken(queryTokens, ["banking", "bank"])) {
    return createIntentResponse("banking");
  }

  if (
    includesAnyToken(queryTokens, [
      "skill",
      "skills",
      "python",
      "java",
      "php",
      "sql",
      "mysql",
      "backend",
      "database",
      "oop",
      "testing"
    ])
  ) {
    return createIntentResponse("skills");
  }

  if (includesAnyToken(queryTokens, ["project", "projects", "built", "work"])) {
    return createIntentResponse("projects");
  }

  if (includesPhrase(queryNormalized, "who is farhan") || includesPhrase(queryNormalized, "about farhan")) {
    return createIntentResponse("about");
  }

  return null;
}

function resolveChatbotResponse(question) {
  const config = chatbotState.config;
  const trimmedQuestion = String(question || "").trim();
  const queryNormalized = normalizeText(trimmedQuestion);
  const queryTokens = tokenizeText(trimmedQuestion);
  const links = getChatbotLinkSet();

  if (!trimmedQuestion) {
    return createChatbotResponse(
      "Please ask a portfolio-related question, for example about Farhan's skills, projects, resume, or contact details.",
      [links.hire],
      config.quickReplies,
      "empty"
    );
  }

  if (trimmedQuestion.length > 320) {
    return createChatbotResponse(
      "Please keep the question concise and focused on Farhan's portfolio. If the topic is detailed, the safest route is to email Farhan directly at alam22205341122@diu.edu.bd.",
      [links.hire],
      config.quickReplies,
      "too-long"
    );
  }

  const metaResponse = resolveChatbotMetaResponse(queryNormalized);

  if (metaResponse) {
    return metaResponse;
  }

  if (isOffTopicQuery(queryNormalized, queryTokens)) {
    return createChatbotResponse(
      config.offTopicMessage,
      [links.resume, links.projects],
      config.quickReplies,
      "off-topic"
    );
  }

  const conversationalResponse = resolveRuleBasedChatbotResponse(queryNormalized, queryTokens);

  if (conversationalResponse) {
    return conversationalResponse;
  }

  const rankedIntents = config.intents
    .map((intent) => ({
      intent,
      score: scoreIntent(intent, queryNormalized, queryTokens)
    }))
    .sort((left, right) => right.score - left.score);

  const bestIntent = rankedIntents[0];

  if (!bestIntent || bestIntent.score < 11) {
    return createChatbotResponse(
      config.unknownMessage,
      [links.hire, links.resume],
      config.quickReplies,
      "unknown"
    );
  }

  return createChatbotResponse(
    bestIntent.intent.answer,
    bestIntent.intent.links || [],
    bestIntent.intent.quickReplies || config.quickReplies,
    bestIntent.intent.id || "intent"
  );
}

function handleChatbotQuestion(rawQuestion) {
  if (!chatbotMessages || !chatbotState.config) {
    return;
  }

  const question = String(rawQuestion || "").trim();

  if (!question) {
    const response = resolveChatbotResponse("");
    renderQuickReplies(response.quickReplies);
    createChatMessage("bot", response.answer, response.links);
    return;
  }

  if (chatbotState.typingTimer) {
    window.clearTimeout(chatbotState.typingTimer);
    chatbotState.typingTimer = null;
  }

  createChatMessage("user", question);
  setChatbotStatus("Thinking...");

  const typingMessage = createTypingMessage();
  const response = resolveChatbotResponse(question);

  chatbotState.typingTimer = window.setTimeout(() => {
    if (typingMessage) {
      typingMessage.remove();
    }

    createChatMessage("bot", response.answer, response.links);
    renderQuickReplies(response.quickReplies);
    chatbotState.lastIntent = response.intentId || null;
    setChatbotStatus(chatbotState.config.assistantStatus);
    chatbotState.typingTimer = null;
  }, 320);

  if (chatbotInput) {
    chatbotInput.value = "";
  }
}

function initChatbot() {
  if (
    !chatbotLauncher ||
    !chatbotPanel ||
    !chatbotMessages ||
    !chatbotSuggestions ||
    !chatbotForm ||
    !chatbotInput
  ) {
    return;
  }

  chatbotState.config = prepareChatbotConfig();

  if (chatbotMeta) {
    chatbotMeta.textContent = "Portfolio-only assistant with professional scope and direct contact fallback.";
  }

  setChatbotStatus(chatbotState.config.assistantStatus);
  renderQuickReplies(chatbotState.config.quickReplies);

  if (chatbotState.initialized) {
    return;
  }

  if (chatbotTeaser) {
    chatbotTeaser.addEventListener("click", () => setChatbotOpen(true));
    scheduleTeaserHide();
  }

  chatbotLauncher.addEventListener("click", () => {
    setChatbotOpen(!chatbotState.open);
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", () => setChatbotOpen(false));
  }

  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleChatbotQuestion(chatbotInput.value);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbotState.open) {
      setChatbotOpen(false);
    }
  });

  chatbotState.initialized = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const initialTheme =
    document.documentElement.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  setTheme(initialTheme);
  typeLoop();
  initClock();
  initForm();
  initRevealAnimations();
  bindInPageLinks();
  initChatbot();

  try {
    ensureMap();
    window.addEventListener("load", ensureMap, { once: true });
  } catch (error) {
    updateMapFallback(
      "Interactive map is temporarily unavailable. The Dhaka and DIU quick links still work.",
      true
    );
  }

  if (yearTarget) {
    yearTarget.textContent = String(new Date().getFullYear());
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => toggleMobileMenu());
  }

  setActiveSection();

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      setActiveSection();
      ticking = false;
    });

    ticking = true;
  });
});
