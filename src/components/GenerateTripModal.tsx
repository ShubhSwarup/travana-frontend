import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchDestinationSuggestions } from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { format } from "date-fns";

const MAX_DAYS = 15;

const aiTripSchema = z.object({
  title: z.string().min(3, "Title too short").max(50),
  description: z.string().max(300).optional(),
  origin: z.string().min(2, "Enter a valid origin"),
  destination: z.string().min(2, "Enter a valid destination"),
});

export type AIGeneratedTripFormData = z.infer<typeof aiTripSchema>;

interface GenerateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (payload: any) => void; // Pass the final payload to parent
}

export default function GenerateTripModal({
  isOpen,
  onClose,
  onGenerate,
}: GenerateTripModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AIGeneratedTripFormData>({
    resolver: zodResolver(aiTripSchema),
  });
  const [originQuery, setOriginQuery] = useState("");
  const [skipOriginNextEffect, setSkipOriginNextEffect] = useState(false);
  const [activeField, setActiveField] = useState<
    "origin" | "destination" | null
  >(null);

  const [query, setQuery] = useState("");
  const { suggestions } = useSelector((state: RootState) => state.destination);
  const [skipNextEffect, setSkipNextEffect] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const START_FROM = new Date();
  START_FROM.setMonth(START_FROM.getMonth() + 1);

  useEffect(() => {
    if (
      (activeField === "origin" && originQuery.length < 2) ||
      (activeField === "destination" && query.length < 2) ||
      skipNextEffect ||
      skipOriginNextEffect
    ) {
      setSkipNextEffect(false);
      setSkipOriginNextEffect(false);
      return;
    }

    const debounceTimeout = setTimeout(() => {
      const valueToFetch = activeField === "origin" ? originQuery : query;
      dispatch(fetchDestinationSuggestions(valueToFetch));
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [query, originQuery, activeField, dispatch]);

  // const onSubmit = (data: AIGeneratedTripFormData) => {
  //   const formattedStartDate =
  //     selectedDate?.startDate instanceof Date
  //       ? format(selectedDate.startDate, "yyyy-MM-dd")
  //       : "";

  //   const formattedEndDate =
  //     selectedDate?.endDate instanceof Date
  //       ? format(selectedDate.endDate, "yyyy-MM-dd")
  //       : "";

  //   const payload = {
  //     ...data,
  //     startDate: formattedStartDate,
  //     endDate: formattedEndDate,
  //   };
  //   console.log(payload);
  //   // onGenerate(payload);
  //   onClose();
  // };
  const [dayRangeError, setDateRangeError] = useState<boolean>(false);
  const [noDateError, setNoDateError] = useState<boolean>(false);

  const onSubmit = (data: AIGeneratedTripFormData) => {
    if (!selectedDate?.startDate || !selectedDate?.endDate) {
      // alert("Please select a valid start and end date for your trip.");
      setNoDateError(true);
      return;
    } else setNoDateError(false);

    const formattedStartDate =
      selectedDate.startDate instanceof Date
        ? format(selectedDate.startDate, "yyyy-MM-dd")
        : "";

    const formattedEndDate =
      selectedDate.endDate instanceof Date
        ? format(selectedDate.endDate, "yyyy-MM-dd")
        : "";

    const tripDuration = Math.ceil(
      (new Date(formattedEndDate).getTime() -
        new Date(formattedStartDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (tripDuration > MAX_DAYS) {
      setDateRangeError(true); // alert("Trip duration cannot exceed 15 days.");
      return;
    } else setDateRangeError(false);

    const payload = {
      ...data,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    console.log(payload);
    onGenerate(payload);
    onClose();
  };

  const onDateChange = (newDate: DateValueType) => {
    setSelectedDate(newDate);
    if (!newDate) return;
    const formattedStartDate =
      newDate.startDate instanceof Date
        ? format(newDate.startDate, "yyyy-MM-dd")
        : "";

    const formattedEndDate =
      newDate.endDate instanceof Date
        ? format(newDate.endDate, "yyyy-MM-dd")
        : "";

    const tripDuration = Math.ceil(
      (new Date(formattedEndDate).getTime() -
        new Date(formattedStartDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (tripDuration > MAX_DAYS) {
      setDateRangeError(true);
      return;
    }
  };

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <form
        method="dialog"
        className="modal-box w-full max-w-lg sm:max-w-xl mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-bold text-xl mb-6 text-center">
          Generate Trip with AI
        </h3>
        <p className="text-sm text-center text-base-content mt-2 mb-6 px-2 sm:px-6">
          Fill in a few details and let our AI create a personalized itinerary
          with activities, wishlist suggestions, and estimated expenses for your
          trip. You can plan trips up to 15 days long.
        </p>
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("title")}
              maxLength={50}
            />
            {errors.title && (
              <p className="text-error text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea textarea-bordered w-full"
              {...register("description")}
              maxLength={300}
            />
            {errors.description && (
              <p className="text-error text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Origin */}
          {/* <div>
            <label className="label">Origin</label>
            <input
              type="text"
              className="input input-bordered w-full"
              {...register("origin")}
              maxLength={100}
            />
            {errors.origin && (
              <p className="text-error text-sm mt-1">{errors.origin.message}</p>
            )}
          </div> */}
          {/* Origin with Suggestions */}
          <div className="relative">
            <label className="label">Origin</label>
            <input
              type="text"
              placeholder="Start typing..."
              className="input input-bordered w-full"
              {...register("origin")}
              onChange={(e) => {
                register("origin").onChange(e);
                setOriginQuery(e.target.value);
                setActiveField("origin");
              }}
            />
            {activeField === "origin" &&
              suggestions.length > 0 &&
              originQuery.length > 1 && (
                <ul className="absolute z-10 bg-base-100 border mt-1 rounded-box max-h-48 overflow-y-auto w-full shadow">
                  {suggestions.map((city, idx) => (
                    <li key={`origin-${idx}`}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                        onClick={() => {
                          setValue("origin", city);
                          setOriginQuery(city);
                          dispatch(clearSuggestions());
                          setSkipOriginNextEffect(true);
                        }}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            {errors.origin && (
              <p className="text-error text-sm mt-1">{errors.origin.message}</p>
            )}
          </div>

          {/* Destination */}
          <div className="relative">
            <label className="label">Destination</label>
            <input
              type="text"
              placeholder="Start typing..."
              className="input input-bordered w-full"
              {...register("destination")}
              onChange={(e) => {
                register("destination").onChange(e);
                setQuery(e.target.value);
                setActiveField("destination");
              }}
            />
            {activeField === "destination" &&
              suggestions.length > 0 &&
              query.length > 1 && (
                <ul className="absolute z-10 bg-base-100 border mt-1 rounded-box max-h-48 overflow-y-auto w-full shadow">
                  {suggestions.map((city, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-base-200"
                        onClick={() => {
                          setValue("destination", city);
                          setQuery(city);
                          dispatch(clearSuggestions());
                          setSkipNextEffect(true);
                        }}
                      >
                        {city}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            {errors.destination && (
              <p className="text-error text-sm mt-1">
                {errors.destination.message}
              </p>
            )}
          </div>

          {/* Dates */}
          <div>
            <label className="label flex justify-between items-center">
              <span className="flex items-center gap-1">Trip Dates</span>
            </label>

            <Datepicker
              placeholder="My Placeholder"
              // inputClassName="w-full rounded-md focus:ring-0 font-normal bg-blue-300 placeholder:text-blue-100 text-white dark:bg-blue-900 dark:placeholder:text-blue-100"
              // inputClassName="input input-bordered w-full"
              inputClassName="input input-bordered w-full bg-base-100 text-base-content placeholder:text-base-content"
              // containerClassName="relative mt-3"
              displayFormat="DD/MM/YYYY"
              startFrom={START_FROM}
              useRange={false}
              value={selectedDate}
              onChange={(newValue) => onDateChange(newValue)}
            />
            {noDateError && (
              <p className="text-error text-sm mt-1">
                Please select a start and end date.
              </p>
            )}
            {dayRangeError && (
              <p className="text-error text-sm mt-1">
                Trip duration cannot exceed 15 days.
              </p>
            )}
          </div>
        </div>

        <div className="modal-action mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Generate Trip
          </button>
        </div>
      </form>
    </dialog>
  );
}
