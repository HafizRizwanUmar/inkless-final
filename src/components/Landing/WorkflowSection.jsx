import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Users, BrainCircuit, LineChart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WorkflowSection = () => {
    const containerRef = useRef(null);
    const stepsRef = useRef([]);

    useGSAP(() => {
        // Animate Header
        gsap.from(".workflow-header", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // Animate Steps
        gsap.from(stepsRef.current, {
            scrollTrigger: {
                trigger: ".workflow-grid",
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
        if (el && !stepsRef.current.includes(el)) {
            stepsRef.current.push(el);
        }
    };

    const steps = [
        {
            icon: <BookOpen size={24} className="text-brand-dark" />,
            title: "1. Create Your Curriculum",
            description: "Easily set up your classes and organize your syllabus. Inkless gives you a centralized hub for all your teaching materials."
        },
        {
            icon: <Users size={24} className="text-brand-dark" />,
            title: "2. Engage Your Students",
            description: "Assign readings, distribute quizzes, and drop lab tasks directly to your students' dashboards in just a few clicks."
        },
        {
            icon: <BrainCircuit size={24} className="text-brand-dark" />,
            title: "3. Let AI Do the Heavy Lifting",
            description: "Our advanced AI automatically grades submissions based on your specific rubrics, saving you countless hours of manual review."
        },
        {
            icon: <LineChart size={24} className="text-brand-dark" />,
            title: "4. Empower with Insights",
            description: "Instantly see where students excel and where they struggle. Provide targeted support before small hurdles become term-long challenges."
        }
    ];

    return (
        <section id="how-it-works" ref={containerRef} className="relative w-full py-24 bg-brand-cream border-t border-brand-light/30">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-white/40 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="workflow-header text-center max-w-2xl mx-auto mb-16">
                    <p className="tracking-widest text-sm font-semibold uppercase text-brand-muted mb-3">How It Works</p>
                    <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-brand-dark mb-6">
                        A Frictionless Workflow
                    </h2>
                    <p className="text-lg text-brand-dark/80 leading-relaxed">
                        Say goodbye to repetitive tasks. Inkless is designed to streamline your day so you can focus entirely on what matters most: teaching.
                    </p>
                </div>

                <div className="workflow-grid grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            ref={addToRefs}
                            className="bg-white rounded-2xl p-8 border border-brand-light/40 shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden"
                        >
                            {/* Hover accent */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-brand-accent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                            <div className="w-12 h-12 bg-brand-light/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-light transition-colors">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">
                                {step.title}
                            </h3>
                            <p className="text-brand-muted leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkflowSection;
