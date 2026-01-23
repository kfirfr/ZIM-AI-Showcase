"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Dynamic width/padding based on scroll for that "pill" effect
    const widthResult = useTransform(scrollY, [0, 100], ["100%", "80%"]);
    const topResult = useTransform(scrollY, [0, 100], ["0px", "20px"]);
    const borderResult = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0)", "rgba(255,255,255,0.08)"]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center items-start pt-4 pointer-events-none">
            <motion.nav
                style={{
                    width: widthResult,
                    top: topResult,
                    borderColor: borderResult,
                }}
                className={cn(
                    "pointer-events-auto flex items-center justify-between px-6 py-3 transition-all duration-300",
                    scrolled
                        ? "bg-black/60 backdrop-blur-xl rounded-full border shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                        : "bg-transparent border-transparent w-full"
                )}
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-zim-teal to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                        Z
                    </div>
                    <span className="text-white font-semibold tracking-tight text-sm">ZIM AI SHOWCASE</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="#features" className="hover:text-zim-teal transition-colors">Capabilities</Link>
                    <Link href="#metrics" className="hover:text-zim-teal transition-colors">Metrics</Link>
                    <Link href="#roadmap" className="hover:text-zim-teal transition-colors">Roadmap</Link>
                </div>

                <button className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/5 text-xs text-white uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95">
                    Launch Console
                </button>
            </motion.nav>
        </div>
    );
};
