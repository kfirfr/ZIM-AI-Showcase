"use client";

import React from "react";

interface AnimatedTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
    children,
    className = "",
    as: Component = "h2"
}) => {
    return (
        <Component className={`animated-gradient-text font-bold ${className}`}>
            {children}
        </Component>
    );
};
