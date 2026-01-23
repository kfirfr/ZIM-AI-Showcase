"use client";

import React, { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { AnimatedTitle } from "./AnimatedTitle";

interface FeatureCardProps {
    title: string;
    description: string;
    children?: React.ReactNode;
    badge?: string;
}

export const FeatureCard = ({ title, description, badge, children }: FeatureCardProps) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className="group relative rounded-2xl border border-white/10 bg-slate-900/40 px-8 py-10 shadow-2xl overflow-hidden backdrop-blur-xl transition-all hover:scale-[1.02]"
            onMouseMove={handleMouseMove}
            whileHover={{ borderColor: "rgba(45, 212, 191, 0.4)" }}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                          450px circle at ${mouseX}px ${mouseY}px,
                          rgba(45, 212, 191, 0.15),
                          transparent 80%
                        )
                      `,
                }}
            />

            <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center justify-between mb-4">
                    {badge && (
                        <span className="inline-block rounded-full bg-zim-teal/10 px-3 py-1 text-xs font-semibold text-zim-teal">
                            {badge}
                        </span>
                    )}
                    <div className="w-8 h-1 rounded bg-gradient-to-r from-zim-teal to-transparent opacity-50" />
                </div>

                <AnimatedTitle className="text-2xl mb-2" as="h3">
                    {title}
                </AnimatedTitle>

                <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                    {description}
                </p>

                <div className="mt-auto rounded-lg border border-white/5 bg-black/20 overflow-hidden relative min-h-[300px]">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};
