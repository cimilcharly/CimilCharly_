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
    "Final-year B.Tech student in Computer Science (AI & ML) at CHRIST University. I architect intelligent AI systems, formal verification & compiler tooling, high-throughput API gateways, and modern full-stack platforms.",
};

export const projects = [
  {
    id: "parity-sql",
    name: "Parity",
    folder: "compiler",
    color: "from-blue-500/30 to-violet-500/20",
    tagline: "Oracle to PostgreSQL transpilation with 5-layer mathematical verification.",
    description:
      "A deterministic-first migration engine that transpiles Oracle SQL & PL/SQL dialects to PostgreSQL with zero raw data leakage. Combines AST rewrite rules with a 5-layer mathematical verification stack (syntax parsing, type schema parity, relational algebra, differential symbolic execution, and automated GitHub PR generation), achieving a 94% verified pass rate across a 500-object enterprise benchmark.",
    features: [
      "Deterministic AST transpilation & dialect-specific rewrite rules",
      "5-layer mathematical verification stack with symbolic execution",
      "94% verified pass rate across 500 enterprise SQL & PL/SQL objects",
      "Zero raw data leakage architecture with automated GitHub PR generation",
    ],
    stack: ["Python", "SQL", "PostgreSQL", "Oracle", "AST", "Symbolic Execution", "Docker"],
    github: "https://github.com/cimilcharly/Parity-sql",
    demo: null,
  },
  {
    id: "flow-sense",
    name: "FlowSense",
    folder: "ai-gateway",
    color: "from-emerald-400/30 to-cyan-500/20",
    tagline: "High-performance AI API Gateway with semantic caching and guardrails.",
    description:
      "An open-source AI reverse proxy and observability engine for production LLMs. Features sub-20ms semantic caching via SentenceTransformers and Redis, real-time DeBERTa-based hallucination detection, Qdrant vector guardrails against prompt injection/PII leaks, and dynamic cost-routing between models based on prompt complexity.",
    features: [
      "Semantic Caching with SentenceTransformers & Redis (<20ms latency)",
      "Real-time hallucination detection & context grounding using DeBERTa",
      "Security guardrails blocking prompt injection & PII leaks via Qdrant",
      "Dynamic prompt complexity evaluation and model cost-routing",
    ],
    stack: ["Python", "FastAPI", "Redis", "Qdrant", "SentenceTransformers", "DeBERTa", "LLMs"],
    github: "https://github.com/cimilcharly/Flow-Sense",
    demo: null,
  },
  {
    id: "secure-ai-inspection",
    name: "Secure AI Quality Inspector",
    folder: "edge-cv",
    color: "from-purple-500/30 to-pink-500/20",
    tagline: "Edge fabric defect detection with YOLOv8, PatchCore & Federated Learning.",
    description:
      "An industrial fabric defect inspection and anomaly detection platform. Detects known defects across 4 categories with YOLOv8m, detects unseen anomalies via PatchCore, calculates real-time severity and financial loss in INR (₹), provides Grad-CAM visual heatmaps, and secures edge communications with AES-256-GCM and a 3-node federated learning simulation (FedAvg).",
    features: [
      "Hybrid CV engine: YOLOv8m defect detection + PatchCore anomaly discovery",
      "Grad-CAM visual explainability & real-time defect cost impact scoring (₹)",
      "End-to-end security: AES-256-GCM encryption and SHA-256 integrity checks",
      "3-node federated learning simulation (FedAvg) across distributed factories",
    ],
    stack: ["Python", "FastAPI", "Streamlit", "YOLOv8", "PatchCore", "PyTorch", "Grad-CAM", "Cryptography"],
    github: "https://github.com/cimilcharly/Secure-AI-powered-industrial-quality-monitoring-system",
    demo: null,
  },
  {
    id: "sentinel-ai",
    name: "Sentinel AI",
    folder: "ai-saas",
    color: "from-red-500/30 to-amber-500/20",
    tagline: "Enterprise insider threat detection powered by Hybrid AI (ML + LLM).",
    description:
      "A production SaaS platform detecting insider threats using a hybrid ML (Isolation Forest) and LLM (GPT-4) pipeline. Features a FastAPI backend with 15+ endpoints, React frontend with 7 pages, multi-tenant PostgreSQL with RBAC, sub-100ms real-time webhook ingestion from Office365, Splunk, and Active Directory, and Stripe billing.",
    features: [
      "Hybrid ML (Isolation Forest) + LLM (GPT-4) threat detection",
      "Multi-tenant SaaS architecture with granular Role-Based Access Control",
      "Sub-100ms webhook ingestion for Office365, Splunk & Active Directory",
      "Automated threat reports, audit logs & Stripe billing integration",
    ],
    stack: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "GPT-4", "Next.js", "Stripe"],
    github: "https://github.com/cimilcharly/Sentinal__AI",
    demo: "https://sentinal-ai-alpha.vercel.app",
  },
  {
    id: "vendoriq",
    name: "VendorIQ",
    folder: "decision-ai",
    color: "from-sky-500/30 to-indigo-500/20",
    tagline: "Decision intelligence & procurement analytics SaaS for SMEs.",
    description:
      "A SaaS platform helping businesses make data-driven vendor selection decisions. Implements Multi-Criteria Decision Analysis (MCDA) and TOPSIS algorithms to rank vendors against complex operational criteria, featuring dynamic scenario simulation, interactive Recharts dashboards, and role-based access control.",
    features: [
      "TOPSIS & Weighted Sum Multi-Criteria Decision Analysis (MCDA) engine",
      "Dynamic what-if scenario simulations and sensitivity modeling",
      "Executive analytics dashboards with interactive Recharts visualizations",
      "FastAPI REST API, PostgreSQL persistence with SQLAlchemy & Redis caching",
    ],
    stack: ["FastAPI", "Python", "Next.js 14", "TypeScript", "PostgreSQL", "Redis", "Docker", "Tailwind CSS"],
    github: "https://github.com/cimilcharly/VendorIQ",
    demo: "https://vendor-iq-pink.vercel.app",
  },
  {
    id: "prepify-interview",
    name: "Prepify",
    folder: "voice-ai",
    color: "from-fuchsia-500/30 to-rose-500/20",
    tagline: "Real-time AI voice mock interviews with Gemini & Vapi SDK.",
    description:
      "An AI-powered SaaS platform for realistic mock interviews. Features conversational voice interactions using Vapi SDK, intelligent question generation and answer evaluation powered by Google Gemini and ChatGPT APIs, Firebase authentication and Firestore data persistence, and performance tracking.",
    features: [
      "Real-time conversational voice mock interviews powered by Vapi SDK",
      "Dual LLM feedback scoring with Google Gemini API & ChatGPT",
      "Live session recording, performance metrics & instant feedback",
      "Secure Firebase authentication and real-time Firestore database",
    ],
    stack: ["Next.js", "React", "TypeScript", "Vapi SDK", "Gemini API", "Firebase", "Tailwind CSS"],
    github: "https://github.com/cimilcharly/prepify-interview",
    demo: "https://prepify-interview.vercel.app",
  },
  {
    id: "promiseos",
    name: "PromiseOS",
    folder: "web-app",
    color: "from-violet-400/30 to-blue-400/20",
    tagline: "Modern Next.js web application built for speed and clarity.",
    description:
      "A TypeScript-powered Next.js application deployed on Vercel. Engineered with modern web standards, App Router, Geist font typography, and a clean, responsive production architecture.",
    features: [
      "Next.js App Router with TypeScript",
      "Optimized with Geist font family (Vercel)",
      "Deployed and live on Vercel",
      "Clean, responsive component architecture",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Vercel"],
    github: "https://github.com/cimilcharly/Promiseos",
    demo: "https://promiseos.vercel.app",
  },
  {
    id: "pet-pantry",
    name: "Pet Pantry",
    folder: "full-stack",
    color: "from-cyan-400/30 to-indigo-400/20",
    tagline: "Full-stack Django storefront for pet supplies.",
    description:
      "A complete e-commerce experience: catalog browsing, cart, secure auth, order flow, and a responsive Bootstrap UI. Deployed and live on Render.",
    features: [
      "Secure user authentication & sessions",
      "Product catalog with cart and checkout",
      "Responsive front-end across devices",
      "Iteratively tested & deployed to Render",
    ],
    stack: ["Django", "Python", "Bootstrap", "SQLite", "Render"],
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
    role: "Artificial Intelligence Intern",
    company: "HL Mando Softtech India Pvt. Ltd. (HL MSI)",
    where: "Bengaluru, India",
    when: "Aug 2026 – Present",
    notes: [
      "Developing a Python-based pipeline to consolidate structured and semi-structured Excel data into clean, standardized JSON output.",
      "Processing Excel workbooks using OpenPyXL and Pandas, handling merged cells, headers, missing values, empty rows/columns, and inconsistent data structures.",
      "Designing data transformation and validation logic to preserve meaningful headings and row-level information while generating consistent JSON records.",
      "Experimenting with and refining the data-processing workflow to improve accuracy, consistency, and usability of the generated output.",
    ],
  },
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
    items: ["Python", "TypeScript", "JavaScript", "SQL", "Java", "Kotlin", "C", "Bash"],
  },
  {
    name: "AI & ML Systems",
    items: [
      "LLMs & RAG",
      "Semantic Caching",
      "DeBERTa",
      "Qdrant / Vector DBs",
      "YOLOv8 & CV",
      "PatchCore & Grad-CAM",
      "Federated Learning (FedAvg)",
      "Vapi Voice AI",
      "Isolation Forest",
    ],
  },
  {
    name: "Frameworks & Backend",
    items: [
      "FastAPI",
      "Next.js",
      "React",
      "Django",
      "PyTorch",
      "Streamlit",
      "Pandas",
      "OpenPyXL",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    name: "Databases & Storage",
    items: ["PostgreSQL", "Redis", "MongoDB", "MySQL", "SQLite", "Firebase"],
  },
  {
    name: "DevOps & Cloud",
    items: ["Docker", "Vercel", "Render", "Git", "GitHub", "Postman", "Android Studio"],
  },
  {
    name: "Architecture & Systems",
    items: [
      "Deterministic Transpilation & ASTs",
      "5-Layer Mathematical Verification",
      "AI Gateways & Proxies",
      "MCDA & TOPSIS Algorithms",
      "RESTful APIs",
      "RBAC & Security",
      "OOP & SDLC",
    ],
  },
];

export const certifications = [
  "Government of India Copyright Registration — Research Work",
  "Introduction to IoT — NPTEL, IIT Kharagpur",
  "Build Your Own Chatbot — IBM",
  "Programming for Data Analytics — L&T EduTech",
];