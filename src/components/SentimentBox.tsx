"use client";

import React, { useState, useEffect } from 'react';
import { LiveChatInterface } from './LiveChatInterface';
import { Zap, AlertTriangle, ArrowUp, ThumbsUp, Play, RefreshCw } from 'lucide-react';

// Map icons to Lucide components for tags
const TagIcons: { [key: string]: React.ElementType } = {
    Zap, AlertTriangle, ArrowUp, ThumbsUp
};

export const SentimentBox = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const [tags, setTags] = useState<{ l: string, i: string, c: string }[]>([]);

    const conversation = [
        { r: "Agent", t: "ZIM Support, Kfir speaking." },
        { r: "Cust", t: "Hi, checking status of container ZIMU882." },
        { r: "Agent", t: "Let me pull that up for you. One moment." },
        { r: "Cust", t: "Please hurry. The factory is waiting.", tag: { l: "Urgency", i: "Zap", c: "text-red-400 border-red-500/50" } },
        { r: "Agent", t: "I see it's currently held at customs." },
        { r: "Cust", t: "What? This Delay is unacceptable!", tag: { l: "Risk: High", i: "AlertTriangle", c: "text-red-400 border-red-500/50" } },
        { r: "Agent", t: "I understand. I'm escalating to the release team.", tag: { l: "Escalation", i: "ArrowUp", c: "text-blue-400 border-blue-500/50" } },
        { r: "Cust", t: "Okay, thank you for helping me.", tag: { l: "Sentiment: Pos", i: "ThumbsUp", c: "text-green-400 border-green-500/50" } }
    ];

    useEffect(() => {
        if (!isPlaying) { setMessages([]); setTags([]); return; }

        let idx = 0;
        const interval = setInterval(() => {
            if (idx >= conversation.length) {
                clearInterval(interval);
                setIsPlaying(false);
                return;
            }

            const line = conversation[idx];
            const newMsg = { role: line.r, text: line.t };

            setMessages(prev => {
                const next = [...prev, newMsg];
                return next.length > 5 ? next.slice(1) : next;
            });

            if (line.tag) {
                setTags(prev => [line.tag!, ...prev].slice(0, 4));
            }

            idx++;
        }, 1500);
        return () => clearInterval(interval);
    }, [isPlaying]);

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            {!isPlaying && messages.length === 0 && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/50 rounded-full transition-all hover:scale-105"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-blue-400 font-bold text-sm tracking-wide">ANALYZE STREAM</span>
                    </button>
                </div>
            )}

            {!isPlaying && messages.length > 0 && (
                <div className="absolute bottom-4 right-4 z-50">
                    <button
                        onClick={() => { setMessages([]); setTags([]); setIsPlaying(true); }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 flex overflow-hidden">
                <div className="w-[60%] border-r border-white/5 bg-black/20 flex flex-col p-4">
                    <LiveChatInterface messages={messages} />
                </div>

                <div className="w-[40%] bg-[#0f172a]/50 p-3 space-y-3 overflow-hidden flex flex-col relative">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center mb-2">Live Tags</div>
                    {tags.map((tag, i) => {
                        const Icon = TagIcons[tag.i] || Zap;
                        return (
                            <div key={i} className={`animate-slide-in-right bg-[#1e293b] p-2 rounded-lg border-l-2 flex items-center gap-2 shadow-lg ${tag.c}`}>
                                <Icon size={14} />
                                <span className="text-[10px] font-bold">{tag.l}</span>
                            </div>
                        )
                    })}
                    {tags.length === 0 && isPlaying && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-xs text-slate-600 italic">Scanning...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
