import API_BASE_URL from '../config';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, CheckCircle, XCircle } from 'lucide-react';

const Submissions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignmentId } = location.state || {};
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!assignmentId) return navigate(-1);

        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${API_BASE_URL}/api/submissions/assignment/${assignmentId}`, {
                    headers: { 'x-auth-token': token }
                });
                setSubmissions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [assignmentId, navigate]);

    if (loading) return <div className="p-8 text-center">Loading Submissions...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assignment
            </button>

            <h1 className="text-2xl font-bold mb-2">Student Submissions</h1>
            <p className="text-secondary-foreground mb-6">Total Submissions: {submissions.length}</p>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-background border-b border-border">
                        <tr>
                            <th className="p-4 font-semibold text-secondary-foreground">Student</th>
                            <th className="p-4 font-semibold text-secondary-foreground">Status</th>
                            <th className="p-4 font-semibold text-secondary-foreground">Submitted At</th>
                            <th className="p-4 font-semibold text-secondary-foreground">Marks</th>
                            <th className="p-4 font-semibold text-secondary-foreground text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {submissions.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-secondary-foreground">No submissions yet.</td>
                            </tr>
                        ) : (
                            submissions.map(sub => (
                                <tr key={sub._id} className="hover:bg-background/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-foreground">{sub.student.name || 'Unknown Student'}</p>
                                                <p className="text-xs text-secondary-foreground">{sub.student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {sub.status === 'graded' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                <CheckCircle size={12} /> Graded
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                                                <Clock size={12} /> Pending Review
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-sm text-secondary-foreground">
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </td>
                                    <td className="p-4 font-mono font-medium">
                                        {sub.obtainedMarks !== undefined ? (
                                            <span className="text-primary">{sub.obtainedMarks}</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => navigate('/grading', { state: { submissionId: sub._id } })}
                                            className="text-primary font-medium hover:underline text-sm"
                                        >
                                            Grade / View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function Clock({ size, className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );
}

export default Submissions;
