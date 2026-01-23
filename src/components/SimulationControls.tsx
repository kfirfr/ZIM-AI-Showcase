"use client";

import React from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

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
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
            {/* Play/Pause Button */}
            {state !== "playing" ? (
                <button
                    onClick={onPlay}
                    className="group flex items-center gap-2 px-4 py-2 bg-zim-teal/20 hover:bg-zim-teal/30 rounded-full transition-all"
                    aria-label="Play simulation"
                >
                    <Play size={16} className="text-zim-teal" fill="currentColor" />
                    <span className="text-xs font-bold text-zim-teal uppercase tracking-wide">
                        {state === "idle" ? "Play" : "Resume"}
                    </span>
                </button>
            ) : (
                <button
                    onClick={onPause}
                    className="group flex items-center gap-2 px-4 py-2 bg-gen-orange/20 hover:bg-gen-orange/30 rounded-full transition-all"
                    aria-label="Pause simulation"
                >
                    <Pause size={16} className="text-gen-orange" fill="currentColor" />
                    <span className="text-xs font-bold text-gen-orange uppercase tracking-wide">Pause</span>
                </button>
            )}

            {/* Stop/Reset Button */}
            {state !== "idle" && (
                <button
                    onClick={onStop}
                    className="p-2 hover:bg-white/10 rounded-full transition-all"
                    aria-label="Stop and reset simulation"
                >
                    <RotateCcw size={16} className="text-slate-400 hover:text-white transition-colors" />
                </button>
            )}
        </div>
    );
};
