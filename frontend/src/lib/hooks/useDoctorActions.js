// src/lib/hooks/useDoctorActions.js
import api from "../utils/api";
import {useState} from "react";
export default function useDoctorActions(token) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createDoctor = async (doctorData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post("/doctors", doctorData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { success: true, data: res.data };
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to create doctor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const updateDoctor = async (id, doctorData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.put(`/doctors/${id}`, doctorData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { success: true, data: res.data };
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to update doctor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    const deleteDoctor = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/doctors/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to delete doctor");
            return { success: false };
        } finally {
            setLoading(false);
        }
    };

    return { createDoctor, updateDoctor, deleteDoctor, loading, error };
}