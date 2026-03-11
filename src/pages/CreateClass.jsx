import API_BASE_URL from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Info, BookOpen, Hash, Layout, DoorOpen } from 'lucide-react';
import SEO from '../components/SEO';

const CreateClass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        section: '',
        subject: '',
        room: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/classes`, {
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
        }
    };

    const inputFields = [
        { name: 'name', label: 'Class name (required)', icon: <BookOpen size={18} />, required: true, placeholder: 'e.g. Physics 101' },
        { name: 'section', label: 'Section', icon: <Hash size={18} />, placeholder: 'e.g. A2' },
        { name: 'subject', label: 'Subject', icon: <Layout size={18} />, placeholder: 'e.g. Science' },
        { name: 'room', label: 'Room', icon: <DoorOpen size={18} />, placeholder: 'e.g. Room 302' },
    ];

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center p-4 sm:items-center">
            <SEO title="Create New Class" description="Design and set up a new digital classroom with personalized branding and enrollment settings." />
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate('/teacher/dashboard')}
                className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-background rounded-3xl shadow-2xl overflow-hidden border border-border my-auto"
            >
                {/* Close Button */}
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-secondary-foreground transition-colors z-20 sm:top-5 sm:right-5"
                >
                    <X size={20} />
                </button>

                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 sm:mb-8">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-3 sm:mb-4">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">Create New Class</h2>
                        <p className="text-secondary-foreground text-xs sm:text-sm mt-1">Set up your virtual classroom to start engaging with students.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="grid gap-4 sm:gap-5">
                            {inputFields.map((field) => (
                                <div key={field.name} className="relative group">
                                    <label className="block text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 sm:mb-1.5 ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                                            {field.icon}
                                        </div>
                                        <input
                                            type="text"
                                            name={field.name}
                                            required={field.required}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full bg-muted/30 border-2 border-transparent rounded-xl sm:rounded-2xl py-2.5 sm:py-3.5 pl-11 sm:pl-12 pr-4 text-sm sm:text-base text-foreground font-medium placeholder:text-muted-foreground/50 focus:border-primary/30 focus:bg-surface focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hint */}
                        <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                            <Info size={16} className="text-primary mt-0.5 shrink-0" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">
                                Only the class name is required. You can edit these details later in class settings.
                            </p>
                        </div>

                        <div className="pt-4 sm:pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/dashboard')}
                                className="flex-1 py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-secondary-foreground hover:bg-muted transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!formData.name}
                                className="flex-[2] py-3 sm:py-4 px-6 bg-primary text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                            >
                                Create Class
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateClass;

