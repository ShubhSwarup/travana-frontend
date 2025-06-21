import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchDestinationSuggestions } from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";
import { Info } from "lucide-react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { format } from "date-fns";

// ✅ No validation for dates now
const tripSchema = z.object({
  title: z.string().min(3, "Title too short").max(50),
  description: z.string().max(300).optional(),
  destination: z.string().min(2, "Enter a valid destination"),
});

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
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

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
    if (query.length < 2 || skipNextEffect) {
      setSkipNextEffect(false);
      return;
    }
    const debounceTimeout = setTimeout(() => {
      dispatch(fetchDestinationSuggestions(query));
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [query, dispatch]);

  const onSubmit = (data: TripFormData) => {
    const formattedStartDate =
      selectedDate?.startDate instanceof Date
        ? format(selectedDate.startDate, "yyyy-MM-dd")
        : "";

    const formattedEndDate =
      selectedDate?.endDate instanceof Date
        ? format(selectedDate.endDate, "yyyy-MM-dd")
        : "";

    const tripPayload = {
      ...data,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    console.log("Trip payload:", tripPayload);
    onClose();
  };

  const handleUnplanned = () => {
    setSelectedDate({ startDate: null, endDate: null });
  };

  return (
    <dialog
      id="create_trip_modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
    >
      <form
        method="dialog"
        // className="modal-box w-full max-w-lg sm:max-w-xl mx-auto"
        className="modal-box w-[95vw] max-w-md sm:max-w-xl mx-auto overflow-y-auto max-h-[90vh]"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-bold text-xl mb-6 text-center">
          Create a New Trip
        </h3>
<p className="text-sm text-center text-base-content mt-2 mb-6 px-2 sm:px-6">
  Manually plan your trip by setting a title, destination, optional description, and travel dates. You can also leave the dates empty for unplanned trips.
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
              // <ul className="absolute z-10 bg-base-100 border mt-1 rounded-box max-h-48 overflow-y-auto w-full shadow">
           <ul className="absolute left-0 right-0 z-10 bg-base-100 border mt-1 rounded-box max-h-48 overflow-y-auto shadow">

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
              <span className="flex items-center gap-1">
                Trip Dates
                <span
                  className="tooltip tooltip-right"
                  data-tip="Leave both dates empty for an unplanned trip."
                >
                  <Info className="w-4 h-4 text-neutral-content" />
                </span>
              </span>
            </label>

            {/* <Datepicker
              value={selectedDate}
              onChange={handleDateChange}
              useRange={true}
              displayFormat="DD MMM YYYY"
              inputClassName="input input-bordered w-full"
              primaryColor="blue"
            /> */}
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
              onChange={(newValue) => setSelectedDate(newValue)}
            />
          </div>
        </div>

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
