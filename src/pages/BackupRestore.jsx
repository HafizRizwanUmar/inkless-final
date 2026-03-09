import React from 'react';
import { Database, UploadCloud, DownloadCloud, Clock, CheckCircle } from 'lucide-react';

const BackupRestore = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">Backup & Restore</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Backup Section */}
                <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/30 p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                        <DownloadCloud className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Create Backup</h3>
                    <p className="text-sm text-blue-200 mb-8 max-w-xs">
                        Generate a complete snapshot of the database, user files, and system configurations.
                    </p>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors">
                        Start Backup Now
                    </button>
                    <p className="mt-4 text-xs text-secondary-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Last backup: 2 hours ago
                    </p>
                </div>

                {/* Restore Section */}
                <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/30 p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                        <UploadCloud className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Restore System</h3>
                    <p className="text-sm text-red-200 mb-8 max-w-xs">
                        Upload a backup file to revert the system to a previous state. CAUTION: Overwrites current data.
                    </p>
                    <button className="w-full bg-transparent border border-red-500/50 hover:bg-red-500/10 text-red-400 font-bold py-3 rounded-lg transition-colors">
                        Upload Backup File
                    </button>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-border p-6">
                <h3 className="font-bold mb-4">Recent Backups</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                            <div className="flex items-center gap-4">
                                <Database className="w-5 h-5 text-secondary-foreground" />
                                <div>
                                    <p className="font-mono font-bold text-sm">backup_2025_10_2{8 - i}.zip</p>
                                    <p className="text-xs text-secondary-foreground">Size: 4.2 GB • Automatic Schedule</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-green-500 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                                <button className="text-blue-400 hover:underline text-sm font-medium">Download</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BackupRestore;
