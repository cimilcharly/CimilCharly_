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
    id: "insider-threat",
    name: "LLM Insider Threat Detection",
    folder: "ai-research",
    color: "from-amber-400/30 to-rose-400/20",
    tagline: "Behavioral analytics + LLM risk scoring for insider threats.",
    description:
      "An AI framework that flags suspicious insider activity from email logs and system telemetry. Uses LLM-based risk scoring layered on behavioral analytics, with a real-time Streamlit dashboard.",
    features: [
      "LLM-based risk scoring of user behavior",
      "Behavioral analytics over communication + system logs",
      "Interactive Streamlit dashboard with live alerts",
      "Modular architecture for future detectors",
    ],
    stack: ["Python", "LLMs", "NLP", "Streamlit", "SQLite"],
    github: "https://github.com/cimilcharly",
    demo: null,
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
    github: "https://github.com/cimilcharly",
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