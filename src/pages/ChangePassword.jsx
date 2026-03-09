import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            // TODO: API call to change password
            navigate('/login');
        } else {
            alert("Passwords do not match");
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-surface rounded-2xl shadow-xl p-8"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                    <p className="text-secondary-foreground">Create a strong new password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Confirm New Password</label>
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
                        Update Password
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePassword;
