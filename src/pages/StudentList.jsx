import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Trash2 } from 'lucide-react';

const StudentList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const students = [
        { id: 1, name: 'Alice Johnson', sapId: '700101', status: 'Active', email: 'alice@uni.edu' },
        { id: 2, name: 'Bob Smith', sapId: '700102', status: 'Inactive', email: 'bob@uni.edu' },
        { id: 3, name: 'Charlie Brown', sapId: '700103', status: 'Active', email: 'charlie@uni.edu' },
        { id: 4, name: 'David Lee', sapId: '700104', status: 'Active', email: 'david@uni.edu' },
    ];

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sapId.includes(searchTerm)
    );

    return (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Toolbar */}
            <div className="p-6 border-b border-border flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-foreground" />
                    <input
                        type="text"
                        placeholder="Search by Name or SAP ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-background border border-border rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-background/80 transition-colors">
                        <Filter className="w-4 h-4" />
                        <span>Filter</span>
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                        Add Student
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background/50 text-secondary-foreground text-sm uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">SAP ID</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-background/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{student.name}</div>
                                            <div className="text-xs text-secondary-foreground">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-secondary-foreground">{student.sapId}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                                    <button className="p-2 hover:bg-background rounded-full transition-colors text-secondary-foreground hover:text-white" title="Email">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-secondary-foreground hover:text-red-500" title="Remove">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 hover:bg-background rounded-full transition-colors text-secondary-foreground" title="More">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-secondary-foreground">
                    No students found matching "{searchTerm}"
                </div>
            )}
        </div>
    );
};

export default StudentList;
