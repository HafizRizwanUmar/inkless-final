import React from 'react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import DarkShowcaseSection from '../components/Landing/DarkShowcaseSection';
import WorkflowSection from '../components/Landing/WorkflowSection';
import Footer from '../components/Landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-brand-light selection:text-brand-dark">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <DarkShowcaseSection />
                <WorkflowSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
