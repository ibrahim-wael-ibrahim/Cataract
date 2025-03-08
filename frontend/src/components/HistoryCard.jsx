// src/components/HistoryCard.jsx
export default function HistoryCard({ id, created_at, image_url, status, percentage }) {
    return (
        <div
            className="p-4 bg-boston-blue-500/10 backdrop-blur-2xl rounded-2xl shadow-md transition-all"
        >
            <div className="h-40 w-full aspect-video mb-5 rounded-3xl overflow-hidden relative">
                <img
                    src={image_url}
                    alt={`Diagnosis ${id}`}
                    className="w-full h-full object-cover object-center" // Fixed bg-cover to proper Tailwind
                />
                <span className="absolute top-2 left-2 bg-boston-blue-800 text-white rounded-3xl px-2 py-1 font-extrabold">
          {created_at ? new Date(created_at).toLocaleDateString() : new Date(Date.now()).toLocaleDateString()}
        </span>
            </div>
            <div className="space-y-2 flex flex-col justify-start items-start gap-4 relative">
        <span
            className={`${
                status === "Normal" ? "bg-boston-blue-800" : "bg-red-800"
            } text-white rounded-3xl px-4 py-1 font-extrabold`}
        >
          {status}
        </span>
                <div className="flex justify-start items-start gap-4 w-full">
                    <p className="text-sm w-full">
                        {status}:{" "}
                        {status === "Normal" ? percentage : (1 - percentage / 100) * 100}%
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                        <div
                            className={`h-2.5 rounded-full ${
                                status === "Normal" ? "bg-boston-blue-500" : "bg-red-500"
                            }`}
                            style={{
                                width: `${
                                    status === "Normal" ? percentage : (1 - percentage / 100) * 100
                                }%`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}