"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Heart } from 'lucide-react';

interface Message {
    role: 'agent' | 'customer';
    text: string;
    words: { text: string; sentiment?: 'negative' | 'positive' | 'neutral' }[];
}

// Comprehensive conversation with word-level sentiment
const fullConversation: Message[] = [
    {
        role: 'agent',
        text: 'ZIM Support, how can I help you today?',
        words: [{ text: 'ZIM' }, { text: 'Support,' }, { text: 'how' }, { text: 'can' }, { text: 'I' }, { text: 'help' }, { text: 'you' }, { text: 'today?' }]
    },
    {
        role: 'customer',
        text: 'I am really frustrated with this delay!',
        words: [
            { text: 'I' }, { text: 'am' }, { text: 'really' },
            { text: 'frustrated', sentiment: 'negative' },
            { text: 'with' }, { text: 'this' },
            { text: 'delay!', sentiment: 'negative' }
        ]
    },
    {
        role: 'agent',
        text: 'I completely understand your frustration. Let me check the status immediately.',
        words: [
            { text: 'I' }, { text: 'completely' },
            { text: 'understand', sentiment: 'positive' },
            { text: 'your' }, { text: 'frustration.' }, { text: 'Let' }, { text: 'me' }, { text: 'check' }, { text: 'the' }, { text: 'status' }, { text: 'immediately.' }
        ]
    },
    {
        role: 'customer',
        text: 'This is unacceptable! My factory is waiting!',
        words: [
            { text: 'This' }, { text: 'is' },
            { text: 'unacceptable!', sentiment: 'negative' },
            { text: 'My' }, { text: 'factory' }, { text: 'is' }, { text: 'waiting!' }
        ]
    },
    {
        role: 'agent',
        text: 'I see the container is held at customs. I\'m escalating this to our priority team right now.',
        words: [
            { text: 'I' }, { text: 'see' }, { text: 'the' }, { text: 'container' }, { text: 'is' }, { text: 'held' }, { text: 'at' }, { text: 'customs.' }, { text: "I'm" }, { text: 'escalating' }, { text: 'this' }, { text: 'to' }, { text: 'our' }, { text: 'priority' }, { text: 'team' }, { text: 'right' }, { text: 'now.' }
        ]
    },
    {
        role: 'customer',
        text: 'Okay, I hope this gets resolved quickly.',
        words: [
            { text: 'Okay,' }, { text: 'I' },
            { text: 'hope', sentiment: 'positive' },
            { text: 'this' }, { text: 'gets' }, { text: 'resolved' }, { text: 'quickly.' }
        ]
    },
    {
        role: 'agent',
        text: 'Great news! The team is expediting clearance. ETA is 2 hours.',
        words: [
            { text: 'Great', sentiment: 'positive' },
            { text: 'news!', sentiment: 'positive' },
            { text: 'The' }, { text: 'team' }, { text: 'is' }, { text: 'expediting' }, { text: 'clearance.' }, { text: 'ETA' }, { text: 'is' }, { text: '2' }, { text: 'hours.' }
        ]
    },
    {
        role: 'customer',
        text: 'Perfect! Thank you so much for your help!',
        words: [
            { text: 'Perfect!', sentiment: 'positive' },
            { text: 'Thank', sentiment: 'positive' },
            { text: 'you' }, { text: 'so' }, { text: 'much' }, { text: 'for' }, { text: 'your' },
            { text: 'help!', sentiment: 'positive' }
        ]
    }
];

