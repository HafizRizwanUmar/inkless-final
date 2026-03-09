import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

const SimilarityComparison = () => {
    return (
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-4 p-4 bg-surface rounded-xl border border-border">
                <div className="flex flex-col items-center">
                    <div className="font-bold text-lg">Student A</div>
                    <div className="text-secondary-foreground text-sm">John Doe</div>
                </div>
                <div className="p-2 bg-background rounded-full">
                    <ArrowRightLeft className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col items-center">
                    <div className="font-bold text-lg">Student B</div>
                    <div className="text-secondary-foreground text-sm">Jane Smith</div>
                </div>
                <div className="absolute right-6">
                    <span className="text-sm text-secondary-foreground mr-2">Identical Content:</span>
                    <span className="font-bold text-red-500 text-xl">95%</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-surface rounded-xl border border-border p-4 flex flex-col">
                    <div className="p-2 bg-background/50 rounded mb-4 text-sm font-medium text-center">Submission A</div>
                    <div className="flex-1 overflow-y-auto font-serif text-sm leading-relaxed p-4 bg-background rounded-lg border border-border">
                        <p className="bg-red-500/20 mb-2">
                            The quick brown fox jumps over the lazy dog. This sentence is a pangram.
                        </p>
                        <p className="mb-2">
                            Unique content written by Student A that is different...
                        </p>
                        <p className="bg-red-500/20 mb-2">
                            A neural network is a series of algorithms that endeavors to recognize underlying relationships...
                        </p>
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-4 flex flex-col">
                    <div className="p-2 bg-background/50 rounded mb-4 text-sm font-medium text-center">Submission B</div>
                    <div className="flex-1 overflow-y-auto font-serif text-sm leading-relaxed p-4 bg-background rounded-lg border border-border">
                        <p className="bg-red-500/20 mb-2">
                            The quick brown fox jumps over the lazy dog. This sentence is a pangram.
                        </p>
                        <p className="mb-2">
                            Totally different text here for Student B...
                        </p>
                        <p className="bg-red-500/20 mb-2">
                            A neural network is a series of algorithms that endeavors to recognize underlying relationships...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimilarityComparison;
