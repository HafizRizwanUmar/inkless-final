import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InklessLogo from '../components/InklessLogo';
import { motion } from 'framer-motion';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { name, email, password, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || 'Signup failed');
            }

            // Signup Success
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            if (data.user.role === 'teacher') {
                navigate('/teacher/dashboard');
            } else if (data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background font-sans">
            {/* Left Side - Hero/Branding (Identical to Login) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-surface relative overflow-hidden border-r border-border p-12">
                <div className="relative z-10 text-center space-y-6 max-w-lg">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-blue-500/20">
                            <InklessLogo className="w-24 h-24" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-foreground">
                        Join Inkless<span className="text-primary">.</span>
                    </h1>
                    <p className="text-lg text-secondary-foreground leading-relaxed">
                        Start your digital learning journey. Create an account to access classrooms, assignments, and AI-powered tools.
                    </p>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob" />
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-2000" />
                    <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl mix-blend-multiply filter animate-blob animation-delay-4000" />
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="flex lg:hidden justify-center mb-6">
                            <InklessLogo className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground font-serif">Create Account</h2>
                        <p className="mt-2 text-sm text-secondary-foreground">
                            to get started with Inkless
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-secondary-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-secondary-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground placeholder-secondary-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1.5">I am a...</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                    className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm appearance-none"
                                >
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-background px-2 text-secondary-foreground">Already have an account?</span>
                            </div>
                        </div>

                        <Link
                            to="/login"
                            className="font-medium text-primary hover:text-primary/80 hover:underline"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
