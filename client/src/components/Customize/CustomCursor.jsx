// src/CustomCursor.js

import React, { useEffect, useState } from 'react';
import './CustomCursor.css';

export const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [style, setStyle] = useState({});

    useEffect(() => {
        const handleMouseMove = (event) => {
            setPosition({ x: event.clientX, y: event.clientY });
            setStyle({
                left: `${event.clientX}px`,
                top: `${event.clientY}px`,
                transition: 'left 0.15s ease-out, top 0.15s ease-out',
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return <div className="custom-cursor" style={style} />;
};