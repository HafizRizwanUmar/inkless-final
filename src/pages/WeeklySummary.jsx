import React from 'react';
import { Calendar, UserCheck, BookOpen, TrendingUp } from 'lucide-react';

const WeeklySummary = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Weekly Summary</h1>
                    <p className="text-secondary-foreground">Oct 21 - Oct 27, 2025</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-surface">Previous Week</button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-surface">Next Week</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-primary">
                    <div className="flex justify-between items-start mb-2">
                        <TrendingUp className="w-6 h-6 text-primary" />
                        <span className="text-green-400 text-xs font-bold">+5%</span>
                    </div>
                    <div className="text-3xl font-bold">82%</div>
                    <div className="text-xs text-secondary-foreground">Avg Attendance</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-blue-500">
                    <div className="flex justify-between items-start mb-2">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                        <span className="text-secondary-foreground text-xs font-bold">Total</span>
                    </div>
                    <div className="text-3xl font-bold">3</div>
                    <div className="text-xs text-secondary-foreground">Assignments Due</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start mb-2">
                        <UserCheck className="w-6 h-6 text-green-500" />
                        <span className="text-green-400 text-xs font-bold">High</span>
                    </div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-xs text-secondary-foreground">Submission Rate</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border border-l-4 border-l-yellow-500">
                    <div className="flex justify-between items-start mb-2">
                        <Calendar className="w-6 h-6 text-yellow-500" />
                        <span className="text-secondary-foreground text-xs font-bold">Next</span>
                    </div>
                    <div className="text-3xl font-bold">Oct 30</div>
                    <div className="text-xs text-secondary-foreground">Upcoming Midterm</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="font-bold mb-4">Activity Log</h3>
                    <div className="relative border-l border-border ml-2 space-y-6">
                        <div className="ml-6 relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
                            <p className="text-sm font-bold">Assignment 3 Published</p>
                            <p className="text-xs text-secondary-foreground">Mon, Oct 21 • 10:00 AM</p>
                        </div>
                        <div className="ml-6 relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-blue-500 border-4 border-background"></div>
                            <p className="text-sm font-bold">Lecture 5: Backpropagation</p>
                            <p className="text-xs text-secondary-foreground">Tue, Oct 22 • 02:00 PM</p>
                        </div>
                        <div className="ml-6 relative">
                            <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-green-500 border-4 border-background"></div>
                            <p className="text-sm font-bold">Quiz 2 Graded</p>
                            <p className="text-xs text-secondary-foreground">Thu, Oct 24 • 04:30 PM</p>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="font-bold mb-4">Student Engagement</h3>
                    <p className="text-sm text-secondary-foreground mb-4">Top active students this week:</p>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-xs">S{i}</div>
                                    <span className="text-sm font-medium">Student {i}</span>
                                </div>
                                <span className="text-xs font-bold text-green-400">Very Active</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeeklySummary;
