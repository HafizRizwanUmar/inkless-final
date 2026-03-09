import React from 'react';
import { AlertTriangle, ExternalLink, ChevronDown } from 'lucide-react';

const PlagiarismReport = () => {
    return (
        <div className="h-[calc(100vh-100px)] grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Sidebar */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">32% Similarity</h2>
                    <p className="text-secondary-foreground">Found 4 matching sources.</p>
                </div>

                <h3 className="font-bold text-sm uppercase tracking-wider text-secondary-foreground mb-4">Matched Sources</h3>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {[
                        { name: 'Wikipedia: Neural Networks', match: '15%', color: 'border-red-500' },
                        { name: 'GeeksforGeeks', match: '8%', color: 'border-orange-500' },
                        { name: 'Medium Article', match: '5%', color: 'border-yellow-500' },
                        { name: 'University Archive', match: '4%', color: 'border-blue-500' },
                    ].map((source, idx) => (
                        <div key={idx} className={`bg-background p-3 rounded-lg border-l-4 ${source.color} cursor-pointer hover:bg-white/5`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm truncate">{source.name}</span>
                                <span className="text-xs font-bold text-white">{source.match}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-secondary-foreground">12 matches found</span>
                                <ExternalLink className="w-3 h-3 text-secondary-foreground" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Document Comparison View */}
            <div className="lg:col-span-2 bg-surface rounded-xl border border-border flex flex-col">
                <div className="p-4 border-b border-border flex justify-between items-center bg-background/50 rounded-t-xl">
                    <h3 className="font-bold">Student Submission</h3>
                    <div className="flex items-center space-x-2 text-sm text-secondary-foreground">
                        <span>Highlighting:</span>
                        <span className="font-bold text-white">All Sources</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
                <div className="p-8 overflow-y-auto leading-relaxed text-lg font-serif">
                    <p className="mb-4">
                        Machine Learning is a subset of artificial intelligence...
                        <span className="bg-red-500/20 border-b-2 border-red-500 cursor-pointer" title="Matched: Wikipedia">
                            that focuses on the development of algorithms that can learn from and make predictions on data.
                        </span>
                    </p>
                    <p className="mb-4">
                        Neural networks are inspired by the biological neural networks...
                        <span className="bg-orange-500/20 border-b-2 border-orange-500 cursor-pointer" title="Matched: GeeksforGeeks">
                            that constitute animal brains.
                        </span>
                        {" "}An ANN is based on a collection of connected units or nodes called artificial neurons.
                    </p>
                    <p className="mb-4 opacity-75">
                        Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. An artificial neuron that receives a signal then processes it and can signal neurons connected to it.
                    </p>
                    <p className="mb-4">
                        In this project, we utilize the <span className="bg-yellow-500/20 border-b-2 border-yellow-500">Backpropagation algorithm</span> to train the network.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlagiarismReport;
