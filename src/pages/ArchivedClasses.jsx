import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, AlertCircle, RotateCcw } from 'lucide-react';

const ArchivedClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchArchivedClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://inkless-backend.vercel.app/api/classes/archived', {
                headers: { 'x-auth-token': token }
            });
            setClasses(res.data);
        } catch (err) {
            console.error("Failed to fetch archived classes", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchivedClasses();
    }, []);

    const handleRestore = async (classId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`https://inkless-backend.vercel.app/api/classes/${classId}/archive`, {}, {
                headers: { 'x-auth-token': token }
            });
            // Refresh list
            fetchArchivedClasses();
        } catch (err) {
            console.error("Failed to restore class", err);
            alert("Failed to restore class. Ensure you are the owner or teacher.");
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary-foreground">Loading archived classes...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Archived Classes</h1>
                    <p className="text-secondary-foreground">Past classes that are no longer active.</p>
                </div>
            </div>

            {classes.length === 0 ? (
                <div className="p-12 text-center bg-surface rounded-xl border border-border flex flex-col items-center">
                    <BookOpen className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold">No Archived Classes</h3>
                    <p className="text-secondary-foreground">You don't have any archived classes yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map(cls => (
                        <div key={cls._id} className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all flex flex-col justify-between h-full opacity-80">
                            <div>
                                <div className={`w-12 h-12 rounded-lg ${cls.theme || 'bg-blue-600'} text-white flex items-center justify-center mb-4`}>
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">{cls.title}</h3>
                                <p className="text-sm text-secondary-foreground mb-4">{cls.subject} {cls.section && `- ${cls.section}`}</p>
                            </div>
                            <div className="flex border-t border-border pt-4 gap-2">
                                <button
                                    onClick={() => handleRestore(cls._id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium transition-colors"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Restore
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchivedClasses;
