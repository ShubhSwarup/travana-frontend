import { useEffect, useState } from "react";
import { Trip } from "../types/trips";
import { Link } from "react-router-dom";
import { fetchCityImage } from "../services/unsplash";

const TripPolaroidCard = ({ trip }: { trip: Trip }) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const loadImage = async () => {
            const city = `${trip.destination}` || "travel";
            const img = await fetchCityImage(city);
            setImage(img);
        };

        loadImage();
    }, [trip.destination]);

    const formattedDates =
        trip.startDate && trip.endDate
            ? `${new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })} – ${new Date(trip.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            })}`
            : "Unplanned Dates";

    return (
        <Link
            to={`/trip/${trip._id}/`}
            className="relative group bg-base-100 shadow-xl rounded-xl overflow-hidden w-full max-w-xs p-4 transition-transform duration-300 transform hover:-translate-y-1 hover:shadow-2xl"
        >
            <div className="w-full aspect-[7/8] rounded-lg overflow-hidden relative">
                <img
                    src={
                        image ||
                        `https://via.placeholder.com/600x800.png?text=${encodeURIComponent(
                            trip.destination || "Travel"
                        )}`
                    }
                    alt={trip.title}
                    className="w-full h-full object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>

            <div className="mt-3 text-center">
                <h3 className="font-bold text-lg text-primary transition-colors group-hover:text-accent">
                    {trip.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{formattedDates}</p>
            </div>
        </Link>
    );
};

export default TripPolaroidCard;
