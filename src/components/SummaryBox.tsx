import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { CheckSquare, MessageSquare, FileText, ArrowRight, User, Bot } from 'lucide-react';
import { ClientOnly } from './ClientOnly';
import { motion, AnimatePresence } from 'framer-motion';

const fullConversation = [
    {
        role: 'agent',
        text: 'ZIM Support. I see you\'re inquiring about shipment ZIMU-2938. How can I assist?'
    },
    {
        role: 'customer',
        text: 'It\'s stuck at Savannah! "Held" status. My production line is stopped!'
    },
    {
        role: 'agent',
        text: 'Checking... It’s a documentation error. I\'m overriding it for priority release now.'
    },
    {
        role: 'customer',
        text: 'That worked! Status updated. Thank you!'
    }
];

export const SummaryBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [phase, setPhase] = useState<'idle' | 'ingest' | 'process' | 'result'>('idle');
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Particle state for the "Extraction" phase
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

    const runSimulation = React.useCallback(() => {
        // Clear any existing timers first
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // If starting from idle or complete, reset everything
        if (phase === 'idle' || phase === 'result') {
            // Logic handled by useEffect when state changes to playing
        }
    }, [phase, state]);

    // Use a Ref to track message index across renders/pauses
    const msgIdxRef = useRef(0);

    // Generate random particles for the extraction phase
    const generateParticles = () => {
        const newParticles = Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 500, // Spread across width
            y: (Math.random() - 0.5) * 400, // Spread across height
            delay: Math.random() * 0.8,
        }));
        setParticles(newParticles);
    };

    useEffect(() => {
        if (state === 'playing') {
            if (containerRef.current && phase === 'idle') {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (phase === 'idle') {
                setPhase('ingest');
                setMessages([]);
                msgIdxRef.current = 0;
            }

            if (phase === 'ingest') {
                intervalRef.current = setInterval(() => {
                    if (msgIdxRef.current < fullConversation.length) {
                        const nextMsg = fullConversation[msgIdxRef.current];
                        if (nextMsg) {
                            setMessages(prev => [...prev, nextMsg]);
                        }
                        msgIdxRef.current++;
                    } else {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        setPhase('process');
                    }
                }, 1800); // 1. SLOwER INGEST (1.8s)
            } else if (phase === 'process') {
                generateParticles();
                // "Process" runs for the duration of the particle/pule animation
                timeoutRef.current = setTimeout(() => {
                    setPhase('result');
                }, 3500);
            } else if (phase === 'result') {
                // Hold result for a bit then reset if needed, or just stay
                // Auto-reset after a long delay to loop? 
                // User usually wants to see the result. Let's hold it unless they restart.
                // But for a loop demo:
                timeoutRef.current = setTimeout(() => {
                    setPhase('idle');
                }, 10000); // Hold result longer
            }

        } else {
            // Paused or Idle
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            if (state === 'idle') {
                setPhase('idle');
                setMessages([]);
                msgIdxRef.current = 0;
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [state, phase]);

    return (
        <ClientOnly>
            <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-gradient-to-br from-slate-950 to-slate-900 flex flex-col border border-emerald-500/20 overflow-hidden font-sans">
                {/* Background Grid/Noise for Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                ></div>

                <SimulationControls
                    state={state}
                    onPlay={() => setState('playing')}
                    onPause={() => setState('paused')}
                    onStop={() => setState('idle')}
                />

                <div className="flex-1 relative w-full h-full flex flex-col p-6">

                    {/* Phase 1: Ingestion & Raw Data */}
                    <AnimatePresence>
                        {(phase === 'ingest' || phase === 'idle' || phase === 'process') && (
                            <motion.div
                                className={`flex-1 flex flex-col justify-end space-y-4 pb-20 transition-all duration-1000 ${phase === 'process' ? 'blur-md scale-90 opacity-30 grayscale' : ''}`}
                                exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                                transition={{ duration: 0.8 }}
                            >
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: msg.role === 'customer' ? 30 : -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-lg backdrop-blur-md border 
                                            ${msg.role === 'agent'
                                                ? 'bg-slate-800/80 border-slate-700 text-slate-200 rounded-bl-none'
                                                : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-100 rounded-br-none'}`}
                                        >
                                            <div className="text-[10px] uppercase opacity-50 mb-1 tracking-wider">{msg.role}</div>
                                            <div className="text-sm leading-relaxed">{msg.text}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Phase 2: Processing (The Vortex) */}
                    <AnimatePresence>
                        {phase === 'process' && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                {/* Particles flying to center - increased count/spread in generateParticles */}
                                {particles.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ x: p.x, y: p.y, opacity: 1, scale: 1.5 }}
                                        animate={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                                        transition={{ duration: 1.2, delay: p.delay, ease: "easeIn" }}
                                        className="absolute w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.9)]"
                                    />
                                ))}

                                {/* The Core / Vortex with Shockwave Exit */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0, rotate: 0 }}
                                    animate={{
                                        scale: [0.2, 1.5, 1.2],
                                        opacity: [0, 1, 1],
                                        rotate: 360
                                    }}
                                    exit={{
                                        scale: 30, // 2. SHOCKWAVE EXPANSION
                                        opacity: 0,
                                        transition: { duration: 0.4, ease: "easeIn" }
                                    }}
                                    transition={{ duration: 3, times: [0, 0.6, 1], ease: "easeInOut" }}
                                    className="relative flex items-center justify-center"
                                >
                                    <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-500 via-cyan-400 to-white blur-2xl opacity-50 animate-pulse"></div>
                                    <div className="absolute w-32 h-32 rounded-full border-2 border-emerald-200/60 border-t-transparent animate-spin-fast"></div> {/* Note: need spin-fast or utilize rotate prop */}
                                    <div className="absolute w-24 h-24 rounded-full border border-white/30 animate-ping"></div>
                                    <div className="absolute text-white/90 font-bold tracking-[0.3em] text-[10px] uppercase drop-shadow-md">Analyzing</div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Phase 3: Crystallization (The Result) */}
                    <AnimatePresence>
                        {phase === 'result' && (
                            <motion.div
                                className="absolute inset-0 z-30 flex items-center justify-center p-6"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                                    className="w-full bg-slate-900/95 backdrop-blur-2xl rounded-xl border border-emerald-500/40 shadow-2xl overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="h-1.5 w-full bg-gradient-to-r from-emerald-600 via-cyan-400 to-emerald-600"></div>

                                    <div className="p-6 space-y-5">
                                        {/* 3. SPECIFIC CONTENT SECTIONS */}

                                        {/* Header Section */}
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight">Transcription Summary</h3>
                                                <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-sm">
                                                    Customer reported held shipment ZIMU-2938 at Savannah. Identified as documentation error.
                                                </p>
                                            </div>
                                            <div className="px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                                                ID: #8392-A
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-800 w-full"></div>

                                        {/* Insights Grid */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User size={14} className="text-cyan-400" />
                                                    <span className="text-xs font-bold text-slate-300 uppercase">Insight - Customer</span>
                                                </div>
                                                <div className="text-sm text-cyan-50 font-medium">Frustrated but loyal. High value account.</div>
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="bg-emerald-900/20 p-3 rounded-lg border border-emerald-500/30"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckSquare size={14} className="text-emerald-400" />
                                                    <span className="text-xs font-bold text-slate-300 uppercase">Insight - Resolution</span>
                                                </div>
                                                <div className="text-sm text-emerald-50 font-medium">Documentation Error fixed via override.</div>
                                            </motion.div>
                                        </div>

                                        {/* Action Items */}
                                        <div className="pt-2">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-3 tracking-wider">Agreed Action Items</div>
                                            <div className="space-y-2.5">
                                                {[
                                                    "Agent to release cargo",
                                                    "Customer to confirm receipt"
                                                ].map((item, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.6 + (i * 0.2) }}
                                                        className="flex items-center gap-3 group"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-colors">
                                                            <CheckSquare size={10} className="text-emerald-400 group-hover:text-emerald-950" />
                                                        </div>
                                                        <span className="text-sm text-slate-300/90 font-medium">{item}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </ClientOnly>
    );
};
