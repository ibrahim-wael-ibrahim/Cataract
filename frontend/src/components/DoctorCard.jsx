"use client";
import { useRouter } from "next/navigation"; // for Next.js 13 app directory
import Link from "next/link";

export default function DoctorCard({ doctor }) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/doctors/${doctor.id}`)}
            className="p-4 bg-boston-blue-500/10 backdrop-blur-2xl rounded-2xl shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4">
                {doctor.profile?.url_picture_profile ? (
                    <img
                        src={doctor.profile.url_picture_profile}
                        alt={`${doctor.first_name} ${doctor.last_name}`}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-boston-blue-200 flex items-center justify-center text-white font-bold">
                        {doctor.first_name[0]}{doctor.last_name[0]}
                    </div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-boston-blue-700">
                        {doctor.first_name} {doctor.last_name}
                    </h3>
                    <p className="text-sm">{doctor.profile?.state || "N/A"}</p>
                </div>
            </div>
            <div className="mt-2">
                <p>
                    <strong>About:</strong> {doctor.profile?.about || "N/A"}
                </p>
                <p>
                    <strong>Qualification:</strong> {doctor.profile?.qualification || "N/A"}
                </p>
                {doctor.profile?.url_whatsapp && (
                    <p>
                        <strong>WhatsApp:</strong>{" "}
                        <Link
                            href={doctor.profile.url_whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-boston-blue-700 underline"
                        >
                            Contact
                        </Link>
                    </p>
                )}
            </div>
        </div>
    );
}
