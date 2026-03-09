import React, { useState } from 'react';
import { Upload, Sparkles, Wand2 } from 'lucide-react';

const AIQuizGenerator = () => {
    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="flex flex-col space-y-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">AI Quiz Generator</h1>
                    <p className="text-secondary-foreground">Upload course notes or paste text to generate questions instantly.</p>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6 flex-1 flex flex-col">
                    <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-8 text-center cursor-pointer hover:bg-primary/10 transition-colors mb-6">
                        <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="font-bold mb-1">Upload PDF/DOCX Notes</h3>
                        <p className="text-sm text-secondary-foreground">or drag and drop files here</p>
                    </div>

                    <div className="flex-1 relative">
                        <textarea
                            className="w-full h-full bg-background border border-border rounded-xl p-4 resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="Or paste your lecture notes here..."
                        ></textarea>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Questions:</span>
                            <input type="number" defaultValue={10} className="w-16 bg-background border border-border rounded p-2 text-center" />
                        </div>
                        <button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center space-x-2">
                            <Wand2 className="w-5 h-5" />
                            <span>Generate Quiz</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Section */}
            <div className="bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Generated Preview
                    </h3>
                    <div className="flex gap-2">
                        <button className="text-sm text-secondary-foreground hover:text-white">Regenerate</button>
                        <button className="text-sm text-primary font-bold">Use Quiz</button>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {/* Mock Generated Questions */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 bg-background rounded-lg border border-border">
                            <p className="font-medium mb-3">Q{i}: What is the difference between supervised and unsupervised learning?</p>
                            <div className="space-y-2">
                                <div className="p-2 ml-4 rounded bg-green-500/10 border border-green-500/30 text-sm">A. Labelling of data</div>
                                <div className="p-2 ml-4 rounded bg-surface border border-border text-sm text-secondary-foreground">B. The algorithm used</div>
                                <div className="p-2 ml-4 rounded bg-surface border border-border text-sm text-secondary-foreground">C. Processing speed</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIQuizGenerator;
