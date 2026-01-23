"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FeatureCard } from '@/components/FeatureCard';
import { AnimatedTitle } from '@/components/AnimatedTitle';
import { TransitionSection } from '@/components/TransitionSection';
import { SummaryBox } from '@/components/SummaryBox';
import { SentimentBox } from '@/components/SentimentBox';
import { EvalBox } from '@/components/EvalBox';
import { TranslationBox } from '@/components/TranslationBox';
import { PredictiveRoutingBox } from '@/components/PredictiveRoutingBox';
import { VirtualAgentBox } from '@/components/VirtualAgentBox';
import { ProactiveEngagementBox } from '@/components/ProactiveEngagementBox';
import { KnowledgeAIBox } from '@/components/KnowledgeAIBox';

export default function Home() {
    return (
        <main className="relative min-h-screen bg-zim-void selection:bg-zim-teal/30">
            <Navbar />

            {/* Hero Section */}
            <Hero />

            {/* Existing Features Section */}
            <section id="features" className="relative z-20 -mt-20 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <AnimatedTitle as="h2" className="text-3xl md:text-4xl mb-4">
                        Deployed Today
                    </AnimatedTitle>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        AI capabilities already transforming ZIM's customer operations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-12 mt-12">
                        <FeatureCard
                            title="AI Summarization"
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

                    <div className="space-y-12">
                        <FeatureCard
                            title="Speech & Text Analytics"
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

            {/* Transition Section */}
            <TransitionSection />

            {/* Future Features Section */}
            <section className="relative z-20 py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <AnimatedTitle as="h2" className="text-3xl md:text-4xl mb-4">
                        Future Capabilities
                    </AnimatedTitle>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Next-generation AI features coming to ZIM operations
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-12 mt-12">
                        <FeatureCard
                            title="Predictive Routing"
                            description="AI analyzes customer intent and routes to the most qualified agent automatically."
                            badge="Smart Routing"
                        >
                            <PredictiveRoutingBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Proactive Engagement"
                            description="AI triggers outreach before customers call, based on shipment events and predicted needs."
                            badge="Prevention"
                        >
                            <ProactiveEngagementBox />
                        </FeatureCard>
                    </div>

                    <div className="space-y-12">
                        <FeatureCard
                            title="Virtual Agent"
                            description="Conversational AI bot handles common queries 24/7 with self-service resolution."
                            badge="Automation"
                        >
                            <VirtualAgentBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Knowledge AI"
                            description="Real-time article suggestions powered by AI help agents find answers instantly."
                            badge="Enablement"
                        >
                            <KnowledgeAIBox />
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* Footer / CTA Area */}
            <section className="relative py-24 border-t border-white/5 bg-black/40 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-zim-teal/5 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                    <AnimatedTitle as="h2" className="text-4xl md:text-6xl mb-6">
                        Ready to Transform Operations?
                    </AnimatedTitle>
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
