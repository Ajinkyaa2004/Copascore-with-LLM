"use client";

import React, { useEffect, useState } from 'react';

interface SplashAnimationProps {
    onComplete: () => void;
}

export default function SplashAnimation({ onComplete }: SplashAnimationProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 500);
        }, 4000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>


            <div className="relative flex flex-col items-center">
                {/* Ball with MEGA bounce - BIGGER SIZE */}
                <div className="mega-bounce text-8xl relative z-10">
                    ⚽
                </div>

                {/* Brand name */}
                <div className="text-4xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-white bg-clip-text text-transparent mt-16">
                    Copascore
                </div>
            </div>
        </div>
    );
}
