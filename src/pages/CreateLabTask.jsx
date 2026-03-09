import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';

const CreateLabTask = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = location.state || {};

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        totalMarks: 100,
        deadline: ''
    });

    const [taskDocument, setTaskDocument] = useState(null);
    const [uploadMode, setUploadMode] = useState('manual'); // 'manual' | 'file'
    const [questions, setQuestions] = useState([{ questionText: '', subMarks: 10, submissionTypes: ['code'] }]);
    const [loading, setLoading] = useState(false);


    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', subMarks: 10, submissionTypes: ['code'] }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const toggleSubmissionType = (index, type) => {
        const newQuestions = [...questions];
        let types = newQuestions[index].submissionTypes || [];
        if (types.includes(type)) {
            types = types.filter(t => t !== type);
        } else {
            types.push(type);
        }
        newQuestions[index].submissionTypes = types;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('totalMarks', formData.totalMarks);
            submitData.append('deadline', formData.deadline);
            submitData.append('classId', classId);

            if (uploadMode === 'manual') {
                submitData.append('questions', JSON.stringify(questions));
            } else if (taskDocument) {
                submitData.append('taskDocument', taskDocument);
            }

            await axios.post('https://inkless-backend.vercel.app/api/lab-tasks', submitData, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/class-details', { state: { classId } });
        } catch (err) {
            console.error(err);
            alert('Error creating lab task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-secondary-foreground hover:text-foreground mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <h1 className="text-2xl font-bold mb-6">Create Lab Task</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Details */}
                <div className="bg-surface p-6 rounded-xl border border-border space-y-4">
                    <h2 className="font-semibold text-lg border-b border-border pb-2">Task Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                                type="text" required
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Lab 01: Conditionals"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                required rows="3"
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Total Marks</label>
                            <input
                                type="number" required
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.totalMarks}
                                onChange={e => setFormData({ ...formData, totalMarks: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Deadline</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Task Content Toggle */}
                <div className="bg-surface p-6 rounded-xl border border-border space-y-6">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h2 className="font-semibold text-lg">Task Content</h2>
                        <div className="flex bg-muted/30 p-1 rounded-lg border border-border">
                            <button
                                type="button"
                                onClick={() => setUploadMode('manual')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${uploadMode === 'manual' ? 'bg-background shadow-sm text-foreground' : 'text-secondary-foreground hover:text-foreground'
                                    }`}
                            >
                                Manual Questions
                            </button>
                            <button
                                type="button"
                                onClick={() => setUploadMode('file')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${uploadMode === 'file' ? 'bg-background shadow-sm text-foreground' : 'text-secondary-foreground hover:text-foreground'
                                    }`}
                            >
                                Upload PDF
                            </button>
                        </div>
                    </div>

                    {uploadMode === 'manual' ? (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-secondary-foreground">Add individual questions for the lab task</h3>
                                <button type="button" onClick={addQuestion} className="text-primary font-bold flex items-center gap-1 hover:underline">
                                    <Plus size={18} /> Add Question
                                </button>
                            </div>

                            {questions.map((q, index) => (
                                <div key={index} className="bg-muted/10 p-6 rounded-xl border border-border relative">
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(index)}
                                        className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <h3 className="font-bold mb-4 text-secondary-foreground">Question {index + 1}</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Question Text</label>
                                            <textarea
                                                required rows="2"
                                                className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                                value={q.questionText}
                                                onChange={e => updateQuestion(index, 'questionText', e.target.value)}
                                                placeholder="e.g. Write a function to check prime numbers..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Marks</label>
                                                <input
                                                    type="number" required
                                                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                                                    value={q.subMarks}
                                                    onChange={e => updateQuestion(index, 'subMarks', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Submission Types</label>
                                                <div className="flex flex-wrap gap-4 mt-2">
                                                    {['code', 'output', 'image', 'text'].map(type => (
                                                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={q.submissionTypes.includes(type)}
                                                                onChange={() => toggleSubmissionType(index, type)}
                                                                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                                                            />
                                                            <span className="capitalize text-sm">{type}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-border p-8 rounded-xl hover:bg-muted/30 transition-colors relative cursor-pointer group flex flex-col items-center justify-center text-center">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={(e) => setTaskDocument(e.target.files[0])}
                                    required={uploadMode === 'file'}
                                />
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <p className="text-base font-bold text-foreground mb-1">
                                    {taskDocument ? taskDocument.name : 'Upload Question PDF'}
                                </p>
                                <p className="text-sm text-secondary-foreground">
                                    {taskDocument ? (taskDocument.size / 1024 / 1024).toFixed(2) + ' MB' : 'Click or drag to upload PDF file'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Publishing...' : 'Publish Lab Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateLabTask;
