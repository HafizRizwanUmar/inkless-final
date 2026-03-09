import React from 'react';
import { Activity, Download } from 'lucide-react';

const AuditLogs = () => {
    const logs = [
        { id: 1, action: 'User Login', user: 'alice@uni.edu', ip: '192.168.1.1', timestamp: 'Oct 28, 10:45 AM', status: 'Success' },
        { id: 2, action: 'Grade Updated', user: 'smith@uni.edu', ip: '192.168.1.25', timestamp: 'Oct 28, 10:30 AM', status: 'Success' },
        { id: 3, action: 'Failed Login', user: 'unknown@uni.edu', ip: '45.32.12.1', timestamp: 'Oct 28, 09:12 AM', status: 'Failed' },
        { id: 4, action: 'Course Created', user: 'admin@uni.edu', ip: '192.168.1.5', timestamp: 'Oct 27, 04:20 PM', status: 'Success' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">System Audit Logs</h1>
                <button className="flex items-center gap-2 bg-surface text-secondary-foreground border border-border px-4 py-2 rounded-lg hover:text-white hover:border-primary">
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background/50 text-secondary-foreground text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">IP Address</th>
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-background/50 transition-colors font-mono text-sm">
                                <td className="px-6 py-4 font-bold">{log.action}</td>
                                <td className="px-6 py-4 text-secondary-foreground">{log.user}</td>
                                <td className="px-6 py-4 text-secondary-foreground">{log.ip}</td>
                                <td className="px-6 py-4 text-secondary-foreground">{log.timestamp}</td>
                                <td className={`px-6 py-4 text-right ${log.status === 'Success' ? 'text-green-500' : 'text-red-500'}`}>
                                    {log.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-center text-xs text-secondary-foreground mt-4">Showing last 4 of 2,450 log entries</p>
        </div>
    );
};

export default AuditLogs;
