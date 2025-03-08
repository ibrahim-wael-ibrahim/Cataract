// src/app/scan/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/auth";
import api from "@/lib/utils/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { Upload } from "lucide-react";
import HistoryCard from "@/components/HistoryCard";

export default function Scan() {
    const [image, setImage] = useState(null); // Selected file
    const [previewUrl, setPreviewUrl] = useState(null); // Local preview URL
    const [result, setResult] = useState(null); // Backend response
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // Create a local URL for preview
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            setMessage("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        setLoading(true);
        setMessage("");
        try {
            const res = await api.post("/predict", formData, { // Fixed to /ai/predict
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user.token}`,
                },
            });
            setResult(res.data);
            setPreviewUrl(null); // Update preview with backend URL
        } catch (err) {
            setMessage(err.response?.data?.error || "Prediction failed");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <section className="min-h-dvh w-full grid place-content-center">
                <p className="text-center">Please log in to upload an image.</p>
            </section>
        );
    }console.log(result)

    return (
        <section className="min-h-dvh w-full p-8 flex justify-center items-center ">
            <div className="p-6 bg-boston-blue-500/10 backdrop-blur-2xl  rounded-2xl shadow-md  transition-all  w-[400px] min-h-[500px] flex flex-col justify-start items-center gap-8">
                <Button className="flex justify-center items-center gap-4 w-full">

                <label htmlFor="image" className="text-2xl font-bold w-full text-boston-blue-700 mb-4 flex items-center justify-center">

                    <Upload /> <span>Scan Your Eye</span>
                </label>
                </Button>

                {
                    previewUrl && (
                        <div className="h-40 w-full  rounded-3xl overflow-hidden relative">
                            <img
                                src={previewUrl}
                                alt={`Diagnosis`}
                                className="bg-cover object-center w-full "
                            />

                        </div>
                    )
                }
                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div>
                        {/*<label className="block text-sm font-bold mb-2">Select Image</label>*/}
                        <Input
                            idInput="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            containerClassName="hidden"
                        />

                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-boston-blue-700"
                    >
                        upload
                    </Button>
                </form>

                {message && (
                    <p className="text-red-400 mt-3 text-center">{message}</p>
                )}

                {result && (
                    <HistoryCard status={result.status} image_url={result.image_url}  percentage={result.percentage} />

                )}
            </div>
        </section>
    );
}