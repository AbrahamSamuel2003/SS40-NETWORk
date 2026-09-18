export interface KnowledgeChunk {
    id: string;
    title: string;
    category: "company" | "digital-solutions" | "products" | "academics" | "location" | "contact" | "pricing" | "careers";
    keywords: string[];
    content: string;
    quickReplies: string[];
    link?: {
        label: string;
        url: string;
    };
}

export const SS40_KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
    {
        id: "chunk-about-ss40",
        title: "About SS40 NETWORK",
        category: "company",
        keywords: ["about", "company", "ss40", "network", "overview", "founded", "history", "vision", "mission", "built in india", "who founded", "what is ss40", "ss40 overview"],
        content: `- **Founded in 2023**: An enterprise-ready technology company guided by the vision "Built in India. Thinking Globally."
- **Three Business Wings**: We operate across SS40 Digital Solutions (custom software), SS40 Products (ClearInvoice), and SS40 Academics (internships & training).
- **Client Promise**: Fixed-scope project delivery, enterprise security, and 30-day post-launch support included.`,
        quickReplies: ["About SS40", "SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Office Location"],
        link: { label: "View About Page", url: "/#about" }
    },
    {
        id: "chunk-three-wings",
        title: "Three Business Wings of SS40",
        category: "company",
        keywords: ["three wings", "3 wings", "wings", "ecosystem", "divisions", "what you do", "services", "business wings", "offerings"],
        content: `- **1. SS40 Digital Solutions**: Custom web apps, mobile apps, AI automation, and cloud systems for growing businesses.
- **2. SS40 Products**: High-reliability SaaS platforms including ClearInvoice for automated invoicing with 99.99% uptime.
- **3. SS40 Academics**: Live project-based internships, placement acceleration, and college training partnerships.`,
        quickReplies: ["SS40 Digital Solutions", "SS40 Products", "SS40 Academics", "Contact Support"],
        link: { label: "Explore Three Wings", url: "/#business-wings" }
    },
    {
        id: "chunk-digital-solutions",
        title: "SS40 Digital Solutions (Custom Software)",
        category: "digital-solutions",
        keywords: ["digital solutions", "custom software", "web development", "mobile app", "full stack", "react", "nextjs", "nodejs", "python", "backend", "frontend", "api", "cloud", "architecture", "database", "ss40 digital solutions", "ds", "ss40 ds"],
        content: `- **Custom Web Applications**: Fast, modern web applications built using Next.js, React, Node.js, and secure cloud databases.
- **Mobile App Development**: High-performance iOS and Android native and cross-platform apps.
- **AI & Workflow Automation**: Smart automated processes, custom AI bots, and data synchronization.
- **Cloud Architecture**: Scalable, high-security backend APIs and cloud infrastructure.`,
        quickReplies: ["Request Project Quote", "SS40 Digital Solutions", "Client Projects", "Contact Support"],
        link: { label: "Visit SS40 Digital Solutions", url: "/digital-solutions" }
    },
    {
        id: "chunk-ai-automation",
        title: "AI & Process Automation Solutions",
        category: "digital-solutions",
        keywords: ["ai", "artificial intelligence", "automation", "workflow", "machine learning", "bot", "llm", "data sync", "intelligent software"],
        content: `- **Smart Business Workflows**: Automate repetitive business tasks and cut down manual workload.
- **Custom AI Assistants**: Tailored AI chatbots and intelligent helpers integrated into your business software.
- **Real-Time Data Pipelines**: Automated reporting and data synchronization across your tools.`,
        quickReplies: ["Request Project Quote", "SS40 Digital Solutions", "Contact Support"],
        link: { label: "Explore AI Solutions", url: "/digital-solutions#what-we-build" }
    },
    {
        id: "chunk-products-clearinvoice",
        title: "SS40 Products & ClearInvoice SaaS",
        category: "products",
        keywords: ["products", "product", "saas", "software product", "clearinvoice", "invoice", "billing", "gst", "inventory", "99.99% uptime", "tools", "ss40 products"],
        content: `- **ClearInvoice SaaS**: Flagship platform for automated GST billing, invoice generation, inventory tracking, and payment reports.
- **99.99% Uptime Guarantee**: Built with high-availability cloud architecture, multi-tenant isolation, and automated data backups.
- **Live Demo Available**: Schedule a free personalized product walkthrough with our solutions team.`,
        quickReplies: ["Book Product Demo", "SS40 Products", "Request Project Quote", "Contact Sales"],
        link: { label: "Visit SS40 Products", url: "/products" }
    },
    {
        id: "chunk-academics-overview",
        title: "SS40 Academics - Student Training & Internships",
        category: "academics",
        keywords: ["academic", "academics", "academic program", "student", "education", "training", "courses", "college program", "study", "learning", "admissions", "ss40 academics"],
        content: `- **Project-Based Internships**: Work on real production software codebases using modern tech stacks with Git & GitHub.
- **Career Launch Pad**: Master Data Structures, Algorithms (DSA), and live mock technical interviews.
- **Direct Placement Support**: Connect with top startup and enterprise hiring partners.
- **College Collaborations**: Strategic university MOUs, workshops, and student innovation labs.`,
        quickReplies: ["Internship Sprints", "Placement Prep", "Student Projects", "University MOUs"],
        link: { label: "Visit SS40 Academics", url: "/academics" }
    },
    {
        id: "chunk-academics-internships",
        title: "SS40 Internship Sprints",
        category: "academics",
        keywords: ["internship", "intern", "sprint", "live project", "hands-on", "fresher", "practical learning", "stipend", "certificate", "skills", "apply internship"],
        content: `- **Real Production Code**: Students write actual React, Next.js, Node.js, and TypeScript applications.
- **1-on-1 Mentor Guidance**: Senior engineers guide your code reviews and software architecture.
- **Verified Credentials**: Earn industry-recognized certificates and verified GitHub portfolio repositories.`,
        quickReplies: ["Student Projects", "Placement Prep", "SS40 Academics", "Contact Academic Team"],
        link: { label: "View Academic Programs", url: "/academics" }
    },
    {
        id: "chunk-academics-placements",
        title: "Career Launch Pad & Placement Prep",
        category: "academics",
        keywords: ["placement", "job", "career", "hiring", "interview", "resume", "aptitude", "mock interview", "placement support", "salary", "package"],
        content: `- **Coding & DSA Mastery**: In-depth preparation for top technical problem-solving rounds.
- **Mock Interviews**: Real 1-on-1 interview simulations with constructive mentor feedback.
- **Hiring Connections**: Direct referrals to verified hiring partner companies.`,
        quickReplies: ["Internship Sprints", "Student Projects", "SS40 Academics"],
        link: { label: "Explore Placement Journey", url: "/academics#placements" }
    },
    {
        id: "chunk-academics-student-projects",
        title: "Student Projects Showcase",
        category: "academics",
        keywords: ["student project", "student projects", "showcase", "built by students", "github projects", "portfolios", "student apps"],
        content: `- **Live Working Projects**: Explore verified student-built apps in AI automation, healthcare, e-commerce, and developer tools.
- **Open GitHub Repositories**: Every project includes live hosted demos and public source code proofs.`,
        quickReplies: ["Student Projects", "Internship Sprints", "SS40 Academics"],
        link: { label: "Browse Student Projects", url: "/academics/student-projects" }
    },
    {
        id: "chunk-academics-colleges",
        title: "University MOUs & College Partnerships",
        category: "academics",
        keywords: ["college", "university", "institution", "mou", "faculty", "workshop", "guest lecture", "collaboration", "campus", "curriculum", "hackathon"],
        content: `- **Strategic Institutional MOUs**: Co-designed industry curricula for engineering and computer science colleges.
- **Campus Technical Workshops**: Hands-on full-stack development, AI, and cloud masterclasses.
- **Faculty Enablement**: Upskilling college faculty with modern industry practices.`,
        quickReplies: ["SS40 Academics", "Contact Academic Team", "Office Location"],
        link: { label: "View College Collaborations", url: "/academics#collaborations" }
    },
    {
        id: "chunk-office-location",
        title: "Office Location & Business Hours",
        category: "location",
        keywords: ["location", "office", "address", "where", "visit", "hours", "timing", "city", "tirunelveli", "tamil nadu", "india", "map", "google map", "sree puram", "incubation centre"],
        content: `- **Office Address**: 1st Floor, Municipal Corporation Incubation Centre (Near Trade Centre), Sree Puram, Tirunelveli, Tamil Nadu 627001, India.
- **Business Hours**: Monday to Saturday, 9:00 AM – 6:00 PM IST (Sunday Closed).
- **Easy Directions**: Located centrally near Tirunelveli municipal trade hub.`,
        quickReplies: ["Open in Google Maps", "Contact Office", "WhatsApp Support", "About SS40"],
        link: {
            label: "Open in Google Maps",
            url: "https://www.google.com/maps?q=8.729284,77.697432"
        }
    },
    {
        id: "chunk-contact-support",
        title: "Contact, Phone & Support Channels",
        category: "contact",
        keywords: ["contact", "support", "email", "phone", "call", "whatsapp", "reach", "talk", "human", "agent", "representative", "helpdesk", "contact us"],
        content: `- **Email**: support@ss40network.com
- **Phone / Office Desk**: +91 94884 14040
- **WhatsApp Support**: Instant chat available via the floating support hub or direct link.
- **Official Contact Page**: Visit /contact to send queries, demo requests, or resume submissions.`,
        quickReplies: ["WhatsApp Support", "Email Support", "Visit Contact Page", "Office Location"],
        link: { label: "Visit Official Contact Page", url: "/contact" }
    },
    {
        id: "chunk-pricing-quotes",
        title: "Pricing, Quotes & Free Estimation",
        category: "pricing",
        keywords: ["price", "pricing", "cost", "quote", "budget", "rate", "estimate", "charges", "how much", "fees", "demo", "book demo", "trial"],
        content: `- **Transparent Pricing**: Scoped with fixed milestones based on your exact software requirements.
- **Free Project Estimation**: Reach out to our solutions architects for a free project scoping call.
- **ClearInvoice Demo**: Free 1-on-1 walkthrough of our SaaS billing platform.`,
        quickReplies: ["Request Project Quote", "Book Product Demo", "WhatsApp Support"],
        link: { label: "Request Project Quote", url: "/contact?source=PROJECT_QUOTE" }
    }
];