export const SentimentBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentSentiment, setCurrentSentiment] = useState<'negative' | 'neutral' | 'positive'>('neutral');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentIndexRef = useRef(0);

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            if (currentIndexRef.current < fullConversation.length) {
                const currentMsg = fullConversation[currentIndexRef.current];
                setMessages(prev => [...prev, currentMsg]);

                // Update sentiment based on message analysis
                const negativeWords = currentMsg.words.filter(w => w.sentiment === 'negative').length;
                const positiveWords = currentMsg.words.filter(w => w.sentiment === 'positive').length;

                if (currentIndexRef.current <= 3) {
                    setCurrentSentiment('negative');
                } else if (currentIndexRef.current <= 5) {
                    setCurrentSentiment('neutral');
                } else {
                    setCurrentSentiment('positive');
                }

                currentIndexRef.current++;
            } else {
                // Loop back
                currentIndexRef.current = 0;
                setMessages([]);
                setCurrentSentiment('neutral');
            }
        }, 2500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setMessages([]);
            setCurrentSentiment('neutral');
            currentIndexRef.current = 0;
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [state]);

    return (
        <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-slate-950/80 to-slate-900/80 flex flex-col">
            <SimulationControls
                state={state}
                onPlay={() => setState('playing')}
                onPause={() => setState('paused')}
                onStop={() => setState('idle')}
            />

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Interface - Left Side */}
                <div className="w-[65%] border-r border-white/5 bg-black/20 flex flex-col p-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Brain size={14} className="text-zim-teal" />
                        Live Conversation
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.role === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] ${msg.role === 'agent'
                                            ? 'bg-slate-800 text-slate-200 rounded-2xl rounded-bl-sm'
                                            : 'bg-gradient-to-br from-blue-900/80 to-blue-800/80 text-white rounded-2xl rounded-br-sm'
                                        } px-4 py-3 shadow-lg`}>
                                        <div className="text-[10px] uppercase tracking-wider opacity-60 mb-1">
                                            {msg.role}
                                        </div>
                                        <div className="text-sm leading-relaxed">
                                            {msg.words.map((word, widx) => (
                                                <React.Fragment key={widx}>
                                                    {word.sentiment === 'negative' ? (
                                                        <motion.span
                                                            initial={{ backgroundColor: 'transparent' }}
                                                            animate={{
                                                                backgroundColor: ['transparent', 'rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.2)'],
                                                            }}
                                                            transition={{ duration: 0.8, delay: widx * 0.1 }}
                                                            className="text-red-400 font-bold px-1 rounded border-b-2 border-red-500/50"
                                                            style={{ textShadow: '0 0 8px rgba(239, 68, 68, 0.6)' }}
                                                        >
                                                            {word.text}
                                                        </motion.span>
                                                    ) : word.sentiment === 'positive' ? (
                                                        <motion.span
                                                            initial={{ backgroundColor: 'transparent' }}
                                                            animate={{
                                                                backgroundColor: ['transparent', 'rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.2)'],
                                                            }}
                                                            transition={{ duration: 0.8, delay: widx * 0.1 }}
                                                            className="text-emerald-400 font-bold px-1 rounded border-b-2 border-emerald-500/50"
                                                            style={{ textShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }}
                                                        >
                                                            {word.text}
                                                        </motion.span>
                                                    ) : (
                                                        <span>{word.text}</span>
                                                    )}
                                                    {' '}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* AI Analysis Panel - Right Side */}
                <div className="w-[35%] bg-[#0f172a]/60 p-4 space-y-4 flex flex-col">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center flex items-center justify-center gap-2">
                        <Brain size={14} className="text-zim-teal animate-pulse" />
                        AI Analysis
                    </div>

                    {/* Sentiment Gauge */}
                    <motion.div
                        className="bg-slate-900/50 p-4 rounded-xl border border-white/5"
                        animate={{ borderColor: currentSentiment === 'negative' ? 'rgba(239, 68, 68, 0.3)' : currentSentiment === 'positive' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.05)' }}
                    >
                        <div className="text-xs text-slate-500 uppercase mb-3">Live Sentiment</div>
                        <div className="relative h-20 flex items-center justify-center">
                            {/* Sentiment Indicator */}
                            <motion.div
                                className="flex items-center gap-2"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {currentSentiment === 'negative' && (
                                    <>
                                        <TrendingDown className="text-red-500" size={32} />
                                        <span className="text-2xl font-bold text-red-500">Negative</span>
                                    </>
                                )}
                                {currentSentiment === 'neutral' && (
                                    <>
                                        <AlertTriangle className="text-yellow-500" size={32} />
                                        <span className="text-2xl font-bold text-yellow-500">Neutral</span>
                                    </>
                                )}
                                {currentSentiment === 'positive' && (
                                    <>
                                        <TrendingUp className="text-emerald-500" size={32} />
                                        <span className="text-2xl font-bold text-emerald-500">Positive</span>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* AI Insights */}
                    <div className="flex-1 space-y-2 overflow-y-auto">
                        <AnimatePresence>
                            {currentSentiment === 'negative' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-red-900/20 border border-red-500/30 rounded-lg p-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <AlertTriangle size={14} className="text-red-400 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-red-400 mb-1">High Friction Detected</div>
                                            <div className="text-[10px] text-slate-300">Escalation recommended</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentSentiment === 'neutral' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <Brain size={14} className="text-yellow-400 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-yellow-400 mb-1">Sentiment Improving</div>
                                            <div className="text-[10px] text-slate-300">Continue current approach</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentSentiment === 'positive' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <Heart size={14} className="text-emerald-400 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-emerald-400 mb-1">Resolution Successful</div>
                                            <div className="text-[10px] text-slate-300">Customer satisfaction high</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
