import React from 'react';
import { Settings, Shield, Clock, Shuffle } from 'lucide-react';

const QuizSettings = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Quiz Configuration</h1>

            <div className="bg-surface rounded-xl border border-border p-8 space-y-8">
                {/* Timer Settings */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold mb-1">Time Limit</h3>
                        <p className="text-sm text-secondary-foreground mb-4">Set the duration for the quiz.</p>
                        <div className="flex items-center gap-4">
                            <input type="number" placeholder="60" className="w-24 bg-background border border-border rounded-lg p-2" />
                            <span className="text-secondary-foreground">Minutes</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-border"></div>

                {/* Anti-Cheat */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                        <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Proctoring Mode</h3>
                                <p className="text-sm text-secondary-foreground">Enable screen monitoring and tab-switch detection.</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-primary cursor-pointer align-middle transition-colors">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-border"></div>

                {/* Randomization */}
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Shuffle className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold mb-1">Shuffle Questions</h3>
                                <p className="text-sm text-secondary-foreground">Randomize question order for each student.</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-primary bg-background border-border rounded" checked readOnly />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4">
                <button className="px-6 py-2 text-secondary-foreground hover:text-white">Reset Defaults</button>
                <button className="px-8 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Save Settings</button>
            </div>
        </div>
    );
};

export default QuizSettings;
