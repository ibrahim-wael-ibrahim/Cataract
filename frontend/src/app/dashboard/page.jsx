// src/app/dashboard/page.jsx
'use client'
import { useState } from "react";
import { useAuth } from "@/lib/context/auth";
import useDoctors from "@/lib/hooks/useDoctors";
import useDoctorActions from "@/lib/hooks/useDoctorActions";
import Button from "@/components/ui/Button";
import DoctorModal from "@/components/DoctorModal";
import { Trash, UserRoundPen , CirclePlus} from 'lucide-react';
import Spinner from "@/components/ui/Spinner";

export default function Dashboard() {
    const { user } = useAuth();
    const { doctors, loading: fetchLoading, error: fetchError, fetchDoctors } = useDoctors(user?.token);
    const { deleteDoctor, loading: actionLoading, error: actionError } = useDoctorActions(user?.token);
    const [showModal, setShowModal] = useState(false);
    const [editDoctor, setEditDoctor] = useState(null);

    const handleOpenModal = (doctor = null) => {
        setEditDoctor(doctor);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setEditDoctor(null);
        setShowModal(false);
    };

    const handleSaveDoctor = () => {
        fetchDoctors(); // Refresh the list after save
        handleCloseModal();
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm("Are you sure you want to delete this doctor?")) {
            const result = await deleteDoctor(id);
            if (result.success) {
                fetchDoctors();
            }
        }
    };

    if (!user || user.role !== "admin") {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <p>You must be an admin to access this page.</p>
            </div>
        );
    }

    if (fetchLoading) {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <Spinner />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="min-h-dvh w-full grid place-content-center">
                <p>Error: {fetchError}</p>
            </div>
        );
    }

    return (
        <section className="min-h-dvh w-full p-8 mt-28 gap-8 flex flex-col justify-start items-center relative">
<div className="flex justify-center items-center w-full gap-8">
    <h2 className="text-2xl font-bold ">Manage Doctors</h2>
    <Button onClick={() => handleOpenModal()} className="rounded-full !p-2">
        <CirclePlus/>
    </Button>
</div>
            {actionError && <p className="text-red-400 mb-3">{actionError}</p>}
            <hr className="h-px w-full bg-white"/>

            <div className="p-4 backdrop-blur-lg   w-full container ">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead className="bg-boston-blue-900/20 p-5">
                    <tr >
                        <th className="p-4 text-left">Profile Picture</th>
                        <th className="p-4 text-left">Name</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">State</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                    </thead>
                    <tbody >
                    {doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-b hover:bg-boston-blue-900/10 p-4 mb-2">
                            <td className="p-4">
                                {doctor.profile?.url_picture_profile ? (
                                    <img
                                        src={doctor.profile.url_picture_profile}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : "N/A"}
                            </td>
                            <td className="p-4">{`${doctor.first_name} ${doctor.last_name}`}</td>
                            <td className="p-4">{doctor.email}</td>
                            <td className="p-4">{doctor.profile?.state || "N/A"}</td>


                            <td className="p-4 flex gap-2">
                                <Button
                                    onClick={() => handleOpenModal(doctor)}
                                    disabled={actionLoading}
                                >
                                    <UserRoundPen/>
                                </Button>
                                <Button
                                    onClick={() => handleDeleteDoctor(doctor.id)}
                                    disabled={actionLoading}
                                >
                                   <Trash/>
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <DoctorModal
                show={showModal}
                onHide={handleCloseModal}
                onSave={handleSaveDoctor}
                doctor={editDoctor}
                token={user?.token}
            />
        </section>
    );
}