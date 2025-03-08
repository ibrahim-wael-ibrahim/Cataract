// src/app/doctors/page.jsx
"use client";

import { useEffect } from "react";
import useDoctors from "@/lib/hooks/useDoctors";
import Spinner from "@/components/ui/Spinner";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorsPage() {
    const { doctors, loading, error, fetchDoctors } = useDoctors(null); // No token needed for public search

    useEffect(() => {
        fetchDoctors(); // Fetch doctors when the component mounts
    }, [fetchDoctors]); // Dependency on fetchDoctors ensures it runs if the function changes

    if (loading) {
        return (
            <section className="min-h-dvh w-full p-8 flex justify-center items-center">
                <Spinner />
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-dvh w-full p-8 flex justify-center items-center">
                <p className="text-red-400">{error}</p>
            </section>
        );
    }

    return (
        <section className="min-h-dvh w-full p-8 mt-32">
            <h1 className="text-3xl font-bold text-boston-blue-700 mb-6 text-center">
                Our Doctors
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))
                ) : (
                    <p className="text-center col-span-full">No doctors found.</p>
                )}
            </div>
        </section>
    );
}