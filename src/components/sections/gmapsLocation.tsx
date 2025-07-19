import React from "react";

const GmapsLocation: React.FC = () => (
    <div className="w-full h-[400px]">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3229927955354!2d106.82983687589116!3d-6.221071260931873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3f6ddce3efd%3A0xea6830e6c82c7a18!2sPlaza%20Festival!5e0!3m2!1sen!2sid!4v1752939315543!5m2!1sen!2sid"
            title="Plaza Festival Location Map"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
        />
    </div>
);

export default GmapsLocation;