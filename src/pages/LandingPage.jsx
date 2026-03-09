import React from 'react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import DarkShowcaseSection from '../components/Landing/DarkShowcaseSection';
import MobileAppSection from '../components/Landing/MobileAppSection';
import Footer from '../components/Landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-purple-200 selection:text-purple-900">
            <LandingNavbar />
            <main>
                <HeroSection />
                <FeaturesSection />
                <DarkShowcaseSection />
                <MobileAppSection />
            </main>
            <Footer />
        </div>
    );
};

export default LandingPage;
