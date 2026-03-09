import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Implement actual admin authentication
        navigate('/admin/dashboard');
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-surface rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
            >
                <div className="w-full md:w-1/2 p-12 bg-primary/10 hidden md:flex flex-col justify-center items-center text-center">
                    <Shield className="w-20 h-20 text-primary mb-6" />
                    <h2 className="text-3xl font-bold text-primary mb-4">Admin Portal</h2>
                    <p className="text-secondary-foreground">System administration and oversight.</p>
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="mb-6">
                        <Link to="/login" className="flex items-center text-sm text-secondary-foreground hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Selection
                        </Link>
                    </div>
                    <div className="text-center md:text-left mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
                        <p className="text-secondary-foreground">Authenticate to access system controls.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div className="flex items-center justify-between">
                            <Link to="/admin/signup" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                Register Admin
                            </Link>
                            <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
