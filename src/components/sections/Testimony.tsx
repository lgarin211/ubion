import React, { useEffect } from "react";

const ELFSIGHT_SCRIPT_ID = "elfsight-platform-script";
const ELFSIGHT_APP_CLASS = "elfsight-app-08d723d4-9848-4b24-bc99-0cf8a9e75b36";

const Testimony: React.FC = () => {
    useEffect(() => {
        // Check if the script is already loaded
        if (!document.getElementById(ELFSIGHT_SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = ELFSIGHT_SCRIPT_ID;
            script.src = "https://static.elfsight.com/platform/platform.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <div>
            <div
                className={ELFSIGHT_APP_CLASS}
                data-elfsight-app-lazy
                style={{ minHeight: 400 }}
            />
        </div>
    );
};

export default Testimony;