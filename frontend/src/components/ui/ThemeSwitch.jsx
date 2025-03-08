"use client";
import { useTheme } from "next-themes";
import { SunMedium, Moon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ThemeSwitch() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Wait until mounted to avoid SSR hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    return resolvedTheme === "dark" ? (
        <SunMedium
            size={24}
            className="text-customOrange hidden md:block cursor-pointer"
            onClick={toggleTheme}
            title="Switch to Light Mode"
        />
    ) : (
        <Moon
            size={24}
            className="hidden md:block cursor-pointer"
            onClick={toggleTheme}
            title="Switch to Dark Mode"
        />
    );
}
