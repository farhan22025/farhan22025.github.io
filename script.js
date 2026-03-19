const typingTarget = document.getElementById("typing-text");
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal");
const skillItems = document.querySelectorAll(".skill-item");
const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const yearTarget = document.getElementById("current-year");
const time24Target = document.getElementById("time-24");
const time12Target = document.getElementById("time-12");
const footerTimeTarget = document.getElementById("footer-time");
const mapFallbackNote = document.getElementById("map-fallback-note");

const chatbotLauncher = document.getElementById("chatbot-launcher");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotSuggestions = document.getElementById("chatbot-suggestions");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotMeta = document.getElementById("chatbot-meta");

const typingPhrases = [
  "scalable data-ready systems.",
  "backend workflows with structure.",
  "clean foundations for analytics.",
  "data-driven backend products."
];

const defaultSuggestionPrompts = [
  "Who is Farhan Alam?",
  "What projects has he built?",
  "What are his strongest skills?",
  "Where can I read his writings?",
  "How can I hire Farhan?"
];

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

let typingIndex = 0;
let characterIndex = 0;
let isDeleting = false;

const mapState = {
  instance: null,
  tileLayer: null,
  retryTimer: null,
  attempts: 0,
  maxAttempts: 14,
  resizeBound: false
};

const chatbotState = {
  trainedEntries: [],
  greeted: false,
  initialized: false,
  pendingResponseTimer: null
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
    .replace(/[^a-z0-9\s#]/g, " ")
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

  const currentPhrase = typingPhrases[typingIndex];
  const speed = isDeleting ? 45 : 90;

  typingTarget.textContent = currentPhrase.slice(0, characterIndex);

  if (!isDeleting && characterIndex < currentPhrase.length) {
    characterIndex += 1;
    window.setTimeout(typeLoop, speed);
    return;
  }

  if (isDeleting && characterIndex > 0) {
    characterIndex -= 1;
    window.setTimeout(typeLoop, 35);
    return;
  }

  if (!isDeleting) {
    isDeleting = true;
    window.setTimeout(typeLoop, 1400);
    return;
  }

  isDeleting = false;
  typingIndex = (typingIndex + 1) % typingPhrases.length;
  window.setTimeout(typeLoop, 250);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("farhan-theme", theme);
  updateThemeToggle(theme);
  refreshMapTiles();
}

function updateThemeToggle(theme) {
  if (!themeToggle) {
    return;
  }

  const icon = themeToggle.querySelector(".theme-toggle__icon");
  const label = themeToggle.querySelector(".theme-toggle__label");
  const isDark = theme === "dark";

  if (icon) {
    icon.textContent = isDark ? "\u263E" : "\u2600";
  }

  if (label) {
    label.textContent = isDark ? "Dark" : "Light";
  }

  themeToggle.setAttribute("aria-pressed", String(!isDark));
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

function toggleMobileMenu(forceClose = false) {
  if (!navMenu || !navToggle) {
    return;
  }

  const willOpen = forceClose ? false : !navMenu.classList.contains("is-open");
  navMenu.classList.toggle("is-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
}

function handleReveal(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}

function animateSkillBars(entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const progress = `${entry.target.dataset.progress || 0}%`;
    const fill = entry.target.querySelector(".skill-fill");

    if (fill) {
      fill.style.width = progress;
    }

    observer.unobserve(entry.target);
  });
}

function setActiveSection() {
  const sections = [...document.querySelectorAll("main section[id]")];
  const scrollPosition = window.scrollY + 140;

  let activeId = sections[0]?.id || "home";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("active", matches);
  });
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
  const isDark = theme === "dark";

  return {
    url: isDark
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

  const tileConfig = getTileConfig();

  if (mapState.tileLayer) {
    mapState.instance.removeLayer(mapState.tileLayer);
  }

  mapState.tileLayer = window.L.tileLayer(tileConfig.url, {
    attribution: tileConfig.attribution,
    maxZoom: 18
  }).addTo(mapState.instance);
}

function initMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement) {
    return false;
  }

  if (!window.L) {
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

    const homeMarker = window.L.marker(dhaka, {
      icon: buildMarker("home")
    }).addTo(mapState.instance);

    const campusMarker = window.L.marker(diuAshulia, {
      icon: buildMarker("campus")
    }).addTo(mapState.instance);

    homeMarker.bindPopup("<strong>Dhaka, Bangladesh</strong><br>Current location");
    campusMarker.bindPopup(
      "<strong>Daffodil International University</strong><br>Ashulia study location"
    );

    window.L.polyline([dhaka, diuAshulia], {
      color: "#40d3c8",
      weight: 3,
      opacity: 0.75,
      dashArray: "10 10"
    }).addTo(mapState.instance);

    const bounds = window.L.latLngBounds([dhaka, diuAshulia]);
    mapState.instance.fitBounds(bounds.pad(0.45));
    window.L.control.zoom({ position: "bottomright" }).addTo(mapState.instance);

    if (!mapState.resizeBound) {
      window.addEventListener("resize", () => {
        mapState.instance?.invalidateSize();
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

  const initialized = initMap();

  if (initialized) {
    if (mapState.retryTimer) {
      window.clearTimeout(mapState.retryTimer);
      mapState.retryTimer = null;
    }

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

  updateMapFallback("Loading interactive map. If it delays, the Dhaka and DIU quick links still work.");

  if (mapState.retryTimer) {
    window.clearTimeout(mapState.retryTimer);
  }

  mapState.retryTimer = window.setTimeout(ensureMap, 800);
}

function initForm() {
  if (!form || !formStatus) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(form).get("name") || "there";
    formStatus.textContent = `Thanks, ${name}. This demo form is frontend-only, so please use the direct email, phone, or WhatsApp options for a real reply.`;
    form.reset();
  });
}

function getFallbackKnowledgeBase() {
  return [
    {
      question: "Who is Farhan Alam?",
      aliases: ["tell me about Farhan", "introduce Farhan"],
      keywords: ["farhan", "software engineer", "backend"],
      answer:
        "Farhan Alam is a Software Engineer based in Dhaka, Bangladesh, focused on backend systems, databases, and data-ready engineering work.",
      links: ["#about", "#contact"]
    },
    {
      question: "What projects has he built?",
      aliases: ["project list", "portfolio projects"],
      keywords: ["projects", "smart waste", "coffee shop", "banking", "deepfake"],
      answer:
        "The site highlights Smart Waste Management System, Coffee Shop Management System, Banking Management System, and Deepfake Detection, each with a GitHub destination.",
      links: ["#projects"]
    },
    {
      question: "What are his strongest skills?",
      aliases: ["top skills", "best technical areas"],
      keywords: ["skills", "sql", "backend", "system design", "database"],
      answer:
        "His strongest visible areas are SQL, database thinking, backend-oriented logic, system design, and structured software engineering work.",
      links: ["#skills", "#about"]
    },
    {
      question: "How can I hire Farhan?",
      aliases: ["contact Farhan", "reach Farhan", "hire me section"],
      keywords: ["hire", "contact", "email", "phone", "whatsapp"],
      answer:
        "Use the Hire Me section for direct contact. It includes two email addresses, a phone number, WhatsApp, Facebook, the resume, and GitHub links.",
      links: ["#contact"]
    },
    {
      question: "Where can I read his writings?",
      aliases: ["research notes", "writings section", "papers"],
      keywords: ["writings", "research", "notes", "papers"],
      answer:
        "Open the Writings and Research section to view thesis notes, backend and data engineering notes, and software engineering writeups linked to GitHub.",
      links: ["#writings"]
    },
    {
      question: "Where is Farhan based?",
      aliases: ["location", "where does he live"],
      keywords: ["dhaka", "bangladesh", "location"],
      answer:
        "Farhan is based in Dhaka, Bangladesh, and the map section also shows Daffodil International University in Ashulia.",
      links: ["#map-section", "#contact"]
    },
    {
      question: "What is this site built with?",
      aliases: ["site stack", "portfolio technology"],
      keywords: ["html", "css", "javascript", "leaflet", "chatbot"],
      answer:
        "This portfolio is built with HTML, CSS, and JavaScript, with Leaflet for the map and a client-side chatbot trained on portfolio questions.",
      links: ["#home", "#map-section"]
    }
  ];
}

function getStaticChatbotResponse(question) {
  const query = normalizeText(question);

  if (!query) {
    return null;
  }

  if (
    query.includes("hello") ||
    query.includes("hi ") ||
    query === "hi" ||
    query.includes("hey")
  ) {
    return {
      answer:
        "Hello. I can help with Farhan's skills, projects, writings, contact details, education, and site features.",
      suggestions: getSuggestionPool(),
      links: ["#about", "#projects", "#writings", "#contact"]
    };
  }

  if (query.includes("email") || query.includes("mail")) {
    return {
      answer:
        "Farhan's primary email is alam22205341122@diu.edu.bd and his secondary email is f05076963@gmail.com.",
      suggestions: [
        "What is Farhan's phone number?",
        "Can I message Farhan on WhatsApp?",
        "Can I view Farhan's resume?"
      ],
      links: ["#contact"]
    };
  }

  if (query.includes("phone") || query.includes("number") || query.includes("whatsapp")) {
    return {
      answer:
        "You can reach Farhan at +8801610772313, and the Hire Me section also includes a WhatsApp Business button for direct contact.",
      suggestions: [
        "What are Farhan's email addresses?",
        "Can I view Farhan's resume?",
        "How can I hire or contact Farhan?"
      ],
      links: ["#contact"]
    };
  }

  if (query.includes("resume") || query.includes("cv")) {
    return {
      answer:
        "Yes. The site includes a direct resume PDF link in both the hero section and the Hire Me section.",
      suggestions: [
        "How can I hire or contact Farhan?",
        "Where is Farhan's GitHub?",
        "What projects has Farhan built?"
      ],
      links: ["#home", "#contact"]
    };
  }

  if (query.includes("project") || query.includes("github")) {
    return {
      answer:
        "The Projects and Writings sections both include GitHub links so visitors can open project folders and notes directly inside the live repository.",
      suggestions: [
        "What projects has Farhan built?",
        "What is in the Writings and Research section?",
        "Can I view the source of this portfolio?"
      ],
      links: ["#projects", "#writings", "#contact"]
    };
  }

  if (query.includes("write") || query.includes("research") || query.includes("paper")) {
    return {
      answer:
        "The Writings and Research section contains thesis notes, backend and data engineering notes, and software engineering writeups linked to GitHub.",
      suggestions: [
        "What are the Deepfake Detection Thesis Notes?",
        "What are the Backend and Data Engineering Notes?",
        "Can I view the source of this portfolio?"
      ],
      links: ["#writings"]
    };
  }

  if (query.includes("map") || query.includes("location") || query.includes("dhaka")) {
    return {
      answer:
        "The map section shows Farhan's location in Dhaka and Daffodil International University in Ashulia, with direct Google Maps links as backup.",
      suggestions: [
        "Where is Farhan based?",
        "What does the map show?",
        "How can I hire or contact Farhan?"
      ],
      links: ["#map-section", "#contact"]
    };
  }

  return null;
}

function trainChatbot(entries) {
  return entries.map((entry) => {
    const phrases = uniqueValues([
      entry.question,
      ...(entry.aliases || []),
      ...(entry.keywords || [])
    ]).map(normalizeText);

    const normalizedQuestion = normalizeText(entry.question);
    const normalizedAliases = (entry.aliases || []).map(normalizeText);
    const searchBlob = phrases.join(" ");
    const tokenWeights = {};

    phrases.forEach((phrase, index) => {
      tokenizeText(phrase).forEach((token) => {
        tokenWeights[token] = (tokenWeights[token] || 0) + (index === 0 ? 7 : 4);
      });
    });

    (entry.keywords || []).forEach((keyword) => {
      tokenizeText(keyword).forEach((token) => {
        tokenWeights[token] = (tokenWeights[token] || 0) + 6;
      });
    });

    return {
      ...entry,
      normalizedQuestion,
      normalizedAliases,
      phrases,
      searchBlob,
      tokenWeights
    };
  });
}

function scoreChatbotEntry(queryNormalized, queryTokens, entry) {
  if (!queryNormalized) {
    return -1;
  }

  let score = 0;

  if (queryNormalized === entry.normalizedQuestion) {
    score += 240;
  }

  entry.normalizedAliases.forEach((alias) => {
    if (alias === queryNormalized) {
      score += 220;
    } else {
      if (alias.includes(queryNormalized) && queryNormalized.length > 4) {
        score += 80;
      }

      if (queryNormalized.includes(alias) && alias.length > 4) {
        score += 60;
      }
    }
  });

  if (entry.normalizedQuestion.includes(queryNormalized) && queryNormalized.length > 4) {
    score += 75;
  }

  if (queryNormalized.includes(entry.normalizedQuestion) && entry.normalizedQuestion.length > 6) {
    score += 75;
  }

  entry.phrases.forEach((phrase) => {
    if (phrase.length > 6 && queryNormalized.includes(phrase)) {
      score += 18;
    }
  });

  queryTokens.forEach((token) => {
    score += entry.tokenWeights[token] || 0;

    if (entry.normalizedQuestion.includes(token)) {
      score += 4;
    }
  });

  for (let index = 0; index < queryTokens.length - 1; index += 1) {
    const bigram = `${queryTokens[index]} ${queryTokens[index + 1]}`;
    if (entry.searchBlob.includes(bigram)) {
      score += 12;
    }
  }

  return score;
}

function getTopChatbotMatches(query) {
  const queryNormalized = normalizeText(query);
  const queryTokens = tokenizeText(query);

  return chatbotState.trainedEntries
    .map((entry) => ({
      entry,
      score: scoreChatbotEntry(queryNormalized, queryTokens, entry)
    }))
    .sort((left, right) => right.score - left.score);
}

function getSuggestionPool(excludedQuestion = "") {
  const starters = window.portfolioChatbotStarters || defaultSuggestionPrompts;

  return uniqueValues(
    starters
      .concat(chatbotState.trainedEntries.slice(0, 12).map((entry) => entry.question))
      .filter((question) => question !== excludedQuestion)
  ).slice(0, 6);
}

function resolveChatbotResponse(question) {
  const staticResponse = getStaticChatbotResponse(question);

  if (staticResponse) {
    return staticResponse;
  }

  const results = getTopChatbotMatches(question);
  const bestMatch = results[0];

  if (!bestMatch || bestMatch.score < 7) {
    return {
      answer:
        "I can answer questions based on this portfolio. Try asking about Farhan's skills, projects, writings, education, contact details, the map, or how this site was built.",
      suggestions: getSuggestionPool(),
      links: ["#about", "#skills", "#projects", "#writings", "#contact"]
    };
  }

  const relatedSuggestions = results
    .slice(1, 5)
    .filter((result) => result.score > 8)
    .map((result) => result.entry.question);

  return {
    answer: bestMatch.entry.answer,
    suggestions: uniqueValues(
      relatedSuggestions.concat(getSuggestionPool(bestMatch.entry.question))
    ).slice(0, 6),
    links: bestMatch.entry.links || []
  };
}

function scrollChatToBottom() {
  if (!chatbotMessages) {
    return;
  }

  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function createChatMessage(sender, text, links = []) {
  if (!chatbotMessages) {
    return;
  }

  const article = document.createElement("article");
  article.className = `chatbot-message chatbot-message--${sender}`;

  const label = document.createElement("span");
  label.className = "chatbot-message__label";
  label.textContent = sender === "bot" ? "Site Bot" : "You";
  article.appendChild(label);

  text
    .split(/\n+/)
    .filter(Boolean)
    .forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText;
      article.appendChild(paragraph);
    });

  if (sender === "bot" && links.length) {
    const linkRow = document.createElement("div");
    linkRow.className = "chatbot-message__links";

    uniqueValues(links).forEach((href) => {
      const anchor = document.createElement("a");
      anchor.className = "chatbot-link";
      anchor.href = href;
      anchor.textContent = sectionLabels[href] || "Open Section";

      if (href.startsWith("#")) {
        anchor.addEventListener("click", () => {
          setChatbotOpen(false);
        });
      } else {
        anchor.target = "_blank";
        anchor.rel = "noreferrer";
      }

      linkRow.appendChild(anchor);
    });

    article.appendChild(linkRow);
  }

  chatbotMessages.appendChild(article);
  scrollChatToBottom();
}

function renderChatSuggestions(prompts) {
  if (!chatbotSuggestions) {
    return;
  }

  chatbotSuggestions.innerHTML = "";

  prompts.slice(0, 6).forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chatbot-suggestion";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      setChatbotOpen(true);

      if (chatbotInput) {
        chatbotInput.value = prompt;
      }

      handleChatbotQuestion(prompt);
    });
    chatbotSuggestions.appendChild(button);
  });
}

