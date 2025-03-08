// src/components/Footer.jsx
import React from "react";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Globe } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-boston-blue-700 text-white p-6 mt-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Copyright and Developer Info */}
                <div className="text-center md:text-left">
                    <p className="text-sm">&copy; {new Date().getFullYear()} EyeCare. All rights reserved.</p>
                    <p className="text-xs mt-1 opacity-80">
                        Developed by{" "}
                        <Link
                            href="https://futureacademy.com" // Replace with actual URL if available
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            Future Academy Team
                        </Link>
                    </p>
                </div>

                {/* Social Media Links */}
                <div className="flex justify-center items-center gap-4">
                    <Link
                        href="https://wa.me/123456789" // Replace with actual WhatsApp link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-boston-blue-300 transition-colors"
                        aria-label="WhatsApp"
                    >
                        <MessageCircle size={24} />
                    </Link>
                    <Link
                        href="https://facebook.com/eyecare" // Replace with actual Facebook link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-boston-blue-300 transition-colors"
                        aria-label="Facebook"
                    >
                        <Facebook size={24} />
                    </Link>
                    <Link
                        href="https://instagram.com/eyecare" // Replace with actual Instagram link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-boston-blue-300 transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={24} />
                    </Link>
                    <Link
                        href="https://eyecare.com" // Replace with actual website link
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-boston-blue-300 transition-colors"
                        aria-label="Website"
                    >
                        <Globe size={24} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}