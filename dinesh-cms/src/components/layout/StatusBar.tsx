"use client";

import { motion } from "framer-motion";
import {
    GitBranch,
    AlertCircle,
    CheckCircle2,
    Cpu,
    Wifi,
    Cloud
} from "lucide-react";
import { useEffect, useState } from "react";

export default function StatusBar() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] h-7 bg-brand-surface border-t border-brand-border px-4 flex items-center justify-between text-[10px] font-mono select-none">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5 text-brand-blue hover:bg-white/5 px-2 py-0.5 rounded transition-colors cursor-pointer">
                    <GitBranch size={12} />
                    <span>production</span>
                </div>

                <div className="flex items-center space-x-3 text-text-secondary">
                    <div className="flex items-center space-x-1">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span>0</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <AlertCircle size={12} />
                        <span>0</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-4 text-text-secondary">
                <div className="flex items-center space-x-2">
                    <Cpu size={12} />
                    <span>4.2GHz</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Cloud size={12} className="text-brand-blue" />
                    <span>Firebase Connected</span>
                </div>
                <div className="flex items-center space-x-2 border-l border-brand-border pl-4">
                    <Wifi size={12} className="text-green-500" />
                    <span>UTF-8</span>
                </div>
                <div className="w-16 text-right tabular-nums">
                    {time}
                </div>
            </div>
        </footer>
    );
}
