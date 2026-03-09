import React from 'react';
import { Sparkles, Check, X, RefreshCw, MessageSquare } from 'lucide-react';

const AIGrading = () => {
    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Student Answer Panel */}
            <div className="flex flex-col bg-surface rounded-xl border border-border p-6 overflow-hidden">
                <h3 className="font-bold text-lg mb-4 text-secondary-foreground">Student Submission</h3>
                <div className="flex-1 bg-background rounded-lg p-6 overflow-y-auto font-serif leading-relaxed text-lg">
                    <p>
                        Artificial Intelligence (AI) refers to the simulation of human intelligence in machines...
                        <br /><br />
                        The core concept of a neural network implies a series of algorithms that endeavor to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.
                        <br /><br />
                        In this project, I implemented an MLP using NumPy. The forward pass calculates the dot product of weights...
                    </p>
                    {/* Mock long content */}
                    {Array(10).fill(0).map((_, i) => <p key={i} className="mt-4 opacity-50">More content regarding the implementation details...</p>)}
                </div>
            </div>

            {/* AI Analysis Panel */}
            <div className="flex flex-col space-y-6">
                <div className="bg-purple-900/10 border border-purple-500/30 p-6 rounded-xl relative overflow-hidden">
                    {/* Confidence Meter */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Inkless AI Analysis</h3>
                                <div className="flex items-center gap-2 text-sm text-purple-300">
                                    <span>Confidence Score:</span>
                                    <div className="w-24 h-2 bg-purple-900 rounded-full">
                                        <div className="w-[92%] h-full bg-purple-400 rounded-full"></div>
                                    </div>
                                    <span>92%</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-sm text-secondary-foreground block">Suggested Grade</span>
                            <span className="text-4xl font-bold text-white">88<span className="text-lg text-secondary-foreground">/100</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-surface rounded-xl border border-border p-6 flex flex-col">
                    <h3 className="font-bold mb-4">AI Feedback & Comments</h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                        <div className="bg-background p-4 rounded-lg border-l-4 border-green-500">
                            <h4 className="font-bold text-green-400 text-sm mb-1">Strong Concept Understanding</h4>
                            <p className="text-sm text-secondary-foreground">The student accurately defines neural networks and their biological inspiration.</p>
                        </div>
                        <div className="bg-background p-4 rounded-lg border-l-4 border-yellow-500">
                            <h4 className="font-bold text-yellow-400 text-sm mb-1">Implementation Logic</h4>
                            <p className="text-sm text-secondary-foreground">Forward pass logic is correct, but backpropagation explanation lacks depth on gradient descent.</p>
                        </div>
                        <div className="bg-background p-4 rounded-lg border-l-4 border-blue-500 flex items-start gap-3">
                            <MessageSquare className="w-4 h-4 text-blue-400 mt-1" />
                            <div>
                                <p className="text-sm text-white">"Consider adding a section on activation functions derivative."</p>
                                <p className="text-xs text-secondary-foreground mt-1">Suggested Comment to Student</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border flex gap-4">
                        <button className="flex-1 py-3 bg-background border border-border hover:bg-surface rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                            <RefreshCw className="w-4 h-4" /> Recheck
                        </button>
                        <button className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                            <Check className="w-4 h-4" /> Accept Grade
                        </button>
                        <button className="flex-1 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                            <X className="w-4 h-4" /> Override
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIGrading;
