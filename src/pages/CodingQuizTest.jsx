import React from 'react';
import { Layout } from 'lucide-react';

const CodingQuizTest = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Add Coding Question</h1>

            <div className="bg-surface rounded-xl border border-border p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-secondary-foreground mb-2">Question Text</label>
                    <textarea rows="3" className="w-full bg-background border border-border rounded-lg p-3 resize-none" placeholder="Write a function that calculates..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Default Code Template</label>
                        <textarea rows="10" className="w-full bg-slate-900 border border-border rounded-lg p-3 font-mono text-sm text-blue-100" placeholder="def solution(args):&#10;    pass" />
                        <p className="text-xs text-secondary-foreground mt-1">This code will be shown to the student initially.</p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Hidden Test Cases</label>
                        <div className="bg-background rounded-lg border border-border p-4 space-y-4">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Input (e.g. [1,2])" className="flex-1 bg-surface border border-border rounded px-2 py-1 text-sm" />
                                <input type="text" placeholder="Expected Output" className="flex-1 bg-surface border border-border rounded px-2 py-1 text-sm" />
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Input" className="flex-1 bg-surface border border-border rounded px-2 py-1 text-sm" />
                                <input type="text" placeholder="Expected Output" className="flex-1 bg-surface border border-border rounded px-2 py-1 text-sm" />
                            </div>
                            <button className="text-primary text-sm font-medium">+ Add Test Case</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodingQuizTest;
