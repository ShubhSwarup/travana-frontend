import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@headlessui/react";
import { fetchCityImage } from "../services/unsplash";
import { Trip } from "../types/trips"; // Assuming this includes _id, title, destination, etc.
import UpdateTripModal from "./UpdateTripModal";
import { Pencil } from "lucide-react"; // ⬅️ Add this for the edit icon

type HeroSectionProps = {
    trip: Trip;
};

function HeroSection({ trip }: HeroSectionProps) {
    const [image, setImage] = useState<string>("");
    const [showEditModal, setShowEditModal] = useState(false);
    useEffect(() => {
        const loadImage = async () => {
            const city = trip.destination || "travel";
            const img = await fetchCityImage(city);
            if (img)
                setImage(img);
        };
        loadImage();
    }, [trip.destination]);

    const { title, destination, description, startDate, endDate } = trip;
    const formattedDates = `${new Date(startDate).toLocaleDateString()} - ${new Date(
        endDate
    ).toLocaleDateString()}`;

    return (
        <div className="relative w-full rounded-2xl overflow-hidden shadow-md mb-6">
            {image ? (
                <img
                    src={image}
                    alt={destination}
                    className="w-full h-64 object-cover"
                />
            ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-600">
                    No image found
                </div>
            )}

            <div className="absolute top-0 left-0 w-full h-full bg-black/40 p-6 flex flex-col justify-end">
                <div
                    className="tooltip tooltip-left absolute top-4 right-4"
                    data-tip="Edit Trip"
                >
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="btn btn-sm btn-circle btn-ghost hover:bg-white/10"
                    >
                        <Pencil className="w-4 h-4 text-white" />
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-white mb-1">{title}</h1>
                <p className="text-lg text-white/80 italic">{destination}</p>
                <p className="text-sm text-white/70 mb-1">{formattedDates}</p>

                <div className="tooltip tooltip-top w-fit mb-2" data-tip={description}>
                    <p className="text-sm text-white/70 truncate max-w-xs">
                        {description}
                    </p>
                </div>

                {!image && (
                    <button className="btn btn-secondary w-fit flex items-center gap-2">
                        <UploadCloud className="h-4 w-4" />
                        Upload Image
                    </button>
                )}
            </div>

            <UpdateTripModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} trip={trip} />
        </div>
    );
}

export default HeroSection;
