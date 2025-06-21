// CreateTripModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import debounce from "lodash/debounce";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchDestinationSuggestions } from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";
import { Info } from "lucide-react";
import { differenceInDays } from "date-fns";

const tripSchema = z
  .object({
    title: z.string().min(3, "Title too short").max(50),
    description: z.string().max(300).optional(),
    destination: z.string().min(2, "Enter a valid destination"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.startDate && !data.endDate) ||
        (!data.startDate && data.endDate)
      ) {
        return false;
      }
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Start and end dates must both be filled and valid",
      path: ["endDate"],
    }
  );

export type TripFormData = z.infer<typeof tripSchema>;

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTripModal({
  isOpen,
  onClose,
}: CreateTripModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const [query, setQuery] = useState("");
  //   const [suggestions, setSuggestions] = useState<string[]>([]);
  const { suggestions, loading } = useSelector(
    (state: RootState) => state.destination
  );
  const [skipNextEffect, setSkipNextEffect] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localStartDate, setLocalStartDate] = useState<string>("");
  const [localEndDate, setLocalEndDate] = useState<string>("");

  const tripDuration =
    localStartDate && localEndDate
      ? differenceInDays(new Date(localEndDate), new Date(localStartDate)) + 1
      : null;

  useEffect(() => {
    if (query.length < 2 || skipNextEffect) {
      setSkipNextEffect(false); // reset after skip
      return;
    }
    const debounceTimeout = setTimeout(() => {
      dispatch(fetchDestinationSuggestions(query));
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [query, dispatch]);

  const onSubmit = (data: TripFormData) => {
    console.log("Trip payload:", data);
    onClose();
  };

  const handleDateSelect = () => {
    if (localStartDate && localEndDate) {
      setValue("startDate", localStartDate);
      setValue("endDate", localEndDate);
    }
    setShowDatePicker(false);
  };

  const handleUnpannedDates = () => {
    if (localStartDate && localEndDate) {
      setValue("startDate", "");
      setValue("endDate", "");
    }
    setLocalStartDate("");
    setLocalEndDate("");
    setShowDatePicker(false);
  };
  return (
    <dialog
      id="create_trip_modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
    >
      <form
        method="dialog"
        className="modal-box w-full max-w-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-bold text-xl mb-6 text-center">
          Create a New Trip
        </h3>

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
              }}
            />
            {suggestions.length > 0 && (
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
              <span>
                Trip Dates
                <span
                  className="tooltip tooltip-right ml-2"
                  data-tip="Leave both dates empty for a planned trip."
                >
                  <Info className="inline-block w-4 h-4 text-neutral-content" />
                </span>
              </span>
              {tripDuration !== null && (
                <span className="text-sm text-base-content opacity-80">
                  {tripDuration} {tripDuration === 1 ? "day" : "days"}
                </span>
              )}
            </label>

            {!showDatePicker && (
              <input
                type="text"
                readOnly
                value={
                  localStartDate && localEndDate
                    ? `${localStartDate} → ${localEndDate}`
                    : "Select date range"
                }
                onClick={() => setShowDatePicker(true)}
                className="input input-bordered w-full cursor-pointer"
              />
            )}

            {showDatePicker && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 mt-2">
                <input
                  type="date"
                  className="input input-bordered w-full sm:w-auto"
                  value={localStartDate}
                  onChange={(e) => setLocalStartDate(e.target.value)}
                />
                <span className="text-center sm:px-2">to</span>
                <input
                  type="date"
                  className="input input-bordered w-full sm:w-auto"
                  value={localEndDate}
                  onChange={(e) => setLocalEndDate(e.target.value)}
                />
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleDateSelect}
                  >
                    Set
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={handleUnpannedDates}
                  >
                    Unplanned
                  </button>
                </div>
              </div>
            )}
            {errors.endDate && (
              <p className="text-error text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Modal action */}
        <div className="modal-action mt-6 flex justify-end gap-3">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Trip
          </button>
        </div>
      </form>
    </dialog>
  );
}
