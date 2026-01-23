"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';

export const PredictiveRoutingBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [step, setStep] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const steps = [
        { phase: 'incoming', customer: 'Luis Garcia', query: '"My container is delayed at port"', intent: null, agent: null },
        { phase: 'analyzing', customer: 'Luis Garcia', query: '"My container is delayed at port"', intent: 'Analyzing intent...', agent: null },
        { phase: 'routing', customer: 'Luis Garcia', query: '"My container is delayed at port"', intent: 'Logistics Issue Detected', agent: 'Routing to Specialist...' },
        { phase: 'assigned', customer: 'Luis Garcia', query: '"My container is delayed at port"', intent: 'Logistics Issue', agent: 'Sarah (Logistics Expert)' },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setStep(prev => (prev + 1) % (steps.length + 1)); // +1 for pause before loop
        }, 2500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setStep(0);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    const currentStep = steps[Math.min(step, steps.length - 1)];

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="w-full max-w-md space-y-6"
                    >
                        {/* Customer Card */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gen-orange/20 border border-gen-orange flex items-center justify-center">
                                    <span className="text-sm font-bold text-gen-orange">LG</span>
                                </div>
                                <div>
                                    <div className="text-base font-bold text-white">{currentStep?.customer}</div>
                                    <div className="text-sm text-slate-400">Incoming Request</div>
                                </div>
                            </div>
                            <div className="text-base text-slate-200 italic leading-relaxed">{currentStep?.query}</div>
                        </div>

                        {/* AI Analysis */}
                        {currentStep?.intent && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 pl-4"
                            >
                                <div className="w-px h-12 bg-zim-teal/50" />
                                <div className="flex-1 bg-zim-teal/10 border border-zim-teal/30 rounded-lg p-3">
                                    <div className="text-sm text-zim-teal font-bold mb-1.5 tracking-wide">AI Intent Detection</div>
                                    <div className="text-base text-white font-medium">{currentStep.intent}</div>
                                </div>
                            </motion.div>
                        )}

                        {/* Agent Assignment */}
                        {currentStep?.agent && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 pl-8"
                            >
                                <div className="w-px h-12 bg-emerald-500/50" />
                                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center">
                                        <span className="text-xs text-emerald-400">A</span>
                                    </div>
                                    <div>
                                        <div className="text-sm text-emerald-400 font-bold mb-0.5">Routed To:</div>
                                        <div className="text-base text-white font-semibold">{currentStep.agent}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
