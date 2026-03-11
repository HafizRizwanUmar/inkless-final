import API_BASE_URL from '../config';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Upload, CheckSquare } from 'lucide-react';

const CreateAssignment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { classId } = location.state || {};

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        marks: 100,
        deadline: '',
        enableAI: false,
        submissionTypes: {
            code: false,
            output: false,
            image: false
        }
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    if (!classId) return <div className="p-8">Error: No Class ID</div>;

    const handleSubmissionTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            submissionTypes: {
                ...prev.submissionTypes,
                [type]: !prev.submissionTypes[type]
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('marks', formData.marks);
            data.append('deadline', formData.deadline);
            data.append('enableAI', formData.enableAI);
            data.append('classId', classId);
            // Append submissionTypes as JSON string
            data.append('submissionTypes', JSON.stringify(formData.submissionTypes));

            if (file) {
                data.append('file', file);
            }

            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/assignments`, data, {
                headers: {
                    'x-auth-token': token,
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate(`/class-details/${classId}`);
        } catch (err) {
            console.error(err);
            alert('Error creating assignment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-secondary-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>

            <h1 className="text-2xl font-bold mb-6">Create New Lab Task / Assignment</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-xl border border-border">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Task Title</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. C++ Multiplication Program"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Task Description / Question</label>
                    <textarea
                        required
                        rows="4"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g. Write a program in C++ that takes two numbers as input and prints their product..."
                    />
                </div>

                {/* Submission Requirements */}
                <div>
                    <label className="block text-sm font-medium mb-3">Submission Requirements</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${formData.submissionTypes.code ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}
                            onClick={() => handleSubmissionTypeChange('code')}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.submissionTypes.code ? 'bg-primary border-primary text-white' : 'border-gray-400'}`}>
                                {formData.submissionTypes.code && <CheckSquare size={14} />}
                            </div>
                            <span className="font-medium">Code Submission</span>
                        </div>

                        <div
                            className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${formData.submissionTypes.output ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}
                            onClick={() => handleSubmissionTypeChange('output')}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.submissionTypes.output ? 'bg-primary border-primary text-white' : 'border-gray-400'}`}>
                                {formData.submissionTypes.output && <CheckSquare size={14} />}
                            </div>
                            <span className="font-medium">Output (Text)</span>
                        </div>

                        <div
                            className={`p-4 border rounded-lg cursor-pointer flex items-center gap-3 transition-all ${formData.submissionTypes.image ? 'border-primary bg-primary/5' : 'border-border hover:border-gray-400'}`}
                            onClick={() => handleSubmissionTypeChange('image')}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.submissionTypes.image ? 'bg-primary border-primary text-white' : 'border-gray-400'}`}>
                                {formData.submissionTypes.image && <CheckSquare size={14} />}
                            </div>
                            <span className="font-medium">Image / Screenshot</span>
                        </div>
                    </div>
                    <p className="text-xs text-secondary-foreground mt-2">Select what students need to submit for this task.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Max Marks</label>
                        <input
                            type="number"
                            className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:outline-none"
                            value={formData.marks}
                            onChange={e => setFormData({ ...formData, marks: e.target.value })}
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

                {/* File Upload (Optional Attachments) */}
                <div>
                    <label className="block text-sm font-medium mb-1">Reference Material (Optional)</label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-background/50 transition-colors relative">
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={e => setFile(e.target.files[0])}
                        />
                        <Upload className="w-8 h-8 text-secondary-foreground mx-auto mb-2" />
                        <p className="text-sm text-secondary-foreground">
                            {file ? file.name : "Drag and drop or click to upload PDF/Docs"}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        {loading ? 'Publishing...' : 'Publish Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignment;
