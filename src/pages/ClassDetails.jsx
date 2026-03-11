import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { FileText, Users, BarChart2, Settings, PenTool, Plus, PlayCircle, Code, ChevronRight, Clock, Archive, HelpCircle, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ClassDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = useParams();

    // Redirect if no classId found in URL
    useEffect(() => {
        if (!classId) {
            console.error("No classId provided in URL params");
            navigate('/');
        }
    }, [classId, navigate]);

    const [activeTab, setActiveTab] = useState('Overview');
    const [classData, setClassData] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [labTasks, setLabTasks] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const tabs = [
        { id: 'Overview', icon: FileText },
        { id: 'Assignments', icon: FileText },
        { id: 'Lab Tasks', icon: Code },
        { id: 'Quizzes', icon: PenTool },
        { id: 'Students', icon: Users },
        { id: 'Analytics', icon: BarChart2 },
    ];

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const res = await axios.get(`${API_BASE_URL}/api/classes/${classId}`, {
                    headers: { 'x-auth-token': token }
                });

                if (!res.data) {
                    throw new Error("Class not found");
                }

                setClassData(res.data);

                // Decode token safely
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                    const decoded = JSON.parse(jsonPayload);
                    setCurrentUser(decoded.user);
                } catch (decodeErr) {
                    console.error("Error decoding token:", decodeErr);
                }
            } catch (err) {
                console.error("Error fetching class data:", err);
                if (err.response?.status === 404) {
                    alert("Class not found.");
                    navigate(-1);
                }
            }
        };
        if (classId) fetchClassData();
    }, [classId, navigate]);

    const [analyticsData, setAnalyticsData] = useState(null);

    // Fetch tab data on switch
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!classId || !token) return;
        const hdrs = { headers: { 'x-auth-token': token } };

        if (activeTab === 'Quizzes') axios.get(`${API_BASE_URL}/api/quizzes/class/${classId}`, hdrs).then(res => setQuizzes(res.data)).catch(console.error);
        if (activeTab === 'Assignments') axios.get(`${API_BASE_URL}/api/assignments/class/${classId}`, hdrs).then(res => setAssignments(res.data)).catch(console.error);
        if (activeTab === 'Lab Tasks') axios.get(`${API_BASE_URL}/api/lab-tasks/class/${classId}`, hdrs).then(res => setLabTasks(res.data)).catch(console.error);
        if (activeTab === 'Analytics') axios.get(`${API_BASE_URL}/api/classes/${classId}/analytics`, hdrs).then(res => setAnalyticsData(res.data)).catch(console.error);
    }, [activeTab, classId]);

    if (!classData || !currentUser) return <div className="flex h-screen items-center justify-center text-secondary-foreground">Loading...</div>;

    const isTeacher = classData && currentUser && (
        (typeof classData.owner === 'object' ? classData.owner._id === currentUser.id : classData.owner === currentUser.id) ||
        (classData.teachers && classData.teachers.some(t => typeof t === 'object' ? t._id === currentUser.id : t === currentUser.id))
    );

    const handleArchive = async () => {
        const confirm = window.confirm("Are you sure you want to archive this class?");
        if (!confirm) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${API_BASE_URL}/api/classes/${classId}/archive`, {}, {
                headers: { 'x-auth-token': token }
            });
            navigate('/teacher/dashboard');
        } catch (err) {
            console.error("Failed to archive", err);
            alert("Failed to archive class.");
        }
    };

    return (
        <div className="min-h-screen bg-background pb-12">
            <SEO
                title={classData?.title || 'Class Details'}
                description={`Class details, assignments, quizzes, and analytics for ${classData?.title || 'your classroom'}.`}
            />
            {/* Professional Header */}
            <div className="relative overflow-hidden bg-black text-white shadow-xl h-64">
                <img
                    src="/banners/classroom_banner.png"
                    alt="Class Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 h-full">
                    <div className="mt-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md"
                        >
                            {classData.title}
                        </motion.h1>
                        <p className="text-brand-cream text-lg md:text-xl font-medium flex items-center gap-2 drop-shadow-sm">
                            {classData.subject} <span className="text-brand-light">•</span> {classData.section}
                        </p>
                        <p className="text-brand-light text-sm mt-1 font-mono uppercase tracking-wider opacity-90">Room: {classData.room} | Code: {classData.code}</p>
                    </div>

                    <div className="flex gap-2 mb-auto md:mb-0">
                        {isTeacher && (
                            <button onClick={handleArchive} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full backdrop-blur-sm transition-all" title="Archive Class">
                                <Archive className="w-6 h-6 text-white" />
                            </button>
                        )}
                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all">
                            <Settings className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sticky Tabs Navigation */}
            <div className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border shadow-sm">
                <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
                    <div className="flex space-x-8 min-w-max">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 flex items-center space-x-2 font-medium text-sm transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-secondary-foreground hover:text-foreground'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
                                <span>{tab.id}</span>
                                {activeTab === tab.id && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="min-h-[400px]"
                    >
                        {activeTab === 'Overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                                        <h3 className="text-xl font-bold mb-4 text-foreground">About this Class</h3>
                                        <p className="text-secondary-foreground leading-relaxed text-lg">
                                            {classData.description || "Welcome to the class! Check here for updates, assignments, and resources."}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                                        <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-brand-cream text-brand-muted rounded-lg"><Users size={20} /></div>
                                                <span className="font-medium">Students</span>
                                            </div>
                                            <span className="text-xl font-bold">{classData.students?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Lab Tasks' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">Lab Tasks</h3>
                                        <p className="text-secondary-foreground">Hands-on coding challenges</p>
                                    </div>
                                    {isTeacher && (
                                        <button
                                            onClick={() => navigate(`/create-lab-task/${classId}`)}
                                            className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                        >
                                            <Plus className="w-5 h-5" /> New Lab
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {labTasks.length === 0 ? (
                                        <EmptyState icon={Code} text="No lab tasks posted yet." />
                                    ) : (
                                        labTasks.map(lab => (
                                            <div key={lab._id} className="group bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                                onClick={() => navigate(`/lab-task-details/${lab._id}`)}>
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ChevronRight className="text-primary w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2">{lab.title}</h4>
                                                        <div className="flex flex-wrap gap-4 text-sm text-secondary-foreground">
                                                            <span className="flex items-center gap-1.5"><Clock size={14} /> Due: {new Date(lab.deadline).toLocaleString()}</span>
                                                            <span className="flex items-center gap-1.5"><Code size={14} /> {lab.questions.length} Questions</span>
                                                        </div>
                                                    </div>
                                                    <div className="shrink-0 text-right">
                                                        <span className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-lg text-sm">
                                                            {lab.totalMarks} Marks
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Assignments' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">Assignments</h3>
                                        <p className="text-secondary-foreground">Homework and Projects</p>
                                    </div>
                                    {isTeacher && (
                                        <button
                                            onClick={() => navigate(`/create-assignment/${classId}`)}
                                            className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                        >
                                            <Plus className="w-5 h-5" /> New Assignment
                                        </button>
                                    )}
                                </div>
                                <div className="grid gap-4">
                                    {assignments.length === 0 ? (
                                        <EmptyState icon={FileText} text="No assignments yet." />
                                    ) : (
                                        assignments.map(assign => (
                                            <div key={assign._id} onClick={() => navigate(`/assignment-details/${assign._id}`)}
                                                className="bg-surface p-6 rounded-2xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex justify-between items-center group">
                                                <div>
                                                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{assign.title}</h4>
                                                    <p className="text-sm text-secondary-foreground mt-1">Due: {new Date(assign.deadline).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    {assign.marks && <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-lg text-sm font-medium">{assign.marks} Pts</span>}
                                                    <ChevronRight className="w-5 h-5 text-border group-hover:text-primary transition-colors" />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Quizzes' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">Quizzes</h3>
                                        <p className="text-secondary-foreground">Assessments and Tests</p>
                                    </div>
                                    {isTeacher && (
                                        <button
                                            onClick={() => navigate('/quiz-builder', { state: { classId } })}
                                            className="w-full sm:w-auto bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                        >
                                            <Plus className="w-5 h-5" /> New Quiz
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {quizzes.length === 0 ? (
                                        <div className="col-span-2"><EmptyState icon={PenTool} text="No quizzes available." /></div>
                                    ) : (
                                        quizzes.map(quiz => {
                                            const now = new Date();
                                            const isExpired = quiz.endTime && new Date(quiz.endTime) < now;
                                            const isNotStarted = quiz.startTime && new Date(quiz.startTime) > now;
                                            const isActive = !isExpired && !isNotStarted;

                                            return (
                                                <div key={quiz._id} className="group bg-surface rounded-2xl border border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all overflow-hidden flex flex-col">
                                                    {/* Colored Top Bar */}
                                                    <div className={`h-1.5 w-full ${isExpired ? 'bg-red-500' : isNotStarted ? 'bg-orange-500' : 'bg-gradient-to-r from-primary to-brand-accent'}`} />

                                                    <div className="p-6 flex flex-col flex-1">
                                                        {/* Header row */}
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div className="flex-1 mr-3">
                                                                <h4 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">{quiz.title}</h4>
                                                                <p className="text-sm text-secondary-foreground line-clamp-2 mt-1">{quiz.description || 'No description provided.'}</p>
                                                            </div>
                                                            {/* Status badge */}
                                                            <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${isExpired ? 'bg-red-500/15 text-red-400' : isNotStarted ? 'bg-orange-500/15 text-orange-400' : 'bg-green-500/15 text-green-400'}`}>
                                                                {isExpired ? 'Closed' : isNotStarted ? 'Upcoming' : 'Open'}
                                                            </span>
                                                        </div>

                                                        {/* Meta info: questions, time limit */}
                                                        <div className="flex flex-wrap gap-2 mt-auto mb-4">
                                                            <span className="flex items-center gap-1.5 text-xs font-mono bg-background border border-border px-2.5 py-1 rounded-full text-secondary-foreground">
                                                                <HelpCircle className="w-3.5 h-3.5" /> {quiz.questions.length} Qs
                                                            </span>
                                                            {quiz.timeLimitMinutes && (
                                                                <span className="flex items-center gap-1.5 text-xs font-mono bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full text-orange-400">
                                                                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitMinutes} min
                                                                </span>
                                                            )}
                                                            {quiz.endTime && (
                                                                <span className="flex items-center gap-1.5 text-xs bg-background border border-border px-2.5 py-1 rounded-full text-secondary-foreground">
                                                                    <Clock className="w-3.5 h-3.5" /> Due: {new Date(quiz.endTime).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Action button */}
                                                        {!isTeacher ? (
                                                            isExpired ? (
                                                                <button
                                                                    onClick={() => navigate(`/quiz-result/${quiz._id}`)}
                                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-background border border-border text-secondary-foreground text-sm font-bold hover:text-foreground transition-colors"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> View Result
                                                                </button>
                                                            ) : isNotStarted ? (
                                                                <div className="w-full text-center py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
                                                                    Opens {new Date(quiz.startTime).toLocaleString()}
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => navigate(`/quiz-attempt/${quiz._id}`)}
                                                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                                                                >
                                                                    <PlayCircle className="w-4 h-4" /> Attempt Quiz
                                                                </button>
                                                            )
                                                        ) : (
                                                            <button
                                                                onClick={() => navigate(`/quiz-analytics/${quiz._id}`)}
                                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-background border border-border text-secondary-foreground text-sm font-bold hover:text-foreground hover:border-primary/50 transition-colors"
                                                            >
                                                                View Analytics
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Students' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">Enrolled Students</h3>
                                        <p className="text-secondary-foreground">Class Roster</p>
                                    </div>
                                    <div className="bg-surface px-4 py-2 border border-border rounded-xl shadow-sm">
                                        <span className="font-bold text-foreground">{classData.students?.length || 0}</span> <span className="text-secondary-foreground text-sm">Students</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {!classData.students || classData.students.length === 0 ? (
                                        <div className="col-span-full"><EmptyState icon={Users} text="No students enrolled yet." /></div>
                                    ) : (
                                        classData.students.map(student => (
                                            <div key={student._id || student} className="bg-surface p-5 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/50 transition-colors">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                                    {student.name ? student.name.charAt(0).toUpperCase() : <Users size={20} />}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <h4 className="font-bold text-foreground truncate">{student.name || 'Unknown Student'}</h4>
                                                    <p className="text-xs text-secondary-foreground truncate">{student.email || 'No email provided'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === 'Analytics' && (
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-2xl font-bold">Class Analytics</h3>
                                        <p className="text-secondary-foreground">Overall performance and engagement</p>
                                    </div>
                                </div>
                                {!analyticsData ? (
                                    <div className="text-center py-10 text-secondary-foreground">Loading analytics...</div>
                                ) : (
                                    <>
                                        {isTeacher ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                                <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/50 transition-colors">
                                                    <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mb-4">
                                                        <Users size={24} />
                                                    </div>
                                                    <h4 className="text-3xl font-bold text-foreground mb-1">{analyticsData.totalStudents}</h4>
                                                    <p className="text-sm font-medium text-secondary-foreground">Total Students</p>
                                                </div>
                                                <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/50 transition-colors">
                                                    <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                                        <FileText size={24} />
                                                    </div>
                                                    <h4 className="text-3xl font-bold text-foreground mb-1">{analyticsData.assignments}</h4>
                                                    <p className="text-sm font-medium text-secondary-foreground">Assignments</p>
                                                </div>
                                                <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/50 transition-colors">
                                                    <div className="w-12 h-12 bg-brand-accent/10 text-brand-accent rounded-full flex items-center justify-center mb-4">
                                                        <PenTool size={24} />
                                                    </div>
                                                    <h4 className="text-3xl font-bold text-foreground mb-1">{analyticsData.quizzes}</h4>
                                                    <p className="text-sm font-medium text-secondary-foreground">Quizzes</p>
                                                </div>
                                                <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col items-center justify-center text-center shadow-sm hover:border-primary/50 transition-colors">
                                                    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-4">
                                                        <Code size={24} />
                                                    </div>
                                                    <h4 className="text-3xl font-bold text-foreground mb-1">{analyticsData.labTasks}</h4>
                                                    <p className="text-sm font-medium text-secondary-foreground">Lab Tasks</p>
                                                </div>
                                            </div>
                                        ) : (
                                            (() => {
                                                const myStats = analyticsData.studentStats?.find(s => s.id === currentUser.id);
                                                if (!myStats) return <div className="text-center py-8 text-secondary-foreground">No personal analytics available yet.</div>;

                                                const totalEarned = myStats.earnedAssigMarks + myStats.earnedQuizMarks + myStats.earnedLabMarks;

                                                return (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                        <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
                                                            <h4 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-primary" /> My Performance Overview</h4>

                                                            <div className="space-y-6">
                                                                <div>
                                                                    <div className="flex justify-between text-sm mb-2">
                                                                        <span className="font-medium text-secondary-foreground">Assignments Completed</span>
                                                                        <span className="font-bold">{myStats.completedAssignments} / {analyticsData.assignments}</span>
                                                                    </div>
                                                                    <div className="w-full bg-background rounded-full h-2">
                                                                        <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${analyticsData.assignments > 0 ? (myStats.completedAssignments / analyticsData.assignments) * 100 : 0}%` }}></div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="flex justify-between text-sm mb-2">
                                                                        <span className="font-medium text-secondary-foreground">Quizzes Completed</span>
                                                                        <span className="font-bold">{myStats.completedQuizzes} / {analyticsData.quizzes}</span>
                                                                    </div>
                                                                    <div className="w-full bg-background rounded-full h-2">
                                                                        <div className="bg-brand-accent h-2 rounded-full" style={{ width: `${analyticsData.quizzes > 0 ? (myStats.completedQuizzes / analyticsData.quizzes) * 100 : 0}%` }}></div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="flex justify-between text-sm mb-2">
                                                                        <span className="font-medium text-secondary-foreground">Lab Tasks Completed</span>
                                                                        <span className="font-bold">{myStats.completedLabs} / {analyticsData.labTasks}</span>
                                                                    </div>
                                                                    <div className="w-full bg-background rounded-full h-2">
                                                                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${analyticsData.labTasks > 0 ? (myStats.completedLabs / analyticsData.labTasks) * 100 : 0}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gradient-to-br from-primary/10 to-brand-accent/10 p-8 rounded-2xl border border-primary/20 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                                                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                                                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl"></div>

                                                            <span className="px-3 py-1 bg-background rounded-full text-xs font-bold uppercase tracking-wider text-secondary-foreground mb-6 shadow-sm">Total Points Earned</span>
                                                            <h2 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand-muted mb-2 drop-shadow-sm">{totalEarned}</h2>
                                                            <p className="text-secondary-foreground font-medium mt-4">Keep up the great work, {currentUser.name}!</p>
                                                        </div>
                                                    </div>
                                                );
                                            })()
                                        )}

                                        {isTeacher && (
                                            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                                                {/* Per Student Stats Table */}
                                                <div className="p-6 border-b border-border bg-muted/20">
                                                    <h4 className="text-xl font-bold text-foreground">Student Performance</h4>
                                                    <p className="text-sm text-secondary-foreground mt-1">Completion rates and total points across all tasks.</p>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-left border-collapse">
                                                        <thead className="bg-background/80 text-xs uppercase text-secondary-foreground font-semibold">
                                                            <tr>
                                                                <th className="px-6 py-4 border-b border-border">Student</th>
                                                                <th className="px-6 py-4 border-b border-border text-center">Assignments</th>
                                                                <th className="px-6 py-4 border-b border-border text-center">Quizzes</th>
                                                                <th className="px-6 py-4 border-b border-border text-center">Lab Tasks</th>
                                                                <th className="px-6 py-4 border-b border-border text-center">Total Points</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-border/50">
                                                            {!analyticsData.studentStats || analyticsData.studentStats.length === 0 ? (
                                                                <tr>
                                                                    <td colSpan="5" className="px-6 py-8 text-center text-secondary-foreground italic">No student data available.</td>
                                                                </tr>
                                                            ) : (
                                                                analyticsData.studentStats.map((stat) => (
                                                                    <tr key={stat.id} className="hover:bg-muted/10 transition-colors">
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex flex-col">
                                                                                <span className="font-bold text-foreground">{stat.name}</span>
                                                                                <span className="text-xs text-secondary-foreground">{stat.email}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <div className="inline-flex items-center gap-1.5 bg-brand-accent/10 text-brand-accent px-2 py-1 rounded font-mono text-sm">
                                                                                {stat.completedAssignments} <span className="text-xs opacity-60">/ {analyticsData.assignments}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <div className="inline-flex items-center gap-1.5 bg-brand-accent/10 text-brand-accent px-2 py-1 rounded font-mono text-sm">
                                                                                {stat.completedQuizzes} <span className="text-xs opacity-60">/ {analyticsData.quizzes}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center">
                                                                            <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-1 rounded font-mono text-sm">
                                                                                {stat.completedLabs} <span className="text-xs opacity-60">/ {analyticsData.labTasks}</span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-center font-bold text-white">
                                                                            {stat.earnedAssigMarks + stat.earnedQuizMarks + stat.earnedLabMarks} pts
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const EmptyState = ({ icon: Icon, text }) => (
    <div className="text-center py-16 bg-surface/50 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center">
        <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
            <Icon className="w-8 h-8 text-secondary-foreground/50" />
        </div>
        <p className="text-secondary-foreground font-medium">{text}</p>
    </div>
);

export default ClassDetails;
