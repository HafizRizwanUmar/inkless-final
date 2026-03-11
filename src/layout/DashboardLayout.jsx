import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bell, User, LogOut, BookOpen, FileText, Settings, Menu, X, CheckSquare, Search, Command, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE_URL from '../config';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <div onClick={onClick} className="cursor-pointer">
        <div className={`group flex items-center space-x-3 px-4 py-3 mx-3 rounded-xl transition-all duration-200 ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
            <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-sm font-medium tracking-wide">{label}</span>
            {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />}
        </div>
    </div>
);

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [enrolledClasses, setEnrolledClasses] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Default fallback user state
    const [user, setUser] = useState({ name: 'Student', role: 'student', avatar: '/avatars/avatar_1.png' });

    const location = useLocation();
    const navigate = useNavigate();

    // Fetch User Info & Classes on Mount
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            // 1. Decode Token for User Info
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const decoded = JSON.parse(jsonPayload);
            const currentUser = decoded.user;

            // 2. Deterministic Avatar Selection (since DB has no avatar field yet)
            // Use Name length or CharCode sum to pick 1 of 5 avatars consistently for the same user
            const nameSum = currentUser.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const avatarIndex = (nameSum % 5) + 1;

            setUser({
                name: currentUser.name,
                role: currentUser.role,
                avatar: `/avatars/avatar_${avatarIndex}.png`
            });

            // 3. Fetch Classes
            const fetchClasses = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/classes`, {
                        headers: { 'x-auth-token': token }
                    });
                    const data = await res.json();
                    setEnrolledClasses(data);
                } catch (err) { console.error("Failed to fetch classes", err); }
            };
            fetchClasses();

            // 4. Fetch Unread Notifications
            const fetchUnread = async () => {
                try {
                    const res = await fetch(`${API_BASE_URL}/api/notifications/unread-count`, {
                        headers: { 'x-auth-token': token }
                    });
                    const data = await res.json();
                    setUnreadCount(data.count || 0);
                } catch (err) { console.error("Failed to fetch notifications", err); }
            };
            fetchUnread();
            // Polling every 60s
            const interval = setInterval(fetchUnread, 60000);
            return () => clearInterval(interval);

        } catch (e) {
            console.error("Error decoding token", e);
        }
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: `/${user.role}/dashboard` },
        { icon: BookOpen, label: 'Calendar', path: '/calendar' },
        { icon: CheckSquare, label: user.role === 'teacher' ? 'To Review' : 'To-do', path: '/submission-list' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    const archivedClasses = [
        { icon: BookOpen, label: 'Archived Classes', path: '/archived' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        const confirm = window.confirm("Are you sure you want to log out?");
        if (confirm) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex font-sans overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isOpen ? 280 : 0, x: isOpen ? 0 : -280 }}
                className={`fixed md:relative z-50 h-screen bg-surface border-r border-border flex flex-col shadow-xl md:shadow-none transition-all duration-300 ease-in-out ${!isOpen ? 'md:hidden' : ''}`}
            >
                {/* Logo Area REMOVED - Empty header for spacing or strictly for close button on mobile */}
                <div className="h-16 flex items-center px-6 border-b border-border shrink-0 justify-end md:justify-center">
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                {/* Nav Items - SCROLLBAR ADDED */}
                <div className="flex-1 overflow-y-auto py-6 space-y-1 thin-scrollbar">
                    <div className="px-6 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                        <span>Menu</span>
                    </div>
                    {menuItems.map((item) => (
                        <SidebarItem key={item.path} {...item} active={location.pathname === item.path} onClick={() => {
                            if (item.path !== '/submission-list' && item.path !== '/profile' && !item.path.includes('dashboard')) {
                                navigate(item.path);
                            } else {
                                navigate(item.path);
                            }
                            if (window.innerWidth < 768) setIsOpen(false);
                        }} />
                    ))}

                    <div className="my-6 mx-6 border-t border-border" />

                    <div className="px-6 mb-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Enrolled
                    </div>

                    {enrolledClasses.length > 0 ? (
                        enrolledClasses.map(cls => (
                            <SidebarItem
                                key={cls._id}
                                icon={BookOpen}
                                label={cls.title}
                                path={`/class-details/${cls._id}`}
                                active={location.pathname.includes(`/class-details/${cls._id}`)}
                                onClick={() => {
                                    // Use navigate to set state
                                    navigate(`/class-details/${cls._id}`);
                                    if (window.innerWidth < 768) setIsOpen(false);
                                }}
                            />
                        ))
                    ) : (
                        <div className="px-6 py-2 text-sm text-muted-foreground italic">No classes yet</div>
                    )}

                    <div className="my-6 mx-6 border-t border-border" />
                    {archivedClasses.map((item) => (
                        <SidebarItem key={item.path} {...item} active={location.pathname === item.path} onClick={() => {
                            navigate(item.path);
                            if (window.innerWidth < 768) setIsOpen(false);
                        }} />
                    ))}
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-border bg-muted/20">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Log Out</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Layout */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 z-30 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-muted rounded-full text-foreground transition-colors">
                            <Menu className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Inkless</span>
                    </div>

                    <div className="flex-1 max-w-xl px-8 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search classes, assignments..."
                                className="w-full bg-muted/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                <span className="text-[10px] bg-background border border-border px-1.5 py-0.5 rounded text-muted-foreground font-mono">⌘K</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Join/Create Class Button */}
                        {user.role === 'student' && (
                            <Link to="/join-class" className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors flex items-center justify-center" title="Join New Class">
                                <Plus size={20} />
                            </Link>
                        )}
                        {user.role === 'teacher' && (
                            <Link to="/create-class" className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors flex items-center justify-center" title="Create New Class">
                                <Plus size={20} />
                            </Link>
                        )}

                        <Link to="/notifications" className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground relative">
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-surface">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </Link>
                        <div className="h-8 w-px bg-border mx-1" />

                        <div className="flex items-center gap-3 pl-1 cursor-pointer hover:bg-muted/50 p-1 rounded-full transition-colors pr-3">
                            <img
                                src={user.avatar}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface shadow-sm"
                            />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium leading-none capitalize truncate max-w-[150px]">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
