"use client";

import React, { useState, useEffect, useRef } from 'react';
import { LiveChatInterface } from './LiveChatInterface';
import { SimulationControls, SimulationState } from './SimulationControls';
import { CheckSquare } from 'lucide-react';

export const SummaryBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [phase, setPhase] = useState<'idle' | 'ingest' | 'process' | 'result'>('idle');
    const [messages, setMessages] = useState<{ role: string, text: string }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fullConversation = [
        { role: "Agent", text: "ZIM Support, Kfir speaking. How can I assist?" },
        { role: "Cust", text: "Hi, I have a major issue with Invoice 992." },
        { role: "Agent", text: "I see the invoice. What is the discrepancy?" },
        { role: "Cust", text: "You charged detention fees but the port was closed that day!" },
        { role: "Agent", text: "Let me check our port logs... One moment please." },
        { role: "Cust", text: "This is urgent. My CFO is waiting." },
        { role: "Agent", text: "I understand. Checking logs now... You are correct." },
        { role: "Cust", text: "Can you remove the fee?" },
        { role: "Agent", text: "Sending waiver request to billing... Approved!" },
        { role: "Cust", text: "Great, thank you for resolving this quickly." }
    ];

    const runSimulation = () => {
        setPhase('ingest');
        setMessages([]);

        let msgIdx = 0;
        intervalRef.current = setInterval(() => {
            if (msgIdx < fullConversation.length) {
                setMessages(prev => [...prev, fullConversation[msgIdx]]);
                msgIdx++;
            } else {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setPhase('process');
                timeoutRef.current = setTimeout(() => {
                    setPhase('result');
                    timeoutRef.current = setTimeout(() => {
                        // Loop back to start
                        runSimulation();
                    }, 4000);
                }, 2500);
            }
        }, 800);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            // Clear intervals but keep state
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else if (state === 'idle') {
            // Reset everything
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setPhase('idle');
            setMessages([]);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
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

            <div className="flex-1 relative overflow-hidden flex flex-col p-4">
                {(phase === 'ingest' || phase === 'idle') && <LiveChatInterface messages={messages} />}

                {phase === 'process' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 backdrop-blur-sm animate-glitch-skew">
                        <div className="text-emerald-400 font-mono text-2xl font-bold tracking-wider">ANALYZING CONVERSATION...</div>
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
                                <span className="text-sm font-bold text-emerald-400 tracking-wider uppercase">AI Summary Generated</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1.5 tracking-wider">Issue Identified</div>
                                    <div className="text-base text-white leading-relaxed">Container detention dispute on <span className="text-blue-400 font-semibold">Invoice #992</span> due to unexpected Port Closure delays.</div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 uppercase font-bold mb-1.5 tracking-wider">Resolution</div>
                                    <div className="text-base text-white leading-relaxed">Port closure logs verified. Detention fee waiver <span className="text-emerald-400 font-semibold">Approved</span> by system.</div>
                                </div>
                                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                    <div className="text-sm text-slate-400">Action: Credit Note Issued</div>
                                    <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-md font-bold tracking-wide">⚡ SAVED 4 MINS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