function seedChatbotConversation() {
  if (chatbotState.greeted || !chatbotMessages) {
    return;
  }

  chatbotMessages.innerHTML = "";
  createChatMessage(
    "bot",
    `Hi, I am Farhan's portfolio assistant. I am ready with ${chatbotState.trainedEntries.length} portfolio questions and can answer common visitor, employer, beginner, and educator-style questions about this site.`,
    ["#about", "#projects", "#writings", "#contact"]
  );
  renderChatSuggestions(getSuggestionPool());
  chatbotState.greeted = true;
}

function setChatbotOpen(isOpen) {
  if (!chatbotPanel || !chatbotLauncher) {
    return;
  }

  chatbotPanel.classList.toggle("is-open", isOpen);
  chatbotLauncher.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    seedChatbotConversation();
    window.setTimeout(() => {
      chatbotInput?.focus();
      scrollChatToBottom();
    }, 120);
  }
}

function handleChatbotQuestion(rawQuestion) {
  const question = String(rawQuestion || "").trim();

  if (!question || !chatbotMessages) {
    renderChatSuggestions(getSuggestionPool());
    return;
  }

  if (chatbotState.pendingResponseTimer) {
    window.clearTimeout(chatbotState.pendingResponseTimer);
    chatbotState.pendingResponseTimer = null;
  }

  createChatMessage("user", question);

  const response = resolveChatbotResponse(question);
  chatbotState.pendingResponseTimer = window.setTimeout(() => {
    createChatMessage("bot", response.answer, response.links);
    renderChatSuggestions(response.suggestions);
    chatbotState.pendingResponseTimer = null;
  }, 180);

  if (chatbotInput) {
    chatbotInput.value = "";
  }
}

