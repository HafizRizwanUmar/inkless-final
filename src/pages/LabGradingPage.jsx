import API_BASE_URL from '../config';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import JSZip from 'jszip';
import { ArrowLeft, Save, Maximize2, Layout, CheckSquare, MessageSquare, FileText, Archive, Pen, CheckCircle, XCircle, Minus, Type, Eraser, Trash2, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Annotation Canvas (shared) ───────────────────────────────────────────
const AnnotationCanvas = ({ width, height, annotations, onAnnotationsChange, tool, color }) => {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const currentPath = useRef([]);

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        annotations.forEach(ann => {
            ctx.save();
            if (ann.type === 'path') {
                ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
                ctx.beginPath();
                ann.points.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
                ctx.stroke();
            } else if (ann.type === 'tick') {
                ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 3; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ann.x - 12, ann.y); ctx.lineTo(ann.x - 4, ann.y + 10); ctx.lineTo(ann.x + 14, ann.y - 12); ctx.stroke();
            } else if (ann.type === 'cross') {
                ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.lineCap = 'round';
                ctx.beginPath(); ctx.moveTo(ann.x - 10, ann.y - 10); ctx.lineTo(ann.x + 10, ann.y + 10);
                ctx.moveTo(ann.x + 10, ann.y - 10); ctx.lineTo(ann.x - 10, ann.y + 10); ctx.stroke();
            } else if (ann.type === 'mark') {
                ctx.fillStyle = ann.color || '#f59e0b'; ctx.font = `bold 18px Arial`; ctx.fillText(ann.text, ann.x, ann.y);
            } else if (ann.type === 'circle') {
                ctx.strokeStyle = ann.color; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(ann.x, ann.y, 18, 0, Math.PI * 2); ctx.stroke();
            }
            ctx.restore();
        });
    }, [annotations]);

    useEffect(() => { redraw(); }, [redraw]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const sx = canvasRef.current.width / rect.width, sy = canvasRef.current.height / rect.height;
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
    };

    const handleStart = (e) => {
        e.preventDefault();
        const pos = getPos(e);
        if (tool === 'pen' || tool === 'eraser') { drawing.current = true; currentPath.current = [pos]; }
        else if (tool === 'tick') onAnnotationsChange([...annotations, { type: 'tick', x: pos.x, y: pos.y, id: Date.now() }]);
        else if (tool === 'cross') onAnnotationsChange([...annotations, { type: 'cross', x: pos.x, y: pos.y, id: Date.now() }]);
        else if (tool === 'circle') onAnnotationsChange([...annotations, { type: 'circle', x: pos.x, y: pos.y, color, id: Date.now() }]);
        else if (tool === 'text') { const t = prompt('Enter mark/comment:'); if (t) onAnnotationsChange([...annotations, { type: 'mark', x: pos.x, y: pos.y, text: t, color, id: Date.now() }]); }
    };

    const handleMove = (e) => {
        e.preventDefault();
        if (!drawing.current) return;
        const pos = getPos(e);
        currentPath.current.push(pos);
        const ctx = canvasRef.current.getContext('2d');
        redraw();
        ctx.save();
        ctx.strokeStyle = tool === 'eraser' ? 'rgba(200,200,200,0.6)' : color;
        ctx.lineWidth = tool === 'eraser' ? 18 : 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath();
        currentPath.current.forEach((pt, i) => i === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.stroke(); ctx.restore();
    };

    const handleEnd = () => {
        if (!drawing.current) return;
        drawing.current = false;
        if (tool === 'eraser') {
            const path = currentPath.current;
            onAnnotationsChange(annotations.filter(ann => {
                if (ann.type === 'path') return !ann.points.some(pt => path.some(ep => Math.hypot(pt.x - ep.x, pt.y - ep.y) < 20));
                return !path.some(ep => Math.hypot(ann.x - ep.x, ann.y - ep.y) < 20);
            }));
        } else {
            onAnnotationsChange([...annotations, { type: 'path', points: currentPath.current, color, lineWidth: 2, id: Date.now() }]);
        }
        currentPath.current = [];
    };

    return <canvas ref={canvasRef} width={width} height={height}
        onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd}
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none" style={{ zIndex: 5 }} />;
};


const LabGradingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { submissionId } = useParams();
    const [submission, setSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // JSZip States
    const [zipFiles, setZipFiles] = useState([]);
    const [selectedZipFile, setSelectedZipFile] = useState(null);
    const [selectedZipContent, setSelectedZipContent] = useState('');
    const [isExtracting, setIsExtracting] = useState(false);

    // Annotation state
    const [annotations, setAnnotations] = useState([]);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#ef4444');

    // Mobile Tab State: 'work' or 'grade'
    const [mobileTab, setMobileTab] = useState('work');

    const TOOLS = [
        { id: 'pen', icon: <Pen className="w-3.5 h-3.5" />, label: 'Draw' },
        { id: 'tick', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Tick' },
        { id: 'cross', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Cross' },
        { id: 'text', icon: <Type className="w-3.5 h-3.5" />, label: 'Mark' },
        { id: 'eraser', icon: <Eraser className="w-3.5 h-3.5" />, label: 'Erase' },
    ];
    const COLORS = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#000000'];

    const handleOpenZip = async (url) => {
        setIsExtracting(true);
        try {
            const response = await fetch(`${API_BASE_URL}${url}`);
            if (!response.ok) throw new Error("Failed to fetch ZIP");
            const blob = await response.blob();

            const zip = new JSZip();
            const contents = await zip.loadAsync(blob);

            const filesList = [];
            contents.forEach((relativePath, file) => {
                if (!file.dir) {
                    filesList.push({ path: relativePath, file });
                }
            });
            setZipFiles(filesList);
            if (filesList.length > 0) {
                viewZipFileContent(filesList[0]);
            }
        } catch (error) {
            console.error("Error reading zip:", error);
            alert("Could not process ZIP file.");
        } finally {
            setIsExtracting(false);
        }
    };

    const viewZipFileContent = async (fileObj) => {
        setSelectedZipFile(fileObj.path);
        try {
            const text = await fileObj.file.async('string');
            setSelectedZipContent(text);
        } catch (e) {
            setSelectedZipContent('// Binary file or unable to read text');
        }
    };

    useEffect(() => {
        if (!submissionId) return navigate(-1);
        const fetchSub = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/lab-submissions/${submissionId}`, { headers: { 'x-auth-token': token } });
                setSubmission(res.data);
                setGradeData({
                    marks: res.data.obtainedMarks || '',
                    feedback: res.data.teacherFeedback || ''
                });
                if (res.data.annotations) {
                    try { setAnnotations(JSON.parse(res.data.annotations)); } catch (_) { }
                }
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchSub();
    }, [submissionId, navigate]);

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/lab-submissions/${submissionId}/grade`,
                { marks: gradeData.marks, feedback: gradeData.feedback, annotations: JSON.stringify(annotations) },
                { headers: { 'x-auth-token': token } }
            );
            alert('Graded Successfully');
            navigate(-1);
        } catch (err) { alert('Error saving grade'); }
        finally { setSubmitting(false); }
    };

    if (loading || !submission) return <div className="h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;

    const { student, labTask } = submission;
    const answersMap = {};
    submission.answers.forEach(a => answersMap[a.questionId] = a);

    return (
        <div className="flex flex-col h-screen bg-background overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-border bg-surface px-4 md:px-6 flex items-center justify-between shrink-0 z-20 shadow-sm relative">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-secondary-foreground" /></button>
                    <div>
                        <h2 className="font-bold text-sm md:text-lg truncate max-w-[150px] md:max-w-md">{labTask.title}</h2>
                        <p className="text-xs text-secondary-foreground">{student?.name}</p>
                    </div>
                </div>
                <div className="text-right flex items-center gap-4">
                    <span className="hidden md:block text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Max: {labTask.totalMarks}</span>
                </div>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden flex border-b border-border bg-surface">
                <button
                    onClick={() => setMobileTab('work')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${mobileTab === 'work' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                >
                    <Layout size={16} /> Student Work
                </button>
                <button
                    onClick={() => setMobileTab('grade')}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${mobileTab === 'grade' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                >
                    <CheckSquare size={16} /> Grading
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-row relative">
                {/* Student Work Section - Visible on Desktop OR Mobile Tab 'work' */}
                <div className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-muted/10 transition-transform absolute inset-0 md:relative md:transform-none ${mobileTab === 'work' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                    {submission.submittedDocument ? (
                        <div className="bg-surface p-6 rounded-xl shadow-sm border border-border">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText size={20} /> Submitted Document</h3>

                            {/* Annotation Toolbar (always shown for documents) */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                {TOOLS.map(t => (
                                    <button key={t.id} onClick={() => setTool(t.id)}
                                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${tool === t.id ? 'bg-primary text-white' : 'bg-background border border-border text-secondary-foreground hover:text-foreground'}`}>
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                                <div className="flex gap-1.5 ml-1">
                                    {COLORS.map(c => (
                                        <button key={c} onClick={() => setColor(c)}
                                            className={`w-5 h-5 rounded-full border-2 ${color === c ? 'border-white scale-125' : 'border-transparent'}`}
                                            style={{ background: c }} />
                                    ))}
                                </div>
                                <button onClick={() => setAnnotations(prev => prev.slice(0, -1))} className="ml-auto px-2 py-1.5 rounded-lg text-xs bg-background border border-border text-secondary-foreground hover:text-foreground">
                                    <Undo2 className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setAnnotations([])} className="px-2 py-1.5 rounded-lg text-xs bg-red-500/10 border border-red-500/30 text-red-400">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {submission.submittedDocument.endsWith('.zip') || submission.submittedDocument.endsWith('.rar') ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => handleOpenZip(submission.submittedDocument)} disabled={isExtracting} className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm">
                                            <Archive size={18} /> {isExtracting ? 'Extracting ZIP...' : 'Open ZIP in Browser Viewer'}
                                        </button>
                                        <a href={`${API_BASE_URL}${submission.submittedDocument}`} download className="text-primary hover:underline font-bold text-sm">Download ZIP Instead</a>
                                    </div>

                                    {zipFiles.length > 0 && (
                                        <div className="flex flex-col md:flex-row gap-0 border border-border rounded-xl overflow-hidden mt-6 bg-background shadow-sm h-[500px]">
                                            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border bg-surface flex flex-col">
                                                <div className="p-3 border-b border-border bg-muted/20">
                                                    <h4 className="font-bold text-xs uppercase text-secondary-foreground tracking-wider">Extracted Files</h4>
                                                </div>
                                                <div className="overflow-y-auto p-2 space-y-1 flex-1">
                                                    {zipFiles.map(f => (
                                                        <button
                                                            key={f.path}
                                                            onClick={() => viewZipFileContent(f)}
                                                            className={`w-full text-left px-3 py-2 text-sm truncate rounded transition-colors flex items-center gap-2 ${selectedZipFile === f.path ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'}`}
                                                        >
                                                            <FileText size={14} className="shrink-0" /> {f.path.split('/').pop()}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full md:w-2/3 flex flex-col bg-[#1e1e1e]">
                                                <div className="p-3 border-b border-[#333] bg-[#252526] text-gray-300 text-xs font-mono truncate flex items-center gap-2">
                                                    <span>{selectedZipFile}</span>
                                                </div>
                                                <div className="overflow-y-auto p-4 flex-1">
                                                    <pre className="text-sm font-mono text-gray-100 whitespace-pre-wrap leading-relaxed">{selectedZipContent}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <p className="text-secondary-foreground text-sm">Submitted PDF — annotate directly below:</p>
                                    <div className="relative rounded-xl overflow-hidden border border-border" style={{ minHeight: 700 }}>
                                        <iframe
                                            src={`${API_BASE_URL}${submission.submittedDocument}#toolbar=0`}
                                            className="w-full border-0"
                                            style={{ height: 700, position: 'relative', zIndex: 1 }}
                                            title="Submission PDF"
                                        />
                                        <AnnotationCanvas width={800} height={700}
                                            annotations={annotations} onAnnotationsChange={setAnnotations}
                                            tool={tool} color={color} />
                                    </div>
                                    <a href={`${API_BASE_URL}${submission.submittedDocument}`} download className="text-primary hover:underline text-xs font-bold self-start">Download PDF</a>
                                </div>
                            )}
                        </div>
                    ) : (
                        labTask.questions.map((q, index) => {
                            const ans = answersMap[q._id];
                            return (
                                <div key={q._id} className="bg-surface rounded-xl shadow-sm border border-border overflow-hidden">
                                    <div className="px-5 py-3 bg-muted/30 border-b border-border flex justify-between items-center">
                                        <h3 className="font-bold text-sm text-foreground">Q{index + 1}: {q.questionText}</h3>
                                        <span className="text-xs bg-muted px-2 py-1 rounded text-secondary-foreground border border-border">{q.subMarks} pts</span>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        {!ans ? (
                                            <p className="text-muted-foreground italic text-sm">No answer submitted.</p>
                                        ) : (
                                            <>
                                                {/* Code Display */}
                                                {ans.codeFiles && ans.codeFiles.length > 0 && ans.codeFiles[0].content && (
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Code</p>
                                                        {ans.codeFiles.map((f, i) => (
                                                            <div key={i} className="mb-2">
                                                                <p className="text-xs font-bold text-secondary-foreground mb-1">{f.fileName}</p>
                                                                <pre className="p-4 rounded-lg text-xs md:text-sm overflow-x-auto bg-[#1e1e1e] text-gray-100 font-mono shadow-inner border border-border">
                                                                    {f.content}
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Output Display */}
                                                {ans.output && (
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Output</p>
                                                        <pre className="p-4 rounded-lg text-xs md:text-sm overflow-x-auto bg-muted/40 text-foreground whitespace-pre-wrap font-mono border border-border">
                                                            {ans.output}
                                                        </pre>
                                                    </div>
                                                )}
                                                {/* Text Display */}
                                                {ans.text && (
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Answer</p>
                                                        <div className="p-4 rounded-lg text-sm bg-background border border-border">
                                                            {ans.text}
                                                        </div>
                                                    </div>
                                                )}
                                                {/* Image Display */}
                                                {ans.images && ans.images.length > 0 && (
                                                    <div className="mt-4 space-y-1">
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attachments</p>
                                                        <div className="flex gap-4 overflow-x-auto">
                                                            {ans.images.map((img, i) => (
                                                                <img key={i} src={`${API_BASE_URL}${img}`} alt="Answer" className="max-h-60 rounded-lg border border-border object-contain bg-black/5" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Grading Panel - Visible on Desktop OR Mobile Tab 'grade' */}
                <div className={`w-full md:w-96 bg-surface border-l border-border flex flex-col shrink-0 absolute inset-0 md:relative md:inset-auto z-20 transition-transform ${mobileTab === 'grade' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
                    <div className="p-6 h-full flex flex-col">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><CheckSquare className="text-primary" /> Grading Control</h3>
                        <form onSubmit={handleGradeSubmit} className="space-y-6 flex-1 flex flex-col">
                            <div>
                                <label className="block text-sm font-bold mb-2">Total Marks Obtained</label>
                                <div className="relative">
                                    <input
                                        type="number" max={labTask.totalMarks} required
                                        className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none pr-20 text-lg font-mono font-bold"
                                        value={gradeData.marks}
                                        onChange={e => setGradeData({ ...gradeData, marks: e.target.value })}
                                        placeholder="0"
                                    />
                                    <span className="absolute right-4 top-3.5 text-muted-foreground text-sm font-medium">/ {labTask.totalMarks}</span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-2 flex items-center gap-2"><MessageSquare size={16} /> Feedback</label>
                                <textarea
                                    className="w-full h-full min-h-[200px] px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none text-sm leading-relaxed"
                                    value={gradeData.feedback}
                                    onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                    placeholder="Provide constructive feedback for the student..."
                                />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95">
                                <Save size={20} /> {submitting ? 'Saving...' : 'Submit Grade'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabGradingPage;
