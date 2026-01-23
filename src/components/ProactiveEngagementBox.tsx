"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { Bell, Send, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProactiveEngagementBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [timeline, setTimeline] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const events = [
        { time: '14:22', icon: 'delay', label: 'Delay Detected', desc: 'Container ZIMU9921 delayed 6hrs' },
        { time: '14:23', icon: 'ai', label: 'AI Trigger', desc: 'Proactive notification queued' },
        { time: '14:23', icon: 'send', label: 'SMS/Email Sent', desc: 'Customer notified automatically' },
        { time: '14:45', icon: 'reply', label: 'Customer Responded', desc: '"Thanks for letting me know!"' },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            setTimeline(prev => (prev + 1) % (events.length + 1));
        }, 2000);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setTimeline(0);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'delay': return <Bell size={14} className="text-red-400" />;
            case 'ai': return <span className="text-zim-teal text-xs font-bold">AI</span>;
            case 'send': return <Send size={14} className="text-blue-400" />;
            case 'reply': return <MessageCircle size={14} className="text-emerald-400" />;
            default: return null;
        }
    };

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 p-6 flex items-center justify-center">
                <div className="relative w-full max-w-sm">
                    {/* Vertical Timeline */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-white/10" />

                    <div className="space-y-6">
                        <AnimatePresence>
                            {events.slice(0, Math.max(timeline, 0)).map((event, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="flex gap-4 relative"
                                >
                                    {/* Timeline Node */}
                                    <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10 bg-slate-950">
                                        {getIcon(event.icon)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm text-slate-400 font-mono font-semibold">{event.time}</span>
                                            <span className="text-base font-bold text-white">{event.label}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{event.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
