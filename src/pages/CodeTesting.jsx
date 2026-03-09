import React from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';

const CodeTesting = () => {
    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Code Viewer / Editor */}
            <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-border flex flex-col font-mono text-sm">
                <div className="p-2 bg-slate-800 rounded-t-xl border-b border-border flex justify-between items-center">
                    <span className="ml-4 text-secondary-foreground">solution.py</span>
                    <button className="flex items-center space-x-2 px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors mr-2">
                        <Play className="w-3 h-3" />
                        <span>Run Tests</span>
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto text-blue-100">
                    <div className="flex">
                        <div className="text-secondary-foreground mr-4 opacity-50 text-right select-none">
                            1<br />2<br />3<br />4<br />5<br />6<br />7<br />8
                        </div>
                        <pre>
                            {`def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    
    return sequence`}
                        </pre>
                    </div>
                </div>
                <div className="p-2 bg-slate-800 border-t border-border text-xs text-secondary-foreground">
                    Python 3.9 • Read-only View
                </div>
            </div>

            {/* Test Results */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Test Cases</h3>

                <div className="space-y-4 flex-1">
                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-green-500 text-sm">Test Case 1</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-secondary-foreground block">Input</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">n=5</span>
                            </div>
                            <div>
                                <span className="text-secondary-foreground block">Expected</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">[0,1,1,2,3]</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-green-500 text-sm">Test Case 2</span>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-secondary-foreground block">Input</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">n=1</span>
                            </div>
                            <div>
                                <span className="text-secondary-foreground block">Expected</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">[0]</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-red-500 text-sm">Test Case 3</span>
                            <XCircle className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-secondary-foreground block">Input</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">n=-1</span>
                            </div>
                            <div>
                                <span className="text-secondary-foreground block">Expected</span>
                                <span className="font-mono bg-background px-2 py-1 rounded block mt-1">[]</span>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-red-400">
                            AssertionError: Expected [] but got [0]
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-sm text-secondary-foreground text-center">Score: 2/3 Passed</p>
                </div>
            </div>
        </div>
    );
};

export default CodeTesting;
