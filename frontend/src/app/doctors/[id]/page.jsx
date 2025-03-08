// src/app/doctors/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/utils/api";
import Spinner from "@/components/ui/Spinner";
import Link from "next/link";
import {
    Facebook,
    Instagram,
    MessageCircle,
    Globe,
} from "lucide-react"; // Import icons from lucide-react

export default function DoctorProfile() {
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchDoctor = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get(`/doctors/${id}`);
                setDoctor(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Failed to fetch doctor profile");
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchDoctor();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <p>Doctor not found.</p>
            </div>
        );
    }

    return (
        <section className="min-h-dvh w-full p-8 flex justify-center items-center">
            <div className="p-4 bg-boston-blue-500/10 backdrop-blur-2xl rounded-2xl shadow-md transition-all w-full max-w-lg">
                <div className="flex items-center gap-6 mb-6">
                    {doctor.profile?.url_picture_profile ? (
                        <img
                            src={doctor.profile.url_picture_profile}
                            alt={`${doctor.first_name} ${doctor.last_name}`}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-boston-blue-200 flex items-center justify-center text-white text-2xl font-bold">
                            {doctor.first_name[0]}{doctor.last_name[0]}
                        </div>
                    )}
                    <div>
                        <h2 className="text-2xl font-bold text-boston-blue-700">
                            {doctor.first_name} {doctor.last_name}
                        </h2>
                        <p className="text-lg">{doctor.email}</p>
                        <span className="bg-boston-blue-500 py-0.5 px-2 my-1 rounded-lg uppercase font-extrabold ">{doctor.profile?.state || "N/A"}</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <p>
                        <strong>About:</strong> {doctor.profile?.about || "N/A"}
                    </p>
                    <p>
                        <strong>Qualification:</strong>{" "}
                        {doctor.profile?.qualification || "N/A"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 my-6">
                        {doctor.profile?.url_whatsapp && (
                            <Link
                                href={doctor.profile.url_whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center gap-2 py-1 px-4 bg-boston-blue-500  w-full hover:bg-boston-blue-600 transition-colors"
                            >
                                <MessageCircle size={28} />
                                <span className="uppercase font-extrabold text-2xl">WhatsApp</span>
                            </Link>
                        )}
                        {doctor.profile?.url_facebook && (
                            <Link
                                href={doctor.profile.url_facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center gap-2 py-1 px-4 bg-boston-blue-500  w-full hover:bg-boston-blue-600 transition-colors"
                            >
                                <Facebook size={28} />
                                <span className="uppercase font-extrabold text-2xl">Facebook</span>
                            </Link>
                        )}
                        {doctor.profile?.url_instagram && (
                            <Link
                                href={doctor.profile.url_instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center gap-2 py-1 px-4 bg-boston-blue-500  w-full hover:bg-boston-blue-600 transition-colors"
                            >
                                <Instagram size={28} />
                                <span className="uppercase font-extrabold text-2xl">Instagram</span>
                            </Link>
                        )}
                        {doctor.profile?.url_website && (
                            <Link
                                href={doctor.profile.url_website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center items-center gap-2 py-1 px-4 bg-boston-blue-500  w-full hover:bg-boston-blue-600 transition-colors"
                            >
                                <Globe size={28} />
                                <span className="uppercase font-extrabold text-2xl">Website</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}