import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, Clock, GraduationCap, TrendingUp, Search, Plus, Filter, MessageSquare, AlertCircle, ChevronRight, LayoutDashboard, User } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';

const StudentClassCard = ({ title, section, teacher, theme, classId, nextAssignment }) => (
    <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
        className="group relative flex flex-col bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 w-full"
    >
        {/* Card Header (Banner) */}
        <div className={`h-28 relative p-4 flex flex-col justify-between overflow-hidden`}>
            <img
                src="/banners/classroom_banner.png"
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="relative z-10 flex justify-between items-start text-white">
                <Link to="/class-details" state={{ classId }} className="hover:underline decoration-1 underline-offset-2 w-full">
                    <h2 className="text-xl font-bold truncate mb-1 drop-shadow-sm">{title}</h2>
                    <p className="text-sm opacity-90 truncate font-medium">{section}</p>
                </Link>
                <div className="bg-white/20 p-1 rounded-full backdrop-blur-sm">
                    <User className="w-5 h-5 text-white" />
                </div>
            </div>
            <p className="relative z-10 text-white/90 text-xs font-medium truncate uppercase tracking-wide opacity-80">{teacher}</p>
        </div>

        {/* Card Body */}
        <div className="flex-1 p-4 relative min-h-[120px] bg-surface flex flex-col justify-between">
            <div className="space-y-3">
                <p className="text-xs font-bold uppercase text-secondary-foreground" >Next Up</p>
                {nextAssignment ? (
                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors cursor-pointer" title={nextAssignment.title}>
                        <div className="text-sm font-bold text-primary truncate">
                            {nextAssignment.title}
                        </div>
                        <div className="text-xs text-secondary-foreground mt-1 flex justify-between">
                            <span>Due: {new Date(nextAssignment.deadline).toLocaleDateString()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-secondary-foreground italic py-2">
                        <CheckSquare className="w-4 h-4" /> No pending work
                    </div>
                )}
            </div>
        </div>

        {/* Card Footer */}
        <div className="border-t border-border p-3 flex justify-end space-x-2 bg-background/50">
            <button className="p-2 hover:bg-black/5 rounded-full text-secondary-foreground hover:text-primary transition-colors tooltip" title="Your Work">
                <BookOpen className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-black/5 rounded-full text-secondary-foreground hover:text-primary transition-colors tooltip" title="Performance">
                <TrendingUp className="w-5 h-5" />
            </button>
        </div>
    </motion.div>
);

const StudentDashboard = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                const hdrs = { headers: { 'x-auth-token': token } };
                const res = await fetch('https://inkless-backend.vercel.app/api/classes', { headers: { 'x-auth-token': token } });
                const classData = await res.json();

                // Fetch next assignment for each class
                // In production, this should be done on backend for performance.
                // For now, we will fetch assignments for each class separately.
                const enrichedClasses = await Promise.all(classData.map(async (cls) => {
                    try {
                        // Fetch both Assignments and Labs
                        const resAss = await fetch(`https://inkless-backend.vercel.app/api/assignments/class/${cls._id}`, hdrs);
                        const assignments = await resAss.json();

                        const resLab = await fetch(`https://inkless-backend.vercel.app/api/lab-tasks/class/${cls._id}`, hdrs);
                        const labs = await resLab.json();

                        // Combine and sort by deadline > now
                        const now = new Date();
                        const allTasks = [...assignments, ...labs]
                            .filter(t => new Date(t.deadline) > now)
                            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

                        return { ...cls, nextAssignment: allTasks[0] || null };
                    } catch (e) { console.error(e); return cls; }
                }));

                setClasses(enrichedClasses);
            } catch (err) {
                console.error("Error fetching classes:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    if (loading) return <div className="p-6 text-center text-secondary-foreground py-20">Loading your profile...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <SEO title="Student Dashboard" description="Access your enrolled classes, upcoming assignments, and track your academic performance." />
            {/* Top Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">My Classes</h1>
                    <p className="text-sm text-secondary-foreground">Access your enrolled courses and upcoming deadlines.</p>
                </div>
            </div>

            {/* Grid of Class Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 text-center bg-surface/50 border border-dashed border-border rounded-2xl">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                            <BookOpen size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Classes Yet</h3>
                        <p className="text-secondary-foreground max-w-sm mb-6">You are not enrolled in any classes yet. Join your first class to get started.</p>
                        <Link to="/join-class" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-transform active:scale-95 flex items-center gap-2">
                            <Plus size={18} /> Join a Class
                        </Link>
                    </div>
                ) : (
                    classes.map((cls) => (
                        <StudentClassCard
                            key={cls._id}
                            title={cls.title}
                            section={cls.section}
                            teacher={cls.owner?.name || 'Instructor'} // Ideally we populate this on backend, using placeholder for now if missing
                            theme={cls.theme}
                            classId={cls._id}
                            nextAssignment={cls.nextAssignment}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
