import React from 'react';
import { Target, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { outcome: 'CLO 1', achieved: 85, target: 70 },
    { outcome: 'CLO 2', achieved: 65, target: 70 },
    { outcome: 'CLO 3', achieved: 90, target: 75 },
    { outcome: 'CLO 4', achieved: 78, target: 70 },
];

const CLOReport = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Course Learning Outcomes (CLO) Report</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-surface rounded-xl border border-border p-6 flex flex-col justify-center items-center text-center">
                    <Target className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-4xl font-bold text-white mb-2">3/4</h3>
                    <p className="text-secondary-foreground">CLOs Achieved by Class Average</p>
                </div>

                <div className="lg:col-span-2 bg-surface rounded-xl border border-border p-6">
                    <h3 className="font-bold mb-6">Achievement vs Target</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="outcome" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Bar dataKey="achieved" fill="#8b5cf6" name="Achieved %" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="target" fill="#64748b" name="Target %" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background/50 text-secondary-foreground text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Outcome</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4">Class Avg</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr>
                            <td className="px-6 py-4 font-bold">CLO 1</td>
                            <td className="px-6 py-4 text-sm text-secondary-foreground">Understand the fundamentals of AI optimization.</td>
                            <td className="px-6 py-4 font-mono">85%</td>
                            <td className="px-6 py-4"><span className="text-green-500 bg-green-500/10 px-2 py-1 rounded text-xs">Met</span></td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-bold">CLO 2</td>
                            <td className="px-6 py-4 text-sm text-secondary-foreground">Implement basic neural network architectures.</td>
                            <td className="px-6 py-4 font-mono">65%</td>
                            <td className="px-6 py-4"><span className="text-red-500 bg-red-500/10 px-2 py-1 rounded text-xs">Not Met</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CLOReport;
