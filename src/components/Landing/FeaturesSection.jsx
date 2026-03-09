import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection = () => {
    const containerRef = useRef(null);
    const featuresRef = useRef([]);

    useGSAP(() => {
        // Animate Header
        gsap.from(".feature-header", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // Animate Features
        gsap.from(featuresRef.current, {
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 75%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });
    }, { scope: containerRef });

    const addToRefs = (el) => {
        if (el && !featuresRef.current.includes(el)) {
            featuresRef.current.push(el);
        }
    };

    const features = [
        {
            icon: <Clock size={28} className="text-gray-800" />,
            title: "Timely Grading Insights",
            description: "Inkless AI is your personal teaching assistant. Get current performance analytics on any student or class immediately (instead of waiting for end-of-term reports)."
        },
        {
            icon: <Search size={28} className="text-gray-800" />,
            title: "Discover Learning Gaps",
            description: "See the big trends today, and find out what caused a drop in performance. It's the best way to find your new focus area with the full analysis already done."
        },
        {
            icon: <ShieldCheck size={28} className="text-gray-800" />,
            title: "AI That You Can Rely On",
            description: "Smart filters, quality curriculum alignment, and advanced prompt engineering means our AI avoids hallucinations. When it doesn't know why something happened - it will tell you."
        }
    ];

    return (
        <section id="features" ref={containerRef} className="relative w-full py-24 bg-gradient-to-b from-white to-purple-50/50">
            <div className="container mx-auto px-6">
                <div className="feature-header mb-20 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tight text-gray-900 leading-tight mb-6">
                            Navigate the learning process <br />
                            <span className="text-gray-400">with Confidence</span>
                        </h2>
                    </div>
                    <div className="lg:pl-10">
                        <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                            Navigate the academic year with confidence using AI-powered insights that simplify complex data into clear, actionable teaching strategies.
                        </p>
                    </div>
                </div>

                <div className="features-grid grid md:grid-cols-3 gap-12 lg:gap-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            className="flex flex-col items-start"
                        >
                            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center feature-header">
                    <Link
                        to="/signup"
                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all group"
                    >
                        View More
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
