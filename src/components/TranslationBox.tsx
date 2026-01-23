"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ArrowRightLeft, Globe } from 'lucide-react';

export const TranslationBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [msgIndex, setMsgIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const messages = [
        {
            original: { lang: "ES", text: "Hola, necesito ayuda con mi pedido." },
            translated: { lang: "EN", text: "Hello, I need help with my order." },
            detected: "Spanish Detected"
        },
        {
            original: { lang: "ZH", text: "我的集装箱什么时候到达？" },
            translated: { lang: "EN", text: "When will my container arrive?" },
            detected: "Chinese (Simplified) Detected"
        },
        {
            original: { lang: "FR", text: "C'est urgent, merci de répondre." },
            translated: { lang: "EN", text: "It is urgent, please reply." },
            detected: "French Detected"
        }
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % messages.length);
        }, 3500);
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (state === 'playing') {
            if (containerRef.current) {
                setTimeout(() => {
                    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setMsgIndex(0);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    const currentMsg = messages[msgIndex];

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[400px] bg-slate-950/50 flex flex-col overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                {/* Background Globe Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <Globe size={300} className="text-zim-teal/20 animate-spin-slow" />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={msgIndex}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full max-w-lg space-y-8"
                    >
                        {/* Source Message */}
                        <div className="relative">
                            <div className="absolute -top-3 left-4 bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-400 border border-slate-700">
                                Customer ({currentMsg.original.lang})
                            </div>
                            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <p className="text-xl text-white font-medium">{currentMsg.original.text}</p>
                            </div>
                        </div>

                        {/* Translation Process */}
                        <div className="flex items-center justify-center gap-4">
                            <motion.div
                                animate={{ rotate: 180 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="p-2 bg-zim-teal/20 rounded-full text-zim-teal"
                            >
                                <ArrowRightLeft size={24} />
                            </motion.div>
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-sm font-mono text-zim-teal font-bold tracking-wider"
                            >
                                {currentMsg.detected}
                            </motion.span>
                        </div>

                        {/* Translated Message */}
                        <div className="relative">
                            <div className="absolute -top-3 right-4 bg-zim-teal/20 px-3 py-1 rounded-full text-xs font-bold text-zim-teal border border-zim-teal/30">
                                Agent View ({currentMsg.translated.lang})
                            </div>
                            <div className="bg-zim-teal/5 border border-zim-teal/20 rounded-2xl p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(45,212,191,0.1)]">
                                <p className="text-xl text-white font-medium">{currentMsg.translated.text}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
