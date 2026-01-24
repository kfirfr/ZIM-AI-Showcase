"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Activity, Zap, Cpu, MessageSquare, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ClientOnly } from './ClientOnly';

// --- Types ---
interface Word {
    text: string;
    sentiment?: 'negative' | 'positive' | 'neutral';
}

interface Message {
    id: string;
    role: 'agent' | 'customer';
    text: string;
    words: Word[];
    insight?: {
        type: 'critical' | 'positive' | 'info';
        label: string;
        text: string;
    };
    sentimentScore: number; // -1 to 1
}

// --- Data ---
const FULL_CONVERSATION: Message[] = [
    {
        id: 'msg-1',
        role: 'agent',
        text: 'ZIM Support. I see you\'re inquiring about shipment ZIMU-2938. How can I assist?',
        words: [
            { text: 'ZIM' }, { text: 'Support.' }, { text: 'I' }, { text: 'see' },
            { text: 'you\'re' }, { text: 'inquiring' }, { text: 'about' },
            { text: 'shipment' }, { text: 'ZIMU-2938.' }, { text: 'How' },
            { text: 'can' }, { text: 'I' }, { text: 'assist?' }
        ],
        sentimentScore: 0.1,
    },
    {
        id: 'msg-2',
        role: 'customer',
        text: 'It\'s stuck at Savannah! "Held" status. My production line is stopped!',
        words: [
            { text: 'It\'s' }, { text: 'stuck', sentiment: 'negative' }, { text: 'at' }, { text: 'Savannah!' },
            { text: '"Held"', sentiment: 'negative' },
            { text: 'status.' }, { text: 'My' }, { text: 'production' }, { text: 'line' }, { text: 'is' },
            { text: 'stopped!', sentiment: 'negative' }
        ],
        insight: {
            type: 'critical',
            label: 'Empathy Required',
            text: 'High friction detected. Production impact.'
        },
        sentimentScore: -0.8,
    },
    {
        id: 'msg-3',
        role: 'agent',
        text: 'Checking... It’s a documentation error. I\'m overriding it for priority release now.',
        words: [
            { text: 'Checking...' }, { text: 'It’s' }, { text: 'a' }, { text: 'documentation' },
            { text: 'error.' }, { text: 'I\'m' },
            { text: 'overriding', sentiment: 'positive' },
            { text: 'it' }, { text: 'for' },
            { text: 'priority', sentiment: 'positive' },
            { text: 'release', sentiment: 'positive' },
            { text: 'now.' }
        ],
        sentimentScore: 0.6,
    },
    {
        id: 'msg-4',
        role: 'customer',
        text: 'That worked! Status updated. Thank you!',
        words: [
            { text: 'That' },
            { text: 'worked!', sentiment: 'positive' },
            { text: 'Status' }, { text: 'updated.' },
            { text: 'Thank', sentiment: 'positive' },
            { text: 'you!', sentiment: 'positive' }
        ],
        insight: {
            type: 'positive',
            label: 'Resolution Success',
            text: 'Customer sentiment restored.'
        },
        sentimentScore: 0.9,
    }
];

// --- Sub-components ---

const AudioWaveform = () => {
    return (
        <div className="flex items-center gap-0.5 h-6 px-2">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-blue-400/80 rounded-full"
                    animate={{
                        height: [4, 12 + Math.random() * 10, 4],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 0.4,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.05
                    }}
                />
            ))}
        </div>
    );
};

const InsightCard = ({ insight }: { insight: NonNullable<Message['insight']> }) => {
    const colors = insight.type === 'critical'
        ? 'border-red-500/50 bg-red-950/40 text-red-200'
        : 'border-cyan-500/50 bg-cyan-950/40 text-cyan-200';

    const glow = insight.type === 'critical'
        ? 'shadow-[0_0_15px_rgba(239,68,68,0.2)]'
        : 'shadow-[0_0_15px_rgba(34,211,238,0.2)]';

    const Icon = insight.type === 'critical' ? AlertCircle : CheckCircle;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`w-full p-3 rounded-lg border backdrop-blur-md mb-3 ${colors} ${glow}`}
        >
            <div className="flex items-start gap-3">
                <div className="relative mt-0.5 shrink-0">
                    <Icon size={16} className={insight.type === 'critical' ? 'text-red-400' : 'text-cyan-400'} />
                    <motion.div
                        className={`absolute inset-0 rounded-full blur-sm ${insight.type === 'critical' ? 'bg-red-500' : 'bg-cyan-500'}`}
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1">{insight.label}</div>
                    <div className="text-xs opacity-80 leading-snug">{insight.text}</div>
                </div>
            </div>
        </motion.div>
    );
};

