import API_BASE_URL from '../config';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, Save, CheckCircle, XCircle, Minus, Type,
    Pen, Eraser, Trash2, Layout, CheckSquare, MessageSquare,
    FileText, Undo2, Download
} from 'lucide-react';
import SEO from '../components/SEO';

// ─────────────────────────── Annotation Canvas ────────────────────────────
// Renders on top of a <img> or <iframe> and allows drawing annotations.
const AnnotationCanvas = ({ width, height, annotations, onAnnotationsChange, tool, color, fontSize }) => {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const currentPath = useRef([]);

    // Redraw all annotations
    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        annotations.forEach(ann => {
            ctx.save();
            if (ann.type === 'path') {
                ctx.strokeStyle = ann.color;
                ctx.lineWidth = ann.lineWidth || 2;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ann.points.forEach((pt, i) => {
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
                ctx.stroke();
            } else if (ann.type === 'tick') {
                ctx.strokeStyle = '#22c55e';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(ann.x - 12, ann.y);
                ctx.lineTo(ann.x - 4, ann.y + 10);
                ctx.lineTo(ann.x + 14, ann.y - 12);
                ctx.stroke();
            } else if (ann.type === 'cross') {
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 3;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(ann.x - 10, ann.y - 10);
                ctx.lineTo(ann.x + 10, ann.y + 10);
                ctx.moveTo(ann.x + 10, ann.y - 10);
                ctx.lineTo(ann.x - 10, ann.y + 10);
                ctx.stroke();
            } else if (ann.type === 'mark') {
                ctx.fillStyle = ann.color || '#f59e0b';
                ctx.font = `bold ${ann.fontSize || 18}px Arial`;
                ctx.fillText(ann.text, ann.x, ann.y);
            } else if (ann.type === 'circle') {
                ctx.strokeStyle = ann.color || '#f59e0b';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ann.x, ann.y, 18, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        });
    }, [annotations]);

    useEffect(() => { redraw(); }, [redraw]);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const src = e.touches ? e.touches[0] : e;
        return { x: (src.clientX - rect.left) * scaleX, y: (src.clientY - rect.top) * scaleY };
    };

    const handleStart = (e) => {
        e.preventDefault();
        const pos = getPos(e);
        if (tool === 'pen' || tool === 'eraser') {
            drawing.current = true;
            currentPath.current = [pos];
        } else if (tool === 'tick') {
            onAnnotationsChange([...annotations, { type: 'tick', x: pos.x, y: pos.y, id: Date.now() }]);
        } else if (tool === 'cross') {
            onAnnotationsChange([...annotations, { type: 'cross', x: pos.x, y: pos.y, id: Date.now() }]);
        } else if (tool === 'circle') {
            onAnnotationsChange([...annotations, { type: 'circle', x: pos.x, y: pos.y, color, id: Date.now() }]);
        } else if (tool === 'text') {
            const text = prompt('Enter mark/comment:');
            if (text) onAnnotationsChange([...annotations, { type: 'mark', x: pos.x, y: pos.y, text, color, fontSize, id: Date.now() }]);
        }
    };

    const handleMove = (e) => {
        e.preventDefault();
        if (!drawing.current) return;
        const pos = getPos(e);
        currentPath.current.push(pos);

        // Live preview
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        redraw();
        ctx.save();
        if (tool === 'pen') {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
        } else {
            ctx.strokeStyle = 'rgba(200,200,200,0.8)';
            ctx.lineWidth = 18;
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        currentPath.current.forEach((pt, i) => { if (i === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
        ctx.stroke();
        ctx.restore();
    };

    const handleEnd = (e) => {
        if (!drawing.current) return;
        drawing.current = false;
        if (tool === 'eraser') {
            // Remove any annotation within the brush path
            const path = currentPath.current;
            const updated = annotations.filter(ann => {
                if (ann.type === 'path') {
                    return !ann.points.some(pt => path.some(ep => Math.hypot(pt.x - ep.x, pt.y - ep.y) < 20));
                }
                return !path.some(ep => Math.hypot(ann.x - ep.x, ann.y - ep.y) < 20);
            });
            onAnnotationsChange(updated);
        } else {
            onAnnotationsChange([...annotations, { type: 'path', points: currentPath.current, color, lineWidth: 2, id: Date.now() }]);
        }
        currentPath.current = [];
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
            style={{ zIndex: 5 }}
        />
    );
};

// ──────────────────────────── Main Grading Page ────────────────────────────
const GradingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { submissionId } = useParams();
    const [submission, setSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [mobileTab, setMobileTab] = useState('work');

    // Annotation state
    const [annotations, setAnnotations] = useState([]);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#ef4444');
    const [fontSize] = useState(18);
    const [imgSize, setImgSize] = useState({ w: 800, h: 1100 });
    const imgRef = useRef(null);
    const pdfContainerRef = useRef(null);

    useEffect(() => {
        if (!submissionId) return navigate(-1);
        const fetchSubmission = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/submissions/${submissionId}`, { headers: { 'x-auth-token': token } });
                setSubmission(res.data);
                setGradeData({ marks: res.data.obtainedMarks || '', feedback: res.data.teacherFeedback || '' });
                // Load saved annotations if any
                if (res.data.annotations) {
                    try { setAnnotations(JSON.parse(res.data.annotations)); } catch (_) { }
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchSubmission();
    }, [submissionId, navigate]);

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/submissions/${submissionId}/grade`,
                { marks: gradeData.marks, feedback: gradeData.feedback, annotations: JSON.stringify(annotations) },
                { headers: { 'x-auth-token': token } }
            );
            alert('Graded & annotations saved!');
            navigate(-1);
        } catch (err) { console.error(err); alert('Error submitting grade'); } finally { setSubmitting(false); }
    };

    const handleImgLoad = () => {
        if (imgRef.current) {
            setImgSize({ w: imgRef.current.naturalWidth, h: imgRef.current.naturalHeight });
        }
    };

    const undo = () => setAnnotations(prev => prev.slice(0, -1));

    if (loading || !submission) return <div className="h-screen flex items-center justify-center text-secondary-foreground">Loading...</div>;
    const { student, assignment } = submission;
    const isPDF = submission.fileUrl?.toLowerCase().endsWith('.pdf');
    const isImage = submission.imagePath || (!isPDF && submission.fileUrl);

    const TOOLS = [
        { id: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Draw' },
        { id: 'tick', icon: <CheckCircle className="w-4 h-4" />, label: 'Tick ✓' },
        { id: 'cross', icon: <XCircle className="w-4 h-4" />, label: 'Cross ✗' },
        { id: 'circle', icon: <Minus className="w-4 h-4 rotate-45" />, label: 'Circle' },
        { id: 'text', icon: <Type className="w-4 h-4" />, label: 'Mark' },
        { id: 'eraser', icon: <Eraser className="w-4 h-4" />, label: 'Erase' },
    ];
    const COLORS = ['#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#000000'];

    return (
        <div className="min-h-screen bg-background">
            <SEO title="Grading System" description="Evaluate student submissions with AI assistance and expert tools for precise feedback." />
            {/* Header */}
            <div className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
                    </button>
                    <div>
                        <h2 className="font-bold text-sm md:text-base truncate max-w-[160px] md:max-w-xs">{assignment?.title}</h2>
                        <p className="text-xs text-secondary-foreground">{student?.name}</p>
                    </div>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">Max: {assignment?.marks}</span>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden flex border-b border-border bg-surface text-sm">
                {['work', 'grade'].map(t => (
                    <button key={t} onClick={() => setMobileTab(t)}
                        className={`flex-1 py-3 font-bold capitalize flex items-center justify-center gap-2 border-b-2 transition-colors ${mobileTab === t ? 'border-primary text-primary' : 'border-transparent text-secondary-foreground'}`}>
                        {t === 'work' ? <><Layout className="w-4 h-4" /> Submission</> : <><CheckSquare className="w-4 h-4" /> Grade</>}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden flex relative">
                {/* ── Left: Submission + Annotation Tool ── */}
                <div className={`flex-1 overflow-y-auto flex flex-col absolute inset-0 md:relative md:inset-auto transition-transform ${mobileTab === 'work' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

                    {/* Annotation Toolbar */}
                    {(isPDF || isImage || submission.imagePath) && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border flex-wrap shrink-0">
                            {TOOLS.map(t => (
                                <button key={t.id} onClick={() => setTool(t.id)} title={t.label}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${tool === t.id ? 'bg-primary text-white shadow-sm' : 'bg-background border border-border text-secondary-foreground hover:text-foreground'}`}>
                                    {t.icon} <span className="hidden sm:inline">{t.label}</span>
                                </button>
                            ))}
                            <div className="flex gap-1.5 ml-2">
                                {COLORS.map(c => (
                                    <button key={c} onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-white scale-125' : 'border-transparent'}`}
                                        style={{ background: c }} />
                                ))}
                            </div>
                            <div className="ml-auto flex gap-2">
                                <button onClick={undo} title="Undo" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-background border border-border text-secondary-foreground hover:text-foreground transition-colors">
                                    <Undo2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setAnnotations([])} title="Clear All" className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-muted/5">
                        {/* PDF Inline */}
                        {isPDF && submission.fileUrl && (
                            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                                <div className="px-4 py-3 bg-background/40 border-b border-border flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-sm">Submitted PDF</span>
                                    <span className="ml-auto text-xs text-secondary-foreground">Draw annotations above, then save grade</span>
                                </div>
                                <div ref={pdfContainerRef} className="relative bg-gray-200" style={{ minHeight: 600 }}>
                                    <iframe
                                        src={`${API_BASE_URL}${submission.fileUrl}#toolbar=0`}
                                        className="w-full border-0"
                                        style={{ height: 800, position: 'relative', zIndex: 1 }}
                                        title="Submission PDF"
                                    />
                                    <AnnotationCanvas width={imgSize.w} height={800}
                                        annotations={annotations} onAnnotationsChange={setAnnotations}
                                        tool={tool} color={color} fontSize={fontSize} />
                                </div>
                            </div>
                        )}

                        {/* Image with annotation canvas */}
                        {submission.imagePath && (
                            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                                <div className="px-4 py-3 bg-background/40 border-b border-border flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="font-bold text-sm">Submitted Image</span>
                                </div>
                                <div className="relative">
                                    <img
                                        ref={imgRef}
                                        src={`${API_BASE_URL}${submission.imagePath}`}
                                        alt="Submission"
                                        className="w-full block"
                                        onLoad={handleImgLoad}
                                        style={{ position: 'relative', zIndex: 1 }}
                                    />
                                    <AnnotationCanvas width={imgSize.w} height={imgSize.h}
                                        annotations={annotations} onAnnotationsChange={setAnnotations}
                                        tool={tool} color={color} fontSize={fontSize} />
                                </div>
                            </div>
                        )}

                        {/* Source Code */}
                        {submission.codeContent && (
                            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                                    <h3 className="font-bold text-sm">Source Code</h3>
                                </div>
                                <pre className="p-4 text-sm font-mono overflow-x-auto bg-[#1e1e1e] text-gray-100 min-h-[200px] whitespace-pre-wrap">
                                    {submission.codeContent}
                                </pre>
                            </div>
                        )}

                        {/* Output */}
                        {submission.outputContent && (
                            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
                                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                                    <h3 className="font-bold text-sm">Output Log</h3>
                                </div>
                                <pre className="p-4 text-sm font-mono whitespace-pre-wrap text-foreground bg-background/50 min-h-[100px]">
                                    {submission.outputContent}
                                </pre>
                            </div>
                        )}

                        {!submission.codeContent && !submission.outputContent && !submission.imagePath && !isPDF && (
                            <div className="text-center py-20 text-secondary-foreground">No content submitted.</div>
                        )}
                    </div>
                </div>

                {/* ── Right: Grading Panel ── */}
                <div className={`w-full md:w-88 bg-surface border-l border-border flex flex-col shrink-0 absolute inset-0 md:relative md:inset-auto z-20 transition-transform ${mobileTab === 'grade' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
                    style={{ width: 'clamp(280px, 22rem, 100%)' }}>
                    <div className="p-5 h-full flex flex-col">
                        <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                            <CheckSquare className="text-primary w-5 h-5" /> Grading
                        </h3>
                        <form onSubmit={handleGradeSubmit} className="space-y-5 flex-1 flex flex-col">
                            <div>
                                <label className="block text-sm font-bold mb-2">Marks Obtained</label>
                                <div className="relative">
                                    <input type="number" max={assignment?.marks} required
                                        className="w-full px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none pr-20 text-lg font-mono font-bold"
                                        value={gradeData.marks}
                                        onChange={e => setGradeData({ ...gradeData, marks: e.target.value })}
                                        placeholder="0" />
                                    <span className="absolute right-4 top-3.5 text-secondary-foreground text-sm font-medium">/ {assignment?.marks}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" /> Feedback
                                </label>
                                <textarea
                                    className="w-full h-full min-h-[180px] px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary focus:outline-none resize-none text-sm leading-relaxed"
                                    value={gradeData.feedback}
                                    onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                    placeholder="Provide constructive feedback..."
                                />
                            </div>

                            {annotations.length > 0 && (
                                <p className="text-xs text-primary font-bold flex items-center gap-1">
                                    <Pen className="w-3 h-3" /> {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} will be saved
                                </p>
                            )}

                            <button type="submit" disabled={submitting}
                                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 active:scale-95">
                                <Save className="w-5 h-5" /> {submitting ? 'Saving...' : 'Submit Grade'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradingPage;
