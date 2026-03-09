import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Zap, BarChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const MobileAppSection = () => {
    const containerRef = useRef(null);
    const phoneRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        // Animate Text
        gsap.from(textRef.current.children, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            },
            x: -50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Animate Phone
        gsap.from(phoneRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
            },
            y: 100,
            opacity: 0,
            duration: 1,
            delay: 0.2,
            ease: "back.out(1.2)" // Bounce effect
        });
    }, { scope: containerRef });

    return (
        <section id="mobile-app" ref={containerRef} className="relative w-full py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Side: Text Content */}
                <div ref={textRef}>
                    <h2 className="text-4xl md:text-5xl font-sans font-medium tracking-tight text-gray-900 leading-tight mb-8">
                        Turn insights into action: <br />
                        <span className="text-gray-400">Discover your teaching edge.</span>
                    </h2>

                    <div className="space-y-12">
                        <div className="flex gap-4">
                            <div className="mt-1 bg-white p-3 rounded-2xl shadow-sm h-fit">
                                <Smartphone size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">The all-in-one grading app</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Manage every assignment imaginable in one place. Grade submissions,
                                    check plagiarism, and generate reports for parents.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 bg-white p-3 rounded-2xl shadow-sm h-fit">
                                <Zap size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Magnify your impact</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Reduce grading time by 10X on any long or short essay. You even get Negative
                                    Bias Protection, which means you never grade unfairly.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="mt-1 bg-white p-3 rounded-2xl shadow-sm h-fit">
                                <BarChart size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Improve Class Performance</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Turn your data into market-beating improvements, especially when
                                    you're not sure what to teach next.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Mobile Mockup */}
                <div className="relative flex justify-center lg:justify-end">
                    {/* Background Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-purple-200/50 to-orange-100/50 rounded-full blur-3xl" />

                    {/* Phone Frame */}
                    <div
                        ref={phoneRef}
                        className="relative z-10 w-[300px] h-[600px] bg-black rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden"
                    >
                        {/* Phone Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl z-20" />

                        {/* Screen Content */}
                        <div className="w-full h-full bg-white flex flex-col">
                            {/* App Header */}
                            <div className="p-4 pt-10 flex justify-between items-center border-b border-gray-100">
                                <div className="text-sm font-bold text-gray-900">My Classes</div>
                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                            </div>

                            {/* App Body */}
                            <div className="flex-1 p-4 bg-gray-50 overflow-hidden relative">
                                {/* Search Bar */}
                                <div className="w-full h-10 bg-white rounded-lg shadow-sm border border-gray-100 mb-4 px-3 flex items-center text-gray-400 text-xs">Search students...</div>

                                {/* Class Card */}
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                                    <div className="flex justify-between mb-2">
                                        <div className="font-semibold text-gray-900">AP English</div>
                                        <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 mb-1">88.5% <span className="text-xs font-normal text-gray-400">Avg Grade</span></div>
                                    <div className="h-10 w-full flex items-end gap-1 mt-2">
                                        {[40, 60, 50, 80, 70, 90, 85].map((h, i) => (
                                            <div key={i} className="flex-1 bg-purple-100 rounded-t-sm" style={{ height: `${h}%` }}>
                                                <div className="w-full bg-purple-500 rounded-t-sm" style={{ height: '40%' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Student List */}
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">SJ</div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">Student {i}</div>
                                                    <div className="text-[10px] text-gray-500">Submitted 2m ago</div>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 bg-gray-900 text-white text-xs rounded-full">Grade</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Action Button */}
                                <div className="absolute bottom-4 right-4 w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-white">
                                    <span className="text-2xl">+</span>
                                </div>
                            </div>

                            {/* App Nav */}
                            <div className="h-16 bg-white border-t border-gray-100 flex justify-around items-center px-6">
                                <div className="w-6 h-6 bg-purple-600 rounded-lg opacity-20" />
                                <div className="w-6 h-6 bg-gray-300 rounded-lg opacity-20" />
                                <div className="w-6 h-6 bg-gray-300 rounded-lg opacity-20" />
                                <div className="w-6 h-6 bg-gray-300 rounded-lg opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MobileAppSection;