const HighlightedWord = ({ word, index }: { word: Word; index: number }) => {
    if (!word.sentiment || word.sentiment === 'neutral') return <span>{word.text} </span>;

    const isNegative = word.sentiment === 'negative';
    const colorClass = isNegative ? 'text-red-400' : 'text-cyan-300';
    const shadowColor = isNegative ? 'rgba(239, 68, 68, ' : 'rgba(34, 211, 238, ';

    return (
        <motion.span
            className={`relative inline-block font-bold px-0.5 mx-0.5 rounded ${colorClass}`}
            initial={{ textShadow: `0 0 0px ${shadowColor}0)` }}
            animate={{
                textShadow: [
                    `0 0 4px ${shadowColor}0.4)`,
                    `0 0 12px ${shadowColor}0.8)`,
                    `0 0 4px ${shadowColor}0.4)`
                ],
                scale: [1, 1.05, 1],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1
            }}
        >
            {word.text}
            <motion.span
                className={`absolute inset-0 rounded blur-md -z-10`}
                animate={{
                    backgroundColor: [
                        `${shadowColor}0)`,
                        `${shadowColor}0.2)`,
                        `${shadowColor}0)`
                    ]
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.1
                }}
            />
        </motion.span>
    );
};

const MessageItem = ({ message }: { message: Message }) => {
    const [status, setStatus] = useState<'decoding' | 'visible'>('decoding');

    useEffect(() => {
        const timer = setTimeout(() => setStatus('visible'), 800); // Faster decoding
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`relative flex w-full mb-4 ${message.role === 'customer' ? 'justify-end' : 'justify-start'}`}>
            <AnimatePresence mode="wait">
                {status === 'decoding' ? (
                    <motion.div
                        key="waveform"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                        className={`p-3 rounded-2xl flex items-center gap-2 ${message.role === 'agent'
                            ? 'bg-slate-800/50 rounded-bl-none'
                            : 'bg-blue-900/20 rounded-br-none ml-auto'
                            }`}
                    >
                        <span className="text-[10px] font-mono text-blue-400 uppercase">Translating Audio</span>
                        <AudioWaveform />
                    </motion.div>
                ) : (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        className={`relative max-w-[85%] p-4 rounded-2xl backdrop-blur-md shadow-lg border ${message.role === 'agent'
                            ? 'bg-slate-800/90 text-slate-100 rounded-bl-sm border-slate-700/50'
                            : 'bg-gradient-to-br from-blue-900/40 to-slate-900/40 text-blue-50 rounded-br-sm border-blue-500/30'
                            }`}
                    >
                        {/* Role Label */}
                        <div className="text-[9px] uppercase tracking-widest opacity-50 mb-1.5 flex items-center gap-2">
                            {message.role === 'agent' ? <Brain size={10} /> : <MessageSquare size={10} />}
                            {message.role}
                        </div>

                        {/* Content */}
                        <div className="text-sm leading-relaxed">
                            {message.words.map((word, idx) => (
                                <React.Fragment key={idx}>
                                    <HighlightedWord word={word} index={idx} />
                                    {' '}
                                </React.Fragment>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const SentimentGauge = ({ score }: { score: number }) => {
    // Score range: -1 to 1.
    // Display range: -100 to +100.
    const displayScore = Math.round(score * 100);

    // Angle mapping: -1 -> -90deg, 1 -> 90deg? Or full semicircle -90 to +90.
    // SVG Path arc.
    const radius = 40;
    const circumference = 2 * Math.PI * radius; // Full circle
    const halfCirc = circumference / 2;

    // Normalized 0 to 1 for the arc
    // -1 => 0 (empty from left) ? No, gauge usually fills from left (Red) to right (Blue).
    // Let's do a gradient bar.
    // 0 = -100 (left), 0.5 = 0 (top), 1 = +100 (right).
    const normalized = (score + 1) / 2; // 0 to 1

    // Color
    const color = score < -0.2 ? '#ef4444' : score > 0.2 ? '#22d3ee' : '#94a3b8';

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            {/* Gauge SVG */}
            <div className="relative w-32 h-16 overflow-hidden">
                <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
                    {/* Track */}
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />

                    {/* Progress */}
                    <motion.path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: normalized }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                        strokeDasharray="1 0" // Hack for partial fill/draw? No, use Framer pathLength if path is total length
                    />
                    <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#94a3b8" />
                            <stop offset="100%" stopColor="#22d3ee" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Needle/Indicator - simpler approach: just rotate a line */}
                <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-full origin-bottom"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: (score * 90) }} // -1 -> -90, 0 -> 0, 1 -> 90
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                >
                    <div className="w-1 h-3/4 bg-white rounded-t-full shadow-[0_0_10px_white] mx-auto mt-auto mb-0" style={{ marginTop: '12px' }}></div>
                </motion.div>
            </div>

            {/* Reading */}
            <div className="mt-2 text-center">
                <motion.div
                    key={displayScore}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-3xl font-bold font-mono tracking-tighter ${displayScore < -20 ? 'text-red-400' : displayScore > 20 ? 'text-cyan-400' : 'text-slate-200'}`}
                >
                    {displayScore > 0 ? '+' : ''}{displayScore}
                </motion.div>
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mt-1">Sentiment Score</div>
            </div>
        </div>
    );
};

// --- Main Application ---
export const SentimentBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Filter messages that have insights for the feed
    const insights = useMemo(() => {
        return messages.filter(m => m.insight).map(m => ({ id: m.id, ...m.insight! }));
    }, [messages]);

    // Simulation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (state === 'playing') {
            interval = setInterval(() => {
                if (currentIndex < FULL_CONVERSATION.length) {
                    const nextMsg = FULL_CONVERSATION[currentIndex];
                    setMessages(prev => [...prev, nextMsg]);

                    // Sync score update with the "decoding" animation (800ms delay in MessageItem)
                    setTimeout(() => {
                        setCurrentScore(nextMsg.sentimentScore);
                    }, 800);

                    setCurrentIndex(prev => prev + 1);
                } else {
                    // Reset or Pause? Loop for demo.
                    setTimeout(() => {
                        setMessages([]);
                        setCurrentIndex(0);
                        setCurrentScore(0);
                    }, 3000);
                }
            }, 2500); // 3. FASTER PACING (2.5s)
        } else if (state === 'idle') {
            setMessages([]);
            setCurrentIndex(0);
            setCurrentScore(0);
        }

        return () => clearInterval(interval);
    }, [state, currentIndex]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [messages]);


    return (
        <ClientOnly>
            <div ref={containerRef} className="relative w-full h-full min-h-[500px] bg-slate-950 flex flex-col overflow-hidden border border-slate-800/50 font-sans">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

                <SimulationControls
                    state={state}
                    onPlay={() => setState('playing')}
                    onPause={() => setState('paused')}
                    onStop={() => setState('idle')}
                />

                <div className="flex-1 flex overflow-hidden relative z-10">
                    {/* LEFT: Live Conversation */}
                    <div className="flex-1 p-6 flex flex-col border-r border-slate-800/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} className="text-blue-400" />
                                Live Voice Stream
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`block w-2 h-2 rounded-full ${state === 'playing' ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                                <span className="text-[10px] text-slate-400 uppercase font-mono">
                                    {state === 'playing' ? 'REC' : 'OFFLINE'}
                                </span>
                            </div>
                        </div>

                        <div ref={chatContainerRef} className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative space-y-2">
                            {messages.map((msg) => (
                                <MessageItem key={msg.id} message={msg} />
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Neural Pulse Gauge & Insights */}
                    <div className="w-[35%] bg-slate-900/50 p-5 flex flex-col backdrop-blur-sm">

                        {/* 1. GAUGE SECTION */}
                        <div className="mb-8 border-b border-slate-800/50 pb-6">
                            <SentimentGauge score={currentScore} />

                            {/* Short Trend Indicator */}
                            <div className="flex justify-center gap-4 mt-4">
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <TrendingUp size={12} className="text-emerald-400" />
                                    <span className="text-[10px] text-slate-400 uppercase">Positivity</span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <Zap size={12} className="text-amber-400" />
                                    <span className="text-[10px] text-slate-400 uppercase">Intensity</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. LIVE INSIGHTS FEED */}
                        <div className="flex-1 flex flex-col min-h-0">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Cpu size={14} />
                                Neural Insights
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                                <AnimatePresence>
                                    {insights.length === 0 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.4 }}
                                            className="text-center mt-10 text-xs text-slate-500 italic"
                                        >
                                            Waiting for data patterns...
                                        </motion.div>
                                    )}
                                    {insights.map((insight) => (
                                        <InsightCard key={insight.id} insight={insight} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};
