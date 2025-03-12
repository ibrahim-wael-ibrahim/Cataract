// src/app/scan/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/lib/context/auth";
import api from "@/lib/utils/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Upload } from "lucide-react";
import HistoryCard from "@/components/HistoryCard";

export default function Scan() {
    const [image, setImage] = useState(null); // Selected file
    const [previewUrl, setPreviewUrl] = useState(null); // Local preview URL
    const [result, setResult] = useState(null); // Backend response
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false); // State for scanning effect
    const { user } = useAuth();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
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

        setScanning(true); // Start scanning effect
        setMessage("");
        setTimeout(async () => {
            const formData = new FormData();
            formData.append("image", image);

            setLoading(true);
            try {
                const res = await api.post("/predict", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setResult(res.data);
                setPreviewUrl(null);
            } catch (err) {
                setMessage(
                    err.response?.data?.error || "Prediction failed. Please try again."
                );
            } finally {
                setLoading(false);
                setScanning(false); // Stop scanning effect
            }
        }, 5000); // 5-second delay for scanning effect
    };

    if (!user) {
        return (
            <section className="min-h-dvh w-full grid place-content-center">
                <p className="text-center">Please log in to upload an image.</p>
            </section>
        );
    }

    return (
        <section className="min-h-dvh w-full p-8 flex justify-center items-center">
            <div className="p-6 bg-boston-blue-500/10 backdrop-blur-2xl rounded-2xl shadow-md transition-all w-4/6 min-h-[500px] flex flex-col justify-start items-center gap-8">
                <div className="min-h-[250px] w-full flex flex-col md:flex-row justify-start items-center gap-8 border-2 p-4 rounded-3xl">
                    <img
                        src="/images/EYES_EX.jpeg"
                        alt="Example image showing a close-up of an eye with good lighting and focus for cataract detection"
                        className="rounded-3xl object-cover object-center w-full md:w-1/2"
                    />
                    <div className="w-full md:w-1/2">
                        <h1 className="text-2xl font-bold mb-4">
                            Guidelines for Uploading Eye Images
                        </h1>
                        <p className="mb-4">
                            To ensure accurate cataract detection, please follow these rules
                            when uploading an image:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Eye Visibility</strong>: The eye should be fully open
                                and not obscured by hair, glasses, or other objects.
                            </li>
                            <li>
                                <strong>Lighting</strong>: Use natural light or a well-lit room
                                to avoid shadows on the eye.
                            </li>
                            <li>
                                <strong>Focus</strong>: Hold the camera steady to ensure the
                                image is not blurry.
                            </li>
                            <li>
                                <strong>Close-up</strong>: Position the camera close to the eye,
                                filling most of the frame with the eye.
                            </li>
                            <li>
                                <strong>Orientation</strong>: Have the person look directly at
                                the camera.
                            </li>
                            <li>
                                <strong>Image Quality</strong>: Use the highest resolution
                                possible for better analysis.
                            </li>
                            <li>
                                <strong>File Type</strong>: Upload images in JPEG or PNG format.
                            </li>
                        </ul>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className=" w-full flex  justify-between items-center gap-4">
                    <label
                        htmlFor="image"
                        className="px-4 py-4 min-h-4 rounded-2xl uppercase text-md disabled:bg-boston-blue-950 border-2 border-boston-blue-700 hover:bg-boston-blue-400 transition-[background] duration-500 ease-in-out cursor-pointer text-2xl font-bold w-full text-boston-blue-700  flex items-center justify-center "
                    >
                        <Upload className="mx-4" /> <span>Scan Your Eye</span>
                    </label>
                    <Input
                        idInput="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        containerClassName="hidden"
                    />
                    <Button
                        type="submit"
                        disabled={loading || scanning}
                        className="w-full bg-boston-blue-700 py-5 "
                    >
                        {scanning ? "Scanning..." : "Upload"}
                    </Button>
                </form>


                {previewUrl && (
                    <div className="w-3/6 aspect-square rounded-3xl overflow-hidden relative">
                        <img
                            src={previewUrl}
                            alt="Selected eye image for diagnosis"
                            className={`object-cover object-center w-full h-full ${
                                scanning ? "opacity-45" : ""
                            }`}
                        />
                        {scanning && (
                            <div className="absolute inset-0 flex flex-col justify-center items-center">
                                <svg
                                    className="animate-spin h-12 w-12 text-boston-blue-700"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                                    />
                                </svg>
                                <p className="mt-4 text-lg font-semibold text-boston-blue-700">
                                    Scanning...
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {message && <p className="text-red-400 mt-3 text-center">{message}</p>}

                {result && (
                    <HistoryCard
                        status={result.status}
                        image_url={result.image_url}
                        percentage={result.percentage}
                    />
                )}
            </div>
        </section>
    );
}