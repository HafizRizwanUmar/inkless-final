import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, FileText, CheckCircle, Clock } from 'lucide-react';
import SEO from '../components/SEO';

const AssignmentDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { assignmentId } = location.state || {};
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [files, setFiles] = useState({ image: null });
    const [textData, setTextData] = useState({ code: '', output: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!assignmentId) return navigate(-1);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                // Decode token for user info
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
                const user = JSON.parse(jsonPayload).user;
                setCurrentUser(user);

                // Fetch Assignment
                const resAssign = await axios.get(`https://inkless-backend.vercel.app/api/assignments/${assignmentId}`, {
                    headers: { 'x-auth-token': token }
                });
                setAssignment(resAssign.data);

                // Fetch My Submission (if exists)
                const resSub = await axios.get(`https://inkless-backend.vercel.app/api/submissions/my/${assignmentId}`, {
                    headers: { 'x-auth-token': token }
                });
                if (resSub.data) {
                    setSubmission(resSub.data);
                    setTextData({
                        code: resSub.data.codeContent || '',
                        output: resSub.data.outputContent || ''
                    });
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [assignmentId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('assignmentId', assignmentId);
            if (assignment.submissionTypes?.code) formData.append('codeContent', textData.code);
            if (assignment.submissionTypes?.output) formData.append('outputContent', textData.output);
            if (assignment.submissionTypes?.image && files.image) formData.append('image', files.image);

            const token = localStorage.getItem('token');
            const res = await axios.post('https://inkless-backend.vercel.app/api/submissions', formData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSubmission(res.data);
            alert('Assignment Submitted Successfully!');
        } catch (err) {
            console.error(err);
            alert('Error submitting assignment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !assignment) return <div className="p-8 text-center">Loading...</div>;

    // Check if user is the creator (Teacher) or a Student
    const isTeacher = assignment.createdBy === currentUser?.id;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <SEO title={assignment?.title || 'Assignment Details'} description={`View details and submit your work for ${assignment?.title || 'this assignment'}.`} />
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary-foreground hover:text-foreground"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            {/* Header */}
            <div className="bg-surface p-6 rounded-xl border border-border">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                        <p className="text-secondary-foreground whitespace-pre-wrap">{assignment.description}</p>
                    </div>
                    {isTeacher && (
                        <button
                            onClick={() => navigate('/submissions', { state: { assignmentId } })}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90"
                        >
                            View Submissions
                        </button>
                    )}
                </div>

                <div className="mt-6 flex gap-6 text-sm text-secondary-foreground border-t border-border pt-4">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Due: {assignment.deadline ? new Date(assignment.deadline).toLocaleString() : 'No Deadline'}</span>
                    <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Marks: {assignment.marks}</span>
                    {assignment.fileUrl && (
                        <a href={`https://inkless-backend.vercel.app${assignment.fileUrl}`} target="_blank" rel="noreferrer" className="text-brand-accent hover:underline flex items-center gap-1">
                            <Upload className="w-4 h-4" /> Attached File
                        </a>
                    )}
                </div>
            </div>

            {/* Teacher View: Minimal info here, they go to Submissions page */}
            {isTeacher ? (
                <div className="bg-brand-cream border border-brand-light p-6 rounded-xl text-brand-dark">
                    <h3 className="font-bold mb-2">Teacher View</h3>
                    <p>This is how the assignment looks to students. Use the "View Submissions" button to grade student work.</p>
                </div>
            ) : (
                /* Student Submission Form */
                <div className="bg-surface p-6 rounded-xl border border-border relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Your Submission</h3>
                        {submission && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                <CheckCircle size={16} />
                                <span className="font-medium text-sm">
                                    {submission.status === 'graded' ? `Graded: ${submission.obtainedMarks}/${assignment.marks}` : 'Submitted'}
                                </span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Code Submission Area */}
                        {assignment.submissionTypes?.code && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Code</label>
                                <textarea
                                    rows="10"
                                    className="w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="// Paste your code here..."
                                    value={textData.code}
                                    onChange={e => setTextData({ ...textData, code: e.target.value })}
                                    readOnly={submission?.status === 'graded'}
                                />
                            </div>
                        )}

                        {/* Output Submission Area */}
                        {assignment.submissionTypes?.output && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Expected Output / Console Log</label>
                                <textarea
                                    rows="5"
                                    className="w-full p-4 font-mono text-sm bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Paste output here..."
                                    value={textData.output}
                                    onChange={e => setTextData({ ...textData, output: e.target.value })}
                                    readOnly={submission?.status === 'graded'}
                                />
                            </div>
                        )}

                        {/* Image Submission */}
                        {assignment.submissionTypes?.image && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Screenshot / Image</label>
                                {submission?.imagePath && (
                                    <div className="mb-4">
                                        <p className="text-xs text-secondary-foreground mb-1">Current Upload:</p>
                                        <img src={`https://inkless-backend.vercel.app${submission.imagePath}`} alt="Submission" className="max-h-60 rounded border border-border" />
                                    </div>
                                )}
                                {submission?.status !== 'graded' && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setFiles({ ...files, image: e.target.files[0] })}
                                        className="block w-full text-sm text-secondary-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                )}
                            </div>
                        )}

                        {/* Feedback Display */}
                        {submission?.teacherFeedback && (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mt-4">
                                <h4 className="font-bold text-yellow-800 mb-1">Teacher Feedback:</h4>
                                <p className="text-yellow-900 text-sm whitespace-pre-wrap">{submission.teacherFeedback}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        {submission?.status !== 'graded' && (
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : (submission ? 'Update Submission' : 'Submit Assignment')}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            )}
        </div>
    );
};

export default AssignmentDetails;
