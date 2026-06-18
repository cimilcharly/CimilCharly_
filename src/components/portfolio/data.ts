export const profile = {
  name: "Cimil Charly",
  role: "AI/ML Engineer · Full-Stack Developer",
  location: "Bengaluru, India",
  email: "cimilcharly@gmail.com",
  phone: "+91 89214 94024",
  github: "https://github.com/cimilcharly",
  linkedin: "https://linkedin.com/in/cimil-charly",
  resume: "/Cimil_Charly_Resume.pdf",
  available: true,
  intro:
    "Final-year B.Tech student in Computer Science (AI & ML) at CHRIST University. I build intelligent, full-stack products — from LLM-driven systems to production ERP modules.",
};

export const projects = [
  {
    id: "sentinel-ai",
    name: "Sentinel AI",
    folder: "ai-saas",
    color: "from-red-400/30 to-amber-400/20",
    tagline: "Enterprise-grade insider threat detection with Hybrid AI.",
    description:
      "A production-ready SaaS platform for detecting insider threats using a hybrid ML + LLM pipeline. Features a FastAPI backend with 15+ endpoints, React frontend with 7 pages, multi-tenant PostgreSQL, real-time webhooks, and Docker deployment.",
    features: [
      "Hybrid ML (Isolation Forest) + LLM (GPT-4) threat detection",
      "Multi-tenant SaaS with Role-Based Access Control",
      "Real-time webhook ingestion from Office365, Splunk & Active Directory",
      "Automated threat reports & Stripe billing integration",
    ],
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "GPT-4", "Next.js"],
    github: "https://github.com/cimilcharly/Sentinel-AI",
    demo: null,
  },
  {
    id: "promiseos",
    name: "PromiseOS",
    folder: "web-app",
    color: "from-violet-400/30 to-blue-400/20",
    tagline: "A modern Next.js web application, live on Vercel.",
    description:
      "A TypeScript-powered Next.js application deployed on Vercel. Built with modern web standards, optimized fonts (Geist), and a clean, production-ready architecture.",
    features: [
      "Next.js App Router with TypeScript",
      "Optimized with Geist font family (Vercel)",
      "Deployed and live on Vercel",
      "Modern, production-ready web architecture",
    ],
    stack: ["Next.js", "TypeScript", "React", "Vercel"],
    github: "https://github.com/cimilcharly/Promiseos",
    demo: "https://promiseos.vercel.app",
  },
  {
    id: "pet-pantry",
    name: "Pet Pantry — E-Commerce",
    folder: "full-stack",
    color: "from-cyan-400/30 to-indigo-400/20",
    tagline: "Full-stack Django storefront for pet supplies.",
    description:
      "A complete e-commerce experience: catalog browsing, cart, secure auth, order flow, and a responsive Bootstrap UI. Deployed and live.",
    features: [
      "Secure user authentication & sessions",
      "Product catalog with cart and checkout",
      "Responsive front-end across devices",
      "Iteratively tested & deployed to Render",
    ],
    stack: ["Django", "Python", "Bootstrap", "SQLite"],
    github: "https://github.com/cimilcharly/Pet-Pantry",
    demo: "https://pet-pantry-awdx.onrender.com",
  },
  {
    id: "med-reminder",
    name: "Medical Reminder App",
    folder: "mobile",
    color: "from-emerald-400/30 to-teal-400/20",
    tagline: "Native Android reminders with offline sync.",
    description:
      "Android app that reliably reminds users to take medication. Firebase for real-time sync, SQLite for offline storage, and an accessible UI.",
    features: [
      "Scheduling & notification engine",
      "Firebase real-time sync",
      "SQLite offline storage",
      "Accessible, friendly UI",
    ],
    stack: ["Kotlin", "Java", "Firebase", "SQLite", "Android"],
    github: "https://github.com/cimilcharly",
    demo: null,
  },
];

export const experience = [
  {
    role: "Software Development Intern",
    company: "Genrobotics Innovations Pvt. Ltd.",
    where: "Technopark, Thiruvananthapuram",
    when: "Apr 2026 – May 2026",
    notes: [
      "Built ERP modules that streamlined organizational workflows and improved reporting efficiency.",
      "Integrated software components and supported implementation based on operational requirements.",
      "Owned testing, debugging and issue resolution across application surfaces.",
      "Collaborated with engineers and stakeholders to translate requirements into shipped software.",
      "Maintained technical documentation for knowledge transfer and future enhancements.",
    ],
  },
  {
    role: "B.Tech in Computer Science (AI & ML)",
    company: "CHRIST (Deemed to be University)",
    where: "Bengaluru, India",
    when: "2023 – 2027 · CGPA 8.8 / 10",
    notes: [
      "Coursework: DSA, DBMS, Operating Systems, Computer Networks, Machine Learning, Software Engineering.",
      "Member — Industry Institute Interaction Cell (IIIC).",
      "General Leader — National Service Scheme (NSS).",
    ],
  },
  {
    role: "Higher Secondary — Computer Science",
    company: "St. Mary's HSS, Kottayam",
    where: "Kerala, India",
    when: "2021 – 2023 · 97% aggregate",
    notes: [
      "School Representative; Troop Leader — Bharat Scouts and Guides.",
    ],
  },
];

export const skillGroups = [
  {
    name: "Languages",
    items: ["Python", "Java", "C", "JavaScript", "Kotlin"],
  },
  {
    name: "Frameworks",
    items: ["Django", "Bootstrap", "Streamlit"],
  },
  {
    name: "Databases",
    items: ["MongoDB", "MySQL", "SQLite", "Firebase"],
  },
  {
    name: "Tools",
    items: ["Git", "GitHub", "Postman", "Android Studio"],
  },
  {
    name: "Concepts",
    items: ["Machine Learning", "NLP", "LLMs", "REST APIs", "OOP", "SDLC"],
  },
];

export const certifications = [
  "Government of India Copyright Registration — Research Work",
  "Introduction to IoT — NPTEL, IIT Kharagpur",
  "Build Your Own Chatbot — IBM",
  "Programming for Data Analytics — L&T EduTech",
];