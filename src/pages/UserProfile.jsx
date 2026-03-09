import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';
import axios from 'axios';

const UserProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@university.edu',
        role: 'Student',
        bio: 'Computer Science Major | AI Enthusiast',
        theme: 'dark',
        notifications: true
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { 'x-auth-token': token }
                });

                // Map API response to state
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    role: res.data.role || 'student',
                    bio: res.data.bio || '',
                    theme: res.data.theme || 'light',
                    notifications: res.data.notifications !== undefined ? res.data.notifications : true
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/profile', {
                name: profile.name,
                bio: profile.bio,
                theme: profile.theme,
                notifications: profile.notifications
            }, {
                headers: { 'x-auth-token': token }
            });
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error("Failed to update profile", err);
            alert("Failed to update profile.");
        }
    };

    if (loading) return <div className="p-8 text-center text-secondary-foreground">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Sidebar Profile Card */}
            <div className="md:col-span-1 space-y-6">
                <div className="bg-surface rounded-xl border border-border p-6 flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl text-primary font-bold overflow-hidden">
                            {/* Placeholder for actual image */}
                            {profile.name[0]}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold">{profile.name}</h2>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full mt-2 inline-block">{profile.role}</span>
                </div>
            </div>

            {/* Main Settings Form */}
            <div className="md:col-span-2 bg-surface rounded-xl border border-border p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Settings
                    </h2>
                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                        {isEditing ? <><Save className="w-4 h-4" /> Save Changes</> : 'Edit Profile'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                disabled={!isEditing}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg p-3 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">Role</label>
                            <input
                                type="text"
                                value={profile.role}
                                disabled
                                className="w-full bg-background border border-border rounded-lg p-3 opacity-50 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                disabled={!isEditing}
                                onChange={handleChange}
                                className="w-full bg-background border border-border rounded-lg py-3 pl-10 pr-4 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary-foreground mb-2">Bio</label>
                        <textarea
                            name="bio"
                            rows="4"
                            value={profile.bio}
                            disabled={!isEditing}
                            onChange={handleChange}
                            className="w-full bg-background border border-border rounded-lg p-3 disabled:opacity-50 resize-none"
                        />
                    </div>

                    <div className="pt-6 border-t border-border">
                        <h3 className="text-lg font-bold mb-4">Preferences</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Email Notifications</span>
                                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${profile.notifications ? 'bg-primary' : 'bg-input'}`} onClick={() => isEditing && setProfile({ ...profile, notifications: !profile.notifications })}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${profile.notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-secondary-foreground">Theme</span>
                                <select
                                    name="theme"
                                    value={profile.theme}
                                    disabled={!isEditing}
                                    onChange={handleChange}
                                    className="bg-background border border-border rounded p-2 text-sm disabled:opacity-50"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
