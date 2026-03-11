import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Send, Timer, HelpCircle, ShieldAlert, BookOpen, User } from 'lucide-react';
import SEO from '../components/SEO';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizAttempt = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizId } = location.state || {};

    const [quiz, setQuiz] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    // Anti-cheat strike tracking (silent, never shown to student)
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [copyAttemptCount, setCopyAttemptCount] = useState(0);
    const [strikes, setStrikes] = useState(0);
    const strikeRef = useRef({ tabSwitch: 0, copy: 0, total: 0 });

    // Timer state (countdown in seconds)
    const [timeLeft, setTimeLeft] = useState(null);
    const timerRef = useRef(null);
    const autoSubmitRef = useRef(false);

    // Fullscreen state
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [exitAttempts, setExitAttempts] = useState(0);
    const [showExitWarning, setShowExitWarning] = useState(false);
    const containerRef = useRef(null);
    const quizStarted = useRef(false);

    useEffect(() => {
        if (!quizId) {
            navigate('/student/dashboard');
            return;
        }

        const fetchQuizAndAttempt = async () => {
            try {
                const token = localStorage.getItem('token');

                try {
                    const attemptRes = await axios.get(`https://inkless-backend.vercel.app/api/quizzes/attempt/${quizId}`, {
                        headers: { 'x-auth-token': token }
                    });
                    if (attemptRes.data) {
                        setResult(attemptRes.data);
                        setLoading(false);
                        const quizRes = await axios.get(`https://inkless-backend.vercel.app/api/quizzes/${quizId}`, {
                            headers: { 'x-auth-token': token }
                        });
                        setQuiz(quizRes.data);
                        return;
                    }
                } catch (err) {
                    if (err.response && err.response.status !== 404) {
                        console.error("Error checking attempt", err);
                    }
                }

                const res = await axios.get(`https://inkless-backend.vercel.app/api/quizzes/${quizId}`, {
                    headers: { 'x-auth-token': token }
                });
                setQuiz(res.data);

                // Set timer if quiz has a time limit
                if (res.data.timeLimitMinutes) {
                    setTimeLeft(res.data.timeLimitMinutes * 60);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching quiz", err);
                setLoading(false);
            }
        };

        fetchQuizAndAttempt();
    }, [quizId, navigate]);

    const handleSubmit = useCallback(async (auto = false) => {
        if (!auto && !window.confirm("Are you sure you want to submit?")) return;
        if (autoSubmitRef.current) return; // Prevent double submit
        autoSubmitRef.current = true;

        if (timerRef.current) clearInterval(timerRef.current);
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const formattedAnswers = Object.keys(answers).map(key => ({
                questionIndex: parseInt(key),
                ...answers[key]
            }));

            const res = await axios.post('https://inkless-backend.vercel.app/api/quizzes/attempt', {
                quizId,
                answers: formattedAnswers,
                strikes: strikeRef.current.total,
                tabSwitchCount: strikeRef.current.tabSwitch,
                copyAttemptCount: strikeRef.current.copy
            }, {
                headers: { 'x-auth-token': token }
            });

            setResult(res.data);

            // Exit fullscreen on submit
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }
        } catch (err) {
            console.error("Error submitting quiz", err);
            alert("Failed to submit quiz.");
            autoSubmitRef.current = false;
        } finally {
            setSubmitting(false);
        }
    }, [answers, quizId]);

    // Anti-cheat event listeners — only active while quiz is in progress (fullscreen)
    useEffect(() => {
        if (!isFullscreen || result) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                strikeRef.current.tabSwitch += 1;
                strikeRef.current.total += 1;
                setTabSwitchCount(strikeRef.current.tabSwitch);
                setStrikes(strikeRef.current.total);
            }
        };

        const handleCopy = (e) => {
            e.preventDefault();
            strikeRef.current.copy += 1;
            strikeRef.current.total += 1;
            setCopyAttemptCount(strikeRef.current.copy);
            setStrikes(strikeRef.current.total);
        };

        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            // Block Ctrl+C, Ctrl+V, Ctrl+A, PrintScreen
            if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'a', 'p'].includes(e.key.toLowerCase())) {
                e.preventDefault();
                if (e.key.toLowerCase() === 'c') {
                    strikeRef.current.copy += 1;
                    strikeRef.current.total += 1;
                    setCopyAttemptCount(strikeRef.current.copy);
                    setStrikes(strikeRef.current.total);
                }
            }
            if (e.key === 'PrintScreen') {
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen, result]);
    useEffect(() => {
        if (timeLeft === null || result || !quizStarted.current) return;

        if (timeLeft <= 0) {
            handleSubmit(true);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    handleSubmit(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerRef.current);
    }, [timeLeft, result, handleSubmit]);

    // Fullscreen management
    const enterFullscreen = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen().then(() => {
                setIsFullscreen(true);
                quizStarted.current = true;
                // start timer after entering fullscreen
                if (quiz?.timeLimitMinutes && timeLeft !== null) {
                    // trigger timer re-run
                    setTimeLeft(t => t);
                }
            }).catch(err => {
                console.warn('Fullscreen failed', err);
                setIsFullscreen(true);
                quizStarted.current = true;
            });
        } else {
            setIsFullscreen(true);
            quizStarted.current = true;
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && isFullscreen && !result) {
                // User exited fullscreen
                setExitAttempts(prev => prev + 1);
                setShowExitWarning(true);
                // Re-enter fullscreen after short delay
                setTimeout(() => {
                    if (!result && !autoSubmitRef.current) {
                        document.documentElement.requestFullscreen?.();
                    }
                }, 1000);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [isFullscreen, result]);

    // Format seconds to MM:SS
    const formatTime = (secs) => {
        if (secs === null) return null;
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const isExpired = quiz?.endTime && new Date(quiz.endTime) < new Date();
    const isNotStarted = quiz?.startTime && new Date(quiz.startTime) > new Date();

    const handleSelectOption = (optionIndex) => {
        setAnswers({ ...answers, [currentQuestion]: { selectedOptionIndex: optionIndex } });
    };

    const handleTextAnswer = (text) => {
        setAnswers({ ...answers, [currentQuestion]: { textAnswer: text } });
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground text-lg">Loading Quiz...</div>;
    if (!quiz) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground text-lg">Quiz not found.</div>;

    // ---- RESULT SCREEN ----
    if (result) {
        const pct = quiz?.questions?.length > 0 ? Math.round((result.score / result.totalPoints) * 100) : 0;
        const pctColor = pct >= 70 ? 'from-green-400 to-emerald-500' : pct >= 40 ? 'from-orange-400 to-amber-500' : 'from-red-400 to-rose-500';

        return (
            <div className="min-h-screen bg-background p-4 md:p-8">
                <SEO title={quiz?.title ? `Attempting ${quiz.title}` : 'Quiz Attempt'} description="Take your quiz, submit answers, and receive instant feedback on MCQs." />
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Score Card */}
                    <div className={`bg-gradient-to-br ${pct >= 70 ? 'from-green-500/10 to-emerald-500/10 border-green-500/20' : pct >= 40 ? 'from-orange-500/10 to-amber-500/10 border-orange-500/20' : 'from-red-500/10 to-rose-500/10 border-red-500/20'} border rounded-3xl p-8 text-center mb-8 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]" />
                        <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-3" />
                        <h1 className="text-3xl font-black text-white mb-1">Quiz Complete!</h1>
                        <div className={`text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r ${pctColor} my-3`}>{pct}%</div>
                        <p className="text-secondary-foreground">
                            Score: <span className="text-white font-bold">{result.score}</span> / {result.totalPoints} points
                        </p>
                    </div>

                    {/* Per-Question Review */}
                    <h2 className="text-lg font-bold text-white mb-4">Answer Review</h2>
                    <div className="space-y-4 mb-8">
                        {quiz.questions.map((question, idx) => {
                            const studentAnswer = result.answers?.find(a => a.questionIndex === idx);
                            const isMCQ = !question.type || question.type === 'MCQ';
                            const isCorrect = isMCQ
                                ? studentAnswer?.selectedOptionIndex === question.correctOptionIndex
                                : null; // Can't auto-evaluate text; show AI feedback instead

                            return (
                                <div key={idx} className={`rounded-2xl border overflow-hidden ${isMCQ ? (isCorrect ? 'border-green-500/40' : 'border-red-500/40') : 'border-border'}`}>
                                    {/* Question header */}
                                    <div className={`flex items-center gap-3 px-5 py-3 border-b ${isMCQ ? (isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20') : 'bg-surface border-border'}`}>
                                        {isMCQ ? (
                                            isCorrect
                                                ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                                                : <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                                        ) : (
                                            <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                                        )}
                                        <span className="text-xs font-bold text-secondary-foreground uppercase tracking-wider">Q{idx + 1}</span>
                                        {isMCQ && question.points && (
                                            <span className={`ml-auto text-xs font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                                {isCorrect ? `+${question.points}` : '0'} pts
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-5 bg-surface space-y-4">
                                        <p className="font-semibold text-white">{question.questionText}</p>

                                        {isMCQ ? (
                                            <div className="space-y-2">
                                                {question.options.map((opt, oIdx) => {
                                                    const isStudentChoice = studentAnswer?.selectedOptionIndex === oIdx;
                                                    const isCorrectOption = question.correctOptionIndex === oIdx;
                                                    let cls = 'border-border bg-background text-secondary-foreground';
                                                    if (isCorrectOption) cls = 'border-green-500 bg-green-500/10 text-green-300';
                                                    else if (isStudentChoice && !isCorrectOption) cls = 'border-red-500 bg-red-500/10 text-red-300';

                                                    return (
                                                        <div key={oIdx} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${cls}`}>
                                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${isCorrectOption ? 'border-green-500 bg-green-500 text-white' : isStudentChoice ? 'border-red-500 bg-red-500 text-white' : 'border-border text-secondary-foreground'}`}>
                                                                {String.fromCharCode(65 + oIdx)}
                                                            </div>
                                                            <span className="text-sm flex-1">{opt.text}</span>
                                                            {isCorrectOption && <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />}
                                                            {isStudentChoice && !isCorrectOption && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                                                            {isStudentChoice && <span className="text-xs text-secondary-foreground ml-1">(Your answer)</span>}
                                                        </div>
                                                    );
                                                })}
                                                {!studentAnswer && (
                                                    <p className="text-xs text-secondary-foreground italic">Not answered</p>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {studentAnswer?.textAnswer ? (
                                                    <div className="bg-background border border-border rounded-xl p-4 text-sm text-foreground">
                                                        <p className="text-xs text-secondary-foreground mb-2 font-bold uppercase">Your Answer</p>
                                                        {studentAnswer.textAnswer}
                                                        <div className="mt-2 space-y-2">
                                                            {result.resultsShared ? (
                                                                studentAnswer.aiFeedback && (
                                                                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-sm italic text-primary">
                                                                        <span className="font-bold not-italic">Teacher/AI Feedback:</span> {studentAnswer.aiFeedback}
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <p className="text-xs font-medium text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg border border-orange-400/20 w-fit">
                                                                    Detailed results pending teacher review
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-secondary-foreground italic">Not answered</p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button onClick={() => navigate(-1)} className="w-full sm:w-auto mx-auto block bg-primary text-white px-10 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                        Back to Class
                    </button>
                </div>
            </div>
        );
    }

    // ---- QUIZ GATE SCREEN (not started / expired / fullscreen entry) ----
    if (!isFullscreen) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-lg w-full bg-surface border border-border rounded-3xl p-10 text-center">
                    {isExpired ? (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">Quiz Closed</h1>
                            <p className="text-secondary-foreground">The deadline for this quiz has passed. You can no longer attempt it.</p>
                            <button onClick={() => navigate(-1)} className="mt-6 bg-surface border border-border text-foreground px-8 py-2.5 rounded-xl font-bold hover:bg-muted/20">Go Back</button>
                        </>
                    ) : isNotStarted ? (
                        <>
                            <Clock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-white mb-2">Not Available Yet</h1>
                            <p className="text-secondary-foreground mb-2">This quiz opens on:</p>
                            <p className="text-lg font-bold text-white">{new Date(quiz.startTime).toLocaleString()}</p>
                            <button onClick={() => navigate(-1)} className="mt-6 bg-surface border border-border text-foreground px-8 py-2.5 rounded-xl font-bold hover:bg-muted/20">Go Back</button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Maximize2 className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
                            <p className="text-secondary-foreground mb-6">{quiz.description || 'Ready to begin your quiz?'}</p>

                            <div className="grid grid-cols-2 gap-3 mb-8 text-sm">
                                <div className="bg-background p-4 rounded-xl border border-border">
                                    <p className="text-secondary-foreground">Questions</p>
                                    <p className="text-xl font-bold text-white mt-1">{quiz.questions.length}</p>
                                </div>
                                <div className="bg-background p-4 rounded-xl border border-border">
                                    <p className="text-secondary-foreground">Time Limit</p>
                                    <p className="text-xl font-bold text-white mt-1">
                                        {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : 'Unlimited'}
                                    </p>
                                </div>
                                {quiz.endTime && (
                                    <div className="col-span-2 bg-background p-4 rounded-xl border border-border">
                                        <p className="text-secondary-foreground">Closes At</p>
                                        <p className="font-bold text-white mt-1">{new Date(quiz.endTime).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6 text-left">
                                <p className="text-orange-400 font-bold flex items-center gap-2 mb-1"><AlertTriangle className="w-4 h-4" /> Fullscreen Mode Required</p>
                                <p className="text-secondary-foreground text-sm">The quiz will enter fullscreen. Leaving will be recorded. The quiz will auto-submit when time runs out.</p>
                            </div>

                            <button
                                onClick={enterFullscreen}
                                className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                            >
                                Start Quiz
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ---- ACTUAL QUIZ SCREEN (fullscreen) ----
    const question = quiz.questions[currentQuestion];
    const totalQuestions = quiz.questions.length;
    const isWarning = timeLeft !== null && timeLeft <= 60;

    return (
        <div ref={containerRef} className="h-screen bg-background flex flex-col text-foreground select-none">
            {/* Exit Warning Banner */}
            {showExitWarning && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900 border border-red-500 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-xl animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="font-bold">Warning: Fullscreen exit detected! ({exitAttempts}x)</span>
                    <button onClick={() => setShowExitWarning(false)} className="ml-2 text-red-400 hover:text-white">✕</button>
                </div>
            )}

            {/* Header */}
            <div className="px-6 py-4 bg-surface border-b border-border flex justify-between items-center shrink-0">
                <div>
                    <h1 className="font-bold text-lg line-clamp-1">{quiz.title}</h1>
                    <p className="text-xs text-secondary-foreground">{totalQuestions} Questions</p>
                </div>

                {timeLeft !== null && (
                    <div className={`flex items-center gap-2 font-mono font-black text-xl px-5 py-2 rounded-xl transition-colors ${isWarning ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-surface border border-border text-foreground'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-border">
                <div
                    className="h-1 bg-primary transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Question Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{currentQuestion + 1}</span>
                                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                    {question.type === 'MCQ' ? 'Multiple Choice' : question.type === 'SHORT' ? 'Short Answer' : 'Long Answer'}
                                    {question.points && <span className="ml-2 text-secondary-foreground normal-case font-normal">({question.points} pts)</span>}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold leading-relaxed pl-11">{question.questionText}</h2>
                        </div>

                        <div className="space-y-4 pl-11">
                            {(!question.type || question.type === 'MCQ') ? (
                                question.options.map((opt, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${answers[currentQuestion]?.selectedOptionIndex === idx
                                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                                            : 'border-border bg-surface hover:bg-surface/80 hover:border-primary/50'
                                            }`}
                                    >
                                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-bold transition-colors shrink-0 ${answers[currentQuestion]?.selectedOptionIndex === idx ? 'border-primary bg-primary text-white' : 'border-border text-secondary-foreground'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-lg">{opt.text}</span>
                                    </div>
                                ))
                            ) : (
                                <textarea
                                    value={answers[currentQuestion]?.textAnswer || ''}
                                    onChange={(e) => handleTextAnswer(e.target.value)}
                                    placeholder={`Enter your ${question.type === 'SHORT' ? 'short' : 'detailed'} answer here...`}
                                    className="w-full h-48 p-4 bg-surface border border-border rounded-2xl text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-foreground"
                                />
                            )}
                        </div>

                        <div className="mt-12 pl-11 flex justify-between">
                            <button
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-surface text-secondary-foreground disabled:opacity-30 transition-colors"
                                disabled={currentQuestion === 0}
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>

                            {currentQuestion < totalQuestions - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.min(totalQuestions - 1, prev + 1))}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSubmit(false)}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                                >
                                    {submitting ? 'Submitting...' : <><CheckCircle className="w-4 h-4" /> Submit Quiz</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Navigator */}
                <div className="w-72 bg-surface border-l border-border p-6 hidden lg:flex flex-col overflow-y-auto">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider text-secondary-foreground">
                        <HelpCircle className="w-4 h-4" /> Navigator
                    </h3>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                        {Array.from({ length: totalQuestions }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentQuestion(i)}
                                className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-colors ${i === currentQuestion
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : answers[i] !== undefined
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : 'bg-background hover:bg-border border border-border text-secondary-foreground'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2 text-xs mt-2 mb-6">
                        {[['bg-primary', 'Current'], ['bg-green-500/20 border border-green-500/30', 'Answered'], ['bg-background border border-border', 'Unanswered']].map(([cls, label]) => (
                            <div key={label} className="flex items-center gap-2 text-secondary-foreground">
                                <div className={`w-4 h-4 rounded ${cls}`} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <div className="bg-background rounded-xl p-4 border border-border mb-4 text-sm">
                            <p className="text-secondary-foreground">Answered</p>
                            <p className="text-2xl font-black text-white">{Object.keys(answers).length} / {totalQuestions}</p>
                        </div>
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
                        >
                            {submitting ? 'Submitting...' : '✓ Submit Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;
