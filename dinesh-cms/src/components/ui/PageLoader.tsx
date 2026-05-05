"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function PageLoader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); // 2 seconds for a premium feel

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
                    className="fixed inset-0 z-[99999] bg-brand-dark flex items-center justify-center overflow-hidden"
                >
                    <div className="relative overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <div className="flex flex-col items-center mb-8">
                                <span className="text-6xl md:text-8xl font-display font-bold text-white tracking-[0.2em] leading-tight">D</span>
                                <span className="text-6xl md:text-8xl font-display font-bold text-brand-primary tracking-[0.2em] leading-tight -mt-4">K</span>
                            </div>

                            <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute inset-0 bg-brand-primary"
                                />
                            </div>

                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-text-muted font-mono text-[10px] uppercase tracking-[0.5em] mt-6"
                            >
                                Initializing Vision
                            </motion.span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
