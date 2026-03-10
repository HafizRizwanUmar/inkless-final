import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TrendingUp, TrendingDown, BookOpen, Award } from 'lucide-react';

const DarkShowcaseSection = () => {
    const containerRef = useRef(null);
    const cardsRef = useRef([]);

    useGSAP(() => {
        gsap.from(cardsRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    const addToRefs = (el) => {
        if (el && !cardsRef.current.includes(el)) {
            cardsRef.current.push(el);
        }
    };

    return (
        <section id="showcase" ref={containerRef} className="relative w-full py-32 bg-black text-white overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-dark/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <p className="text-brand-accent font-semibold tracking-wide text-sm mb-4 uppercase">Why Inkless</p>
                    <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-6">
                        Everything You Need <br />
                        <span className="text-gray-400">To Run Your Classroom.</span>
                    </h2>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        From managing rosters to deep AI analytics, Inkless bridges the gap between traditional learning and modern technology.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div
                        ref={addToRefs}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <h3 className="text-xl font-semibold leading-snug">
                                AI Predicts Strong Improvement in Calculus.
                            </h3>
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Class 10-A is up</p>
                                <p className="text-xs text-gray-500">7h ago</p>
                            </div>
                        </div>
                        {/* Visual Representation */}
                        <div className="h-48 rounded-2xl bg-gradient-to-br from-brand-dark/40 to-brand-dark/40 border border-white/5 relative overflow-hidden flex items-end justify-center pb-4 px-4 group-hover:scale-[1.02] transition-transform duration-500">
                            {/* Abstract Chart */}
                            <div className="w-full flex items-end gap-2 h-32">
                                {[30, 45, 40, 60, 55, 70, 85].map((h, i) => (
                                    <div key={i} className="flex-1 bg-brand-accent/50 rounded-t-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div
                        ref={addToRefs}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors cursor-pointer group"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <h3 className="text-xl font-semibold leading-snug">
                                Plagiarism Detected in Recent Submissions.
                            </h3>
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                                <TrendingDown size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Assignment 3 Alert</p>
                                <p className="text-xs text-gray-500">2h ago</p>
                            </div>
                        </div>
                        {/* Visual Representation */}
                        <div className="h-48 rounded-2xl bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-white/5 relative overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="text-red-400 text-6xl font-bold opacity-20">!</div>
                            <div className="absolute bottom-4 left-4 right-4 bg-red-500/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 h-full w-[85%]"></div>
                            </div>
                            <p className="absolute bottom-7 right-4 text-xs text-red-300">85% Similarity</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div
                        ref={addToRefs}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors md:col-span-2 lg:col-span-1 cursor-pointer group"
                    >
                        <div className="mb-6 flex items-start justify-between">
                            <h3 className="text-xl font-semibold leading-snug">
                                Curriculum Alignment Score Reached 98%.
                            </h3>
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Physics Syllabus</p>
                                <p className="text-xs text-gray-500">1d ago</p>
                            </div>
                        </div>
                        {/* Visual Representation */}
                        <div className="h-48 rounded-2xl bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-white/5 relative overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                            <div className="w-24 h-24 rounded-full border-4 border-green-500/30 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin-slow"></div>
                                <span className="text-2xl font-bold text-green-400">A+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DarkShowcaseSection;
