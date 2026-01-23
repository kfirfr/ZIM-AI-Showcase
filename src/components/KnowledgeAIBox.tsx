"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SimulationControls, SimulationState } from './SimulationControls';
import { FileText, TrendingUp } from 'lucide-react';

export const KnowledgeAIBox = () => {
    const [state, setState] = useState<SimulationState>('idle');
    const [query, setQuery] = useState('');
    const [articles, setArticles] = useState<{ title: string, score: number }[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const stepRef = useRef(0);

    const scenarios = [
        {
            query: 'detention fee waiver',
            articles: [
                { title: 'Port Detention Fee Policy 2024', score: 98 },
                { title: 'Fee Waiver Request Process', score: 95 },
                { title: 'Customer Billing Guidelines', score: 87 },
            ]
        },
        {
            query: 'container tracking not updating',
            articles: [
                { title: 'Tracking System Troubleshooting', score: 96 },
                { title: 'Common Tracking Delays Explained', score: 91 },
                { title: 'How to Escalate Tracking Issues', score: 85 },
            ]
        },
    ];

    const runSimulation = () => {
        intervalRef.current = setInterval(() => {
            const scenario = scenarios[stepRef.current % scenarios.length];

            // Simulate typing
            setQuery(scenario.query);

            // Show articles after a delay
            setTimeout(() => {
                setArticles(scenario.articles);
            }, 800);

            stepRef.current++;
        }, 4500);
    };

    useEffect(() => {
        if (state === 'playing') {
            runSimulation();
        } else if (state === 'paused') {
            if (intervalRef.current) clearInterval(intervalRef.current);
        } else if (state === 'idle') {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setQuery('');
            setArticles([]);
            stepRef.current = 0;
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
                {/* Left: Agent Query */}
                <div className="w-1/2 bg-black/20 p-4 border-r border-white/5">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-3">Agent Query</div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 min-h-[60px] flex items-center">
                        <p className="text-base text-white leading-relaxed">
                            {query && (
                                <>
                                    <span className="text-slate-500">Searching: </span>
                                    <span className="text-zim-teal font-semibold">"{query}"</span>
                                </>
                            )}
                            {!query && <span className="text-slate-600 italic">Type a question...</span>}
                        </p>
                    </div>
                </div>

                {/* Right: AI Suggestions */}
                <div className="w-1/2 bg-[#0f172a]/50 p-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wider mb-3">
                        <TrendingUp size={12} className="text-zim-teal" />
                        AI Suggested Articles
                    </div>
                    <div className="space-y-2">
                        {articles.map((article, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-3 hover:border-zim-teal/30 transition-colors animate-slide-in-right" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="flex items-start gap-2">
                                    <FileText size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm text-white font-semibold truncate">{article.title}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-zim-teal rounded-full" style={{ width: `${article.score}%` }} />
                                            </div>
                                            <span className="text-xs text-zim-teal font-bold">{article.score}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {articles.length === 0 && state === 'playing' && (
                            <div className="text-center text-xs text-slate-600 italic py-8">Analyzing...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
