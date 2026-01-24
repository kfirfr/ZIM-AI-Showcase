"use client";

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { NeuralSpine } from '@/components/NeuralSpine';
import { DeploymentIntro } from '@/components/DeploymentIntro';
import { FeatureCard } from '@/components/FeatureCard';
import { AnimatedTitle } from '@/components/AnimatedTitle';

import { SummaryBox } from '@/components/SummaryBox';
import { SentimentBox } from '@/components/SentimentBox';
import { EvalBox } from '@/components/EvalBox';
import { TranslationBox } from '@/components/TranslationBox';
import { PredictiveRoutingBox } from '@/components/PredictiveRoutingBox';
import { VirtualAgentBox } from '@/components/VirtualAgentBox';
import { ProactiveEngagementBox } from '@/components/ProactiveEngagementBox';
import { KnowledgeAIBox } from '@/components/KnowledgeAIBox';
import { SocialListeningBox } from '@/components/SocialListeningBox';
import { FutureIntro } from '@/components/FutureIntro';
import { VisionaryFooter } from '@/components/VisionaryFooter';

export default function Home() {
    const [isIntroReached, setIsIntroReached] = React.useState(false);

    // Fix: Force scroll to top on load to prevent jumping to features
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen bg-zim-dark text-white selection:bg-zim-teal/30">
            <Navbar />

            <Hero />

            {/* Neural Spine Connection */}
            <NeuralSpine />

            {/* Transitional Intro */}
            <DeploymentIntro onReached={() => setIsIntroReached(true)} />

            {/* Existing Features Section */}
            <section id="features" className="relative z-20 mt-0 pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                {/* Header Removed - Moved to DeploymentIntro */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-12 mt-12">
                        <FeatureCard
                            title="AI Summarization"
                            description="Instantly condense complex customer interactions into structured CRM notes. Save 4+ minutes per case."
                            badge="Efficiency"
                            color="green"
                        >
                            <SummaryBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Global Translation"
                            description="Break language barriers with real-time, context-aware translation for cross-border support."
                            badge="Scale"
                            color="orange"
                        >
                            <TranslationBox />
                        </FeatureCard>
                    </div>

                    <div className="space-y-12">
                        <FeatureCard
                            title="Speech & Text Analytics"
                            description="Detect customer emotion and intent in real-time to guide agents and prevent escalations."
                            badge="Intelligence"
                            color="blue"
                        >
                            <SentimentBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Auto-Evaluations"
                            description="100% audit coverage. Automatically score every interaction against compliance and quality checks."
                            badge="Quality"
                            color="purple"
                        >
                            <EvalBox />
                        </FeatureCard>
                    </div>
                </div>
            </section>



            {/* Future Features Section */}
            <FutureIntro />

            <section className="relative z-20 mt-0 pt-10 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-12 mt-12">
                        <FeatureCard
                            title="Predictive Routing"
                            description="AI analyzes customer intent and routes to the most qualified agent automatically."
                            badge="Smart Routing"
                            color="gold"
                        >
                            <PredictiveRoutingBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Predictive Engagement"
                            description="AI triggers outreach before customers call, based on shipment events and predicted needs."
                            badge="Prevention"
                            color="cyan"
                        >
                            <ProactiveEngagementBox />
                        </FeatureCard>
                    </div>

                    <div className="space-y-12">
                        <FeatureCard
                            title="Agentic Virtual Agent"
                            description="Conversational AI bot handles common queries 24/7 with self-service resolution."
                            badge="Automation"
                            color="rose"
                        >
                            <VirtualAgentBox />
                        </FeatureCard>

                        <FeatureCard
                            title="AI Knowledge Base"
                            description="Real-time article suggestions powered by AI help agents find answers instantly."
                            badge="Enablement"
                            color="indigo"
                        >
                            <KnowledgeAIBox />
                        </FeatureCard>

                        <FeatureCard
                            title="Social Listening"
                            description="AI monitors social media mentions and auto-converts negative posts into prioritized support tickets."
                            badge="Channel Expansion"
                            color="blue"
                        >
                            <SocialListeningBox />
                        </FeatureCard>
                    </div>
                </div>
            </section>

            {/* Visionary Footer */}
            <VisionaryFooter />

        </main>
    );
}
