export interface KnowledgeSourceDocument {
    id: string;
    title: string;
    category:
        | "company"
        | "digital-solutions"
        | "products"
        | "academics"
        | "internships"
        | "projects"
        | "technologies"
        | "announcements"
        | "location"
        | "contact"
        | "pricing"
        | "ecosystem"
        | "legal";
    sourceUrl: string;
    route: string;
    content: string;
    summary: string;
    keywords: string[];
    suggestedOptions: string[];
    lastUpdated: string;
}

/**
 * Official SS40 NETWORK Knowledge Corpus
 * Sourced directly from:
 * 1. Official Live Website (https://ss40network.com)
 * 2. Live Client Projects (https://ss40network.com/client-projects)
 * 3. Live Student Capstone Projects (https://ss40network.com/academics/student-projects)
 * 4. Official LinkedIn Company Page (https://www.linkedin.com/company/ss40-network/)
 * 5. Ministry of Corporate Affairs (MCA) Corporate Incubation Records
 */
export const OFFICIAL_SS40_CORPUS: KnowledgeSourceDocument[] = [
    {
        id: "doc-company-overview",
        title: "SS40 NETWORK Corporate Profile & Guiding Vision",
        category: "company",
        sourceUrl: "https://ss40network.com/#about",
        route: "/#about",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Overview of SS40 NETWORK PRIVATE LIMITED, vision, leadership, motto, and headquarters.",
        keywords: [
            "about", "company", "ss40", "network", "overview", "founded", "history", "vision", 
            "mission", "built in india", "who founded", "what is ss40", "ss40 network", "private limited", 
            "sivasubramanian", "ceo", "founder", "mca", "incorporation", "management", "motto", "slogan",
            "a little bit more"
        ],
        suggestedOptions: ["Three Wings", "Digital Solutions", "SS40 Products", "SS40 Academics"],
        content: `SS40 NETWORK PRIVATE LIMITED is an Indian technology firm and academy founded in 2023 with the guiding vision: "Built in India. Thinking Globally." and the corporate motto: "A LITTLE BIT MORE - We solve your pain points through digital innovations."
- Founder & CEO: M. Sivasubramanian.
- Legal Status: 100% MCA Registered Private Limited under the Ministry of Corporate Affairs, Government of India.
- Headquarters: 1st Floor, Municipal Corporation Incubation Centre (Near Trade Centre), Sree Puram, Tirunelveli, Tamil Nadu 627001, India.
- Contact: support@ss40network.com | +91 83005 91750 | Official website: https://ss40network.com
- Three Specialized Business Wings: SS40 Digital Solutions (custom enterprise software & AI), SS40 Products (business software platforms like ClearInvoice, GTC Suite, AI Email Agent), and SS40 Academics (practical software engineering internships & placement preparation).
- Delivery Commitments: Fixed-scope deliverables, 30-day post-launch warranty, enterprise security, and 99.99% uptime guarantee.`
    },
    {
        id: "doc-three-wings",
        title: "Three Business Wings of SS40 NETWORK",
        category: "company",
        sourceUrl: "https://ss40network.com/#business-wings",
        route: "/#business-wings",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "The three core divisions of SS40 NETWORK: Digital Solutions, Products, and Academics.",
        keywords: [
            "three wings", "3 wings", "wings", "ecosystem", "divisions", "what you do", 
            "services", "business wings", "offerings", "all wings", "portfolio"
        ],
        suggestedOptions: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Talk to Team"],
        content: `SS40 NETWORK operates across Three Specialized Wings:
1. SS40 Digital Solutions: Custom software development, enterprise web applications (Next.js/React), iOS/Android mobile platforms, cloud architectures, and AI workflow automations.
2. SS40 Products: Scalable business software platforms including ClearInvoice (automated GST billing & inventory management), GTC Suite (enterprise management), and SS40 AI Email Agent (zero-latency inbox automation).
3. SS40 Academics: Practical learning academy providing live production project internships, DSA technical problem-solving mastery, placement acceleration, and university MOUs.`
    },
    {
        id: "doc-digital-solutions-overview",
        title: "SS40 Digital Solutions - Custom Software Development",
        category: "digital-solutions",
        sourceUrl: "https://ss40network.com/digital-solutions",
        route: "/digital-solutions",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Custom full-stack web and mobile software development services by SS40 Digital Solutions.",
        keywords: [
            "digital solutions", "custom software", "web development", "mobile app", "full stack", 
            "react", "nextjs", "nodejs", "python", "backend", "frontend", "api", "cloud", 
            "architecture", "database", "software development", "web app", "ios", "android", "enterprise software"
        ],
        suggestedOptions: ["Request Project Quote", "Client Projects", "AI Automations", "Contact Solutions Team"],
        content: `SS40 Digital Solutions provides full-lifecycle custom software engineering:
- Web Application Engineering: High-speed, secure web applications built using Next.js, React, Node.js, TypeScript, PostgreSQL, and modern cloud infrastructure.
- Mobile App Development: High-performance native and cross-platform mobile apps for iOS and Android.
- Enterprise Software: Custom ERPs, CRMs, interactive analytics dashboards, and business automation platforms.
- Cloud Architecture & DevOps: Scalable serverless and microservice systems with 99.99% uptime and enterprise security.
- Client Assurance: Fixed-scope deliverables, transparent milestone tracking, and a 30-day post-launch warranty.`
    },
    {
        id: "doc-ai-workflow-automation",
        title: "AI & Workflow Automation Services",
        category: "digital-solutions",
        sourceUrl: "https://ss40network.com/digital-solutions#what-we-build",
        route: "/digital-solutions",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Intelligent AI assistants, automated business pipelines, and workflow automation solutions.",
        keywords: [
            "ai", "artificial intelligence", "automation", "workflow", "machine learning", 
            "bot", "llm", "data sync", "intelligent software", "ai agents", "chatbots", "rag", "sky"
        ],
        suggestedOptions: ["Request AI Quote", "SS40 Digital Solutions", "Contact Solutions Team"],
        content: `SS40 Digital Solutions engineers custom AI and automated workflow engines:
- Intelligent Chatbots & Assistants: Tailored neural AI agents (such as SS40 SKY) integrated into corporate software and customer portals.
- Business Process Automation: Eliminates repetitive manual tasks, streamlining ticketing, billing, and document operations.
- Real-Time Data Pipelines: Synchronizes data across CRMs, ERPs, databases, and alerting systems with zero latency.`
    },
    {
        id: "doc-development-lifecycle",
        title: "SS40 Software Development Lifecycle & Methodology",
        category: "digital-solutions",
        sourceUrl: "https://ss40network.com/digital-solutions#lifecycle",
        route: "/digital-solutions",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Four-phase delivery lifecycle: Discovery, Sprint Engineering, Rigorous QA, and Deployment.",
        keywords: [
            "lifecycle", "process", "methodology", "how you work", "sprints", "agile", 
            "qa", "testing", "timeline", "delivery", "warranty"
        ],
        suggestedOptions: ["Request Project Quote", "SS40 Digital Solutions", "Contact Team"],
        content: `SS40 Digital Solutions follows a disciplined 4-stage engineering lifecycle:
1. Discovery & Architecture: Comprehensive requirements scoping, technical design, database schema, and fixed milestones.
2. Agile Sprint Engineering: High-velocity bi-weekly sprint deliverables with direct client review demos.
3. Rigorous QA & Security Audit: End-to-end automated testing, load testing, and enterprise security compliance.
4. Deployment & 30-Day Warranty: Zero-downtime production deployment backed by a 30-day post-launch support warranty.`
    },
    {
        id: "doc-products-portfolio",
        title: "SS40 Products - Business Software Suite",
        category: "products",
        sourceUrl: "https://ss40network.com/products",
        route: "/products",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "In-house SS40 Products including ClearInvoice, SS40 AI Email Agent, and GTC Suite.",
        keywords: [
            "products", "product", "software products", "clearinvoice", "gtc suite", 
            "ai email agent", "software tools", "erp", "cloud platforms", "ss40 products", "all products"
        ],
        suggestedOptions: ["ClearInvoice Product", "Book Product Demo", "SS40 Digital Solutions", "Contact Sales"],
        content: `SS40 Products engineers high-impact software products built for real business challenges:
- ClearInvoice (https://invoice.ss40network.cloud/): Smart invoicing built for modern businesses and SMEs. Offers automated GST billing, instant invoice generation, online payment collections via Razorpay, Google Drive document synchronization, and inventory tracking. Free tier available.
- SS40 AI Email Agent: "Zero-Latency Inbox" — Intelligent contextual drafting and email inbox automation. Helps businesses handle inbound inquiries and drafts response suggestions in real time.
- GTC Suite: "Enterprise Scale" — Comprehensive enterprise operations and business management platform.
- Infrastructure: High-availability cloud architecture with multi-tenant data isolation, automated daily backups, and a 99.99% uptime guarantee.`
    },
    {
        id: "doc-clearinvoice-product",
        title: "ClearInvoice - Smart Invoicing & GST Billing Solution",
        category: "products",
        sourceUrl: "https://ss40network.com/products#featured-product",
        route: "/products",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Automated GST invoicing, real-time inventory management, Razorpay payment links, and Google Drive sync.",
        keywords: [
            "clearinvoice", "invoice", "billing", "gst", "invoicing", "inventory", 
            "products", "product", "billing engine", "99.99% uptime", "demo clearinvoice", "clear invoice", "razorpay"
        ],
        suggestedOptions: ["Book ClearInvoice Demo", "SS40 Products", "Contact Sales"],
        content: `ClearInvoice is a flagship product developed by SS40 Products (live at https://invoice.ss40network.cloud/):
- Core Capabilities: Automated GST compliance billing, instant PDF invoicing, real-time inventory tracking, payment collection via Razorpay, auto-sync documents securely to Google Drive, and revenue analytics.
- Target Audience: Small and Medium Enterprises (SMEs), retailers, freelancers, and growing businesses across India.
- Free Plan: Free tier available to help businesses get started immediately with zero upfront cost.
- Live Walkthrough: Personalized 1-on-1 live product demo available for business owners and accounting teams.`
    },
    {
        id: "doc-live-client-projects",
        title: "SS40 Client Projects & Case Studies (Live Deployments)",
        category: "projects",
        sourceUrl: "https://ss40network.com/client-projects",
        route: "/client-projects",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Verified enterprise client projects delivered: Y.G / Mayil Agro Foods, Annai Eva's Kitchen, and Jalsa Restaurant.",
        keywords: [
            "client projects", "case studies", "clients", "portfolio", "deployments", "mayil agro foods", 
            "yg agro", "annai eva kitchen", "jalsa restaurant", "restaurant billing", "ecommerce platform", "branding"
        ],
        suggestedOptions: ["Digital Solutions", "Start Your Project", "SS40 Products", "Contact Team"],
        content: `SS40 NETWORK has engineered and delivered high-impact digital solutions for commercial clients:
1. Y.G / Mayil Agro Foods (E-Commerce Platform):
   - Industry: Manufacturing / Agro Foods.
   - Project: Dedicated Direct-to-Consumer (D2C) e-commerce platform for Y.G, a food brand known for asafoetida and health mixes. Enables customers to browse products, manage purchases, and complete secure online transactions. (Attributes: Faster, Modern, Stable, Completed).
2. Branding (Logo) - Annai Eva's Kitchen:
   - Industry: Multicuisine Restaurant / Hospitality.
   - Project: Complete brand identity and visual language created around "Tradition Served with Elegance", combining traditional Indian influences with contemporary aesthetics across signage, menus, packaging, and digital media. (Attributes: Traditional, Elegant, Theme Based, Completed).
3. Faster Restaurant Billing System - Jalsa Restaurant:
   - Industry: Restaurant & Hospitality (Hosur).
   - Project: Custom restaurant management system built specifically for a non-technical staff workflow. Covers rapid billing, GST invoices, kitchen tokens, and financial analysis & reporting. Result: faster checkout and streamlined operations. (Attributes: Fast, Simple, Reliable, Completed).`
    },
    {
        id: "doc-academics-overview",
        title: "SS40 Academics - Practical Software Engineering Academy",
        category: "academics",
        sourceUrl: "https://ss40network.com/academics",
        route: "/academics",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Bridging the gap between academic study and real-world engineering through live project sprints in Tirunelveli.",
        keywords: [
            "academic", "academics", "academic program", "student", "education", "training", 
            "courses", "college program", "study", "learning", "admissions", "ss40 academics", "internship", "tirunelveli"
        ],
        suggestedOptions: ["Internship Sprints", "Student Projects", "Placement Prep", "University MOUs"],
        content: `SS40 Academics bridges the gap between academic education and industry software engineering with the motto: "Learn by Doing. Build Fast. Grow Beyond."
- Practical Project-Based Internships: Students write production-ready code with Git/GitHub workflows and modern tech stacks (React, Next.js, Node.js, TypeScript).
- Career Launch Pad: Comprehensive preparation for Data Structures & Algorithms (DSA) and mock technical interviews.
- Direct Placement Referrals: Connects job-ready graduates to hiring partner tech firms.
- Institutional Collaborations: University MOUs, technical workshops, and campus innovation labs.`
    },
    {
        id: "doc-academics-internships",
        title: "SS40 Academic Internship Sprints",
        category: "internships",
        sourceUrl: "https://ss40network.com/academics#internships",
        route: "/academics",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Hands-on tech internships building real production software with senior engineer code reviews.",
        keywords: [
            "internship", "intern", "sprint", "live project", "hands-on", "fresher", 
            "practical learning", "certificate", "skills", "apply internship", "academic", "training"
        ],
        suggestedOptions: ["Student Projects", "Placement Prep", "University Partnerships", "Apply for Internship"],
        content: `SS40 Academics delivers hands-on, project-based internship sprints:
- Production Codebase: Students build real-world full-stack web and mobile apps using Next.js, React, Node.js, TypeScript, and Git/GitHub workflows.
- Senior Mentorship: 1-on-1 code reviews and software architecture guidance from senior software engineers.
- Verified Credentials: Industry-recognized internship completion certificates and public GitHub portfolio repositories.`
    },
    {
        id: "doc-academics-placements",
        title: "Career Launch Pad & Placement Acceleration",
        category: "academics",
        sourceUrl: "https://ss40network.com/academics#placements",
        route: "/academics",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "DSA training, 1-on-1 mock technical interviews, resume building, and hiring referrals.",
        keywords: [
            "placement", "job", "career", "hiring", "interview", "resume", "aptitude", 
            "mock interview", "placement support", "dsa", "coding batch", "salary", "hiring partners"
        ],
        suggestedOptions: ["Internship Sprints", "Student Projects", "SS40 Academics", "Contact Academic Team"],
        content: `SS40 Career Launch Pad:
- DSA & Problem Solving: Rigorous preparation in Data Structures, Algorithms, and technical coding interview rounds.
- Simulated Mock Interviews: 1-on-1 simulated technical and HR interviews with actionable feedback.
- Tech Hiring Network: Direct referrals to startup and enterprise tech hiring partner companies.`
    },
    {
        id: "doc-live-student-projects",
        title: "Live Student Capstone Projects Showcase (SS40 Academics)",
        category: "projects",
        sourceUrl: "https://ss40network.com/academics/student-projects",
        route: "/academics/student-projects",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Innovative projects built by SS40 Academics students: LectureCast, WaveLink, and StudentOS.",
        keywords: [
            "student project", "student projects", "showcase", "built by students", "lecturecast", 
            "wavelink", "studentos", "student management system", "screen sharing", "wireless mic", "live projects"
        ],
        suggestedOptions: ["Browse Student Projects", "Internship Sprints", "SS40 Academics"],
        content: `Verified Student Projects built during SS40 Academic Internship Sprints (featured on https://ss40network.com/academics/student-projects):
1. LectureCast (Live at https://lecturecast.space-z.ai/):
   - Category: Innovation / EdTech.
   - Solves: Classroom screen sharing during network instability.
   - Description: Screen sharing built specifically for college classrooms. The professor broadcasts and students receive directly over the local college Wi-Fi, ensuring internet outages never disconnect the class.
2. WaveLink:
   - Category: Innovation Tech / Audio.
   - Solves: Costly classroom audio equipment.
   - Description: Turns any smartphone into a wireless microphone with zero app installation, zero internet access required, and no extra hardware.
3. StudentOS – Student Management System:
   - Category: Web Development.
   - Description: A modern student management platform designed to simplify and centralize essential academic and student-related activities through a user-friendly web interface.`
    },
    {
        id: "doc-academics-colleges-mous",
        title: "University MOUs & College Innovation Labs",
        category: "academics",
        sourceUrl: "https://ss40network.com/academics#collaborations",
        route: "/academics",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Institutional MOUs, campus technical masterclasses, hackathons, and innovation labs.",
        keywords: [
            "college", "university", "institution", "mou", "faculty", "workshop", 
            "guest lecture", "collaboration", "campus", "curriculum", "hackathon"
        ],
        suggestedOptions: ["University MOUs", "SS40 Academics", "Contact Academic Desk", "Office Location"],
        content: `SS40 Institutional Partnerships:
- Institutional MOUs: Co-developed industry-aligned curricula for engineering and computer science institutions.
- Campus Technical Workshops: Masterclasses in full-stack engineering, AI automation, and cloud deployments.
- Innovation Labs: Setting up student incubation centers and practical software labs inside campuses.`
    },
    {
        id: "doc-ecosystem-tirunelveli",
        title: "Regional Tech Ecosystem & Tirunelveli Innovation",
        category: "ecosystem",
        sourceUrl: "https://ss40network.com/#about",
        route: "/#about",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Regional presence at the Municipal Corporation Incubation Centre and local tech leadership.",
        keywords: [
            "tirunelveli", "ecosystem", "collector", "nelstia", "incubation", "government", 
            "tamil nadu", "local", "regional", "innovation", "sree puram", "startup"
        ],
        suggestedOptions: ["Office Location", "About SS40 NETWORK", "Three Wings", "Contact Office"],
        content: `SS40 NETWORK in the Regional Ecosystem:
- Incubation Center: Located at 1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli.
- District Initiatives: Actively presented AI and entrepreneurship initiatives to the Tirunelveli District Administration.
- Industry Partnerships: Collaborated with regional bodies like NELSTIA to connect local engineering talent with enterprise software opportunities.`
    },
    {
        id: "doc-office-location",
        title: "Office Location, Visiting Details & Business Hours",
        category: "location",
        sourceUrl: "https://ss40network.com/contact",
        route: "/contact",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Physical office location in Tirunelveli, business timings, and Google Maps directions.",
        keywords: [
            "location", "office", "address", "where", "visit", "hours", "timing", "city", 
            "tirunelveli", "tamil nadu", "india", "map", "google map", "sree puram", "incubation centre"
        ],
        suggestedOptions: ["WhatsApp Support", "Contact Office", "Email Support", "About SS40 NETWORK"],
        content: `SS40 NETWORK Office Details:
- Physical Address: 1st Floor, Municipal Corporation Incubation Centre (Near Trade Centre), Sree Puram, Tirunelveli, Tamil Nadu 627001, India.
- Business Hours: Monday to Saturday, 9:00 AM – 6:00 PM IST (Sunday Closed).
- Location Note: Centrally located near the Tirunelveli municipal business district.`
    },
    {
        id: "doc-contact-support",
        title: "Official Contact Channels & Customer Support",
        category: "contact",
        sourceUrl: "https://ss40network.com/contact",
        route: "/contact",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Direct email addresses, telephone numbers, WhatsApp widget, and contact form.",
        keywords: [
            "contact", "support", "email", "phone", "call", "whatsapp", "reach", "talk", 
            "human", "agent", "representative", "helpdesk", "contact us"
        ],
        suggestedOptions: ["WhatsApp Support", "Email Us", "Visit Contact Page", "Office Location"],
        content: `Official SS40 NETWORK Contact Channels:
- Official Email: support@ss40network.com
- Direct Desk Phones: +91 83005 91750 | +91 93630 33440
- WhatsApp Support: Instant support available via the website floating widget (+91 8300591750).
- Contact Page: Visit /contact for quote requests, demo bookings, or academic admissions.`
    },
    {
        id: "doc-pricing-quotes",
        title: "Project Scoping, Pricing & Free Estimation",
        category: "pricing",
        sourceUrl: "https://ss40network.com/contact",
        route: "/contact",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Custom transparent milestone pricing, free scoping consultations, and product demos.",
        keywords: [
            "price", "pricing", "cost", "quote", "budget", "rate", "estimate", "charges", 
            "how much", "fees", "demo", "book demo", "trial"
        ],
        suggestedOptions: ["Request Project Quote", "Book ClearInvoice Demo", "WhatsApp Support"],
        content: `SS40 NETWORK Project Pricing & Scoping:
- Transparent Milestone Pricing: Custom-scoped based on your exact feature specifications and project milestones.
- Free Scoping Consultation: Connect directly with our solutions architects for a free project scoping session.
- Product Demos: Free 1-on-1 walkthroughs available for all software products including ClearInvoice.`
    },
    {
        id: "doc-announcements-updates",
        title: "Company Announcements, Blogs & Ecosystem Updates",
        category: "announcements",
        sourceUrl: "https://ss40network.com/blogs",
        route: "/blogs",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Latest announcements, government visits, college MOUs, and tech events from SS40 blogs.",
        keywords: [
            "blogs", "news", "announcements", "updates", "articles", "events", "posts", 
            "mou", "industry visit", "milestones", "activities"
        ],
        suggestedOptions: ["View Company Updates", "Three Wings", "Contact Office"],
        content: `SS40 NETWORK Blogs & Activity Stream:
- Ecosystem Updates: Documentation of university collaborations, technical workshops, and district administration meetings.
- Technology Insights: Engineering articles on modern full-stack web architectures, Next.js optimization, and enterprise AI.
- Stay Updated: Visit /blogs for real-time company announcements and milestone achievements.`
    },
    {
        id: "doc-legal-privacy-terms",
        title: "Legal Policies, Data Privacy & Terms of Service",
        category: "legal",
        sourceUrl: "https://ss40network.com/privacy-policy",
        route: "/privacy-policy",
        lastUpdated: "2026-10-01T00:00:00.000Z",
        summary: "Enterprise data confidentiality, customer privacy, and service terms.",
        keywords: [
            "privacy", "terms", "policy", "refund", "legal", "security", "data", "confidentiality"
        ],
        suggestedOptions: ["Privacy Policy", "Terms of Service", "Refund Policy", "Contact Support"],
        content: `SS40 NETWORK Legal & Trust Commitments:
- Data Privacy: Strict enterprise data confidentiality; client and visitor data is never sold or shared with unauthorized third parties.
- Transparent Terms: Service level agreements and milestone deliverable warranties governed by Indian law.
- Compliance: Full adherence to MCA regulatory standards and standard web security practices.`
    }
];
