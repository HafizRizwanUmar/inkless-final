import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, AlertTriangle, ShieldOff, Eye, Download, FileSpreadsheet, FileArchive } from 'lucide-react';

const StrikeBadge = ({ count, label }) => {
    if (count === 0) return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
            0
        </span>
    );
    const color = count >= 3 ? 'red' : count >= 1 ? 'orange' : 'green';
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full
            ${color === 'red' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                color === 'orange' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' :
                    'bg-green-500/15 text-green-400 border border-green-500/20'}`}>
            {count}
        </span>
    );
};

const QuizSubmissions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizId } = location.state || {};

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [downloading, setDownloading] = useState(''); // 'excel' | 'zip' | ''

    useEffect(() => {
        if (!quizId) return navigate(-1);
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/quizzes/submissions/${quizId}`, {
                    headers: { 'x-auth-token': token }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [quizId, navigate]);

    const handleDownload = async (type) => {
        try {
            setDownloading(type);
            const token = localStorage.getItem('token');
            const endpoint = type === 'excel'
                ? `http://localhost:5000/api/quizzes/export/excel/${quizId}`
                : `http://localhost:5000/api/quizzes/export/pdf-zip/${quizId}`;
            const ext = type === 'excel' ? 'xlsx' : 'zip';
            const mimeType = type === 'excel'
                ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                : 'application/zip';

            const res = await fetch(endpoint, { headers: { 'x-auth-token': token } });
            if (!res.ok) { alert('Export failed. No submissions yet?'); return; }

            const blob = await res.blob();
            const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `${data?.quiz?.title || 'quiz'}_${type === 'excel' ? 'submissions' : 'reports'}.${ext}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert('Download failed.');
        } finally {
            setDownloading('');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-secondary-foreground">Loading submissions...</div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center text-red-400">Failed to load submissions.</div>;

    const { quiz, attempts } = data;
    const suspiciousCount = attempts.filter(a => a.strikes > 0).length;

    return (
        <div className="max-w-5xl mx-auto p-6">
            {/* Header */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-foreground hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{quiz.title}</h1>
                    <p className="text-secondary-foreground text-sm mt-1">{attempts.length} submission{attempts.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="bg-surface border border-border rounded-xl px-4 py-3 text-center">
                        <p className="text-xs text-secondary-foreground">Submissions</p>
                        <p className="text-2xl font-black text-white">{attempts.length}</p>
                    </div>
                    <div className={`rounded-xl px-4 py-3 text-center border ${suspiciousCount > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                        <p className={`text-xs ${suspiciousCount > 0 ? 'text-red-400' : 'text-green-400'}`}>Suspicious</p>
                        <p className={`text-2xl font-black ${suspiciousCount > 0 ? 'text-red-400' : 'text-green-400'}`}>{suspiciousCount}</p>
                    </div>
                    {/* Export Buttons */}
                    <button
                        onClick={() => handleDownload('excel')}
                        disabled={downloading === 'excel'}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm"
                        title="Download Excel with all submissions"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                        {downloading === 'excel' ? 'Exporting...' : 'Excel'}
                    </button>
                    <button
                        onClick={() => handleDownload('zip')}
                        disabled={downloading === 'zip'}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm"
                        title="Download ZIP with Best, Average & Worst student PDFs"
                    >
                        <FileArchive className="w-4 h-4" />
                        {downloading === 'zip' ? 'Generating...' : 'PDF Reports'}
                    </button>
                </div>
            </div>

            {/* Anti-cheat legend */}
            <div className="bg-surface border border-border rounded-2xl p-4 mb-4 flex flex-wrap gap-4 text-xs text-secondary-foreground">
                <div className="flex items-center gap-2">
                    <ShieldOff className="w-4 h-4 text-orange-400" />
                    <span>Tab Switches — student left the quiz window</span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Copy Attempts — student tried to copy text</span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>Total Strikes — combined suspicious events</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background border-b border-border text-xs uppercase text-secondary-foreground font-semibold">
                        <tr>
                            <th className="px-5 py-4">Student</th>
                            <th className="px-5 py-4 text-center">Score</th>
                            <th className="px-5 py-4 text-center">
                                <span className="flex items-center justify-center gap-1"><ShieldOff className="w-3.5 h-3.5 text-orange-400" /> Tab Switches</span>
                            </th>
                            <th className="px-5 py-4 text-center">
                                <span className="flex items-center justify-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Copy Attempts</span>
                            </th>
                            <th className="px-5 py-4 text-center">
                                <span className="flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5 text-purple-400" /> Strikes</span>
                            </th>
                            <th className="px-5 py-4 text-center">Submitted</th>
                            <th className="px-5 py-4 text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {attempts.length === 0 ? (
                            <tr><td colSpan="7" className="px-5 py-10 text-center text-secondary-foreground">No submissions yet.</td></tr>
                        ) : (
                            attempts.map(att => {
                                const pct = att.totalPoints > 0 ? Math.round((att.score / att.totalPoints) * 100) : 0;
                                const isSuspicious = att.strikes > 0;
                                return (
                                    <React.Fragment key={att._id}>
                                        <tr className={`transition-colors ${isSuspicious ? 'hover:bg-red-500/5' : 'hover:bg-muted/10'}`}>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                                                        ${isSuspicious ? 'bg-red-500/10 text-red-400' : 'bg-primary/10 text-primary'}`}>
                                                        {att.student?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{att.student?.name || 'Unknown'}</p>
                                                        <p className="text-xs text-secondary-foreground">{att.student?.email}</p>
                                                    </div>
                                                    {isSuspicious && <AlertTriangle className="w-4 h-4 text-red-400 ml-1" title="Suspicious activity" />}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-sm font-black ${pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-orange-400' : 'text-red-400'}`}>
                                                        {att.score}/{att.totalPoints}
                                                    </span>
                                                    <span className="text-xs text-secondary-foreground">{pct}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <StrikeBadge count={att.tabSwitchCount || 0} label="switches" />
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <StrikeBadge count={att.copyAttemptCount || 0} label="copies" />
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <StrikeBadge count={att.strikes || 0} label="strikes" />
                                            </td>
                                            <td className="px-5 py-4 text-center text-xs text-secondary-foreground">
                                                {new Date(att.attemptedAt).toLocaleString()}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <button
                                                    onClick={() => setSelected(selected === att._id ? null : att._id)}
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    {selected === att._id ? 'Hide' : 'View'}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded row — show answers + AI feedback */}
                                        {selected === att._id && (
                                            <tr>
                                                <td colSpan="7" className="px-5 py-4 bg-background/50">
                                                    <div className="space-y-3">
                                                        <p className="font-bold text-sm text-foreground mb-3">Answers</p>
                                                        {att.answers.map((ans, idx) => (
                                                            <div key={idx} className="bg-surface border border-border rounded-xl p-4 text-sm">
                                                                <span className="text-xs font-bold text-primary">Q{ans.questionIndex + 1}</span>
                                                                {ans.selectedOptionIndex !== undefined && (
                                                                    <p className="mt-1 text-secondary-foreground">Option selected: <span className="font-bold text-white">{String.fromCharCode(65 + ans.selectedOptionIndex)}</span></p>
                                                                )}
                                                                {ans.textAnswer && (
                                                                    <p className="mt-1 text-secondary-foreground">Answer: <span className="text-white">{ans.textAnswer}</span></p>
                                                                )}
                                                                {ans.aiFeedback && (
                                                                    <div className="mt-2 p-2 bg-primary/10 border border-primary/20 rounded-lg text-xs text-white">
                                                                        <span className="font-bold text-primary">AI: </span>{ans.aiFeedback}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuizSubmissions;
