import React, { useState } from 'react';
import { Bell, FileText, CheckCircle, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
    const [filter, setFilter] = useState('All');
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'Assignment', title: 'New Assignment Posted', message: 'Calculus III assignment is now available.', time: '2 hours ago', read: false },
        { id: 2, type: 'System', title: 'System Maintenance', message: 'Scheduled maintenance on Saturday 10 PM.', time: '5 hours ago', read: true },
        { id: 3, type: 'Quiz', title: 'Quiz Graded', message: 'Your score for Physics Quiz 1 is 85/100.', time: '1 day ago', read: false },
        { id: 4, type: 'Assignment', title: 'Submission Reminder', message: 'History Essay is due tomorrow.', time: '1 day ago', read: true },
    ]);

    const filters = ['All', 'Assignment', 'Quiz', 'System'];

    const getIcon = (type) => {
        switch (type) {
            case 'Assignment': return <FileText className="w-5 h-5 text-blue-400" />;
            case 'Quiz': return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'System': return <Info className="w-5 h-5 text-yellow-400" />;
            default: return <Bell className="w-5 h-5 text-gray-400" />;
        }
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = filter === 'All' ? notifications : notifications.filter(n => n.type === filter);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
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
