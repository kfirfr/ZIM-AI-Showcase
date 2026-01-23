"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureCard } from '@/components/FeatureCard';
import { SummaryBox } from '@/components/SummaryBox';
import { SentimentBox } from '@/components/SentimentBox';
import { EvalBox } from '@/components/EvalBox';
import { TranslationBox } from '@/components/TranslationBox';

export default function Home() {
    return (
        <main className="relative min-h-screen bg-zim-void selection:bg-zim-teal/30">
            <Navbar />

            {/* Hero Section */}
            <Hero />

            {/* Features Section */}
            <section id="features" className="relative z-20 -mt-20 pb-40 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">

                    {/* Feature 1: Summarization */}
                    <div className="space-y-12 mt-12">
                        <FeatureCard
                            title="Auto-Summarization"
                            description="Instantly condense complex customer interactions into structured CRM notes. Save 4+ minutes per case."
                            badge="Efficiency"
                        >
                            <SummaryBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Global Translation"
                            description="Break language barriers with real-time, context-aware translation for cross-border support."
                            badge="Scale"
                        >
                            <TranslationBox />
                        </FeatureCard>
                    </div>

                    {/* Feature 2: Analytics - Offset for staggered look */}
                    <div className="space-y-12">
                        <FeatureCard
                            title="Sentiment Analysis"
                            description="Detect customer emotion and intent in real-time to guide agents and prevent escalations."
                            badge="Intelligence"
                        >
                            <SentimentBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Auto-Evaluations"
                            description="100% audit coverage. Automatically score every interaction against compliance and quality checks."
                            badge="Quality"
                        >
                            <EvalBox />
                        </FeatureCard>
                    </div>

                </div>
            </section>

            {/* Footer / CTA Area */}
            <section className="relative py-24 border-t border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zim-teal/5 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                        Ready to <span className="text-zim-teal">Modernize</span> Your Ops?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join the future of shipping logistics with Genesys AI powered by ZIM.
                    </p>
                    <button className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
                        Schedule Demo
                    </button>
                </div>
            </section>

        </main>
    );
}
