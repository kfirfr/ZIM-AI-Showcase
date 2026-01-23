"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { Bot } from 'lucide-react';

export const VirtualAgentBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [messages, setMessages] = useState<{ role: 'bot' | 'user', text: string }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const indexRef = useRef(0);

    const conversation = [
        { role: 'bot' as const, text: 'Hi! I\'m ZIM Assistant. How can I help?' },
        { role: 'user' as const, text: 'Where is container ZIMU7733?' },
        { role: 'bot' as const, text: 'Let me check that for you...' },
        { role: 'bot' as const, text: 'Container ZIMU7733 is currently at Port of Los Angeles. ETA to destination: Jan 28, 2026.' },
        { role: 'user' as const, text: 'Can I get the bill of lading?' },
        { role: 'bot' as const, text: 'I\'ve sent the document to your email. Anything else?' },
        { role: 'user' as const, text: 'No, thank you!' },
        { role: 'bot' as const, text: 'You\'re welcome! Have a great day! 🚢' },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            if (indexRef.current < conversation.length) {
                setMessages(prev => [...prev, conversation[indexRef.current]]);
                indexRef.current++;
            } else {
                // Loop back - MUST clear interval first
                if (intervalRef.current) clearInterval(intervalRef.current);
                setTimeout(() => {
                    setMessages([]);
                    indexRef.current = 0;
                    runSimulation(); // Restart simulation
                }, 3000);
            }
        }, 1500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setMessages([]);
            indexRef.current = 0;
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

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.role === 'bot' && (
                            <div className="w-8 h-8 rounded-full bg-zim-teal/20 border border-zim-teal flex items-center justify-center flex-shrink-0">
                                <Bot size={16} className="text-zim-teal" />
                            </div>
                        )}
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-slate-600/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs text-white">U</span>
                            </div>
                        )}
                        <div className={`max-w-[75%] px-4 py-3 rounded-lg ${msg.role === 'bot' ? 'bg-white/10 border border-white/20' : 'bg-blue-600'}`}>
                            <p className="text-base text-white leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {messages.length === 0 && state === 'idle' && (
                    <div className="flex items-center justify-center h-full text-slate-500 text-base font-medium">
                        💬 Click Play to start conversation
                    </div>
                )}
            </div>
        </div>
    );
};
