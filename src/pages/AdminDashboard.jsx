import React from 'react';
import { Shield, Users, Server, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-surface p-6 rounded-xl border border-border shadow-lg"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-20 text-white`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <span className="text-2xl font-bold">{value}</span>
        </div>
        <p className="text-secondary-foreground text-sm">{label}</p>
    </motion.div>
);

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">System Administration</h1>
                    <p className="text-secondary-foreground">Overview of system health and user activity.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={Users} label="Total Users" value="1,240" color="bg-blue-500" />
                <StatCard icon={Server} label="System Uptime" value="99.9%" color="bg-green-500" />
                <StatCard icon={Shield} label="Active Roles" value="4" color="bg-purple-500" />
                <StatCard icon={Activity} label="Pending Approvals" value="5" color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface rounded-xl border border-border p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">System Logs</h3>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="flex justify-between text-sm py-2 border-b border-border/50 first:mt-0">
                                <span className={i % 2 === 0 ? "text-red-400" : "text-green-400"}>[{i % 2 === 0 ? "ERROR" : "INFO"}]</span>
                                <span className="text-secondary-foreground">User login {i % 2 === 0 ? "failed" : "success"} from IP 192.168.1.{i}</span>
                                <span className="text-secondary-foreground opacity-50">10:{i}0 AM</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 text-primary text-sm hover:underline">View Full Logs</button>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Active Courses Distribution</h3>
                    <div className="flex items-center justify-center p-8 bg-background/50 rounded-lg">
                        <span className="text-secondary-foreground">Chart Visualization Placeholder</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
