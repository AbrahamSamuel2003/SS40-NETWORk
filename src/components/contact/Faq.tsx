"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, MessageSquare } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

const FAQ_DATA = [
    {
        question: "How quickly will our team receive a response?",
        answer: "Our core engineering and advisory team typically reviews inquiries and replies within 1 business day. For urgent business requirements, you can also reach us via direct WhatsApp."
    },
    {
        question: "Does SS40 Network handle custom enterprise development?",
        answer: "Yes. We design, architect, and deploy full-stack custom platforms, high-scale web applications, mobile apps, and proprietary AI automation workflows tailored to enterprise needs."
    },
    {
        question: "Can we request a demonstration of ClearInvoice or other SaaS products?",
        answer: "Certainly. Our product architects can organize a 1-on-1 virtual walkthrough to demonstrate features, integration capabilities, and deployment architecture."
    },
    {
        question: "How can educational institutions establish an academic MoU?",
        answer: "Through SS40 ACADEMICS, we partner with engineering colleges, universities, and polytechnics to provide hands-on software development training, live capstone projects, and industry internship programs."
    },
    {
        question: "Where are you located for in-person consultations?",
        answer: "Our headquarters is located at the 1st Floor, Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli. In-person meetings are welcome during business hours."
    }
];

export function Faq() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <SectionWrapper id="faq" className="bg-white py-16 md:py-24 relative border-t border-gray-100">
            <Container className="max-w-4xl mx-auto flex flex-col items-center">

                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                        className="inline-block px-3.5 py-1 rounded-full bg-[#EDF5F2] border border-[#0F766E]/20 text-[#0F766E] text-[10px] font-extrabold uppercase tracking-widest mb-3 shadow-2xs"
                    >
                        COMMON INQUIRIES
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] tracking-tight font-serif"
                    >
                        Frequently Asked <span className="text-[#0F766E]">Questions</span>
                    </motion.h2>
                </div>

                {/* FAQ ACCORDION LIST */}
                <div className="w-full flex flex-col gap-3.5">
                    {FAQ_DATA.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.08 }}
                                className={`w-full rounded-2xl transition-all duration-300 border ${
                                    isOpen
                                        ? 'bg-[#FAFCFB] border-[#0F766E]/30 shadow-md shadow-[#0F766E]/5'
                                        : 'bg-white border-gray-200/70 hover:border-gray-300'
                                }`}
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span className={`font-bold text-base md:text-lg transition-colors pr-6 font-serif ${
                                        isOpen ? 'text-[#0F766E]' : 'text-[#0F172A]'
                                    }`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                                        isOpen ? 'bg-[#0F766E] text-white' : 'bg-[#EDF5F2] text-[#0F766E]'
                                    }`}>
                                        {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 md:px-6 pb-6 text-[#334155] text-sm md:text-base leading-relaxed border-t border-gray-100/80 pt-4 font-normal">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* BOTTOM CONCIERGE STRIP */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="w-full mt-12 p-6 rounded-2xl bg-[#EDF5F2] border border-[#0F766E]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0F766E] shadow-2xs shrink-0">
                            <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#0F172A]">Have a question not listed here?</h4>
                            <p className="text-xs text-gray-600">Our engineering representatives are available online.</p>
                        </div>
                    </div>

                    <a
                        href="https://wa.me/918300591750?text=Hello%20SS40%20Network%2C%20I%20have%20a%20question%20regarding%20your%20services."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition-all shadow-xs shrink-0"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat on WhatsApp
                    </a>
                </motion.div>

            </Container>
        </SectionWrapper>
    );
}
