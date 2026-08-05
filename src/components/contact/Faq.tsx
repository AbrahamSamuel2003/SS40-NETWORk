"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { Container } from "@/components/ui/Container";

const FAQ_DATA = [
    {
        question: "How quickly will I receive a response?",
        answer: "We usually respond within one business day."
    },
    {
        question: "Do you work with businesses of all sizes?",
        answer: "Yes. We work with startups, SMEs, educational institutions and enterprises."
    },
    {
        question: "Can I request a custom software solution?",
        answer: "Absolutely. We build tailored digital solutions based on your business requirements."
    },
    {
        question: "Do you provide product demonstrations?",
        answer: "Yes. Product demonstrations can be arranged based on your requirements."
    },
    {
        question: "Can educational institutions collaborate with SS40 NETWORK?",
        answer: "Yes. We actively collaborate with schools, colleges, universities and training institutions through SS40 ACADEMICS."
    }
];

export function Faq() {
    const [openIndex, setOpenIndex] = React.useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <SectionWrapper id="faq" className="bg-white py-20 md:py-32">
            <Container className="max-w-4xl mx-auto flex flex-col items-center">

                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
                        className="text-3xl md:text-5xl font-extrabold text-[#111827] tracking-tight"
                    >
                        Frequently Asked <span className="text-[#6B9F91]">Questions</span>
                    </motion.h2>
                </div>

                <div className="w-full flex flex-col gap-4">
                    {FAQ_DATA.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1 }}
                                className={`w-full bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#6B9F91]/30 shadow-lg shadow-[#6B9F91]/5' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                                >
                                    <span className={`font-bold text-base md:text-lg transition-colors pr-8 ${isOpen ? 'text-[#6B9F91]' : 'text-[#111827]'}`}>
                                        {faq.question}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#6B9F91] text-white' : 'bg-[#F2F7F5] text-gray-400'}`}>
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
                                        >
                                            <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-500 text-sm md:text-base leading-relaxed border-t border-gray-50 pt-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

            </Container>
        </SectionWrapper>
    );
}
