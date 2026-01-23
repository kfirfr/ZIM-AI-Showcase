"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { Check, Loader2 } from 'lucide-react';

export const EvalBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [activeIdx, setActiveIdx] = useState(-1);
    const [score, setScore] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentStepRef = useRef(0);

    const criteria = ["Greeting Protocol", "Identity Verified", "Active Listening", "Empathy Shown", "Correct Information", "Hold Time Valid", "Solution Confirmed", "Closing Script"];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            const step = currentStepRef.current % (criteria.length + 2); // +2 for pause before restart

            if (step < criteria.length) {
                setActiveIdx(step);
                setScore(prev => Math.min((step + 1) * 12.5, 100));
            } else {
                // Pause at completion before looping
                setActiveIdx(criteria.length - 1);
            }

            currentStepRef.current++;
        }, 500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setActiveIdx(-1);
            setScore(0);
            currentStepRef.current = 0;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 bg-black/20 p-4 flex gap-4 relative">
                <div className="flex-1 space-y-2 relative overflow-y-auto scrollbar-hide">
                    {criteria.map((c, i) => (
                        <div key={i} className={`flex justify-between items-center p-2 rounded border transition-all duration-300 ${i === activeIdx ? 'bg-purple-500/20 border-purple-500 scale-[1.02] shadow-lg' : i < activeIdx ? 'bg-black/40 border-slate-800 opacity-60' : 'bg-transparent border-transparent text-slate-600'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-300">{c}</span>
                            {i < activeIdx ? <Check size={14} className="text-green-400" /> : i === activeIdx ? <Loader2 size={14} className="text-purple-400 animate-spin" /> : null}
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
