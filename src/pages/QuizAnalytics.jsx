import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { range: '0-20', count: 2 },
    { range: '21-40', count: 5 },
    { range: '41-60', count: 12 },
    { range: '61-80', count: 18 },
    { range: '81-100', count: 8 },
];

const QuizAnalytics = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Analytics: Mid-Term AI</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="text-secondary-foreground text-sm">Average Score</div>
                    <div className="text-3xl font-bold mt-2">72.5%</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="text-secondary-foreground text-sm">Highest Score</div>
                    <div className="text-3xl font-bold mt-2 text-green-400">98%</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="text-secondary-foreground text-sm">Lowest Score</div>
                    <div className="text-3xl font-bold mt-2 text-red-400">35%</div>
                </div>
                <div className="bg-surface p-6 rounded-xl border border-border">
                    <div className="text-secondary-foreground text-sm">Completion Rate</div>
                    <div className="text-3xl font-bold mt-2">95%</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface p-6 rounded-xl border border-border h-96">
                    <h3 className="font-bold mb-6">Score Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="range" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} cursor={{ fill: '#334155', opacity: 0.2 }} />
                            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-border">
                    <h3 className="font-bold mb-6">Most Difficult Questions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start p-4 bg-background rounded-lg border border-border">
                                <span className="font-bold text-red-400">Q{i * 5}</span>
                                <div>
                                    <p className="text-sm font-medium mb-2">Explain the vanishing gradient problem.</p>
                                    <div className="w-full bg-surface rounded-full h-2 mb-1">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                    <p className="text-xs text-secondary-foreground">Only 25% students answered correctly</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAnalytics;
