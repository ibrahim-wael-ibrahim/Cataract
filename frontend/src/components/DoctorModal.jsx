// src/components/DoctorModal.jsx
"use client"
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useDoctorActions from "@/lib/hooks/useDoctorActions";

export default function DoctorModal({ show, onHide, onSave, doctor, token }) {
    const { createDoctor, updateDoctor, loading, error } = useDoctorActions(token);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        profile: {
            qualification: "",
            about: "",
            state: "",
            url_picture_profile: "",
            url_whatsapp: "",
            url_facebook: "",
            url_instagram: "",
            url_website: ""
        }
    });

    useEffect(() => {
        if (doctor) {
            setFormData({
                first_name: doctor.first_name,
                last_name: doctor.last_name,
                email: doctor.email,
                password: "", // Keep password empty for edits
                profile: {
                    qualification: doctor.profile?.qualification ,
                    about: doctor.profile?.about ,
                    state: doctor.profile?.state ,
                    url_picture_profile: doctor.profile?.url_picture_profile,
                    url_whatsapp: doctor.profile?.url_whatsapp ,
                    url_facebook: doctor.profile?.url_facebook ,
                    url_instagram: doctor.profile?.url_instagram ,
                    url_website: doctor.profile?.url_website
                }
            });
        }
    }, [doctor]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            profile: {
                about: formData.profile.about,
                qualification: formData.profile.qualification,
                state: formData.profile.state,
                url_picture_profile: formData.profile.url_picture_profile,
                url_whatsapp: formData.profile.url_whatsapp,
                url_facebook: formData.profile.url_facebook,
                url_instagram: formData.profile.url_instagram,
                url_website: formData.profile.url_website
            }
        };
        payload.profile = Object.fromEntries(
            Object.entries(payload.profile).filter(([_, v]) => v !== '')
        );
        let result;
        if (doctor) {
            result = await updateDoctor(doctor.id, payload);
        } else {
            result = await createDoctor(payload);
        }

        if (result.success) {
            onSave();
            onHide();
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                [name]: value
            }
        }));
    };

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50">
            <div className="p-6 rounded-3xl w-[90%] max-w-2xl backdrop-blur-lg border-2 border-boston-blue-500">
                <h3 className="text-xl font-bold mb-4">
                    {doctor ? "Edit Doctor" : "Add Doctor"}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info Column */}
                    <div className="space-y-3">
                        <Input
                            idInput="first_name"
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.first_name}
                            onChange={handleUserChange}
                            required
                        />
                        <Input
                            idInput="last_name"
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.last_name}
                            onChange={handleUserChange}
                            required
                        />
                        <Input
                            idInput="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleUserChange}
                            required
                        />
                        {!doctor && (
                            <Input
                                idInput="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleUserChange}
                                required
                            />
                        )}
                    </div>

                    {/* Profile Info Column */}
                    <div className="space-y-3">
                        <Input
                            idInput="qualification"
                            type="text"
                            name="qualification"
                            placeholder="Qualification"
                            value={formData.profile.qualification}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="state"
                            type="text"
                            name="state"
                            placeholder="State"
                            value={formData.profile.state}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="about"
                            type="text"
                            name="about"
                            placeholder="About"
                            value={formData.profile.about}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="url_picture_profile"
                            type="url"
                            name="url_picture_profile"
                            placeholder="Profile Picture URL"
                            value={formData.profile.url_picture_profile}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="url_whatsapp"
                            type="url"
                            name="url_whatsapp"
                            placeholder="WhatsApp URL"
                            value={formData.profile.url_whatsapp}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="url_facebook"
                            type="url"
                            name="url_facebook"
                            placeholder="Facebook URL"
                            value={formData.profile.url_facebook}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="url_instagram"
                            type="url"
                            name="url_instagram"
                            placeholder="Instagram URL"
                            value={formData.profile.url_instagram}
                            onChange={handleProfileChange}
                        />
                        <Input
                            idInput="url_website"
                            type="url"
                            name="url_website"
                            placeholder="Website URL"
                            value={formData.profile.url_website}
                            onChange={handleProfileChange}
                        />
                    </div>

                    {error && <p className="text-red-400 col-span-full">{error}</p>}
                    <div className="flex gap-2 col-span-full">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-boston-blue-700"
                        >
                            {loading ? "Saving..." : doctor ? "Update" : "Add"}
                        </Button>
                        <Button onClick={onHide} className="w-full" disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}