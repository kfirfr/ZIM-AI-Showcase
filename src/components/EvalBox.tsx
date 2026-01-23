"use client";

import React, { useState, useEffect } from 'react';
import { Check, Loader2, Play, RefreshCw } from 'lucide-react';

export const EvalBox = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const [score, setScore] = useState(0);
    const criteria = ["Greeting Protocol", "Identity Verified", "Active Listening", "Empathy Shown", "Correct Information", "Hold Time Valid", "Solution Confirmed", "Closing Script"];

    useEffect(() => {
        if (!isPlaying) {
            // Don't reset immediately if we want to show result, but if replaying yes.
            // Logic handled by start button
            return;
        }

        setActiveIdx(-1);
        setScore(0);

        let idx = 0;
        const interval = setInterval(() => {
            setActiveIdx(idx);
            setScore(prev => Math.min(prev + 12.5, 100));
            idx++;
            if (idx > criteria.length - 1) {
                clearInterval(interval);
                setIsPlaying(false);
            }
        }, 400); // Faster
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            {!isPlaying && score === 0 && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/50 rounded-full transition-all hover:scale-105"
                    >
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                            <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-purple-400 font-bold text-sm tracking-wide">START AUDIT</span>
                    </button>
                </div>
            )}

            {!isPlaying && score > 0 && (
                <div className="absolute bottom-4 right-4 z-50">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 bg-black/20 p-4 flex gap-4 relative">
                <div className="flex-1 space-y-2 relative overflow-y-auto scrollbar-hide">
                    {criteria.map((c, i) => (
                        <div key={i} className={`flex justify-between items-center p-2 rounded border transition-all duration-300 ${i === activeIdx ? 'bg-purple-500/20 border-purple-500 scale-[1.02] shadow-lg' : i < activeIdx || (!isPlaying && score > 0) ? 'bg-black/40 border-slate-800 opacity-60' : 'bg-transparent border-transparent text-slate-600'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-300">{c}</span>
                            {(i < activeIdx || (!isPlaying && score > 0)) ? <Check size={14} className="text-green-400" /> : i === activeIdx ? <Loader2 size={14} className="text-purple-400 animate-spin" /> : null}
                        </div>
                    ))}
                </div>
                <div className="w-24 flex flex-col items-center justify-center border-l border-white/5 pl-2">
                    <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                        <svg className="w-full h-full transform -rotate-90"><circle cx="32" cy="32" r="28" fill="none" stroke="#1e293b" strokeWidth="4" /><circle cx="32" cy="32" r="28" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray={`${score * 1.75} 360`} className="transition-all duration-500 ease-out" /></svg>
                        <span className="absolute text-lg font-black text-white">{Math.floor(score)}</span>
                    </div>
                    <div className="text-[9px] font-bold text-slate-500 uppercase text-center">Quality Score</div>
                </div>
            </div>
        </div>
    );
};
