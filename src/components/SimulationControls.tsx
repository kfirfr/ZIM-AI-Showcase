"use client";

import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export type SimulationState = "idle" | "playing" | "paused";

interface SimulationControlsProps {
    state: SimulationState;
    onPlay: () => void;
    onPause: () => void;
    onStop: () => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
    state,
    onPlay,
    onPause,
    onStop,
}) => {
    // Initial state with blurred background and centered PLAY button
    if (state === "idle") {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30">
                <motion.button
                    onClick={onPlay}
                    className="group relative flex items-center gap-3 px-8 py-4 rounded-full transition-all overflow-hidden shadow-[0_0_30px_rgba(96,165,250,0.3)]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Play simulation"
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-0 group-hover:opacity-100 transition-opacity animate-gradient-shift" />

                    {/* Icon and Text */}
                    <Play size={24} className="relative z-10 text-white" fill="currentColor" />
                    <span className="relative z-10 text-base font-bold text-white uppercase tracking-wider">
                        Play
                    </span>
                </motion.button>
            </div>
        );
    }

    // Playing/Paused state with compact controls at bottom
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            {/* Pause Button (when playing) */}
            {state === "playing" ? (
                <motion.button
                    onClick={onPause}
                    className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Pause simulation"
                >
                    {/* Gradient Background for Pause */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-0 group-hover:opacity-50 transition-opacity" />

                    <Pause size={16} className="relative z-10 text-white" fill="currentColor" />
                    <span className="relative z-10 text-xs font-bold text-white uppercase tracking-wide">Pause</span>
                </motion.button>
            ) : (
                /* Resume Button (when paused) */
                <motion.button
                    onClick={onPlay}
                    className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-all overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Resume simulation"
                >
                    {/* Gradient Background for Resume */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#60a5fa] via-[#34d399] via-[#a78bfa] to-[#fb923c] opacity-0 group-hover:opacity-50 transition-opacity" />

                    <Play size={16} className="relative z-10 text-white" fill="currentColor" />
                    <span className="relative z-10 text-xs font-bold text-white uppercase tracking-wide">
                        Resume
                    </span>
                </motion.button>
            )}

            {/* Stop/Reset Button */}
            {state !== "idle" && (
                <motion.button
                    onClick={onStop}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Stop and reset simulation"
                >
                    <RotateCcw size={16} className="text-slate-400 hover:text-white transition-colors" />
                </motion.button>
            )}
        </div>
    );
};
