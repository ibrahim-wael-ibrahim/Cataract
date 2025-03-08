// src/app/history/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/auth";
import api from "@/lib/utils/api";
import Spinner from "@/components/ui/Spinner";
import HistoryCard from "@/components/HistoryCard";
import { Clock } from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // user includes token

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/history", { // Fixed to /ai/history
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setHistory(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchHistory();
  }, [user]);

  if (!user) {
    return (
        <section className="min-h-dvh w-full grid place-content-center">
          <p className="text-center">Please log in to view your history.</p>
        </section>
    );
  }

  if (loading) {
    return (
        <section className="min-h-dvh w-full grid place-content-center">
          <Spinner />
        </section>
    );
  }

  return (
      <section className="min-h-dvh w-full p-8 mt-32 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-boston-blue-700 mb-6 flex items-center">
          <Clock className="mr-2" /> Diagnosis History
        </h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {history.length > 0 ? (
              history.map((entry) => (
                  <HistoryCard
                      key={entry.id}
                      id={entry.id}
                      created_at={entry.created_at}
                      image_url={entry.image_url}
                      status={entry.status}
                      percentage={entry.percentage}
                  />
              ))
          ) : (
              <p className="text-center col-span-full">No history found.</p>
          )}
        </div>
      </section>
  );
}