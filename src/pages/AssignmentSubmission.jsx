import React from 'react';
import { UploadCloud, File, X } from 'lucide-react';

const AssignmentSubmission = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Submit Assignment</h1>
                <span className="text-secondary-foreground">Due: Oct 28 11:59 PM</span>
            </div>

            <div className="bg-surface rounded-xl border border-border p-8">
                <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-12 text-center cursor-pointer hover:bg-primary/10 transition-colors">
                    <UploadCloud className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Drag & Drop your files here</h3>
                    <p className="text-secondary-foreground mb-6">or click to browse from your computer</p>
                    <p className="text-xs text-secondary-foreground opacity-70">Accepted formats: PDF, DOCX, ZIP (Max 50MB)</p>
                </div>

                <div className="mt-8 space-y-4">
                    <h4 className="font-bold text-secondary-foreground uppercase text-xs tracking-wider">Uploaded Files</h4>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-500/20 rounded">
                                <File className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Neural_Net_Implementation.pdf</p>
                                <p className="text-xs text-secondary-foreground">2.4 MB • Uploaded just now</p>
                            </div>
                        </div>
                        <button className="text-secondary-foreground hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button className="px-6 py-2 text-secondary-foreground hover:text-white font-medium">Cancel</button>
                    <button className="px-8 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors">Submit Final</button>
                </div>
            </div>
        </div>
    );
};

export default AssignmentSubmission;
