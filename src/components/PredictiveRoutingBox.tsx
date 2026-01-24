"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Zap, TrendingUp, AlertCircle, CheckCircle2, Search, X } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

// --- Types ---
interface Agent {
    id: string;
    name: string;
    role: string;
    skill: string;
    occupancy: number; // 0-100
    status: 'available' | 'busy' | 'away';
    matchScore: number;
    rejectionReason?: 'Occupancy' | 'Skill Gap' | 'Lower Score';
}

const AGENTS: Agent[] = [
    { id: 'a1', name: 'David K.', role: 'Senior', skill: 'VIP, Claims', occupancy: 92, status: 'busy', matchScore: 94, rejectionReason: 'Occupancy' },
    { id: 'a2', name: 'Emma L.', role: 'Junior', skill: 'Billing', occupancy: 20, status: 'available', matchScore: 45, rejectionReason: 'Skill Gap' },
    { id: 'a3', name: 'Kfir', role: 'Expert', skill: 'VIP, Global', occupancy: 45, status: 'available', matchScore: 98 }, // The Match
    { id: 'a4', name: 'Tom R.', role: 'Senior', skill: 'Tech Support', occupancy: 60, status: 'available', matchScore: 60, rejectionReason: 'Skill Gap' },
    { id: 'a5', name: 'Lisa M.', role: 'Mid', skill: 'General', occupancy: 10, status: 'away', matchScore: 30, rejectionReason: 'Skill Gap' },
    { id: 'a6', name: 'James B.', role: 'Senior', skill: 'VIP', occupancy: 85, status: 'busy', matchScore: 88, rejectionReason: 'Occupancy' },
];

const SCAN_SPEED = 400; // ms per agent

// --- Sub-components ---

