import React from 'react';

const InklessLogo = ({ className = "w-10 h-10" }) => {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <circle cx="50" cy="50" r="45" fill="url(#blue_gradient)" stroke="#1a73e8" strokeWidth="2" />
            <path d="M50 20C50 20 30 50 30 65C30 76.0457 38.9543 85 50 85C61.0457 85 70 76.0457 70 65C70 50 50 20 50 20Z" fill="white" />
            <circle cx="50" cy="65" r="10" fill="#1a73e8" />
            <defs>
                <linearGradient id="blue_gradient" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#1a73e8" />
                    <stop offset="1" stopColor="#1557b0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export const InklessTextInfo = () => (
    <div className="flex flex-col">
        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
            Inkless<span className="text-primary">.</span>
        </h1>
        <p className="text-xs text-secondary-foreground font-sans tracking-widest uppercase">
            Digital Classroom
        </p>
    </div>
);

export default InklessLogo;
