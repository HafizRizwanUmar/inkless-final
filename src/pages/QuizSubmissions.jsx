import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Search, Filter, User, Mail, Calendar, CheckCircle, Clock, AlertCircle, MoreHorizontal, Download, Share2, Sparkles, AlertTriangle, ShieldCheck, ShieldOff, Eye, FileSpreadsheet, FileText } from 'lucide-react';
import SEO from '../components/SEO';

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

    const [attempts, setAttempts] = useState([]);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiStatus, setAiStatus] = useState({ available: false, msg: 'Checking...' });
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [selected, setSelected] = useState(null);
    const [downloading, setDownloading] = useState(''); // 'excel' | 'zip' | ''

    useEffect(() => {
        if (!quizId) return navigate(-1);
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const [submissionsRes, aiStatusRes, quizRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/quizzes/submissions/${quizId}`, {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get(`${API_BASE_URL}/api/quizzes/ai-status`, {
                        headers: { 'x-auth-token': token }
                    }),
                    axios.get(`${API_BASE_URL}/api/quizzes/${quizId}`, {
                        headers: { 'x-auth-token': token }
                    })
                ]);

                // Correctly unpack the submissions data which is { quiz, attempts }
                setAttempts(submissionsRes.data.attempts || []);
                setAiStatus(aiStatusRes.data);
                setQuiz(quizRes.data);
            } catch (err) {
                console.error("Failed to fetch submissions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quizId, navigate]);

    const handleBatchMarking = async () => {
        if (!window.confirm('This will use AI to mark all text questions for all students. Continue?')) return;
        setIsProcessingAI(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_BASE_URL}/api/quizzes/grade-all/${quizId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            alert(res.data.msg);
            // Refresh data
            const submissionsRes = await axios.get(`${API_BASE_URL}/api/quizzes/submissions/${quizId}`, {
                headers: { 'x-auth-token': token }
            });
            setAttempts(submissionsRes.data.attempts || []);
        } catch (err) {
            console.error(err);
            alert('Failed to process AI marking.');
        } finally {
            setIsProcessingAI(false);
        }
    };

    const handleShareResults = async () => {
        if (!window.confirm('Share results with all students? Students will receive a notification and see their full scores.')) return;
        setIsSharing(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/quizzes/share-results/${quizId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setQuiz({ ...quiz, resultsShared: true });
            alert('Results shared successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to share results.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleDownload = async (type) => {
        try {
            setDownloading(type);
            const token = localStorage.getItem('token');
            const endpoint = type === 'excel'
                ? `${API_BASE_URL}/api/quizzes/export/excel/${quizId}`
                : `${API_BASE_URL}/api/quizzes/export/pdf-zip/${quizId}`;
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
            a.download = `${quiz?.title || 'quiz'}_${type === 'excel' ? 'submissions' : 'reports'}.${ext}`;
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
    if (!quiz || !attempts) return <div className="min-h-screen flex items-center justify-center text-red-400">Failed to load submissions.</div>;

    const suspiciousCount = attempts.filter(a => a.strikes > 0).length;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <SEO title="Quiz Submissions" description="Review student quiz attempts, AI-powered grading insights, and share results." />

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-secondary-foreground hover:text-primary mb-6 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
            </button>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">{quiz.title}</h1>
                    <p className="text-secondary-foreground text-sm mt-1 font-medium">
                        {attempts.length} submission{attempts.length !== 1 ? 's' : ''} recorded
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 items-center">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border ${aiStatus.available ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'}`}>
                        <div className={`w-2 h-2 rounded-full ${aiStatus.available ? 'bg-blue-400 animate-pulse' : 'bg-yellow-400'}`} />
                        AI Ping 1.0: {aiStatus.available ? 'Available' : 'Unavailable'}
                    </div>

                    <button
                        onClick={handleBatchMarking}
                        disabled={isProcessingAI || !aiStatus.available || attempts.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        {isProcessingAI ? 'Processing...' : 'Mark All with AI'}
                    </button>

                    <button
                        onClick={handleShareResults}
                        disabled={isSharing || attempts.length === 0 || quiz?.resultsShared}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${quiz?.resultsShared ? 'bg-green-600/20 text-green-400 cursor-default' : 'bg-green-600 text-white hover:bg-green-700'}`}
                    >
                        {quiz?.resultsShared ? <><CheckCircle className="w-4 h-4" /> Results Shared</> : <><Share2 className="w-4 h-4" /> Share Results</>}
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleDownload('excel')}
                            disabled={downloading === 'excel'}
                            className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50 shadow-sm"
                            title="Download Excel"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => handleDownload('zip')}
                            disabled={downloading === 'zip'}
                            className="p-2.5 rounded-xl bg-brand-muted text-primary hover:bg-muted transition-all disabled:opacity-50 shadow-sm"
                            title="Download PDF Reports"
                        >
                            <FileText className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-secondary-foreground font-bold uppercase">Total Submissions</p>
                        <p className="text-2xl font-black text-foreground">{attempts.length}</p>
                    </div>
                </div>
                <div className={`border rounded-2xl p-4 flex items-center gap-4 ${suspiciousCount > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${suspiciousCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className={`text-xs font-bold uppercase ${suspiciousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>Suspicious Activity</p>
                        <p className={`text-2xl font-black ${suspiciousCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{suspiciousCount} Students</p>
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-secondary-foreground font-bold uppercase">Integrity System</p>
                        <p className="text-sm font-bold text-foreground">Active & Monitoring</p>
                    </div>
                </div>
            </div>

            {/* Anti-cheat legend */}
            <div className="flex flex-wrap gap-4 text-xs font-medium text-secondary-foreground px-2 mb-4">
                <div className="flex items-center gap-2">
                    <ShieldOff className="w-4 h-4 text-orange-400" />
                    <span>Tab Switches — student left quiz</span>
                </div>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Copy Attempts — suspicious clipboard action</span>
                </div>
                <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-brand-accent" />
                    <span>Total Strikes — combined events</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background border-b border-border text-[10px] uppercase text-secondary-foreground font-black tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4 text-center">Indicators</th>
                                <th className="px-6 py-4 text-center">Submitted At</th>
                                <th className="px-6 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {attempts.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-secondary-foreground font-medium italic">No submissions yet for this quiz.</td></tr>
                            ) : (
                                attempts.map(att => {
                                    const pct = att.totalPoints > 0 ? Math.round((att.score / att.totalPoints) * 100) : 0;
                                    const isSuspicious = att.strikes > 0;
                                    return (
                                        <React.Fragment key={att._id}>
                                            <tr className={`transition-all duration-200 ${isSuspicious ? 'bg-red-500/[0.02] hover:bg-red-500/5' : 'hover:bg-muted/10'}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0
                                                        ${isSuspicious ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                                            {att.student?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-foreground text-sm">{att.student?.name || 'Unknown'}</p>
                                                            <p className="text-[10px] text-secondary-foreground uppercase font-bold tracking-tight">{att.student?.email}</p>
                                                        </div>
                                                        {isSuspicious && <AlertTriangle className="w-4 h-4 text-red-500 ml-1" title="Suspicious activity" />}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className={`text-base font-black leading-none ${pct >= 70 ? 'text-green-500' : pct >= 40 ? 'text-orange-500' : 'text-red-500'}`}>
                                                            {att.score}/{att.totalPoints}
                                                        </span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                                                                <div className={`h-full ${pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-[10px] font-black">{pct}%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <StrikeBadge count={att.tabSwitchCount || 0} label="switches" />
                                                        <StrikeBadge count={att.copyAttemptCount || 0} label="copies" />
                                                        <div className="w-px h-4 bg-border/50 mx-1" />
                                                        <StrikeBadge count={att.strikes || 0} label="strikes" />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center text-[11px] font-bold text-secondary-foreground">
                                                    {new Date(att.attemptedAt).toLocaleDateString()}
                                                    <br />
                                                    <span className="opacity-50 font-medium">{new Date(att.attemptedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setSelected(selected === att._id ? null : att._id)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${selected === att._id ? 'bg-primary text-white' : 'text-primary hover:bg-primary/10'}`}
                                                    >
                                                        {selected === att._id ? 'HIDE' : 'VIEW'}
                                                    </button>
                                                </td>
                                            </tr>

                                            {selected === att._id && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-6 bg-muted/20 border-b border-border/50">
                                                        <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                                            <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-2">Student Submission Details</p>
                                                            {att.answers.map((ans, idx) => (
                                                                <div key={idx} className="bg-surface border border-border rounded-xl p-5 shadow-sm">
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-1 rounded-md">QUESTION {ans.questionIndex + 1}</span>
                                                                    </div>

                                                                    {ans.selectedOptionIndex !== undefined && (
                                                                        <div className="flex items-center gap-3">
                                                                            <p className="text-sm font-medium text-secondary-foreground">Selected Option:</p>
                                                                            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black">{String.fromCharCode(65 + ans.selectedOptionIndex)}</span>
                                                                        </div>
                                                                    )}

                                                                    {ans.textAnswer && (
                                                                        <div className="mt-2">
                                                                            <p className="text-[10px] font-black text-secondary-foreground uppercase mb-1">Student Answer:</p>
                                                                            <p className="text-sm text-foreground bg-background/50 p-3 rounded-lg border border-border/50 italic leading-relaxed">"{ans.textAnswer}"</p>
                                                                        </div>
                                                                    )}

                                                                    {ans.aiFeedback && (
                                                                        <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl relative overflow-hidden group">
                                                                            <div className="absolute top-0 right-0 p-2 opacity-20"><Sparkles className="w-8 h-8 text-purple-500" /></div>
                                                                            <div className="flex items-center gap-2 mb-2">
                                                                                <div className="p-1 rounded-md bg-purple-500/10"><Sparkles className="w-3 h-3 text-purple-500" /></div>
                                                                                <p className="text-[10px] font-black text-purple-600 uppercase tracking-tight">AI Grading Insight</p>
                                                                            </div>
                                                                            <p className="text-xs text-purple-700 font-medium leading-relaxed">{ans.aiFeedback}</p>
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
        </div>
    );
};

export default QuizSubmissions;
