// src/lib/hooks/useDoctors.js
"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/utils/api";

export default function useDoctors(token) {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDoctors = useCallback(async (state = "") => {
        setLoading(true);
        setError(null);
        try {
            const config = state ? { params: { state } } : {};
            const res = await api.get("/doctors", config);
            setDoctors(res.data);
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to fetch doctors");
        } finally {
            setLoading(false);
        }
    }, []); // Empty deps since api is stable

    useEffect(() => {
        if (token) {
            fetchDoctors(); // Initial fetch for token-based contexts
        }
    }, [token, fetchDoctors]);

    return { doctors, loading, error, fetchDoctors };
}