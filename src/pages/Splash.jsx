import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/onboarding');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="h-screen w-full bg-background flex flex-col items-center justify-center text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center"
            >
                <h1 className="text-6xl font-bold tracking-tighter mb-4 text-primary">Inkless.</h1>
                <p className="text-xl text-secondary-foreground font-light tracking-widest uppercase">Smart. Paperless. AI-Powered.</p>
            </motion.div>
        </div>
    );
};

export default Splash;