const AgentCard = ({ agent, state, isMatched, isScanned }: { agent: Agent, state: 'idle' | 'scanning' | 'matched', isMatched: boolean, isScanned: boolean }) => {
    // Visual State Determination
    let borderColor = 'border-slate-700/50';
    let bgColor = 'bg-slate-800/40';
    let opacity = 'opacity-60';
    let label = null;

    if (state === 'scanning') {
        if (isScanned) {
            // Evaluated
            if (agent.id === 'a3') {
                // Potential Match (Greenish/Gold pending final)
                borderColor = 'border-amber-400';
                bgColor = 'bg-amber-900/20';
                opacity = 'opacity-100';
            } else {
                // Rejected
                borderColor = 'border-red-500/30';
                bgColor = 'bg-red-900/10';
                opacity = 'opacity-50 grayscale';
            }
        } else {
            // Waiting to be scanned
            opacity = 'opacity-40';
        }
    } else if (state === 'matched') {
        if (isMatched) {
            borderColor = 'border-amber-400 box-shadow-[0_0_20px_rgba(251,191,36,0.5)]';
            bgColor = 'bg-gradient-to-br from-amber-500/20 to-black';
            opacity = 'opacity-100 scale-105 z-10';
        } else {
            opacity = 'opacity-20 grayscale';
        }
    }

    return (
        <motion.div
            layout
            className={`relative p-3 rounded-xl border ${borderColor} ${bgColor} ${opacity} transition-all duration-300 flex flex-col gap-2`}
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-200">{agent.name}</div>
                        <div className="text-[10px] text-slate-400">{agent.role}</div>
                    </div>
                </div>
                {/* Status Dot */}
                <div className={`w-2 h-2 rounded-full ${agent.status === 'available' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>

            <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Skill</span>
                    <span className="text-slate-200">{agent.skill}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Occupancy</span>
                    <span className={`${agent.occupancy > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{agent.occupancy}%</span>
                </div>
            </div>

            {/* Reject/Match Label */}
            <AnimatePresence>
                {state === 'scanning' && isScanned && !isMatched && agent.rejectionReason && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-0 -bottom-3 flex justify-center"
                    >
                        <span className="bg-red-950/80 border border-red-500/50 text-red-200 text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md">
                            {agent.rejectionReason}
                        </span>
                    </motion.div>
                )}
                {state === 'matched' && isMatched && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -top-3 -right-3"
                    >
                        <div className="bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg shadow-amber-500/20 flex items-center gap-1">
                            <TrendingUp size={12} />
                            {agent.matchScore}% MATCH
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Main Application ---
export const PredictiveRoutingBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [scanIndex, setScanIndex] = useState(-1);
    const [phase, setPhase] = useState<'idle' | 'scanning' | 'matched'>('idle');
    const [customerCoords, setCustomerCoords] = useState<{ x: number, y: number } | null>(null);
    const [targetCoords, setTargetCoords] = useState<{ x: number, y: number } | null>(null);

    // Refs for connection line
    const customerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Initial Scroll
    const containerRef = useRef<HTMLDivElement>(null);

    // Control Logic
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (state === 'playing') {
            // Start scanning if not already
            if (phase === 'idle') {
                setPhase('scanning');
                setScanIndex(-1);
            }

            // Scanning Interval
            interval = setInterval(() => {
                setScanIndex(prev => {
                    const next = prev + 1;
                    if (next >= AGENTS.length) {
                        // Scan complete -> Match
                        setPhase('matched');

                        // Wait then reset
                        setTimeout(() => {
                            if (state === 'playing') {
                                setPhase('idle');
                                setScanIndex(-1);
                                setTimeout(() => setPhase('scanning'), 500);
                            }
                        }, 3000);

                        return prev; // Stop incrementing
                    }
                    return next;
                });
            }, SCAN_SPEED);

        } else if (state === 'idle') {
            setPhase('idle');
            setScanIndex(-1);
            if (interval) clearInterval(interval);
        }

        // Cleanup interval on unmount or pause
        if (state !== 'playing' || phase === 'matched') {
            if (interval) clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [state, phase]);


    return (
        <ClientOnly>
            <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-slate-950 flex flex-col overflow-hidden border border-amber-900/30">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                <SimulationControls
                    state={state}
                    onPlay={() => setState('playing')}
                    onPause={() => setState('paused')}
                    onStop={() => setState('idle')}
                />

                <div className="flex-1 p-6 relative z-10 flex flex-col">

                    {/* 1. CUSTOMER CALLER CARD */}
                    <div ref={customerRef} className="relative z-20 mx-auto mb-8 w-full max-w-md">
                        <div className="bg-gradient-to-r from-amber-950/80 to-slate-900/90 border border-amber-500/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
                            {/* Glow behind */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -ml-16 -mt-16 pointer-events-none" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center">
                                            <User size={24} className="text-amber-200" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[10px] font-bold px-1.5 rounded-full border border-black">
                                            VIP
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Kfir</h3>
                                        <div className="flex items-center gap-2 text-xs text-amber-500/80">
                                            <Shield size={10} />
                                            <span>Premier Member</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Intent</div>
                                    <div className="text-sm font-bold text-red-400 flex items-center gap-1 justify-end">
                                        <AlertCircle size={12} />
                                        Resolution
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">Wait: 00:42</div>
                                </div>
                            </div>

                            {/* Connecting Anchor Point (Bottom Center) */}
                            <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-amber-500 rounded-full -translate-x-1/2 shadow-[0_0_10px_orange]" />
                        </div>
                    </div>


                    {/* 2. MATCHMAKING GRID */}
                    <div ref={gridRef} className="flex-1 grid grid-cols-3 gap-4 relative">
                        {AGENTS.map((agent, index) => {
                            const isScanned = index <= scanIndex;
                            const isCurrentScan = index === scanIndex;
                            const isMatch = agent.id === 'a3'; // Kfir is the match

                            return (
                                <div key={agent.id} className="relative">
                                    <AgentCard
                                        agent={agent}
                                        state={phase}
                                        isScanned={isScanned}
                                        isMatched={phase === 'matched' && isMatch}
                                    />

                                    {/* Scanning Reticle Overlay */}
                                    <AnimatePresence>
                                        {phase === 'scanning' && isCurrentScan && (
                                            <motion.div
                                                layoutId="scanner"
                                                className="absolute inset-0 border-2 border-amber-400 rounded-xl z-30 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                                                initial={{ opacity: 0, scale: 1.1 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-[9px] font-bold px-2 rounded-full">
                                                    ANALYZING
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Match Connector Line (SVG Overlay) */}
                                    {/* We render this GLOBALLY but calculate relative positions? A bit hard in React without excessive refs.
                                       Easier hack: Absolute div line from Top Center of THIS card to Top Center of Container. 
                                       Actually, simpler to just draw a straight laser when matched.
                                   */}
                                </div>
                            )
                        })}
                    </div>

                    {/* CONNECTION LINE OVERLAY (Simple Approach) */}
                    <AnimatePresence>
                        {phase === 'matched' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 pointer-events-none z-50"
                            >
                                <svg className="w-full h-full">
                                    {/* Line from Customer (Top Center 20% Y approx) to Matched Agent (Kfir is index 2, Top Right) */}
                                    {/* Hardcoded approx coords for demo layout stability. 
                                        Customer: 50% X, 140px Y (approx bottom of card).
                                        Agent 3 (Top Right): 83% X, 220px Y (approx top of card).
                                    */}
                                    <defs>
                                        <linearGradient id="matchGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                        </linearGradient>
                                        <filter id="glow">
                                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                                            <feMerge>
                                                <feMergeNode in="coloredBlur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* Calculated approx paths based on standard render positions */}
                                    <motion.path
                                        d="M 50% 120 L 83% 200"
                                        stroke="url(#matchGrad)"
                                        strokeWidth="3"
                                        filter="url(#glow)"
                                        fill="none"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 0.4, ease: "circOut" }}
                                    />

                                    <motion.circle
                                        cx="83%" cy="200" r="4" fill="#fbbf24"
                                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </ClientOnly>
    );
};
