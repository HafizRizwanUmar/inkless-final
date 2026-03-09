import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Validate OTP
        navigate('/change-password');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-surface rounded-2xl shadow-xl p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Verify Your Account</h2>
                    <p className="text-secondary-foreground">Enter the 6-digit code sent to your email.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-between gap-2">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 md:w-14 md:h-14 bg-background border border-border rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
                    >
                        Verify OTP
                    </button>

                    <div className="text-center">
                        <button type="button" className="text-sm text-secondary-foreground hover:text-white transition-colors">
                            Didn't receive code? <span className="text-primary">Resend</span>
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default OTP;
