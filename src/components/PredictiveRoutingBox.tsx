"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AlertCircle, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

interface Agent {
    id: string;
    initials: string;
    name: string;
    specialty: string;
    availability: number;
    match: number;
}

const agents: Agent[] = [
    { id: 'dk', initials: 'DK', name: 'David K.', specialty: 'VIP, Delays', availability: 95, match: 94 },
    { id: 'el', initials: 'EL', name: 'Emma L.', specialty: 'Billing, Finance', availability: 60, match: 47 },
    { id: 'jt', initials: 'JT', name: 'James T.', specialty: 'Operations, VIP', availability: 80, match: 56 },
    { id: 'lm', initials: 'LM', name: 'Lisa M.', specialty: 'Routing, Enterprise', availability: 90, match: 31 },
    { id: 'tr', initials: 'TR', name: 'Tom R.', specialty: 'Delays, Escalations', availability: 75, match: 47 },
];

export const PredictiveRoutingBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [step, setStep] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const steps = [
        { phase: 'incoming', showCustomer: true, showAnalysis: false, showAgents: false, selectedAgent: null },
        { phase: 'analyzing', showCustomer: true, showAnalysis: true, showAgents: false, selectedAgent: null },
        { phase: 'routing', showCustomer: true, showAnalysis: true, showAgents: true, selectedAgent: null },
        { phase: 'matched', showCustomer: true, showAnalysis: true, showAgents: true, selectedAgent: 'dk' },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setStep(prev => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                } else {
                    // Loop back after showing final state
                    return 0;
                }
            });
        }, 3000);
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

    const currentStep = steps[step];

    return (
        <div className="relative w-full h-full min-h-[450px] bg-gradient-to-br from-slate-950/80 to-slate-900/80 flex flex-col overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Customer Card */}
                    <AnimatePresence mode="wait">
                        {currentStep.showCustomer && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gradient-to-br from-amber-950/40 to-red-950/40 border border-amber-800/50 rounded-2xl p-5 shadow-xl"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-amber-600/30 border-2 border-amber-500 flex items-center justify-center">
                                            <User className="text-amber-300" size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold text-white">Sarah Chen</div>
                                            <div className="text-sm text-gen-orange font-semibold">VIP Customer</div>
                                        </div>
                                    </div>
                                    <div className="bg-red-900/60 border border-red-600/50 px-3 py-1 rounded-full">
                                        <span className="text-xs font-bold text-red-300">High Priority</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-slate-400">Issue:</span>{' '}
                                        <span className="text-white font-medium">Container Delay</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Sentiment:</span>{' '}
                                        <span className="text-gen-orange font-bold">Frustrated</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Analysis */}
                    <AnimatePresence mode="wait">
                        {currentStep.showAnalysis && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-zim-teal/10 border border-zim-teal/30 rounded-xl p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Zap className="text-zim-teal animate-pulse" size={16} />
                                    <span className="text-sm font-bold text-zim-teal uppercase tracking-wide">AI Analysis</span>
                                </div>
                                <div className="text-white text-sm space-y-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-zim-teal" />
                                        <span>VIP status confirmed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-zim-teal" />
                                        <span>Issue type: Logistics delay</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-zim-teal" />
                                        <span>High urgency detected</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Agent Pool */}
                    <AnimatePresence mode="wait">
                        {currentStep.showAgents && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="space-y-3"
                            >
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-4">
                                    Agent Pool Analysis
                                </div>

                                {agents.map((agent, idx) => {
                                    const isSelected = currentStep.selectedAgent === agent.id;
                                    return (
                                        <motion.div
                                            key={agent.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                                scale: isSelected ? 1.02 : 1,
                                            }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={`
                                                relative rounded-xl p-4 border transition-all duration-500
                                                ${isSelected
                                                    ? 'bg-teal-900/40 border-zim-teal shadow-[0_0_30px_rgba(45,212,191,0.4)]'
                                                    : 'bg-slate-800/50 border-slate-700'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                                                        ${isSelected
                                                            ? 'bg-zim-teal text-black'
                                                            : 'bg-slate-700 text-slate-300'
                                                        }
                                                    `}>
                                                        {agent.initials}
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                            {agent.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{agent.specialty}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <div className="text-xs text-slate-400">Availability</div>
                                                        <div className={`text-base font-bold font-mono ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                                            {agent.availability}%
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs text-slate-400">Match</div>
                                                        <div className={`text-xl font-bold font-mono ${isSelected ? 'text-zim-teal' : 'text-slate-500'
                                                            }`}>
                                                            {agent.match}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-3 pt-3 border-t border-zim-teal/30"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <TrendingUp size={14} className="text-zim-teal" />
                                                        <span className="text-xs font-bold text-zim-teal uppercase tracking-wide">
                                                            Best Match - Routing Now
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