function hydrateChatbotKnowledge() {
  const knowledgeBase =
    Array.isArray(window.portfolioKnowledgeBase) && window.portfolioKnowledgeBase.length
      ? window.portfolioKnowledgeBase
      : getFallbackKnowledgeBase();

  chatbotState.trainedEntries = trainChatbot(knowledgeBase);

  if (chatbotMeta) {
    chatbotMeta.textContent = `Indexed ${chatbotState.trainedEntries.length} portfolio questions for visitors, employers, beginners, and professors.`;
  }

  renderChatSuggestions(getSuggestionPool());
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

  hydrateChatbotKnowledge();

  if (chatbotState.initialized) {
    return;
  }

  chatbotLauncher.addEventListener("click", () => {
    if (!chatbotState.trainedEntries.length) {
      hydrateChatbotKnowledge();
    }

    const nextState = !chatbotPanel.classList.contains("is-open");
    setChatbotOpen(nextState);
  });

  chatbotClose?.addEventListener("click", () => setChatbotOpen(false));

  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleChatbotQuestion(chatbotInput.value || "");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && chatbotPanel.classList.contains("is-open")) {
      setChatbotOpen(false);
    }
  });

  chatbotState.initialized = true;
}

document.addEventListener("DOMContentLoaded", () => {
  const initialTheme =
    document.documentElement.dataset.theme ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  try {
    setTheme(initialTheme);
  } catch (error) {
    updateThemeToggle(initialTheme);
  }

  typeLoop();
  initClock();
  initForm();

  try {
    ensureMap();
    window.addEventListener("load", ensureMap, { once: true });
  } catch (error) {
    updateMapFallback(
      "Interactive map is temporarily unavailable. The Dhaka and DIU quick links still work.",
      true
    );
  }

  try {
    initChatbot();
    window.addEventListener("load", () => {
      if (!chatbotState.trainedEntries.length) {
        hydrateChatbotKnowledge();
      }
    });
  } catch (error) {
    if (chatbotMeta) {
      chatbotMeta.textContent = "Site knowledge is reloading. Ask about projects, skills, or hiring.";
    }
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

  navLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(true));
  });

  const revealObserver = new IntersectionObserver(handleReveal, {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));

  const skillObserver = new IntersectionObserver(animateSkillBars, {
    threshold: 0.35
  });

  skillItems.forEach((item) => skillObserver.observe(item));

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
