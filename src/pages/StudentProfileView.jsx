import React from 'react';
import { User, Mail, GraduationCap, TrendingUp, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Assignment 1', score: 65 },
    { name: 'Quiz 1', score: 75 },
    { name: 'Midterm', score: 85 },
    { name: 'Assignment 2', score: 82 },
    { name: 'Final', score: 90 },
];

const StudentProfileView = () => {
    return (
        <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-border p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
                    JD
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold">John Doe</h1>
                        <p className="text-secondary-foreground">Computer Science • Semester 4</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-secondary-foreground">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> john.doe@uni.edu
                        </div>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" /> SAP ID: 700101
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-secondary-foreground mb-1">CGPA</p>
                    <p className="text-4xl font-bold text-green-400">3.85</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6 h-96">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Performance Trend
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} itemStyle={{ color: '#fff' }} />
                            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="lg:col-span-1 bg-surface rounded-xl border border-border p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Recent Deliverables
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                                <div>
                                    <p className="font-medium text-sm">Assignment {i}</p>
                                    <p className="text-xs text-secondary-foreground">Submitted 2 days ago</p>
                                </div>
                                <span className="font-bold text-green-400">8{i}/100</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileView;
