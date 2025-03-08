// src/app/search/page.jsx
"use client";

import { useState, useEffect } from "react";
import useDoctors from "@/lib/hooks/useDoctors";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Search as SearchIcon } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import DoctorCard from "@/components/DoctorCard";

export default function Search() {
    const [state, setState] = useState("");
    const { doctors, loading, error, fetchDoctors } = useDoctors(null); // No token needed for public search

    useEffect(() => {
        // Debounce fetching with a 500ms delay
        const delayDebounce = setTimeout(() => {
            if (state.trim()) {
                fetchDoctors(state)
                    .catch((err) => {
                        console.error("Fetch error:", err);
                    });
            }
        }, 500); // 500ms delay

        // Cleanup: Clear the timeout if state changes or component unmounts
        return () => {
            clearTimeout(delayDebounce);
        };
    }, [state, fetchDoctors]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Trigger fetch immediately on button click (optional)
        if (state.trim()) {
            fetchDoctors(state);
        }
    };

    const handleInputChange = (e) => {
        setState(e.target.value); // Update state on every input change
    };

    return (
        <section className="min-h-dvh w-full p-8 mt-32 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-boston-blue-700">Search Doctors by State</h2>
            <form onSubmit={handleSearch} className="mb-8 w-full max-w-md">
                    <Input
                        idInput="state"
                        type="text"
                        placeholder="Enter state (e.g., Cairo)"
                        value={state}
                        onChange={handleInputChange}
                        required
                        icon={SearchIcon}
                    />
            </form>

            {error && <p className="text-red-400 mb-4">{error}</p>}

            {loading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
                    {doctors.length > 0 ? (
                        doctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
                    ) : (
                        <p className="text-center col-span-full">No doctors found for this state.</p>
                    )}
                </div>
            )}
        </section>
    );
}