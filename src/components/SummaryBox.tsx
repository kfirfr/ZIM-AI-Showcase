"use client";

import React, { useState, useEffect } from 'react';
import { LiveChatInterface } from './LiveChatInterface';
import { CheckSquare, Play, RefreshCw } from 'lucide-react';

export const SummaryBox = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [phase, setPhase] = useState<'idle' | 'ingest' | 'process' | 'result'>('idle');
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);

    const fullConversation = [
        { role: "Agent", text: "ZIM Support, Kfir speaking." },
        { role: "Cust", text: "Hi, I have a major issue with Invoice 992." },
        { role: "Agent", text: "I see the invoice. What is the discrepancy?" },
        { role: "Cust", text: "You charged detention fees but the port was closed!" },
        { role: "Agent", text: "Checking logs... You are correct." },
        { role: "Cust", text: "Can you remove it?" },
        { role: "Agent", text: "Sending request... Approved." },
        { role: "Cust", text: "Great, thank you." }
    ];

    useEffect(() => {
        if (!isPlaying) { setPhase('idle'); setMessages([]); return; }

        let timeout: NodeJS.Timeout | undefined;
        const loop = () => {
            setPhase('ingest');
            setMessages([]);

            let msgIdx = 0;
            const typeInterval = setInterval(() => {
                if (msgIdx < fullConversation.length) {
                    setMessages(prev => [...prev, fullConversation[msgIdx]]);
                    msgIdx++;
                } else {
                    clearInterval(typeInterval);
                    setPhase('process');
                    setTimeout(() => {
                        setPhase('result');
                        // Auto replay or stop? Let's stop after one cycle for better UX in grid
                        setIsPlaying(false);
                    }, 2000);
                }
            }, 600);
        };

        loop();
        return () => { if (timeout) clearTimeout(timeout); };
    }, [isPlaying]);

    return (
        <div className="relative w-full h-full min-h-[320px] bg-slate-950/50 flex flex-col">
            {/* Controls Overlay */}
            {!isPlaying && phase === 'idle' && (
                <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-zim-teal/10 hover:bg-zim-teal/20 border border-zim-teal/50 rounded-full transition-all hover:scale-105"
                    >
                        <div className="w-8 h-8 rounded-full bg-zim-teal flex items-center justify-center text-black">
                            <Play size={14} fill="currentColor" />
                        </div>
                        <span className="text-zim-teal font-bold text-sm tracking-wide">RUN SIMULATION</span>
                    </button>
                </div>
            )}

            {/* Replay Overlay */}
            {!isPlaying && phase === 'result' && (
                <div className="absolute bottom-4 right-4 z-50">
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 relative overflow-hidden flex flex-col p-4">
                {phase === 'ingest' && <LiveChatInterface messages={messages} />}
                {phase === 'idle' && <LiveChatInterface messages={[]} />} {/* Empty state placeholder */}

                {phase === 'process' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm animate-glitch-skew">
                        <div className="text-emerald-400 font-mono text-xl font-bold">COMPRESSING...</div>
                        <div className="w-48 h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 animate-scan-sweep"></div>
                        </div>
                    </div>
                )}

                {phase === 'result' && (
                    <div className="absolute inset-0 bg-[#0f172a] z-30 p-6 flex flex-col items-center justify-center animate-pop-in">
                        <div className="w-full bg-white/5 border border-emerald-500/30 rounded-xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 bg-emerald-500 rounded text-black"><CheckSquare size={16} /></div>
                                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">CRM Summary Generated</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Issue</div>
                                    <div className="text-sm text-white">Dispute on <span className="text-blue-400">Invoice #992</span> due to Port Closure.</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Outcome</div>
                                    <div className="text-sm text-white">Logs verified. Fee waiver <span className="text-emerald-400">Approved</span>.</div>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                    <div className="text-[10px] text-slate-500">Action: Credit Note Issued</div>
                                    <div className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[9px] rounded font-bold">SAVED 4 MINS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
