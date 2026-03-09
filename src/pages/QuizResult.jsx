import React from 'react';
import { Award, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizResult = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Quiz Results</h1>
                <p className="text-secondary-foreground">Mid-Term: Artificial Intelligence</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="md:col-span-1 bg-surface rounded-xl border border-border p-8 text-center flex flex-col items-center justify-center"
                >
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
                        <Award className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-5xl font-bold mb-1 text-white">85<span className="text-2xl text-secondary-foreground">%</span></div>
                    <div className="text-lg font-medium text-green-400">Passed</div>
                    <p className="text-sm text-secondary-foreground mt-2">You scored higher than 72% of the class.</p>
                </motion.div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-surface rounded-xl border border-border p-6 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-background rounded-lg border-l-4 border-green-500">
                            <div className="text-2xl font-bold text-white mb-1">38</div>
                            <div className="text-sm text-secondary-foreground">Correct Answers</div>
                        </div>
                        <div className="p-4 bg-background rounded-lg border-l-4 border-red-500">
                            <div className="text-2xl font-bold text-white mb-1">7</div>
                            <div className="text-sm text-secondary-foreground">Incorrect Answers</div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-xl border border-border p-6">
                        <h3 className="font-bold mb-4">Performance by Topic</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Neural Networks</span>
                                    <span className="text-green-400">90%</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[90%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Search Algorithms</span>
                                    <span className="text-yellow-400">65%</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-500 w-[65%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border font-bold">Question Review</div>
                <div className="divide-y divide-border">
                    <div className="p-6">
                        <div className="flex gap-4">
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold mb-2">Q1: Which of the following is NOT a supervised learning algorithm?</p>
                                <p className="text-sm text-green-400">Your Answer: K-Means Clustering</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-red-500/5">
                        <div className="flex gap-4">
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold mb-2">Q2: Alpha-Beta pruning is applied to which algorithm?</p>
                                <p className="text-sm text-red-500 mb-1">Your Answer: Breadth-First Search</p>
                                <p className="text-sm text-green-400">Correct Answer: Minimax Algorithm</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizResult;
