import React, { useEffect } from 'react';

const InstagramPoin: React.FC = () => {
    useEffect(() => {
        // Check if the script is already added
        if (!document.getElementById('elfsight-platform-script')) {
            const script = document.createElement('script');
            script.id = 'elfsight-platform-script';
            script.src = 'https://static.elfsight.com/platform/platform.js';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div
            className="elfsight-app-5b525de9-1766-4af1-8e47-9c7736ccd456"
            data-elfsight-app-lazy
        ></div>
    );
};

export default InstagramPoin;