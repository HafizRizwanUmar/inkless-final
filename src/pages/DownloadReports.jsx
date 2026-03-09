import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

const ReportCard = ({ title, format }) => (
    <div className="bg-surface rounded-xl border border-border p-6 hover:border-primary transition-colors cursor-pointer group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Download className="w-24 h-24" />
        </div>
        <div className="relative z-10">
            <div className={`w-12 h-12 rounded-lg ${format === 'PDF' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} flex items-center justify-center mb-4`}>
                {format === 'PDF' ? <FileText className="w-6 h-6" /> : <FileSpreadsheet className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-sm text-secondary-foreground mb-4">Export performance data in {format} format.</p>
            <span className="text-xs font-bold text-primary uppercase tracking-wider group-hover:underline">Download</span>
        </div>
    </div>
);

const DownloadReports = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
                <h1 className="text-3xl font-bold">Export Grade Reports</h1>
                <p className="text-secondary-foreground max-w-xl">
                    Download detailed reports for student performance, assignment analytics, and accreditation requirements.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 rounded-xl border border-yellow-500/30 text-center">
                    <h3 className="font-bold text-white text-xl mb-1">Top Performers</h3>
                    <p className="text-yellow-200 text-sm mb-4">Highest 10%</p>
                    <div className="flex -space-x-2 justify-center mb-4">
                        {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs">S{i}</div>)}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-6 rounded-xl border border-blue-500/30 text-center">
                    <h3 className="font-bold text-white text-xl mb-1">Class Average</h3>
                    <p className="text-blue-200 text-sm mb-4">Overall Performance</p>
                    <span className="text-4xl font-bold text-white">78%</span>
                </div>
                <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 p-6 rounded-xl border border-red-500/30 text-center">
                    <h3 className="font-bold text-white text-xl mb-1">Needs Improvement</h3>
                    <p className="text-red-200 text-sm mb-4">Below 50%</p>
                    <span className="text-4xl font-bold text-white">5</span>
                    <span className="text-xs text-red-200 block">students</span>
                </div>
            </div>

            <h3 className="font-bold text-xl pt-8 border-t border-border">Available Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ReportCard title="Full Class Results" format="Excel" />
                <ReportCard title="Performance Summary" format="PDF" />
                <ReportCard title="Grade Distribution" format="PDF" />
                <ReportCard title="Attendance Report" format="Excel" />
                <ReportCard title="CLO Achievement" format="PDF" />
                <ReportCard title="Individual Report Cards" format="ZIP" />
            </div>
        </div>
    );
};

export default DownloadReports;
