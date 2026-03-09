import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const slides = [
    {
        title: "Manage Assignments",
        description: "Streamline your coursework with organized assignment tracking and easy submissions.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "AI Grading",
        description: "Experience the power of AI-driven grading for instant, accurate feedback.",
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000",
    },
    {
        title: "Smart Analytics",
        description: "Unlock insights into your academic performance with comprehensive analytics.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    },
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/login');
        }
    };

    const skip = () => navigate('/login');

    return (
        <div className="h-screen w-full bg-background text-white flex flex-col md:flex-row overflow-hidden">
            {/* Image Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden bg-surface">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentSlide}
                        src={slides[currentSlide].image}
                        alt={slides[currentSlide].title}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover opacity-80"
                    />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent md:hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent md:bg-gradient-to-l" />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-16 flex flex-col justify-center relative z-10">
                <div className="flex-1 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary">{slides[currentSlide].title}</h2>
                            <p className="text-secondary-foreground text-lg md:text-xl leading-relaxed mb-8">{slides[currentSlide].description}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex space-x-2">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`h-2 w-2 md:h-3 md:w-3 rounded-full transition-colors duration-300 ${index === currentSlide ? 'bg-primary' : 'bg-secondary'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            onClick={skip}
                            className="px-6 py-3 text-sm font-medium text-secondary-foreground hover:text-white transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
                        >
                            {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
                            {currentSlide !== slides.length - 1 && <ChevronRight className="ml-2 w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
