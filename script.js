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
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    assistantStatus: "Online and portfolio-focused",
    contactEmail: "alam22205341122@diu.edu.bd",
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
  createChatMessage("bot", chatbotState.config.greeting, [
    { label: "Open Projects", href: "#projects" },
    { label: "Open Resume", href: "assets/farhan-cv-resume.pdf" },
    { label: "Open Hire Me", href: "#contact" }
  ]);
  renderQuickReplies(chatbotState.config.quickReplies);
  chatbotState.greeted = true;
}

function includesConfiguredPhrase(query, phrases) {
  return phrases.some((phrase) => query.includes(phrase));
}

function scoreIntent(intent, queryNormalized, queryTokens) {
  let score = 0;

  intent.normalizedPhrases.forEach((phrase) => {
    if (!phrase) {
      return;
    }

    if (queryNormalized === phrase) {
      score += 90;
      return;
    }

    if (queryNormalized.includes(phrase) || phrase.includes(queryNormalized)) {
      score += phrase.length > 8 ? 42 : 18;
    }
  });

  intent.normalizedKeywords.forEach((keyword) => {
    if (!keyword) {
      return;
    }

    if (keyword.includes(" ")) {
      if (queryNormalized.includes(keyword)) {
        score += 12;
      }
      return;
    }

    if (queryTokens.includes(keyword)) {
      score += 8;
    }
  });

  return score;
}

function isOffTopicQuery(queryNormalized) {
  const config = chatbotState.config;

  return (
    includesConfiguredPhrase(queryNormalized, config.offTopicKeywords.map(normalizeText)) ||
    includesConfiguredPhrase(queryNormalized, config.codeKeywords.map(normalizeText)) ||
    includesConfiguredPhrase(queryNormalized, config.jailbreakKeywords.map(normalizeText))
  );
}

function resolveChatbotResponse(question) {
  const config = chatbotState.config;
  const trimmedQuestion = String(question || "").trim();
  const queryNormalized = normalizeText(trimmedQuestion);
  const queryTokens = tokenizeText(trimmedQuestion);

  if (!trimmedQuestion) {
    return {
      answer:
        "Please ask a portfolio-related question, for example about Farhan's skills, projects, resume, or contact details.",
      links: [{ label: "Open Hire Me", href: "#contact" }],
      quickReplies: config.quickReplies
    };
  }

  if (trimmedQuestion.length > 320) {
    return {
      answer:
        "Please keep the question concise and focused on Farhan's portfolio. If the topic is detailed, the safest route is to email Farhan directly at alam22205341122@diu.edu.bd.",
      links: [{ label: "Open Hire Me", href: "#contact" }],
      quickReplies: config.quickReplies
    };
  }

  if (isOffTopicQuery(queryNormalized)) {
    return {
      answer: config.offTopicMessage,
      links: [
        { label: "Open Resume", href: "assets/farhan-cv-resume.pdf" },
        { label: "Open Projects", href: "#projects" }
      ],
      quickReplies: config.quickReplies
    };
  }

  const rankedIntents = config.intents
    .map((intent) => ({
      intent,
      score: scoreIntent(intent, queryNormalized, queryTokens)
    }))
    .sort((left, right) => right.score - left.score);

  const bestIntent = rankedIntents[0];

  if (!bestIntent || bestIntent.score < 10) {
    return {
      answer: config.unknownMessage,
      links: [
        { label: "Open Hire Me", href: "#contact" },
        { label: "Open Resume", href: "assets/farhan-cv-resume.pdf" }
      ],
      quickReplies: config.quickReplies
    };
  }

  return {
    answer: bestIntent.intent.answer,
    links: bestIntent.intent.links || [],
    quickReplies: bestIntent.intent.quickReplies || config.quickReplies
  };
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
