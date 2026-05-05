"use client";

import { motion } from "framer-motion";

const PRESS_LOGOS = [
    {
        name: "TechCrunch",
        color: "hover:text-[#02d200]",
        svg: (
            <svg viewBox="0 0 178 32" className="h-6 md:h-7 w-auto fill-current">
                <path d="M0 0h31.9v6.5H0V0zm12.7 6.5h6.5v25.4h-6.5V6.5zm40 0V0h-19.1v6.5H40v25.4h6.5V6.5h6.2zM78.6 18.5V14h-6.2v6.2c0 3.3 1.8 5.1 5.1 5.1h1.1v6.2h-1.1c-6.8 0-11.7-4.1-11.7-11.3V5c0-3.3 1.8-5 5.1-5h12.8v6.5H72.4v5.4h6.2v6.6zm31.3-12V0H90.8v6.5H97v25.4h6.5V6.5h6.4zm26.1 11.9V14h-6.2v6.2c0 3.3 1.8 5.1 5.1 5.1h1.1v6.2h-1.1c-6.8 0-11.7-4.1-11.7-11.3V5c0-3.3 1.8-5 5.1-5H142v6.5h-11.3v5.4h6.2v6.5zm42 13.6h-6.6V19H165.2v13h-6.6V0h6.6v12.4h6.2V0H178v32z" />
            </svg>
        )
    },
    {
        name: "Forbes",
        color: "hover:text-white",
        svg: (
            <svg viewBox="0 0 117 30" className="h-6 md:h-8 w-auto fill-current">
                <path d="M12.33 0H0v28.84h4.4v-11.0h6.14c4.68 0 8.08-2.65 8.08-8.9 0-6.16-3.4-8.94-6.29-8.94zm-1.03 13.1h-6.9v-8.63h6.9c2.16 0 3.1 1.05 3.1 4.3 0 3.23-.94 4.33-3.1 4.33zM34.86 14.54c0 9.17-5.5 14.84-13.2 14.84s-13.2-5.67-13.2-14.84S14.05-.3 21.66-.3s13.2 5.67 13.2 14.84zm-21.64 0c0 6.64 2.84 10.27 8.44 10.27s8.45-3.63 8.45-10.27-2.85-10.27-8.45-10.27-8.44 3.63-8.44 10.27zM42.2 28.84V0h11.97c4.2 0 7.37 2.15 7.37 7.54 0 3.65-1.54 5.95-4.56 6.9l5.06 14.4h-4.87l-4.55-13.43h-6.05v13.43H42.2zm11.45-17.9c1.93 0 2.94-.8 2.94-3.53 0-2.83-1-3.6-2.94-3.6h-7.05v7.13h7.05zM71.4 0H63v28.84h13.98c5.44 0 9.32-3.44 9.32-9.74 0-4.04-1.63-6.66-4.33-7.85 2.16-1.12 3.33-3.08 3.33-6.14 0-5.1-3.5-5.11-8.3-5.11H71.4v28.84h-4.4V0h4.4zm3.93 11.47H67.4V4.53h7.05c2.4 0 3.63.58 3.63 3.53 0 2.87-1.15 3.4-3.63 3.4zm.88 12.83h-8.8v-8.35h8.8c3.08 0 4.6.65 4.6 4.1 0 3.3-1.45 4.25-4.6 4.25zM103.5 15.93h-10.3v8.38h11.4v4.53H88.8V0h14.24v4.53h-9.84v6.87h10.3v4.53zM116.7 20.37h-3.43c-.22 2.83-1.3 4.44-4.22 4.44-2.2 0-3.32-.97-3.32-2.34 0-1.43 1.12-2.12 3.03-2.65.6-.17 1.22-.3 1.84-.46 3.68-.86 6.36-2.3 6.36-6.12 0-3.92-3.13-6.23-7.53-6.23-4.66 0-8.2 2.76-8.34 7.62h3.33c.18-2.6 1.4-3.35 4.54-3.35 1.7 0 3.32.74 3.32 2 0 1.25-1 1.85-3 2.45-.63.18-1.28.34-1.92.53-3.65.98-6.22 2.37-6.22 6.22 0 4.27 3.44 6.7 7.7 6.7 5.08 0 8.08-3.04 8.26-8.84z" />
            </svg>
        )
    },
    {
        name: "Entrepreneur",
        color: "hover:text-[#00aeef]",
        svg: (
            <svg viewBox="0 0 210 30" className="h-5 md:h-6 w-auto fill-current">
                <path d="M0 0h17.3v4.6H5v7.2h10.8v4.6H5v9h12.3v4.6H0V0zm20.8 0h5v11.7c1.4-1.8 4.2-3 7.6-3 7.4 0 11.3 5.3 11.3 10.6v10.7h-5v-10.4c0-4-2.8-6.4-7.2-6.4-4 0-6.7 2.4-6.7 6.4v10.4h-5V0zm30.3 8.3h4v4.3h-4V25c0 3.3 2 5.1 5.3 5.1 1.3 0 2.5-.2 3.5-.6v4.3c-1.2.6-2.8 1-4.7 1-6.1 0-9.1-3.6-9.1-9.3V12.6h-3.4v-4.3h3.4V4.7l5-1.5v5.1zm14.3 3.4h5v4.2c1.4-3.2 4.4-4.8 7.3-4.8.6 0 1.3 0 1.9.2v4.8c-.8-.2-1.6-.3-2.5-.3-4.4 0-6.7 2.4-6.7 6.4v12.2h-5V11.7zm18 10.7c0-7.7 5.7-12.4 13.5-12.4 7.6 0 13 4.5 13 11.8v1.3H88.8c.4 4.5 3.4 7.6 8.3 7.6 3.1 0 5.6-1.5 7-3.6l3.8 2.4C105.7 32.5 101.4 35 96.9 35c-8.4 0-13.6-5.7-13.6-12.6zm21.3-3c-.1-3.6-2.4-6.4-6.7-6.4-4 0-6.6 2.8-7 6.4h13.7zm13.1-7.7h5v4.3c1.7-3.1 5.3-4.9 9.1-4.9 7.4 0 11.3 5.3 11.3 10.6v10.7h-5v-10.4c0-4-2.8-6.4-7.2-6.4-4 0-6.7 2.4-6.7 6.4v10.4h-5V11.7zm28.7 0h5v4.3c1.7-3.1 5.3-4.9 9.1-4.9 7.4 0 11.3 5.3 11.3 10.6v10.7h-5v-10.4c0-4-2.8-6.4-7.2-6.4-4 0-6.7 2.4-6.7 6.4v10.4h-5V11.7zm33.1.7c0 7.3 5.4 11.7 13.2 11.7s13.2-4.4 13.2-11.7V11.7h5V25c0 7.8-5.8 13.5-13.2 13.5-5.3 0-9.6-2.1-11.8-5.7 1.4-1.8 4.2-3 7.6-3 7.4 0 11.3 5.3 11.3 10.6v10.7h-5v-10.4c0-4-2.8-6.4-7.2-6.4-4 0-6.7 2.4-6.7 6.4v10.4h-5V11.7z" />
            </svg>
        )
    },
    {
        name: "Wired",
        color: "hover:text-[#ff0000]",
        svg: (
            <svg viewBox="0 0 125 50" className="h-7 md:h-9 w-auto fill-current">
                <path d="M105.375 14.875v17.25h8.5c2.375 0 3.75-.375 4.75-1.25 1.25-1.125 1.875-3.125 1.875-7.375s-.625-6.25-1.875-7.375c-1-.875-2.375-1.25-4.75-1.25zM117 23.5c0 3.75-.25 4.625-1 5.125-.5.375-1.125.5-2.375.5h-4.75V17.75h4.75c1.25 0 1.875 0 2.375.5.75.625 1 1.5 1 5.25zm7.875 12.438H99.937V11h24.938zM79.563 17.75v-2.875h14.75v5.5h-3.126V17.75h-6v4.125h4.75v2.75h-4.75v4.625h6.126v-3h3.124v5.875H79.564V29.25h2.374v-11.5zM66.188 27.625c0 1.875.124 3.25.374 4.375h3.376c-.126-.875-.25-2.5-.25-4.625-.126-2.5-.876-2.875-2.626-3.25 2-.375 2.876-1.25 2.876-4.375 0-2.5-.376-3.5-1.126-4.125-.5-.5-1.374-.75-2.75-.75h-10.5v17.25h3.5v-6.75h4.876c1 0 1.374.125 1.75.375s.5.625.5 1.875zm-7.126-5v-4.75h5.626c.75 0 1 .125 1.124.25.25.25.5.625.5 2.125s-.25 2-.5 2.25c-.124.125-.374.25-1.124.25zm15.876 13.313h-25V11h24.937v24.938zM43.438 29.25v2.875H31.562V29.25h4.25v-11.5h-4.25v-2.875h11.875v2.875h-4.25v11.5zM23.375 14.875h-3.25L17.75 28.5 15 15.875c-.125-.875-.5-1-1.25-1H12c-.75 0-1.125.25-1.25 1L8 28.5 5.625 14.875h-3.5L5.5 31.25c.125.75.375.875 1.25.875h2.375c.75 0 1-.125 1.25-.875L13 19.375l2.625 11.875c.125.75.375.875 1.25.875h2.25c.75 0 1.125-.125 1.25-.875zm1.75 21.063h-25V11h24.938v24.938z" />
            </svg>
        )
    },
    {
        name: "The Verge",
        color: "hover:text-[#e0126e]",
        svg: (
            <svg viewBox="0 0 100 87" className="h-9 md:h-12 w-auto fill-current">
                <path d="M100 86.66H0L50 0l50 86.66zM20 75h60L50 22.8 20 75z" />
            </svg>
        )
    },
];

export default function PressLogos() {
    // Duplicate the logos to create the infinite scroll effect
    const duplicatedLogos = [...PRESS_LOGOS, ...PRESS_LOGOS, ...PRESS_LOGOS];

    return (
        <section className="py-24 border-y border-white/5 bg-brand-dark overflow-hidden relative">
            {/* Ambient Multi-color Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-[radial-gradient(ellipse_at_center,rgba(0,195,255,0.1)_0%,transparent_70%)] -z-10 opacity-30 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
                <h3 className="text-center text-white font-mono text-[10px] uppercase tracking-[0.5em] opacity-80">
                    Propelled by Global Visionaries & Media
                </h3>
            </div>

            <div className="relative flex overflow-hidden group">
                <div className="animate-marquee flex gap-12 md:gap-24 items-center py-8">
                    {duplicatedLogos.map((press, i) => (
                        <div
                            key={`${press.name}-${i}`}
                            className={`flex items-center justify-center opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer px-4 text-white ${press.color}`}
                        >
                            {press.svg}
                        </div>
                    ))}
                </div>
            </div>

            {/* Side Fades for Seamless Loop */}
            <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-brand-dark to-transparent z-20" />
            <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-brand-dark to-transparent z-20" />
        </section>
    );
}
