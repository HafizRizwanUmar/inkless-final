import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Shield, User } from 'lucide-react';

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const users = [
        { id: 1, name: 'Alice Johnson', email: 'alice@uni.edu', role: 'Student', status: 'Active' },
        { id: 2, name: 'Dr. Smith', email: 'smith@uni.edu', role: 'Teacher', status: 'Active' },
        { id: 3, name: 'Admin User', email: 'admin@uni.edu', role: 'Admin', status: 'Active' },
        { id: 4, name: 'Bob Brown', email: 'bob@uni.edu', role: 'Student', status: 'Inactive' },
    ];

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90">
                    <Plus className="w-5 h-5" /> Add User
                </button>
            </div>

            <div className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-foreground" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                            <option>All Roles</option>
                            <option>Student</option>
                            <option>Teacher</option>
                            <option>Admin</option>
                        </select>
                        <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm">
                            <option>Active</option>
                            <option>Inactive</option>
                        </select>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-background/50 text-secondary-foreground text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-background/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-secondary-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {user.role === 'Admin' ? <Shield className="w-4 h-4 text-purple-500" /> : <User className="w-4 h-4 text-blue-500" />}
                                        <span>{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button className="p-2 hover:bg-background rounded-lg text-secondary-foreground transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-secondary-foreground transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
