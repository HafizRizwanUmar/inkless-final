import React from 'react';
import { Info, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const AIConfidence = () => {
    return (
        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">AI Confidence Analysis</h1>
                <p className="text-secondary-foreground">Analysis for "Student 1 - Neural Networks"</p>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-surface rounded-2xl border border-border p-12 text-center shadow-2xl relative w-full"
            >
                <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Circular Progress Mockup */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="96" cy="96" r="88" className="stroke-background" strokeWidth="12" fill="none" />
                        <circle cx="96" cy="96" r="88" className="stroke-green-500" strokeWidth="12" fill="none" strokeDasharray="552" strokeDashoffset="55" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-white">92%</span>
                        <span className="text-sm text-secondary-foreground uppercase tracking-widest mt-1">Confidence</span>
                    </div>
                </div>

                <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-start gap-3 text-left bg-background p-4 rounded-lg">
                        <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <p className="text-sm text-secondary-foreground">
                            The AI is highly confident in this grade based on keyword matching, semantic analysis, and structure comparison with the rubric.
                        </p>
                    </div>

                    <div className="flex items-start gap-3 text-left bg-background p-4 rounded-lg">
                        <Info className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <p className="text-sm text-secondary-foreground">
                            Warning: 2 sections show high similarity with online sources. Please review the Plagiarism Report.
                        </p>
                    </div>
                </div>

                <button className="mt-8 flex items-center justify-center space-x-2 text-primary hover:text-white transition-colors mx-auto">
                    <RefreshCw className="w-4 h-4" />
                    <span>Run Full Re-check</span>
                </button>
            </motion.div>
        </div>
    );
};

export default AIConfidence;
