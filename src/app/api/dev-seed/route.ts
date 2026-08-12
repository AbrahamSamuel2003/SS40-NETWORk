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

        return NextResponse.json({ success: true, message: "Database seeded correctly!" });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
