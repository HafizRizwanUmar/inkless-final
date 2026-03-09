import React, { useState } from 'react';
import { PenTool, MessageSquare, Save } from 'lucide-react';

const ManualMarking = () => {
    const [score, setScore] = useState(0);

    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Viewer */}
            <div className="lg:col-span-2 bg-gray-100 rounded-xl overflow-hidden relative flex items-center justify-center">
                {/* Mock PDF Viewer */}
                <div className="text-gray-500 text-center">
                    <p className="text-2xl font-bold mb-2">PDF Viewer Plugin</p>
                    <p className="text-sm">Student Document Display Area</p>
                </div>

                {/* Floating Toolbar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface text-white px-4 py-2 rounded-full shadow-xl flex space-x-4">
                    <button className="hover:text-primary"><PenTool className="w-5 h-5" /></button>
                    <button className="hover:text-primary"><MessageSquare className="w-5 h-5" /></button>
                </div>
            </div>

            {/* Grading Panel */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <h3 className="font-bold text-lg mb-6">Evaluation Rubric</h3>

                <div className="flex-1 space-y-6 overflow-y-auto">
                    {[
                        { title: 'Introduction & Theory', max: 20 },
                        { title: 'Implementation Logic', max: 30 },
                        { title: 'Results & Analysis', max: 30 },
                        { title: 'Code Quality', max: 20 },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-background p-4 rounded-lg border border-border">
                            <div className="flex justify-between mb-2">
                                <span className="font-medium text-sm">{item.title}</span>
                                <span className="text-xs text-secondary-foreground">Max: {item.max}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max={item.max}
                                className="w-full accent-primary h-2 bg-input rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-end mt-2">
                                <input type="number" className="w-16 bg-surface border border-border rounded p-1 text-right text-sm" placeholder="-" />
                            </div>
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium mb-2">General Comments</label>
                        <textarea className="w-full bg-background border border-border rounded-lg p-3 h-32 resize-none" placeholder="Add feedback..." />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-bold">Total Score</span>
                        <span className="text-3xl font-bold text-primary">85<span className="text-lg text-secondary-foreground">/100</span></span>
                    </div>
                    <button className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                        <Save className="w-4 h-4" /> Save Grade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManualMarking;
