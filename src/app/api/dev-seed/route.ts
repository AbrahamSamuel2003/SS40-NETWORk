import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        await prisma.clientProject.deleteMany({});
        await prisma.happimonial.deleteMany({ where: { pageScope: 'DIGITAL_SOLUTIONS' } });

        // 6 Client Projects
        await prisma.clientProject.create({
            data: {
                title: "Global Supply Chain Optimizer",
                description: "A complete overhaul of logistics networks for a global shipping provider. Implemented a real-time IoT tracking mesh coupled with machine learning logistics predictions.",
                industry: "Logistics",
                tags: ["AI Logistics", "React Native", "Node.js"],
                isConfidential: false,
                imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8ed3891db8?q=80&w=2070&auto=format&fit=crop",
            }
        });
        await prisma.clientProject.create({
            data: {
                title: "FinTech Compliance Infrastructure",
                description: "Deep security refactoring and backend optimization for an international bank. Microservices transition and automated real-time fraud monitoring.",
                industry: "Finance",
                tags: ["Cybersecurity", "PostgreSQL", "Go"],
                isConfidential: true,
            }
        });
        await prisma.clientProject.create({
            data: {
                title: "Healthcare Telemedicine App",
                description: "Scaling a regional telehealth platform during a surge of user traffic. Decentralized media nodes and optimized frontend rendering to scale gracefully.",
                industry: "Healthcare",
                tags: ["WebRTC", "Next.js", "Redis"],
                isConfidential: false,
                imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
                caseStudy: "The migration required zero downtime and successfully prepared the brand for its biggest year ever."
            }
        });
        await prisma.clientProject.create({
            data: {
                title: "E-Commerce Market Scaling",
                description: "Preparing a rapidly growing retail brand for Black Friday traffic levels.",
                industry: "Retail",
                tags: ["AWS", "Kubernetes", "GraphQL"],
                isConfidential: false,
                imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1950&auto=format&fit=crop",
                caseStudy: "The migration required zero downtime and successfully prepared the brand for its biggest year ever."
            }
        });
        await prisma.clientProject.create({
            data: {
                title: "EdTech Learning Dashboard",
                description: "Interactive analytics for university professors to track student progress.",
                industry: "Education",
                tags: ["Data Vis", "D3.js", "Express"],
                isConfidential: true,
                projectUrl: "https://example.com"
            }
        });
        await prisma.clientProject.create({
            data: {
                title: "Automotive Smart Manufacturing",
                description: "Computer vision defect detection system on assembly lines. High-speed camera integrations running real-time edge computing models.",
                industry: "Manufacturing",
                tags: ["Computer Vision", "Python", "TensorFlow"],
                isConfidential: false,
                imageUrl: "https://images.unsplash.com/photo-1565043666747-69f6646db940?q=80&w=1974&auto=format&fit=crop",
            }
        });

        // 5 Happimonials
        await prisma.happimonial.create({
            data: {
                clientName: "Sarah Jenkins",
                companyName: "Tech Innovators",
                industry: "SaaS",
                testimonial: "The digital transformation they provided was nothing short of miraculous for our growth.",
                pageScope: "DIGITAL_SOLUTIONS",
                thumbnailUrl: "https://randomuser.me/api/portraits/women/44.jpg"
            }
        });
        await prisma.happimonial.create({
            data: {
                clientName: "Mark Turrent",
                companyName: "Logistics Hub",
                industry: "Shipping",
                testimonial: "I was highly skeptical about IoT tracking at first, but it essentially saved our operations.",
                pageScope: "DIGITAL_SOLUTIONS",
                youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
                thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            }
        });
        await prisma.happimonial.create({
            data: {
                clientName: "David Chen",
                companyName: "Finance Corp",
                industry: "Banking",
                testimonial: "Security is non-negotiable. SS40 NETWORK delivered a fortress.",
                pageScope: "DIGITAL_SOLUTIONS",
                thumbnailUrl: "https://randomuser.me/api/portraits/men/32.jpg"
            }
        });
        await prisma.happimonial.create({
            data: {
                clientName: "Emily Rojas",
                companyName: "Health Plus",
                industry: "Healthcare",
                testimonial: "Patients love the speed and reliability of our new platform.",
                pageScope: "DIGITAL_SOLUTIONS",
            }
        });
        await prisma.happimonial.create({
            data: {
                clientName: "James Smith",
                companyName: "Retail Solutions",
                industry: "E-Commerce",
                testimonial: "We broke all sales records without a single second of downtime this year.",
                pageScope: "DIGITAL_SOLUTIONS",
                youtubeUrl: "https://www.youtube.com/watch?v=tT8SmdtzR0Y"
            }
        });

        // ---------------- PRODUCTS ----------------
        await prisma.product.deleteMany({});
        await prisma.happimonial.deleteMany({ where: { pageScope: 'PRODUCTS' } });

        await prisma.product.create({
            data: {
                name: "ClearInvoice",
                marketingTitle: "Smart Invoicing Built For Modern Businesses",
                badgeText: "OUR PRODUCT",
                productUrl: "https://invoice.ss40network.cloud/",
                description: "ClearInvoice helps businesses create invoices, manage billing, track expenses, and simplify financial workflows through a modern cloud-based experience.",
                tags: ["GST Automation", "Easy Billing", "Expense Manager"],
                features: ["Automated Tax", "One-click Quotes", "Bank Sync"],
                isActive: true,
                isFeatured: true,
                sortOrder: 1
            }
        });

        await prisma.product.create({
            data: {
                name: "AI Insight",
                marketingTitle: "Predictive Analytics For Everyone",
                badgeText: "NEW",
                productUrl: "https://ai.ss40network.cloud/",
                description: "Leverage advanced machine learning models to forecast trends and analyze your customer behavior seamlessly and securely in real-time.",
                tags: ["AI Tools", "Data Sync", "Safe Analytics"],
                features: ["Predictive Models", "User Segmentation", "24/7 Insight"],
                isActive: true,
                isFeatured: false,
                sortOrder: 2
            }
        });

        await prisma.happimonial.create({
            data: {
                clientName: "David Lee",
                companyName: "Nexus Logistics",
                industry: "Supply Chain",
                testimonial: "Reduced invoicing discrepancies to zero and recovered 15% missing revenue with ClearInvoice.",
                isActive: true,
                pageScope: "PRODUCTS",
                thumbnailUrl: "https://randomuser.me/api/portraits/men/11.jpg"
            }
        });

        await prisma.happimonial.create({
            data: {
                clientName: "Sarah Connor",
                companyName: "Prime Retailers",
                industry: "E-Commerce",
                testimonial: "Automated our entire global multi-currency tax billing system perfectly using SS40 platforms.",
                isActive: true,
                pageScope: "PRODUCTS",
                thumbnailUrl: "https://randomuser.me/api/portraits/women/42.jpg"
            }
        });

        // PRODUCT LOGOS
        await prisma.organizationLogo.deleteMany({ where: { pageScope: 'PRODUCTS' } });

        const logoUrls = [
            'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
            'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
            'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
            'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg',
            'https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg'
        ];
        const names = ["Amazon", "Google", "Microsoft", "IBM", "Cisco"];

        for (let i = 0; i < logoUrls.length; i++) {
            await prisma.organizationLogo.create({
                data: {
                    name: names[i],
                    category: "Partner",
                    placementType: "CLIENT",
                    logoUrl: logoUrls[i],
                    isActive: true,
                    pageScope: "PRODUCTS"
                }
            });
        }

        // ---------------- STUDENT PROJECTS ----------------
        const studentProjectCount = await prisma.studentProject.count();
        if (studentProjectCount === 0) {
            await prisma.studentProject.createMany({
                data: [
                    {
                        title: "Smart Agri-Sense IoT Network",
                        category: "IoT & Hardware",
                        badge: "SMART FARMING",
                        description: "Precision agriculture mesh monitoring soil moisture, ambient humidity, and micro-climate conditions with real-time solar alerts and automated drip irrigation triggers.",
                        tags: ["IoT", "ESP32", "MQTT", "Next.js", "InfluxDB"],
                        isFeatured: true,
                        imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1200&auto=format&fit=crop",
                        projectUrl: "https://github.com/ss40-network/agri-sense",
                        sortOrder: 1,
                        isActive: true
                    },
                    {
                        title: "MediSync Patient Triage Platform",
                        category: "Healthcare AI",
                        badge: "CLINICAL AI",
                        description: "Automated emergency triage and vital signs anomaly detection platform that classifies incoming patient risk levels using predictive clinical models.",
                        tags: ["Python", "FastAPI", "React", "PostgreSQL", "TailwindCSS"],
                        isFeatured: false,
                        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop",
                        projectUrl: "https://github.com/ss40-network/medisync",
                        sortOrder: 2,
                        isActive: true
                    },
                    {
                        title: "FinFlow Micro-Lending Portal",
                        category: "Fintech",
                        badge: "FINTECH",
                        description: "Peer-to-peer micro-finance management suite featuring automated KYC document parsing, credit risk scoring, and zero-knowledge transaction audit logs.",
                        tags: ["Node.js", "TypeScript", "Next.js", "Prisma", "Docker"],
                        isFeatured: false,
                        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
                        projectUrl: "https://github.com/ss40-network/finflow",
                        sortOrder: 3,
                        isActive: true
                    },
                    {
                        title: "EcoGrid Fleet Energy Monitor",
                        category: "CleanTech",
                        badge: "EV MOBILITY",
                        description: "Real-time telemetry and battery degradation tracking dashboard for commercial electric vehicle fleets with route energy efficiency modeling.",
                        tags: ["React", "Go", "TimescaleDB", "Leaflet", "WebSockets"],
                        isFeatured: false,
                        imageUrl: "https://images.unsplash.com/photo-1558441719-703e22646d65?q=80&w=1200&auto=format&fit=crop",
                        projectUrl: "https://github.com/ss40-network/ecogrid",
                        sortOrder: 4,
                        isActive: true
                    },
                    {
                        title: "EduMentor AI Coding Assistant",
                        category: "EdTech",
                        badge: "DEV TOOLS",
                        description: "Interactive code review copilot that analyzes beginner student pull requests, flags syntax bottlenecks, and suggests step-by-step refactoring hints.",
                        tags: ["LLM", "OpenAI", "Next.js", "Monaco Editor", "PostgreSQL"],
                        isFeatured: false,
                        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
                        projectUrl: "https://github.com/ss40-network/edumentor",
                        sortOrder: 5,
                        isActive: true
                    }
                ]
            });
        }

        return NextResponse.json({ success: true, message: "Database seeded correctly!" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}

