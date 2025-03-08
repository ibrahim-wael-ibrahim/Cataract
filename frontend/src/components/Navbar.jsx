// src/components/Navbar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "@/components/ui/ThemeSwitch";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { useAuth } from "@/lib/context/auth";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Define role-specific navigation links
    const patientLinks = [
        { url: "/", label: "home" },
        { url: "/search", label: "search" },
        { url: "/scan", label: "scan" },
        { url: "/history", label: "history" },
    ];

    const doctorLinks = [
        { url: "/", label: "home" },
        { url: "/search", label: "search" },
        { url: "/doctors", label: "doctors" },
    ];

    const adminLinks = [
        { url: "/", label: "home" },
        { url: "/search", label: "search" },
        { url: "/dashboard", label: "dashboard" },
    ];

    // Default links for unauthenticated users
    const defaultLinks = [{ url: "/", label: "home" }];

    // Determine which links to use based on user role
    const navLinks = user
        ? user.role === "patient"
            ? patientLinks
            : user.role === "doctor"
                ? doctorLinks
                : user.role === "admin"
                    ? adminLinks
                    : defaultLinks // Fallback for unexpected roles
        : defaultLinks; // Unauthenticated users

    return (
        <div
            className={`fixed inset-x-0 top-2 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6`}
        >
            <header className="absolute top-1/2 py-2 w-[90dvw] -translate-y-1/2 flex justify-between items-center mx-4 md:mx-14 backdrop-blur-md px-4 rounded-2xl">
                <Logo />
                <nav id="navbar-items" className="w-full">
                    <ul className="flex justify-center items-center gap-4">
                        {navLinks.map(({ url, label }) => (
                            <li
                                key={label}
                                className={`relative after:absolute after:bottom-0 after:left-0 after:right-0 after:mx-auto after:h-px after:z-10 after:bg-boston-blue-500 after:w-0 hover:after:w-full after:transition-all after:duration-500 after:ease-in-out py-1 ${
                                    pathname === url ? "after:w-full font-extrabold" : ""
                                }`}
                            >
                                <Link href={url} className="px-4 py-2 text-lg uppercase">
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div
                    id="navbar-contoler"
                    className="flex justify-center items-center gap-4"
                >
                    <ThemeSwitch />
                    {user ? (
                        <Button onClick={logout}>Logout</Button>
                    ) : (
                        <Link href="/signin">
                            <Button >SignIn</Button>
                        </Link>
                    )}
                </div>
            </header>
        </div>
    );
}