import React, { useState } from 'react';
import { Globe, Lock, Mail, Server } from 'lucide-react';

const SystemSettings = () => {
    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold">System Settings</h1>

            <div className="space-y-6">
                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="flex items-center gap-2 font-bold mb-6 text-lg">
                        <Globe className="w-5 h-5 text-blue-400" />
                        General Settings
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-1">Institution Name</label>
                            <input type="text" defaultValue="Inkless University" className="w-full bg-background border border-border rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-1">Timezone</label>
                            <select className="w-full bg-background border border-border rounded-lg p-2">
                                <option>UTC (Coordinated Universal Time)</option>
                                <option>EST (Eastern Standard Time)</option>
                                <option>PST (Pacific Standard Time)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="flex items-center gap-2 font-bold mb-6 text-lg">
                        <Lock className="w-5 h-5 text-green-400" />
                        Security Policies
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
                                <p className="text-xs text-secondary-foreground">Enforce 2FA for all admin accounts.</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-primary cursor-pointer align-middle transition-colors">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">Password Expiry</h4>
                                <p className="text-xs text-secondary-foreground">Require password reset every 90 days.</p>
                            </div>
                            <div className="relative inline-block w-12 h-6 rounded-full bg-background border border-border cursor-pointer align-middle transition-colors">
                                <span className="absolute left-1 top-1 w-4 h-4 bg-secondary-foreground rounded-full transition-transform"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-xl border border-border p-6">
                    <h3 className="flex items-center gap-2 font-bold mb-6 text-lg">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        Email Configuration (SMTP)
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-1">SMTP Host</label>
                            <input type="text" placeholder="smtp.example.com" className="w-full bg-background border border-border rounded-lg p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-1">Port</label>
                            <input type="number" placeholder="587" className="w-full bg-background border border-border rounded-lg p-2" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button className="px-6 py-2 text-secondary-foreground hover:text-white">Discard Changes</button>
                <button className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90">Save Configuration</button>
            </div>
        </div>
    );
};

export default SystemSettings;
