"use client";

import { motion } from "framer-motion";

interface FAQItem {
    q: string;
    a: string;
}

export default function FAQGrid({ questions }: { questions: FAQItem[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {questions.map((faq, fIdx) => (
                <motion.div
                    key={fIdx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: fIdx * 0.1 }}
                    className="glass-card p-10 hover:border-brand-primary/20 transition-all"
                >
                    <h3 className="text-2xl font-display text-white mb-6 leading-tight">
                        {faq.q}
                    </h3>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        {faq.a}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}
