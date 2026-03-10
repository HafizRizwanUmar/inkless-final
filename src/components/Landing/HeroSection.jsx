import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Animate Content
        tl.from(contentRef.current.children, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Animate Image
        gsap.from(imageRef.current, {
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            delay: 0.4,
            ease: "power3.out"
        });

        // Floating animation for image
        gsap.to(imageRef.current, {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }, { scope: containerRef });

    return (
        <section id="hero" ref={containerRef} className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-cream pt-20">
            {/* Abstract Background Elements - Warm Brand Theme */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-brand-cream to-brand-light/30 opacity-80 blur-3xl" />

                {/* Brand Shapes */}
                <div className="absolute top-[30%] left-[-10%] w-[50%] h-[60%] bg-gradient-to-r from-brand-accent/20 to-brand-light/30 blur-3xl rounded-full transform rotate-12" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[60%] bg-gradient-to-tl from-brand-muted/10 via-brand-accent/10 to-transparent blur-3xl rounded-full mix-blend-multiply" />
            </div>

            <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl z-20" ref={contentRef}>
                    <p className="tracking-[0.2em] text-sm font-semibold uppercase text-brand-accent mb-4">Elevate Your Teaching</p>
                    <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-tight text-brand-dark leading-[1.1] mb-6">
                        The Modern LMS <br />
                        <span className="text-brand-muted relative inline-block group">
                            for Education
                            <div className="absolute bottom-1 left-0 w-full h-3 bg-brand-light/60 -z-10 transform -rotate-1 group-hover:bg-brand-accent/40 transition-colors duration-300"></div>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-brand-dark/80 mb-10 max-w-[450px] leading-relaxed">
                        Empower your classroom with Inkless.
                        Manage courses, streamline grading with AI, and track student success—all in one intuitive platform.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-brand-dark text-brand-cream rounded-full font-medium hover:bg-[#341d1a] transition-all flex items-center gap-2 group shadow-xl shadow-brand-dark/20 border border-brand-dark/10"
                        >
                            Get Started Free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="#demo"
                            className="px-8 py-4 bg-white/60 backdrop-blur-sm text-brand-dark rounded-full font-medium hover:bg-white transition-all flex items-center gap-2 border border-brand-light/50"
                        >
                            Watch Demo
                        </Link>
                    </div>
                </div>

                {/* Hero Visual - LMS Dashboard Mockup */}
                <div
                    ref={imageRef}
                    className="relative hidden lg:block h-[500px] w-full mt-10 lg:mt-0 xl:-mr-10 z-10"
                >
                    {/* Decorative Background Cards */}
                    <div className="absolute inset-x-4 inset-y-0 bg-brand-light rounded-2xl md:rounded-[32px] transform rotate-3 scale-100 shadow-xl transition-transform duration-700 hover:rotate-6 opacity-80 border border-brand-accent/20"></div>
                    <div className="absolute inset-x-8 inset-y-[-10px] bg-brand-accent/60 rounded-2xl md:rounded-[32px] transform -rotate-1 scale-[0.98] shadow-lg transition-transform duration-700 hover:-rotate-3 opacity-60"></div>

                    {/* Main UI Mockup */}
                    <div className="absolute inset-0 rounded-2xl md:rounded-[32px] overflow-hidden border-4 border-white shadow-2xl z-20 bg-white flex flex-col transform transition-transform duration-700 hover:scale-[1.02]">
                        {/* Mockup Top Bar */}
                        <div className="bg-[#f0eceb] border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="bg-white/80 text-brand-muted text-xs font-semibold tracking-wide px-8 py-1 rounded-md shadow-sm border border-gray-100/50">
                                lnkless.app/dashboard
                            </div>
                            <div className="w-8"></div> {/* Spacer to center URL */}
                        </div>

                        {/* Mockup Inner Content */}
                        <div className="flex-1 bg-[#faf8f7] p-6 lg:p-8 flex flex-col gap-6 overflow-hidden relative">
                            {/* Header Area */}
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <div className="text-xs font-semibold text-brand-accent uppercase tracking-wider mb-1">Course Overview</div>
                                    <h3 className="text-2xl font-bold text-brand-dark font-sans tracking-tight">Advanced Physics 101</h3>
                                </div>
                                <div className="bg-brand-dark text-brand-cream text-xs px-4 py-2 rounded-lg shadow-md font-medium flex items-center gap-2">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                    Assign Grading
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-xl border border-brand-light/40 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-light/20 rounded-bl-full"></div>
                                    <div className="text-sm font-medium text-brand-muted mb-2">Class Average</div>
                                    <div className="text-4xl font-bold text-brand-dark font-sans">87% <span className="text-sm font-medium text-emerald-500 ml-1 inline-flex items-center">↑ 2%</span></div>
                                </div>
                                <div className="bg-white p-5 rounded-xl border border-brand-light/40 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-brand-accent/10 rounded-bl-full"></div>
                                    <div className="text-sm font-medium text-brand-muted mb-2">Submissions</div>
                                    <div className="text-4xl font-bold text-brand-dark font-sans">24<span className="text-lg font-medium text-brand-muted/70 ml-1">/ 28</span></div>
                                </div>
                            </div>

                            {/* Activity List */}
                            <div className="flex-1 bg-white rounded-xl border border-brand-light/40 shadow-sm p-5 flex flex-col gap-4 relative">
                                <div className="text-sm font-semibold text-brand-dark border-b border-gray-100 pb-2">Recent Insights</div>
                                <div className="flex flex-col gap-3 max-h-[140px] overflow-hidden">
                                    {[
                                        { s: "AH", text: "Alex H. submitted Lab Report 3", sub: "Automated grading complete. Confidence: 95%", score: "94" },
                                        { s: "SM", text: "Sarah M. submitted Lab Report 3", sub: "Flagged: 12% similarity detected.", score: "72", alert: true },
                                        { s: "JP", text: "James P. submitted Lab Report 3", sub: "Automated grading complete. Confidence: 92%", score: "88" }
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-start gap-4 p-3 rounded-lg transition-colors cursor-default ${item.alert ? 'bg-red-50 hover:bg-red-100/80 border border-red-100' : 'hover:bg-brand-cream/40 border border-transparent'}`}>
                                            <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${item.alert ? 'bg-red-200 text-red-800' : 'bg-brand-light text-brand-dark'}`}>{item.s}</div>
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="text-sm font-medium text-brand-dark truncate">{item.text}</div>
                                                <div className={`text-xs truncate ${item.alert ? 'text-red-600 font-medium' : 'text-brand-muted'}`}>{item.sub}</div>
                                            </div>
                                            <div className="shrink-0 text-right space-y-1">
                                                <div className={`text-xs font-bold px-2 py-1 rounded ${item.alert ? 'text-red-700 bg-red-100' : 'text-brand-dark bg-brand-light/40'}`}>Score: {item.score}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Fade Out Graphic */}
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none rounded-b-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
