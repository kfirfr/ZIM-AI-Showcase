"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MoreHorizontal, Sparkles, Send } from 'lucide-react';

interface ChatMessage {
    role: 'bot' | 'user';
    text: string;
}

export const VirtualAgentBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const stepRef = useRef(0);

    const scenario = [
        { role: 'user', text: "Can I change the destination of my shipment?", delay: 1000 },
        { role: 'bot', text: "I can help with that. Please provide your Booking Reference Number.", delay: 2000 },
        { role: 'user', text: "It's ZIMU98765432.", delay: 3500 },
        { role: 'bot', text: "Checking shipment status...", delay: 4500, action: true }, // Internal thought/action
        { role: 'bot', text: "The shipment is currently at Singapore. COD (Change of Destination) request has been initiated. A fee of $150 applies. Confirm?", delay: 6500 },
        { role: 'user', text: "Yes, please proceed.", delay: 8500 },
        { role: 'bot', text: "Request processed successfully. You will receive a confirmation email shortly.", delay: 10000 },
    ];

    const runSimulation = () => {
        let currentTime = 0;

        scenario.forEach((step) => {
            const timeout = setTimeout(() => {
                if (step.action) {
                    setIsTyping(true);
                    setTimeout(() => setIsTyping(false), 1500);
                } else {
                    if (step.role === 'bot') {
                        setIsTyping(true);
                        setTimeout(() => {
                            setIsTyping(false);
                            setMessages(prev => [...prev, { role: 'bot', text: step.text }]);
                        }, 1000);
                    } else {
                        setMessages(prev => [...prev, { role: 'user', text: step.text }]);
                    }
                }
            }, step.delay);

            // Track timeouts to clear if needed (simplification: just clearing intervalRef in real usage)
        });

        // Loop reset (simple version: clear and restart after max delay + buffer)
        intervalRef.current = setTimeout(() => {
            setMessages([]);
            runSimulation();
        }, 14000);
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
            // Complex to pause exact timeouts, for now just clearing restarts logic
        } else if (state === 'idle') {
            if (intervalRef.current) clearTimeout(intervalRef.current);
            setMessages([]);
            setIsTyping(false);
        }
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [state]);

    return (
        <div ref={containerRef} className="relative w-full h-full min-h-[450px] bg-slate-950/50 flex flex-col overflow-hidden">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-4 flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zim-teal to-blue-500 flex items-center justify-center shadow-lg shadow-zim-teal/20">
                        <Bot className="text-white" size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-white">ZIM Virtual Assistant</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-slate-400">Online 24/7</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-sm'
                                    : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-white/5'
                                    }`}>
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-start"
                        >
                            <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-sm border border-white/5 flex items-center gap-1">
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Area (Visual Only) */}
                <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="bg-white/5 rounded-full p-3 flex items-center justify-between">
                        <span className="text-sm text-slate-500 ml-2">Type a message...</span>
                        <div className="p-2 bg-zim-teal/20 rounded-full">
                            <Send size={16} className="text-zim-teal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
