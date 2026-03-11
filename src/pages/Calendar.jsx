import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Filter, MoreVertical, BookOpen, PenTool, Code, User, MapPin } from 'lucide-react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const [tasks, setTasks] = useState([]); // Combined Assignments & Labs
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, completed
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const hdrs = { headers: { 'x-auth-token': token } };

                // Fetch all classes first (to get class names if needed, though we can fetch tasks direct if API supports 'my-tasks')
                // Assuming we need to iter classes for now or if there's a 'my-tasks' endpoint.
                // Given current API structure, we iterate enrolled classes.
                const resClasses = await axios.get(`${API_BASE_URL}/api/classes`, hdrs);
                const classes = resClasses.data;

                let allItems = [];

                await Promise.all(classes.map(async (cls) => {
                    const [resAss, resLab] = await Promise.all([
                        axios.get(`${API_BASE_URL}/api/assignments/class/${cls._id}`, hdrs),
                        axios.get(`${API_BASE_URL}/api/lab-tasks/class/${cls._id}`, hdrs)
                    ]);

                    const assigns = resAss.data.map(a => ({ ...a, type: 'Assignment', classTitle: cls.title }));
                    const labs = resLab.data.map(l => ({ ...l, type: 'Lab', classTitle: cls.title }));
                    allItems = [...allItems, ...assigns, ...labs];
                }));

                // Sort by deadline
                allItems.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                setTasks(allItems);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const now = new Date();
    const upcoming = tasks.filter(t => new Date(t.deadline) > now);
    const past = tasks.filter(t => new Date(t.deadline) <= now);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <SEO title="Calendar" description="Track your academic schedule, assignment deadlines, and upcoming quizzes in one unified view." />
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-muted">Task Timeline</h1>
                    <p className="text-secondary-foreground">Manage your workflow and deadlines.</p>
                </div>
                <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border">
                    {['all', 'assignment', 'lab'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${filter === f ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* UPCOMING TIMELINE */}
                <div className="md:col-span-8 space-y-6">
                    <h2 className="font-bold text-xl flex items-center gap-2">
                        <Clock className="text-primary" /> Up Next
                    </h2>

                    {upcoming.length === 0 ? (
                        <div className="p-8 border border-dashed border-border rounded-2xl text-center bg-surface/50">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <h3 className="font-bold text-lg">All Caught Up!</h3>
                            <p className="text-secondary-foreground">You have no upcoming deadlines. Great job!</p>
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-border ml-3 space-y-8 pl-8 py-2">
                            {upcoming.map((task, idx) => (
                                <motion.div
                                    key={task._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative group cursor-pointer"
                                    onClick={() => navigate(task.type === 'Lab' ? '/lab-task-details' : '/assignment-details', { state: task.type === 'Lab' ? { labId: task._id } : { assignmentId: task._id } })}
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-background bg-primary shadow-sm group-hover:scale-125 transition-transform" />

                                    <div className="bg-surface p-5 rounded-xl border border-border shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${task.type === 'Lab' ? 'bg-brand-accent/10 text-brand-muted border-brand-accent/20' : 'bg-brand-accent/10 text-brand-muted border-brand-accent/20'}`}>
                                                    {task.type}
                                                </span>
                                                <h3 className="font-bold text-lg mt-2 group-hover:text-primary transition-colors">{task.title}</h3>
                                                <p className="text-sm text-secondary-foreground">{task.classTitle}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-bold text-primary text-lg">
                                                    {Math.ceil((new Date(task.deadline) - now) / (1000 * 60 * 60 * 24))} days
                                                </div>
                                                <p className="text-xs text-secondary-foreground">left</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-secondary-foreground border-t border-border pt-3 mt-3">
                                            <span className="flex items-center gap-1">
                                                <AlertCircle size={14} /> Due: {new Date(task.deadline).toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                Points: {task.totalMarks || task.marks}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PAST / COMPLETED */}
                <div className="md:col-span-4 space-y-6">
                    <h2 className="font-bold text-xl flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="text-muted-foreground" /> Completed / Past
                    </h2>

                    <div className="space-y-4 opacity-80">
                        {past.length === 0 ? (
                            <p className="text-muted-foreground text-sm italic">No past tasks.</p>
                        ) : (
                            past.slice(0, 5).map(task => (
                                <div key={task._id} className="bg-muted/20 p-4 rounded-xl border border-border">
                                    <h4 className="font-bold text-muted-foreground line-through">{task.title}</h4>
                                    <p className="text-xs text-muted-foreground">{task.classTitle}</p>
                                    <p className="text-xs mt-2">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                </div>
                            ))
                        )}
                        {past.length > 5 && (
                            <button className="w-full py-2 text-xs font-bold text-primary uppercase tracking-wider bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
                                View All History
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
