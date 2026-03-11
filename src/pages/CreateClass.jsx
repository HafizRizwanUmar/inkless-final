import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Hash, Layout, DoorOpen, Plus, Info } from 'lucide-react';

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
            const res = await fetch('https://inkless-backend.vercel.app/api/classes', {
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
            // In a real app, use a toast notification here
        }
    };

    const inputFields = [
        { name: 'name', label: 'Class name (required)', icon: <Book size={18} />, required: true, placeholder: 'e.g. Physics 101' },
        { name: 'section', label: 'Section', icon: <Hash size={18} />, placeholder: 'e.g. A2' },
        { name: 'subject', label: 'Subject', icon: <Layout size={18} />, placeholder: 'e.g. Science' },
        { name: 'room', label: 'Room', icon: <DoorOpen size={18} />, placeholder: 'e.g. Room 302' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate('/teacher/dashboard')}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-brand-light/20"
            >
                {/* Close Button */}
                <button
                    onClick={() => navigate('/teacher/dashboard')}
                    className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 text-secondary-foreground transition-colors z-20"
                >
                    <X size={20} />
                </button>

                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                            <Plus size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Create New Class</h2>
                        <p className="text-secondary-foreground text-sm mt-1">Set up your virtual classroom to start engaging with students.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5">
                            {inputFields.map((field) => (
                                <div key={field.name} className="relative group">
                                    <label className="block text-xs font-bold text-brand-muted uppercase tracking-wider mb-1.5 ml-1">
                                        {field.label}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted group-focus-within:text-primary transition-colors">
                                            {field.icon}
                                        </div>
                                        <input
                                            type="text"
                                            name={field.name}
                                            required={field.required}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            placeholder={field.placeholder}
                                            className="w-full bg-brand-light/10 border-2 border-brand-light/20 rounded-2xl py-3.5 pl-12 pr-4 text-primary font-medium placeholder:text-brand-muted/50 focus:border-primary/30 focus:bg-white focus:outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Hint */}
                        <div className="flex items-start gap-2 p-3 bg-brand-light/5 rounded-xl border border-brand-light/10">
                            <Info size={16} className="text-brand-muted mt-0.5" />
                            <p className="text-xs text-brand-muted leading-snug">
                                Only the class name is required. You can edit these details later in the class settings.
                            </p>
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate('/teacher/dashboard')}
                                className="flex-1 py-4 px-6 rounded-2xl font-bold text-secondary-foreground hover:bg-black/5 border border-transparent transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!formData.name}
                                className="flex-[2] py-4 px-6 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98]"
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
