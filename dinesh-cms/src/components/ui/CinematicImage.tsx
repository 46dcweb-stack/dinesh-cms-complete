"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface CinematicImageProps {
    src: string;
    alt: string;
    className?: string;
    wrapperClassName?: string;
    priority?: boolean;

    // Animation Styles
    animationType?: "hero" | "scroll-revel" | "manifesto" | "default";
    parallax?: boolean;
    parallaxSpeed?: number;
    glowColor?: string;
}

export default function CinematicImage({
    src,
    alt,
    className,
    wrapperClassName,
    priority = false,
    animationType = "default",
    parallax = false,
    parallaxSpeed = 0.2,
    glowColor = "rgba(255, 90, 0, 0.1)"
}: CinematicImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        if (shouldReduceMotion) return;

        const ctx = gsap.context(() => {
            // 1. Scroll Reveal Logic
            if (animationType === "scroll-revel" || animationType === "manifesto") {
                gsap.fromTo(
                    containerRef.current,
                    {
                        opacity: 0,
                        y: animationType === "manifesto" ? 50 : 30,
                        filter: "blur(10px)"
                    },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        }
                    }
                );
            }

            // 2. Parallax Effect
            if (parallax && !shouldReduceMotion) {
                gsap.to(imageRef.current, {
                    yPercent: 15 * parallaxSpeed,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                });
            }

            // 3. Hero Floating Animation
            if (animationType === "hero") {
                gsap.to(containerRef.current, {
                    y: -15,
                    duration: 3,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [animationType, parallax, parallaxSpeed, shouldReduceMotion]);

    // Framer Motion Hover & Entry
    const variants: Variants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.2,
                ease: [0.33, 1, 0.68, 1]
            }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative overflow-hidden rounded-2xl",
                animationType === "hero" && "shadow-[0_0_50px_-12px_rgba(255,90,0,0.3)]",
                wrapperClassName
            )}
        >
            {/* Background Glow */}
            {(animationType === "hero" || glowColor) && (
                <div
                    className="absolute inset-0 pointer-events-none -z-10 blur-[60px]"
                    style={{
                        background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`
                    }}
                />
            )}

            <motion.div
                ref={imageRef}
                variants={variants}
                initial="initial"
                animate="animate"
                whileHover={!shouldReduceMotion ? "hover" : undefined}
                className="w-full h-full"
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    className={cn(
                        "object-cover transition-all duration-700",
                        animationType === "hero" && "scale-110", // Initial zoom for Ken Burns start
                        className
                    )}
                />

                {/* Subtle Vignette for Manifesto */}
                {animationType === "manifesto" && (
                    <div className="absolute inset-0 bg-linear-to-t from-brand-dark/40 to-transparent pointer-events-none" />
                )}
            </motion.div>
        </div>
    );
}
