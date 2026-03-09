import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Trash2, Edit2, X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassCard = ({ classData, onEdit, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
            className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 w-full"
        >
            <div className={`h-28 relative p-4 flex flex-col justify-between overflow-hidden`}>
                <img
                    src="/banners/classroom_banner.png"
                    alt="Banner"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 flex justify-between items-start text-white">
                    <Link to="/class-details" state={{ classId: classData._id }} className="hover:underline decoration-1 underline-offset-2 flex-1 mr-2">
                        <h2 className="text-xl font-bold truncate mb-1 drop-shadow-sm">{classData.title}</h2>
                        <p className="text-sm opacity-90 truncate font-medium">{classData.section}</p>
                    </Link>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                            className="p-1 hover:bg-white/20 rounded-full transition-colors text-white backdrop-blur-sm"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 overflow-hidden"
                                >
                                    <button
                                        onClick={() => { setShowMenu(false); onEdit(classData); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => { setShowMenu(false); onDelete(classData._id); }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="flex-1 p-4 relative min-h-[100px] flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-sm text-secondary-foreground font-medium">
                        <span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-xs uppercase tracking-wide">Students</span>
                        <span>{classData.students?.length || 0} enrolled</span>
                    </div>
                    {classData.code && (
                        <div className="text-xs font-mono bg-secondary/30 p-2 rounded inline-block text-foreground border border-border mt-1">
                            Code: <span className="font-bold select-all">{classData.code}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const EditClassModal = ({ isOpen, onClose, classData, onSave }) => {
    const [formData, setFormData] = useState({ title: '', section: '', subject: '', room: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (classData) {
            setFormData({
                title: classData.title || '',
                section: classData.section || '',
                subject: classData.subject || '',
                room: classData.room || ''
            });
        }
    }, [classData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await onSave(classData._id, formData);
        setLoading(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border"
            >
                <div className="px-6 py-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-foreground">Edit Class</h3>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Class Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Section</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                            value={formData.section}
                            onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Room</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-background text-foreground"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const TeacherDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://inkless-backend.vercel.app/api/classes', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setClasses(data);
        } catch (err) {
            console.error("Error fetching classes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDeleteClass = async (classId) => {
        if (!window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://inkless-backend.vercel.app/api/classes/${classId}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setClasses(classes.filter(c => c._id !== classId));
            } else {
                alert("Failed to delete class");
            }
        } catch (err) {
            console.error("Error deleting class:", err);
        }
    };

    const handleEditClass = (classData) => {
        setSelectedClass(classData);
        setIsEditModalOpen(true);
    };

    const handleSaveClass = async (classId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://inkless-backend.vercel.app/api/classes/${classId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(updatedData)
            });

            if (res.ok) {
                const updatedClass = await res.json();
                setClasses(classes.map(c => c._id === classId ? updatedClass : c));
            } else {
                alert("Failed to update class");
            }
        } catch (err) {
            console.error("Error updating class:", err);
        }
    };

    if (loading) return <div className="p-6 text-center text-secondary-foreground">Loading classes...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Teaching</h1>
                    <p className="text-sm text-secondary-foreground">Manage your active courses.</p>
                </div>
            </div>

            {/* Grid of Class Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.length === 0 ? (
                    <div className="col-span-full py-16 bg-surface rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                        <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
                            <Plus size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-1">No Classes Created</h3>
                        <p className="text-secondary-foreground max-w-sm mb-6">You haven't created any classes yet. Click the + button in the top bar to get started.</p>
                        <Link to="/create-class" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-2">
                            Create a Class
                        </Link>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <ClassCard
                            key={cls._id}
                            classData={cls}
                            onEdit={handleEditClass}
                            onDelete={handleDeleteClass}
                        />
                    ))
                )}
            </div>

            <EditClassModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                classData={selectedClass}
                onSave={handleSaveClass}
            />
        </div>
    );
};

export default TeacherDashboard;
