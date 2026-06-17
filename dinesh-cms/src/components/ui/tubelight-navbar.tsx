"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
}

export function NavBar({ items, className }: NavBarProps) {
    const pathname = usePathname()
    const resolveActiveTab = () => {
        const currentItem = items.find(item => item.url === pathname)
        if (currentItem) return currentItem.name

        // For sub-routes (e.g. /blog/post-1)
        const activeItem = items.find(item => item.url !== "/" && pathname?.startsWith(item.url))
        return activeItem ? activeItem.name : null
    }

    const [activeTab, setActiveTab] = useState<string | null>(resolveActiveTab)
    useEffect(() => {
        setActiveTab(resolveActiveTab())
    }, [pathname, items])

    return (
        <div
            className={cn(
                "z-50 max-w-full",
                className,
            )}
        >
            <div className="flex items-center gap-1 lg:gap-3 bg-brand-dark/50 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            onClick={() => setActiveTab(item.name)}
                            className={cn(
                                "relative shrink-0 whitespace-nowrap break-normal cursor-pointer text-xs lg:text-sm font-semibold px-4 lg:px-6 py-2 rounded-full transition-colors",
                                "text-white/80 hover:text-brand-primary",
                                isActive && "bg-white/5 text-brand-primary",
                            )}
                        >
                            <span className="hidden md:inline whitespace-nowrap break-normal">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full bg-brand-primary/5 rounded-full -z-10"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                >
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-brand-primary rounded-t-full">
                                        <div className="absolute w-12 h-6 bg-brand-primary/20 rounded-full blur-md -top-2 -left-2" />
                                        <div className="absolute w-8 h-6 bg-brand-primary/20 rounded-full blur-md -top-1" />
                                        <div className="absolute w-4 h-4 bg-brand-primary/20 rounded-full blur-sm top-0 left-2" />
                                    </div>
                                </motion.div>
                            )}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
