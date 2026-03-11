import { useEffect } from 'react';

const SEO = ({ title, description, keywords }) => {
    useEffect(() => {
        // Update title
        const fullTitle = title ? `${title} | Inkless` : 'Inkless - Automated Academic Management';
        document.title = fullTitle;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description || 'Inkless is an advanced, AI-powered platform designed to automate academic management, grading, and plagiarism detection.';

        // Update meta keywords
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = keywords || 'education, AI grading, plagiarism detection, quiz builder, academic management, Inkless';

        // Scroll to top on page change (optional SEO/UX benefit)
        window.scrollTo(0, 0);

    }, [title, description, keywords]);

    return null; // This component doesn't render anything
};

export default SEO;
