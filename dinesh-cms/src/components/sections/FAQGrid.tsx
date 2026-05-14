"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQGrid({ questions }: { questions: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-white/5 border-t border-white/5">
      {questions.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-start justify-between gap-6 py-7 text-left group"
            >
              <span className={`text-lg md:text-xl font-display leading-snug transition-colors duration-300 ${isOpen ? "text-brand-primary" : "text-white group-hover:text-brand-primary"}`}>
                {faq.q}
              </span>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${isOpen ? "border-brand-primary bg-brand-primary text-white" : "border-white/10 text-white/40 group-hover:border-brand-primary/40 group-hover:text-brand-primary"}`}>
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="text-text-secondary text-base md:text-lg leading-relaxed pb-7 max-w-3xl">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}