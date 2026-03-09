import React, { useState, useEffect } from 'react';
import { Plus, Trash, Save, ArrowLeft, Wand2, X, Clock, Brain, PenTool, AlignLeft, List, ChevronRight, ChevronLeft, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

// ---- Step Indicator ----
const StepIndicator = ({ steps, current }) => (
    <div className="flex items-center gap-0 mb-10">
        {steps.map((step, idx) => (
            <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all
                        ${idx < current ? 'bg-primary text-white' : idx === current ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-surface border-2 border-border text-secondary-foreground'}`}>
                        {idx < current ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <p className={`text-xs mt-1.5 font-medium ${idx === current ? 'text-primary' : 'text-secondary-foreground'}`}>{step}</p>
                </div>
                {idx < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${idx < current ? 'bg-primary' : 'bg-border'}`} />
                )}
            </React.Fragment>
        ))}
    </div>
);

// ---- Question Type Icon ----
const QuestionTypeIcon = ({ type, className = "w-6 h-6" }) => {
    if (type === 'MCQ') return <List className={className} />;
    if (type === 'SHORT') return <PenTool className={className} />;
    return <AlignLeft className={className} />;
};

const QuizBuilder = () => {
    const location = useLocation();
    const { classId: preSelectedClassId } = location.state || {};
    const navigate = useNavigate();

    // ---- WIZARD STEP ----
    const [step, setStep] = useState(0); // 0=Setup, 1=Method, 2=Questions, 3=Time, 4=Builder

    // ---- META ----
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedClass, setSelectedClass] = useState(preSelectedClassId || '');
    const [classes, setClasses] = useState([]);

    // ---- SETUP STEP ----
    const [method, setMethod] = useState(''); // 'manual' | 'ai'
    const [quizType, setQuizType] = useState(''); // 'mcq' | 'short' | 'long' | 'mixed'

    // ---- COUNTS ----
    const [totalCount, setTotalCount] = useState(10);
    const [mcqCount, setMcqCount] = useState(4);
    const [shortCount, setShortCount] = useState(3);
    const [longCount, setLongCount] = useState(3);

    // ---- TIME ----
    const [timeLimitMinutes, setTimeLimitMinutes] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // ---- AI MATERIAL ----
    const [aiMaterial, setAiMaterial] = useState('');
    const [generatingAI, setGeneratingAI] = useState(false);

    // ---- QUESTIONS ----
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/classes', { headers: { 'x-auth-token': token } });
                setClasses(res.data);
            } catch (err) { console.error(err); }
        };
        fetchClasses();
    }, []);

    // ---- Question helpers ----
    const makeBlankQuestion = (type = 'MCQ') => ({
        id: Date.now() + Math.random(),
        text: '', type,
        options: type === 'MCQ' ? ['', '', '', ''] : [],
        correctOptionIndex: 0, points: type === 'MCQ' ? 1 : type === 'SHORT' ? 2 : 5
    });

    const buildBlankQuestions = () => {
        if (quizType === 'mcq') return Array.from({ length: totalCount }, () => makeBlankQuestion('MCQ'));
        if (quizType === 'short') return Array.from({ length: totalCount }, () => makeBlankQuestion('SHORT'));
        if (quizType === 'long') return Array.from({ length: totalCount }, () => makeBlankQuestion('LONG'));
        // Mixed
        return [
            ...Array.from({ length: mcqCount }, () => makeBlankQuestion('MCQ')),
            ...Array.from({ length: shortCount }, () => makeBlankQuestion('SHORT')),
            ...Array.from({ length: longCount }, () => makeBlankQuestion('LONG')),
        ];
    };

    const getTypesForAI = () => {
        if (quizType === 'mcq') return ['MCQ'];
        if (quizType === 'short') return ['SHORT'];
        if (quizType === 'long') return ['LONG'];
        return ['MCQ', 'SHORT', 'LONG'];
    };

    const getTotalCount = () => {
        if (quizType === 'mixed') return mcqCount + shortCount + longCount;
        return parseInt(totalCount) || 0;
    };

    // ---- AI Generate ----
    const handleGenerateAI = async () => {
        if (!aiMaterial.trim()) { alert('Please paste material to generate questions from.'); return; }
        setGeneratingAI(true);
        try {
            const token = localStorage.getItem('token');

            // Build specific count breakdown for AI prompt context
            let numQuestions = getTotalCount();
            const res = await axios.post('http://localhost:5000/api/quizzes/generate', {
                material: aiMaterial,
                numQuestions: numQuestions,
                types: getTypesForAI(),
                mcqCount: quizType === 'mixed' ? mcqCount : undefined,
                shortCount: quizType === 'mixed' ? shortCount : undefined,
                longCount: quizType === 'mixed' ? longCount : undefined,
            }, { headers: { 'x-auth-token': token } });

            const newQuestions = res.data.map(q => ({
                id: Date.now() + Math.random(),
                text: q.questionText || '',
                type: q.type || 'MCQ',
                options: q.options && q.options.length > 0 ? q.options.map(o => o.text) : ['', '', '', ''],
                correctOptionIndex: q.correctOptionIndex || 0,
                points: q.points || (q.type === 'LONG' ? 5 : q.type === 'SHORT' ? 2 : 1)
            }));
            setQuestions(newQuestions);
            setStep(4); // Jump to builder to review
        } catch (err) {
            console.error(err);
            alert('Failed to generate questions. ' + (err.response?.data?.msg || err.message));
        } finally {
            setGeneratingAI(false);
        }
    };

    // ---- Manual enter builder ----
    const enterManualBuilder = () => {
        setQuestions(buildBlankQuestions());
        setStep(4);
    };

    // ---- Question Editing ----
    const updateQuestion = (index, field, value) => {
        const newQ = [...questions];
        newQ[index][field] = value;
        setQuestions(newQ);
    };
    const updateOption = (qIndex, oIndex, value) => {
        const newQ = [...questions];
        newQ[qIndex].options[oIndex] = value;
        setQuestions(newQ);
    };
    const addQuestion = (type = 'MCQ') => setQuestions([...questions, makeBlankQuestion(type)]);
    const removeQuestion = (index) => setQuestions(questions.filter((_, i) => i !== index));

    // ---- Save ----
    const handleSave = async () => {
        if (!title || !selectedClass) { alert('Please provide a title and select a class.'); return; }
        const formattedQuestions = questions.map(q => {
            const base = { type: q.type, questionText: q.text, points: q.points };
            if (q.type === 'MCQ') {
                base.options = q.options.map(opt => ({ text: opt }));
                base.correctOptionIndex = q.correctOptionIndex;
            }
            return base;
        });
        const payload = {
            title, description, classId: selectedClass,
            questions: formattedQuestions,
            timeLimitMinutes: timeLimitMinutes ? parseInt(timeLimitMinutes) : null,
            startTime: startTime || null,
            endTime: endTime || null
        };
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/quizzes', payload, { headers: { 'x-auth-token': token } });
            alert('Quiz created successfully!');
            navigate(-1);
        } catch (err) {
            console.error(err);
            alert('Failed to save quiz.');
        } finally {
            setLoading(false);
        }
    };

    const steps = ['Setup', 'Method', 'Questions', 'Restrictions', 'Review & Edit'];

    // ========== RENDER ==========
    return (
        <div className="max-w-3xl mx-auto p-6 pb-32">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)} className="p-2 hover:bg-surface rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Create New Quiz</h1>
                    <p className="text-sm text-secondary-foreground">Step {step + 1} of {steps.length}</p>
                </div>
            </div>

            <StepIndicator steps={steps} current={step} />

            {/* ===== STEP 0: SETUP ===== */}
            {step === 0 && (
                <div className="space-y-5">
                    <div className="bg-surface p-6 rounded-2xl border border-border space-y-4">
                        <h2 className="text-lg font-bold">Basic Information</h2>
                        <div>
                            <label className="block text-sm font-bold text-secondary-foreground mb-1">Select Class</label>
                            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none">
                                <option value="">-- Select a Class --</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.title} ({c.code})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-secondary-foreground mb-1">Quiz Title</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                                placeholder="e.g., Mid-Term Exam Chapter 3-5"
                                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-secondary-foreground mb-1">Description (Optional)</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)}
                                rows={2} className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none resize-none" />
                        </div>
                    </div>

                    <button
                        onClick={() => { if (!title || !selectedClass) { alert('Please fill in title and class.'); return; } setStep(1); }}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2">
                        Continue <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* ===== STEP 1: METHOD ===== */}
            {step === 1 && (
                <div className="space-y-5">
                    <h2 className="text-lg font-bold text-foreground">How would you like to create the quiz?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { value: 'manual', icon: <PenTool className="w-10 h-10" />, title: 'Manual', desc: 'Write questions yourself, one by one.', color: 'blue' },
                            { value: 'ai', icon: <Wand2 className="w-10 h-10" />, title: 'Generate with AI', desc: 'Paste your material and let AI build the quiz.', color: 'purple' }
                        ].map(opt => (
                            <button key={opt.value} onClick={() => setMethod(opt.value)}
                                className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg flex flex-col gap-4
                                    ${method === opt.value ? 'border-primary bg-primary/10 shadow-primary/10 shadow-lg' : 'border-border bg-surface hover:border-primary/50'}`}>
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${opt.value === 'ai' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                    {opt.icon}
                                </div>
                                <div>
                                    <p className="text-lg font-bold">{opt.title}</p>
                                    <p className="text-secondary-foreground text-sm mt-1">{opt.desc}</p>
                                </div>
                                {method === opt.value && <Check className="w-5 h-5 text-primary self-end" />}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { if (!method) { alert('Select a method.'); return; } setStep(2); }}
                        disabled={!method}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-40">
                        Continue <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* ===== STEP 2: QUESTION TYPE & COUNT ===== */}
            {step === 2 && (
                <div className="space-y-6">
                    <h2 className="text-lg font-bold">Question Type & Count</h2>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { value: 'mcq', label: 'MCQ Only', desc: 'Multiple Choice', icon: <List className="w-7 h-7" />, color: 'blue' },
                            { value: 'short', label: 'Short Answer', desc: 'Brief responses', icon: <PenTool className="w-7 h-7" />, color: 'green' },
                            { value: 'long', label: 'Long Answer', desc: 'Detailed essays', icon: <AlignLeft className="w-7 h-7" />, color: 'orange' },
                            { value: 'mixed', label: 'Mixed', desc: 'All types', icon: <Brain className="w-7 h-7" />, color: 'purple' },
                        ].map(opt => (
                            <button key={opt.value} onClick={() => setQuizType(opt.value)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col gap-2
                                    ${quizType === opt.value ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-primary/50'}`}>
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                                    ${opt.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : opt.color === 'green' ? 'bg-green-500/10 text-green-400' : opt.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {opt.icon}
                                </div>
                                <p className="font-bold text-sm">{opt.label}</p>
                                <p className="text-xs text-secondary-foreground">{opt.desc}</p>
                            </button>
                        ))}
                    </div>

                    {quizType && quizType !== 'mixed' && (
                        <div className="bg-surface p-5 rounded-2xl border border-border">
                            <label className="block text-sm font-bold text-secondary-foreground mb-2">Number of Questions</label>
                            <input type="number" min="1" max="50" value={totalCount} onChange={e => setTotalCount(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl p-3 focus:border-primary outline-none text-lg font-bold" />
                        </div>
                    )}

                    {quizType === 'mixed' && (
                        <div className="bg-surface p-5 rounded-2xl border border-border space-y-4">
                            <p className="font-bold">Question Breakdown</p>
                            {[
                                { label: 'MCQ Questions', value: mcqCount, setter: setMcqCount, color: 'blue' },
                                { label: 'Short Answer Questions', value: shortCount, setter: setShortCount, color: 'green' },
                                { label: 'Long Answer Questions', value: longCount, setter: setLongCount, color: 'orange' },
                            ].map(row => (
                                <div key={row.label} className="flex items-center justify-between gap-4">
                                    <label className="text-sm text-secondary-foreground flex-1">{row.label}</label>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => row.setter(v => Math.max(0, v - 1))}
                                            className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center font-bold hover:bg-border text-secondary-foreground">−</button>
                                        <span className="w-6 text-center font-bold text-white">{row.value}</span>
                                        <button onClick={() => row.setter(v => v + 1)}
                                            className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center font-bold hover:bg-border text-secondary-foreground">+</button>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-2 border-t border-border flex justify-between text-sm">
                                <span className="text-secondary-foreground">Total</span>
                                <span className="font-black text-white">{mcqCount + shortCount + longCount} questions</span>
                            </div>
                        </div>
                    )}

                    <button onClick={() => { if (!quizType) { alert('Select a question type.'); return; } setStep(3); }}
                        disabled={!quizType}
                        className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-40">
                        Continue <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* ===== STEP 3: TIME RESTRICTIONS ===== */}
            {step === 3 && (
                <div className="space-y-5">
                    <div>
                        <h2 className="text-lg font-bold">Time Restrictions</h2>
                        <p className="text-secondary-foreground text-sm mt-1">All fields are optional. Leave blank for no restriction.</p>
                    </div>
                    <div className="bg-surface p-6 rounded-2xl border border-border space-y-5">
                        <div className="bg-background p-4 rounded-xl border border-border">
                            <label className="block text-sm font-bold text-secondary-foreground mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-orange-400" /> Per-Attempt Time Limit</label>
                            <div className="flex items-center gap-3">
                                <input type="number" min="1" value={timeLimitMinutes} onChange={e => setTimeLimitMinutes(e.target.value)}
                                    placeholder="e.g., 30"
                                    className="flex-1 bg-surface border border-border rounded-xl p-3 focus:border-primary outline-none text-lg font-bold" />
                                <span className="text-secondary-foreground font-medium">minutes</span>
                            </div>
                            <p className="text-xs text-secondary-foreground mt-2">Students will be auto-submitted when time runs out.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-background p-4 rounded-xl border border-border">
                                <label className="block text-sm font-bold text-secondary-foreground mb-2">Available From</label>
                                <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl p-3 focus:border-primary outline-none [color-scheme:dark]" />
                                <p className="text-xs text-secondary-foreground mt-2">Quiz hidden until this date/time.</p>
                            </div>
                            <div className="bg-background p-4 rounded-xl border border-border">
                                <label className="block text-sm font-bold text-secondary-foreground mb-2">Closes At</label>
                                <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl p-3 focus:border-primary outline-none [color-scheme:dark]" />
                                <p className="text-xs text-secondary-foreground mt-2">Students cannot attempt after this time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Summary card before entering builder */}
                    <div className="bg-surface border border-border rounded-2xl p-5 space-y-2 text-sm">
                        <p className="font-bold text-foreground mb-3">Quiz Summary</p>
                        <div className="flex justify-between"><span className="text-secondary-foreground">Title</span><span className="font-bold">{title}</span></div>
                        <div className="flex justify-between"><span className="text-secondary-foreground">Method</span><span className="font-bold capitalize">{method}</span></div>
                        <div className="flex justify-between"><span className="text-secondary-foreground">Type</span><span className="font-bold capitalize">{quizType}</span></div>
                        <div className="flex justify-between"><span className="text-secondary-foreground">Questions</span><span className="font-bold">{getTotalCount()}</span></div>
                        {timeLimitMinutes && <div className="flex justify-between"><span className="text-secondary-foreground">Time Limit</span><span className="font-bold">{timeLimitMinutes} min</span></div>}
                    </div>

                    {method === 'ai' ? (
                        <div className="space-y-4">
                            <div className="bg-surface p-5 rounded-2xl border border-border space-y-3">
                                <label className="block text-sm font-bold text-secondary-foreground flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400" /> Paste Source Material for AI</label>
                                <textarea value={aiMaterial} onChange={e => setAiMaterial(e.target.value)}
                                    placeholder="Paste your topic, notes, textbook excerpt, or article..."
                                    rows={6} className="w-full bg-background border border-border rounded-xl p-3 resize-none focus:border-primary outline-none text-sm" />
                            </div>
                            <button onClick={handleGenerateAI} disabled={generatingAI}
                                className="w-full bg-purple-600 text-white py-3.5 rounded-xl font-bold hover:bg-purple-500 flex items-center justify-center gap-2 disabled:opacity-50">
                                {generatingAI ? 'Generating...' : <><Wand2 className="w-5 h-5" /> Generate Questions with AI</>}
                            </button>
                        </div>
                    ) : (
                        <button onClick={enterManualBuilder}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-primary/90 flex items-center justify-center gap-2">
                            <PenTool className="w-5 h-5" /> Start Entering Questions
                        </button>
                    )}
                </div>
            )}

            {/* ===== STEP 4: BUILDER / REVIEW ===== */}
            {step === 4 && (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold">Review & Edit Questions</h2>
                            <p className="text-sm text-secondary-foreground">{questions.length} question{questions.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex gap-2">
                            {['MCQ', 'SHORT', 'LONG'].map(t => (
                                <button key={t} onClick={() => addQuestion(t)}
                                    className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bold text-secondary-foreground hover:text-foreground hover:border-primary/50 transition-colors flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5" /> {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {questions.length === 0 && (
                        <div className="text-center py-12 bg-surface rounded-2xl border border-dashed border-border text-secondary-foreground">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                            No questions added yet.
                        </div>
                    )}

                    {questions.map((q, qIdx) => (
                        <div key={q.id} className="bg-surface rounded-2xl border border-border overflow-hidden">
                            <div className={`h-1 w-full ${q.type === 'MCQ' ? 'bg-blue-500' : q.type === 'SHORT' ? 'bg-green-500' : 'bg-orange-500'}`} />
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">{qIdx + 1}</span>
                                        <select value={q.type} onChange={e => updateQuestion(qIdx, 'type', e.target.value)}
                                            className="bg-background border border-border rounded-lg px-2 py-1 text-xs text-secondary-foreground focus:border-primary outline-none">
                                            <option value="MCQ">MCQ</option>
                                            <option value="SHORT">Short Answer</option>
                                            <option value="LONG">Long Answer</option>
                                        </select>
                                        <span className="flex items-center gap-1 text-xs text-secondary-foreground">
                                            <span className="font-bold text-foreground">Pts:</span>
                                            <input type="number" value={q.points} onChange={e => updateQuestion(qIdx, 'points', parseInt(e.target.value) || 1)}
                                                className="w-12 bg-background border border-border rounded p-1 text-xs text-center focus:border-primary outline-none" />
                                        </span>
                                    </div>
                                    <button onClick={() => removeQuestion(qIdx)} className="p-1.5 text-secondary-foreground hover:text-red-500 bg-background rounded-lg border border-border">
                                        <Trash className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <input type="text" value={q.text} onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                                    placeholder="Enter question text..."
                                    className="w-full bg-background border border-border rounded-xl p-3 mb-4 focus:border-primary outline-none" />

                                {q.type === 'MCQ' ? (
                                    <div className="space-y-2">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQuestion(qIdx, 'correctOptionIndex', oIdx)}
                                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${q.correctOptionIndex === oIdx ? 'border-green-500 bg-green-500' : 'border-border'}`}>
                                                    {q.correctOptionIndex === oIdx && <Check className="w-3 h-3 text-white" />}
                                                </button>
                                                <input type="text" value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                    className="flex-1 bg-background border border-border rounded-lg p-2 text-sm focus:border-primary outline-none" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed border-border rounded-xl bg-background text-secondary-foreground text-sm flex items-center justify-center h-16">
                                        Student will type a {q.type === 'SHORT' ? 'short' : 'long'} text answer.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Fixed Bottom Bar */}
            {step === 4 && (
                <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 flex justify-between items-center z-50">
                    <p className="text-secondary-foreground text-sm">{questions.length} questions · {questions.reduce((acc, q) => acc + (q.points || 0), 0)} total pts</p>
                    <button onClick={handleSave} disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 flex items-center gap-2">
                        {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Publish Quiz</>}
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizBuilder;
