// src/components/TripModal.tsx

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { Trip } from "../types/trips";
import { updateTrip } from "../features/trips/tripsThunk";
import { fetchDestinationSuggestions } from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    trip: Trip;
}

export type TripFormValues = {
    title: string;
    destination: string;
    description: string;
};

export default function UpdateTripModal({ isOpen, onClose, trip }: Props) {
    const dispatch = useDispatch<AppDispatch>();
    const locationRef = useRef<HTMLDivElement>(null);
    const { suggestions } = useSelector((state: RootState) => state.destination);
    const START_FROM = new Date();
    const [query, setQuery] = useState<string>(trip.destination);
    const [skipNextEffect, setSkipNextEffect] = useState(false);
    const [dateValue, setDateValue] = useState<DateValueType>({
        startDate: new Date(trip.startDate),
        endDate: new Date(trip.endDate),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<TripFormValues>({
        defaultValues: {
            title: trip.title,
            destination: trip.destination,
            description: trip.description,
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                title: trip.title,
                destination: trip.destination,
                description: trip.description,
            });
            setDateValue({
                startDate: new Date(trip.startDate),
                endDate: new Date(trip.endDate),
            });
            setQuery(trip.destination);
        }
    }, [isOpen, trip]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                locationRef.current &&
                !locationRef.current.contains(event.target as Node)
            ) {
                dispatch(clearSuggestions());
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2 || skipNextEffect) {
            setSkipNextEffect(false);
            return;
        }
        const timer = setTimeout(() => {
            dispatch(fetchDestinationSuggestions(query));
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const onSubmit = async (data: TripFormValues) => {
        try {
            await dispatch(
                updateTrip({
                    tripId: trip._id,
                    data: {
                        ...data,
                        startDate: dateValue?.startDate?.toISOString() || trip.startDate,
                        endDate: dateValue?.endDate?.toISOString() || trip.endDate,
                    },
                })
            ).unwrap();
            onClose();
        } catch (err) {
            alert("Failed to update trip");
            console.error(err);
        }
    };

    return (
        <dialog className={`modal ${isOpen ? "modal-open" : ""} backdrop-blur-sm`}>
            <form onSubmit={handleSubmit(onSubmit)} className="modal-box space-y-4">
                <h3 className="font-bold text-lg text-center">Edit Trip</h3>

                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        {...register("title", { required: "Title is required" })}
                    />
                    {errors.title && (
                        <p className="text-error text-sm">{errors.title.message}</p>
                    )}
                </div>

                <div className="relative" ref={locationRef}>
                    <label className="label">Destination</label>
                    <input
                        className="input input-bordered w-full"
                        value={watch("destination") || ""}
                        {...register("destination", { required: "Destination is required" })}
                        onChange={(e) => {
                            const value = e.target.value;
                            setQuery(value);
                            setValue("destination", value);
                        }}
                    />
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 bg-base-100 border mt-1 rounded-box max-h-40 overflow-y-auto w-full shadow">
                            {suggestions.map((city, idx) => (
                                <li key={idx}>
                                    <button
                                        type="button"
                                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                                        onClick={() => {
                                            setValue("destination", city.display_name);
                                            setQuery(city.display_name);
                                            setSkipNextEffect(true);
                                            dispatch(clearSuggestions());
                                            // if (city.lat && city.lon) {
                                            //     setValue("coordinates", {
                                            //         lat: parseFloat(city.lat),
                                            //         lng: parseFloat(city.lon),
                                            //     });
                                            // }
                                        }}
                                    >
                                        {city.display_name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="label">Description</label>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        {...register("description")}
                    />
                </div>

                <div>
                    <label className="label">Date Range</label>
                    <Datepicker
                        // inputClassName="input input-bordered w-full"
                        inputClassName="input input-bordered w-full bg-base-100 text-base-content placeholder:text-base-content"

                        displayFormat="DD/MM/YYYY"
                        value={dateValue}
                        onChange={setDateValue}
                        useRange={false}
                    />
                </div>

                <div className="modal-action justify-end">
                    <button type="button" className="btn btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </dialog>
    );
}
