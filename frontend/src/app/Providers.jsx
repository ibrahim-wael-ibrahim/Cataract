"use client"
import {AuthProvider} from "@/lib/context/auth";
import { useEffect, useState } from "react";
import {ThemeProvider as NextThemesProvider} from "next-themes";

export function Providers({children}) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return null; // Prevent SSR mismatch

    return (
        <AuthProvider>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            </NextThemesProvider>
        </AuthProvider>
)
}
