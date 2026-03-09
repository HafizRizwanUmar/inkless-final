import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const JoinClass = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/classes/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ code })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Failed to join class');
            }

            navigate('/student/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            {/* Overlay background effect */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg bg-surface rounded-lg shadow-2xl overflow-hidden border border-border"
            >
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-medium text-white">Join class</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-secondary-foreground text-sm mb-4">
                        Ask your teacher for the class code, then enter it here.
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="text"
                                name="code"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="peer w-full bg-background/50 border-b-2 border-border px-3 py-3 pt-6 text-white text-base focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Class code"
                            />
                            <label className="absolute left-3 top-2 text-xs text-secondary-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-secondary-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Class code
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate('/student/dashboard')}
                            className="px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-white/10 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!code}
                            className="px-6 py-2 text-sm font-medium text-white bg-transparent hover:bg-primary/10 text-primary disabled:text-secondary-foreground disabled:hover:bg-transparent rounded transition-colors"
                        >
                            Join
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default JoinClass;
