"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LiveChatInterface } from './LiveChatInterface';
import { SimulationControls, SimulationState } from './SimulationControls';
import { Zap, AlertTriangle, ArrowUp, ThumbsUp } from 'lucide-react';

const TagIcons: { [key: string]: React.ElementType } = {
    Zap, AlertTriangle, ArrowUp, ThumbsUp
};

export const SentimentBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const [tags, setTags] = useState<{ l: string, i: string, c: string }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const currentIndexRef = useRef(0);

    const conversation = [
        { r: "Agent", t: "ZIM Support, Kfir speaking." },
        { r: "Cust", t: "Hi, checking status of container ZIMU882." },
        { r: "Agent", t: "Let me pull that up for you. One moment." },
        { r: "Cust", t: "Please hurry. The factory is waiting.", tag: { l: "Urgency", i: "Zap", c: "text-red-400 border-red-500/50" } },
        { r: "Agent", t: "I see it's currently held at customs." },
        { r: "Cust", t: "What? This delay is unacceptable!", tag: { l: "Risk: High", i: "AlertTriangle", c: "text-red-400 border-red-500/50" } },
        { r: "Agent", t: "I understand. I'm escalating to the release team now.", tag: { l: "Escalation", i: "ArrowUp", c: "text-blue-400 border-blue-500/50" } },
        { r: "Cust", t: "Okay, thank you for helping me.", tag: { l: "Sentiment: Pos", i: "ThumbsUp", c: "text-green-400 border-green-500/50" } },
        { r: "Agent", t: "The team is expediting clearance. ETA 2 hours." },
        { r: "Cust", t: "Perfect, I appreciate the quick response!" }
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            const line = conversation[currentIndexRef.current % conversation.length];
            const newMsg = { role: line.r, text: line.t };

            setMessages(prev => {
                const next = [...prev, newMsg];
                return next.length > 6 ? next.slice(1) : next;
            });

            if (line.tag) {
                setTags(prev => [line.tag!, ...prev].slice(0, 4));
            }

            currentIndexRef.current++;
        }, 2000);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setMessages([]);
            setTags([]);
            currentIndexRef.current = 0;
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

            <div className="flex-1 flex overflow-hidden">
                <div className="w-[60%] border-r border-white/5 bg-black/20 flex flex-col p-4">
                    <LiveChatInterface messages={messages} />
                </div>

                <div className="w-[40%] bg-[#0f172a]/50 p-3 space-y-3 overflow-hidden flex flex-col relative">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-3">Live AI Analysis</div>
                    {tags.map((tag, i) => {
                        const Icon = TagIcons[tag.i] || Zap;
                        return (
                            <div key={i} className={`animate-slide-in-right bg-[#1e293b] p-2 rounded-lg border-l-2 flex items-center gap-2 shadow-lg ${tag.c}`}>
                                <Icon size={14} />
                                <span className="text-[10px] font-bold">{tag.l}</span>
                            </div>
                        )
                    })}
                    {tags.length === 0 && state === 'playing' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-xs text-slate-600 italic">Scanning...</div>
                    )}
                    {state === 'idle' && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-xs text-slate-600 italic">Ready</div>
                    )}
                </div>
            </div>
        </div>
    );
};
