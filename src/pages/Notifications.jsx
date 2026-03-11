import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Clock, Trash2, Filter, Mail, Shield, AlertBox, BookOpen, ChevronRight, MoreVertical } from 'lucide-react';
import SEO from '../components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios'; // Assuming axios is used and needs to be imported

const Notifications = () => {
    const [filter, setFilter] = useState('All');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://inkless-backend.vercel.app/api/notifications', {
                headers: { 'x-auth-token': token }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('https://inkless-backend.vercel.app/api/notifications/read-all', {}, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://inkless-backend.vercel.app/api/notifications/read/${id}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://inkless-backend.vercel.app/api/notifications/${id}`, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const filters = ['All', 'Assignment', 'Quiz', 'System'];

    const getIcon = (type) => {
        switch (type) {
            case 'ASSIGNMENT': return <BookOpen className="w-5 h-5 text-brand-accent" />; // Changed from FileText
            case 'QUIZ': return <CheckCircle2 className="w-5 h-5 text-green-400" />; // Changed from CheckCircle
            case 'SYSTEM': return <Shield className="w-5 h-5 text-yellow-400" />; // Changed from Info
            default: return <Bell className="w-5 h-5 text-gray-400" />;
        }
    };

    const filteredNotifications = filter === 'All' ? notifications : notifications.filter(n => n.type === filter.toUpperCase());

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-700">
            <SEO title="Notifications" description="Stay updated with your latest alerts, graded assignments, and class announcements." />
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <button className="text-sm text-primary hover:underline">Mark all as read</button>
            </div>

            {/* Filters */}
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {filters.map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-primary text-white' : 'bg-surface text-secondary-foreground hover:bg-surface/80'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className={`p-4 rounded-xl border border-border flex items-start space-x-4 ${notif.read ? 'bg-background' : 'bg-surface shadow-md'}`}
                            >
                                <div className={`p-2 rounded-full bg-background border border-border`}>
                                    {getIcon(notif.type)}
                                    {notif.read === false && <span className="absolute top-4 left-4 w-2 h-2 bg-red-500 rounded-full"></span>}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`text-base font-semibold ${notif.read ? 'text-secondary-foreground' : 'text-white'}`}>{notif.title}</h3>
                                        <span className="text-xs text-secondary-foreground">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-secondary-foreground mt-1">{notif.message}</p>
                                </div>
                                <button onClick={() => deleteNotification(notif.id)} className="text-secondary-foreground hover:text-red-400 transition-colors p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-secondary-foreground">
                            No notifications found.
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Notifications;
