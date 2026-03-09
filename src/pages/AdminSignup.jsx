import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSignup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        // TODO: Implement actual registration logic
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        // Mock success
        console.log("Admin Signup:", { name, email, secretKey });
        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-surface rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
            >
                {/* Illustration Area */}
                <div className="w-full md:w-1/2 p-12 bg-primary/10 hidden md:flex flex-col justify-center items-center text-center">
                    <ShieldAlert className="w-20 h-20 text-primary mb-6" />
                    <h2 className="text-3xl font-bold text-primary mb-4">Admin Access</h2>
                    <p className="text-secondary-foreground">Secure registration for system administrators.</p>
                </div>

                {/* Signup Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Create Admin Account</h2>
                        <p className="text-secondary-foreground">Enter your details to register.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="admin@inkless.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Admin Secret Key</label>
                            <div className="relative">
                                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                                <input
                                    type="text"
                                    value={secretKey}
                                    onChange={(e) => setSecretKey(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="Enter provided secret key"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-foreground hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
                        >
                            Register Admin
                        </button>

                        <div className="text-center mt-4">
                            <p className="text-secondary-foreground text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminSignup;
