import React from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';

const StudentManagement = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
            {/* Add Students Section */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add Students
                </h2>

                <div className="flex-1 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Add Single Student</label>
                        <div className="flex gap-2">
                            <input type="text" placeholder="Enter Email or SAP ID" className="flex-1 bg-background border border-border rounded-lg p-2" />
                            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">Add</button>
                        </div>
                    </div>

                    <div className="relative border-2 border-dashed border-border rounded-xl flex-1 flex flex-col items-center justify-center p-8 text-center group hover:border-primary transition-colors cursor-pointer">
                        <div className="p-4 bg-background rounded-full mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8 text-secondary-foreground" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Bulk Import</h3>
                        <p className="text-sm text-secondary-foreground mb-4">Upload a CSV file containing student details.</p>
                        <button className="text-primary text-sm font-medium hover:underline">Download Template</button>
                    </div>
                </div>
            </div>

            {/* Remove Students / Current List Context */}
            <div className="bg-surface rounded-xl border border-border p-6 flex flex-col">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    Remove Students
                </h2>

                <div className="flex-1 bg-background rounded-xl p-4 overflow-y-auto">
                    <p className="text-sm text-secondary-foreground mb-4">Select students to remove from this class.</p>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="flex justify-between items-center p-3 bg-surface border border-border rounded-lg hover:border-red-500/50 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-xs font-bold">JD</div>
                                    <div>
                                        <p className="text-sm font-medium">John Doe {i}</p>
                                        <p className="text-xs text-secondary-foreground">70010{i}</p>
                                    </div>
                                </div>
                                <button className="text-secondary-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                    <button className="bg-red-500/10 text-red-500 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                        Remove Selected
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
