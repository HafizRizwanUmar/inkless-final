import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

const SubmissionList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('student');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                // Decode token to find role
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decoded = JSON.parse(decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
                const userRole = decoded.user.role;
                setRole(userRole);

                const endpoint = userRole === 'teacher'
                    ? 'https://inkless-backend.vercel.app/api/submissions/teacher/pending'
                    : 'https://inkless-backend.vercel.app/api/submissions/student/pending';

                const res = await axios.get(endpoint, {
                    headers: { 'x-auth-token': token }
                });

                setTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    if (loading) return <div className="p-8 text-center text-secondary-foreground">Loading tasks...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        {role === 'teacher' ? 'To Review' : 'To-Do List'}
                    </h1>
                    <p className="text-secondary-foreground">
                        {role === 'teacher' ? 'Submissions waiting for your grade.' : 'Upcoming assignments you need to complete.'}
                    </p>
                </div>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                {tasks.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <CheckSquare className="w-16 h-16 text-green-500 mb-4 opacity-50" />
                        <h3 className="text-xl font-bold">All caught up!</h3>
                        <p className="text-secondary-foreground">You have no tasks pending at the moment.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {tasks.map(task => (
                            <div key={task._id} className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-muted/30 transition-colors">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg text-foreground">
                                            {role === 'teacher' ? task.assignment?.title : task.title}
                                        </h3>
                                        {role === 'teacher' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Needs Grading</span>}
                                        {role === 'student' && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">Pending</span>}
                                    </div>
                                    <p className="text-sm text-secondary-foreground">
                                        {role === 'teacher' ? `Student: ${task.student?.name}` : `Points: ${task.marks || 0}`}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs font-medium pt-2">
                                        <span className="flex items-center gap-1 text-primary">
                                            <AlertCircle className="w-4 h-4" />
                                            {role === 'teacher' ? `Submitted: ${new Date(task.submittedAt).toLocaleString()}` : `Due: ${new Date(task.deadline).toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => role === 'teacher'
                                        ? navigate('/grading', { state: { submissionId: task._id } })
                                        : navigate('/assignment-details', { state: { assignmentId: task._id } })
                                    }
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap"
                                >
                                    {role === 'teacher' ? 'Grade Now' : 'Start Task'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmissionList;
