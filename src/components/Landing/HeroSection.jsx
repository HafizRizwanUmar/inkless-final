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
        <section id="hero" ref={containerRef} className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden bg-white pt-20">
            {/* Abstract Background Elements - Simulating the 3D Wave */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-100/50 via-white to-white opacity-60 blur-3xl" />

                {/* Purple Wave Shape - simplified CSS representation */}
                <div className="absolute top-[40%] left-0 w-full h-[60%] bg-gradient-to-r from-purple-500/10 via-purple-400/20 to-indigo-500/10 blur-3xl transform -skew-y-6" />
                <div className="absolute bottom-0 right-0 w-3/4 h-1/2 bg-gradient-to-tl from-purple-600/10 to-transparent blur-3xl rounded-full mix-blend-multiply" />
            </div>

            <div className="container relative z-10 mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="max-w-2xl" ref={contentRef}>
                    <h1 className="text-5xl md:text-7xl font-sans font-medium tracking-tight text-gray-900 leading-[1.1] mb-8">
                        AI-Driven Grading <br />
                        <span className="text-gray-400">Made Simple</span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                        Get superhuman insights into student performance with Inkless.
                        Find out why grades are trending up or down, then assign personalized feedback
                        in one convenient app.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            to="/signup"
                            className="px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-black transition-all flex items-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Hero Visual - Abstract 3D-like Shape or Image Placeholder */}
                <div
                    ref={imageRef}
                    className="relative hidden lg:block h-[600px] w-full"
                >
                    {/* Placeholder for the 3D abstract shape from the reference */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-100 rounded-[3rem] opacity-30 blur-2xl" />

                    {/* You can replace this with an actual 3D image later */}
                    <div className="absolute inset-4 rounded-[2.5rem] overflow-hidden shadow-2xl bg-white/40 backdrop-blur-sm border border-white/50">
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-blue-500/10 relative overflow-hidden">
                            {/* Abstract waves */}
                            <div className="absolute top-1/4 -left-1/4 w-[150%] h-[150%] border-[40px] border-purple-300/30 rounded-[100%] animate-spin-slow" style={{ animationDuration: '20s' }} />
                            <div className="absolute top-1/3 -right-1/4 w-[120%] h-[120%] border-[60px] border-indigo-300/20 rounded-[100%] animate-spin-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
