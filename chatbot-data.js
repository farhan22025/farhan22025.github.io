window.portfolioChatbotConfig = {
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
    "Hello. I am Farhan's portfolio assistant. I can answer questions about his experience, skills, projects, writings, education, and contact details.",
  offTopicMessage:
    "I'm specifically trained to answer questions about Farhan Alam's portfolio and experience. For general questions, you might want to try a standard search. Want to see his resume instead?",
  unknownMessage:
    "I'm not quite sure about that. The best way to get that answered is to email Farhan directly at alam22205341122@diu.edu.bd.",
  quickReplies: [
    {
      label: "Download Resume",
      message: "Can I view Farhan's resume?"
    },
    {
      label: "View Projects",
      message: "What projects has Farhan built?"
    },
    {
      label: "Contact Info",
      message: "How can I contact Farhan?"
    },
    {
      label: "Top Skills",
      message: "What are Farhan's main skills?"
    }
  ],
  offTopicKeywords: [
    "politics",
    "president",
    "prime minister",
    "election",
    "history",
    "weather",
    "temperature",
    "sports",
    "football",
    "cricket score",
    "movie",
    "recipe",
    "music",
    "joke",
    "pirate",
    "horoscope",
    "news",
    "bitcoin",
    "crypto"
  ],
  codeKeywords: [
    "write code",
    "generate code",
    "fix my code",
    "debug my code",
    "solve this bug",
    "leetcode",
    "algorithm",
    "homework",
    "assignment",
    "coding help",
    "build me",
    "make me a script"
  ],
  jailbreakKeywords: [
    "ignore previous instructions",
    "ignore all instructions",
    "act as",
    "pretend to be",
    "system prompt",
    "developer message",
    "jailbreak",
    "roleplay"
  ],
  intents: [
    {
      id: "about",
      phrases: [
        "who is farhan",
        "tell me about farhan",
        "introduce farhan",
        "about farhan"
      ],
      keywords: ["farhan", "software engineer", "backend", "data engineering"],
      answer:
        "Farhan Alam is a Software Engineer based in Dhaka, Bangladesh, focused on backend systems, database design, and data-oriented engineering growth.",
      links: [
        { label: "Open About", href: "#about" },
        { label: "Open Hire Me", href: "#contact" }
      ],
      quickReplies: [
        { label: "Top Skills", message: "What are Farhan's main skills?" },
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "Contact", message: "How can I contact Farhan?" }
      ]
    },
    {
      id: "skills",
      phrases: [
        "what are farhan's main skills",
        "what are his skills",
        "what can farhan do",
        "strongest skills",
        "technical skills"
      ],
      keywords: ["skills", "python", "java", "php", "c", "sql", "mysql", "oop", "system design"],
      answer:
        "Farhan's portfolio highlights Python, Java, PHP, C, SQL, MySQL, OOP, data structures, system design, Git, and SQA testing, with a clear backend and data focus.",
      links: [
        { label: "Open Skills", href: "#skills" },
        { label: "Open Projects", href: "#projects" }
      ],
      quickReplies: [
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "Education", message: "What is Farhan's education background?" },
        { label: "Resume", message: "Can I view Farhan's resume?" }
      ]
    },
    {
      id: "projects",
      phrases: [
        "what projects has farhan built",
        "show me his projects",
        "project list",
        "featured projects"
      ],
      keywords: ["projects", "smart waste", "coffee shop", "banking", "deepfake"],
      answer:
        "The featured work includes Smart Waste Management System, Coffee Shop Management System, Banking Management System, and the Deepfake Detection thesis project. Each card on the site now points to GitHub.",
      links: [
        { label: "Open Projects", href: "#projects" },
        { label: "Open Writings", href: "#writings" }
      ],
      quickReplies: [
        { label: "Deepfake Project", message: "What is the Deepfake Detection project about?" },
        { label: "Writings", message: "What is in the Writings and Research section?" },
        { label: "GitHub", message: "Where is Farhan's GitHub?" }
      ]
    },
    {
      id: "smart-waste",
      phrases: [
        "what is the smart waste management system project",
        "smart waste management system",
        "smart waste project"
      ],
      keywords: ["smart waste", "waste", "erd", "uml", "data flow"],
      answer:
        "Smart Waste Management System is a structured system design project focused on waste tracking, ERD planning, UML diagrams, and clean documentation.",
      links: [{ label: "Open Projects", href: "#projects" }],
      quickReplies: [
        { label: "Other Projects", message: "What projects has Farhan built?" },
        { label: "System Design", message: "What are Farhan's main skills?" }
      ]
    },
    {
      id: "coffee-shop",
      phrases: [
        "what is the coffee shop management system",
        "coffee shop management system",
        "coffee shop project"
      ],
      keywords: ["coffee shop", "java", "oop", "pos"],
      answer:
        "Coffee Shop Management System is a Java-based POS project that applies object-oriented design to transaction handling and day-to-day shop operations.",
      links: [{ label: "Open Projects", href: "#projects" }],
      quickReplies: [
        { label: "OOP Skills", message: "What are Farhan's main skills?" },
        { label: "More Projects", message: "What projects has Farhan built?" }
      ]
    },
    {
      id: "banking",
      phrases: [
        "what is the banking management system project",
        "banking management system",
        "banking project"
      ],
      keywords: ["banking", "c", "file handling", "persistence"],
      answer:
        "Banking Management System is a C project that uses file handling for persistent records and structured banking operations.",
      links: [{ label: "Open Projects", href: "#projects" }],
      quickReplies: [
        { label: "More Projects", message: "What projects has Farhan built?" },
        { label: "Resume", message: "Can I view Farhan's resume?" }
      ]
    },
    {
      id: "deepfake",
      phrases: [
        "what is the deepfake detection project about",
        "deepfake detection",
        "deepfake thesis",
        "final year thesis"
      ],
      keywords: ["deepfake", "thesis", "machine learning", "gpu", "computer vision"],
      answer:
        "Deepfake Detection is Farhan's thesis-focused research project around manipulated media detection, machine learning, and GPU-assisted experimentation.",
      links: [
        { label: "Open Projects", href: "#projects" },
        { label: "Open Writings", href: "#writings" }
      ],
      quickReplies: [
        { label: "Writings", message: "What is in the Writings and Research section?" },
        { label: "Education", message: "What is Farhan's education background?" }
      ]
    },
    {
      id: "writings",
      phrases: [
        "what is in the writings and research section",
        "show me the writings",
        "research papers",
        "writings"
      ],
      keywords: ["writings", "research", "notes", "papers", "writeups"],
      answer:
        "The Writings and Research section contains thesis notes, backend and data engineering notes, and software engineering writeups linked through GitHub.",
      links: [{ label: "Open Writings", href: "#writings" }],
      quickReplies: [
        { label: "Deepfake Notes", message: "What is the Deepfake Detection project about?" },
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "GitHub", message: "Where is Farhan's GitHub?" }
      ]
    },
    {
      id: "education",
      phrases: [
        "what is farhan's education background",
        "education background",
        "where did farhan study",
        "what is his cgpa"
      ],
      keywords: ["education", "diu", "cgpa", "a levels", "university"],
      answer:
        "Farhan is completing a B.Sc. in Software Engineering at Daffodil International University, and the site lists his CGPA as 3.06 out of 4.00. His pre-university background is Cambridge A Levels from St. Loretto School and College.",
      links: [
        { label: "Open Education", href: "#education" },
        { label: "Open Map", href: "#map-section" }
      ],
      quickReplies: [
        { label: "Activities", message: "What activities is Farhan involved in?" },
        { label: "Contact", message: "How can I contact Farhan?" }
      ]
    },
    {
      id: "activities",
      phrases: [
        "what activities is farhan involved in",
        "clubs and activities",
        "community involvement",
        "what clubs"
      ],
      keywords: ["activities", "data science club", "robotics club", "volunteer", "hackathon"],
      answer:
        "Farhan's profile includes the DIU Data Science Club, DIU Robotics Club, and volunteer work around tech events and hackathons.",
      links: [{ label: "Open Activities", href: "#activities" }],
      quickReplies: [
        { label: "Education", message: "What is Farhan's education background?" },
        { label: "Projects", message: "What projects has Farhan built?" }
      ]
    },
    {
      id: "contact",
      phrases: [
        "how can i contact farhan",
        "contact info",
        "hire farhan",
        "how do i reach farhan"
      ],
      keywords: ["contact", "hire", "email", "phone", "whatsapp", "facebook"],
      answer:
        "The best direct contact is alam22205341122@diu.edu.bd, with f05076963@gmail.com as the secondary email. The site also includes phone, WhatsApp, Facebook, resume, and GitHub links in the Hire Me section.",
      links: [
        { label: "Open Hire Me", href: "#contact" },
        { label: "Open Resume", href: "assets/farhan-cv-resume.pdf" }
      ],
      quickReplies: [
        { label: "Download Resume", message: "Can I view Farhan's resume?" },
        { label: "GitHub", message: "Where is Farhan's GitHub?" },
        { label: "Projects", message: "What projects has Farhan built?" }
      ]
    },
    {
      id: "resume",
      phrases: [
        "can i view farhan's resume",
        "download resume",
        "show the resume",
        "cv"
      ],
      keywords: ["resume", "cv", "download", "pdf"],
      answer:
        "Yes. Farhan's resume is available directly from the site through the resume buttons in the hero and Hire Me sections.",
      links: [
        { label: "Open Resume", href: "assets/farhan-cv-resume.pdf" },
        { label: "Open Hire Me", href: "#contact" }
      ],
      quickReplies: [
        { label: "Contact Info", message: "How can I contact Farhan?" },
        { label: "Projects", message: "What projects has Farhan built?" }
      ]
    },
    {
      id: "github",
      phrases: [
        "where is farhan's github",
        "github profile",
        "source code",
        "site source"
      ],
      keywords: ["github", "source", "repository", "repo"],
      answer:
        "Farhan's GitHub profile is linked from the Hire Me section, and the site source is also available there.",
      links: [
        { label: "Open Hire Me", href: "#contact" },
        { label: "Open GitHub", href: "https://github.com/farhan22025" }
      ],
      quickReplies: [
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "Writings", message: "What is in the Writings and Research section?" }
      ]
    },
    {
      id: "location",
      phrases: [
        "where is farhan based",
        "location",
        "where is he from",
        "map"
      ],
      keywords: ["dhaka", "bangladesh", "ashulia", "diu", "map"],
      answer:
        "Farhan is based in Dhaka, Bangladesh, and the map section also highlights Daffodil International University in Ashulia.",
      links: [
        { label: "Open Map", href: "#map-section" },
        { label: "Open Hire Me", href: "#contact" }
      ],
      quickReplies: [
        { label: "Education", message: "What is Farhan's education background?" },
        { label: "Contact", message: "How can I contact Farhan?" }
      ]
    },
    {
      id: "site",
      phrases: [
        "how was this site built",
        "what is this site built with",
        "theme toggle",
        "chatbot"
      ],
      keywords: ["site", "html", "css", "javascript", "leaflet", "theme", "chatbot"],
      answer:
        "The portfolio is a static HTML, CSS, and JavaScript site with a rule-based portfolio assistant, a theme toggle, smooth sections, and a Leaflet-powered map.",
      links: [
        { label: "Open Home", href: "#home" },
        { label: "Open Map", href: "#map-section" }
      ],
      quickReplies: [
        { label: "Projects", message: "What projects has Farhan built?" },
        { label: "Contact", message: "How can I contact Farhan?" }
      ]
    }
  ]
};
