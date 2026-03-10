import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import InklessLogo from '../InklessLogo';

const Footer = () => {
    return (
        <footer className="relative w-full bg-gradient-to-br from-brand-dark to-brand-dark text-white pt-24 pb-12 overflow-hidden">
            {/* Large Watermark Text */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-5 pointer-events-none select-none">
                <h1 className="text-[17vw] font-bold tracking-tighter text-white leading-none whitespace-nowrap">
                    INKLESS
                </h1>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <InklessLogo className="h-8 w-8 text-white" />
                            <span className="font-sans text-xl font-bold tracking-tight">INKLESS</span>
                        </div>
                        <h3 className="text-xl font-medium mb-6">Discover your teaching edge.</h3>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold mb-6">Features</h4>
                        <ul className="space-y-4 text-gray-300 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Course Management</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Student Analytics</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">AI Grading</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Plagiarism Check</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-300 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-300 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© 2026 Inkless Labs GmbH. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
