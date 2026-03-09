import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateClass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        subject: '', // Mapping to Course Code
        room: ''    // Mapping to Semester
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    title: formData.name,
                    section: formData.section,
                    subject: formData.subject,
                    room: formData.room
                })
            });

            if (!res.ok) throw new Error('Failed to create class');

            navigate('/teacher/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.message); // Simple error handling for now
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
                    <h2 className="text-xl font-medium text-white">Create class</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="peer w-full bg-background/50 border-b-2 border-border px-3 py-3 pt-6 text-white text-base focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Class name (required)"
                            />
                            <label className="absolute left-3 top-2 text-xs text-secondary-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-secondary-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Class name (required)
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="text"
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="peer w-full bg-background/50 border-b-2 border-border px-3 py-3 pt-6 text-white text-base focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Section"
                            />
                            <label className="absolute left-3 top-2 text-xs text-secondary-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-secondary-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Section
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="peer w-full bg-background/50 border-b-2 border-border px-3 py-3 pt-6 text-white text-base focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Subject"
                            />
                            <label className="absolute left-3 top-2 text-xs text-secondary-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-secondary-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Subject
                            </label>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative group">
                            <input
                                type="text"
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                className="peer w-full bg-background/50 border-b-2 border-border px-3 py-3 pt-6 text-white text-base focus:border-primary focus:outline-none transition-colors placeholder-transparent"
                                placeholder="Room"
                            />
                            <label className="absolute left-3 top-2 text-xs text-secondary-foreground transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-secondary-foreground/70 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                                Room
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={() => navigate('/teacher/dashboard')}
                            className="px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-white/10 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!formData.name}
                            className="px-6 py-2 text-sm font-medium text-white bg-transparent hover:bg-primary/10 text-primary disabled:text-secondary-foreground disabled:hover:bg-transparent rounded transition-colors"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateClass;
