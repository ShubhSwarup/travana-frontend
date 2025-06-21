// CreateTripModal.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect, useRef } from "react";
import { format, differenceInDays } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../app/store";
import { fetchDestinationSuggestions } from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";
import { Info } from "lucide-react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useClickOutside } from "../hooks/useClickOutside";

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
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
  });

  const calendarRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const { suggestions } = useSelector((state: RootState) => state.destination);
  const [skipNextEffect, setSkipNextEffect] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const tripDuration =
    dateRange[0].startDate && dateRange[0].endDate
      ? differenceInDays(
          new Date(dateRange[0].endDate),
          new Date(dateRange[0].startDate)
        ) + 1
      : null;

  useClickOutside(calendarRef, () => setShowDatePicker(false));

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
    console.log("Trip payload:", data);
    onClose();
  };

  const handleDateSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    setValue("startDate", format(startDate, "yyyy-MM-dd"));
    setValue("endDate", format(endDate, "yyyy-MM-dd"));

    // if (startDate && endDate && startDate !== endDate) {
    //   setTimeout(() => setShowDatePicker(false), 150);
    // }
  };

  const handleUnplanned = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setValue("startDate", "");
    setValue("endDate", "");
    setShowDatePicker(false);
  };

  return (
    <dialog
      id="create_trip_modal"
      className={`modal ${isOpen ? "modal-open" : ""}`}
    >
      <form
        method="dialog"
        className="modal-box w-full max-w-lg sm:max-w-xl mx-auto"
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
              <span className="flex items-center gap-1">
                Trip Dates
                <span
                  className="tooltip tooltip-right"
                  data-tip="Leave both dates empty for a planned trip."
                >
                  <Info className="w-4 h-4 text-neutral-content" />
                </span>
              </span>
              {tripDuration !== null && (
                <span className="text-sm text-base-content opacity-80">
                  {tripDuration} {tripDuration === 1 ? "day" : "days"}
                </span>
              )}
            </label>

            <input
              type="text"
              readOnly
              className="input input-bordered cursor-pointer w-full"
              value={
                dateRange[0].startDate && dateRange[0].endDate
                  ? `${format(dateRange[0].startDate, "dd MMM yyyy")} → ${format(dateRange[0].endDate, "dd MMM yyyy")}`
                  : "Select date range"
              }
              onClick={() => setShowDatePicker(!showDatePicker)}
            />

            {showDatePicker && (
              <div
                className="relative z-50 mt-2 w-max mx-auto sm:mx-0"
                ref={calendarRef}
              >
                <DateRange
                  // className="calendar-popup"
                  editableDateInputs={true}
                  onChange={handleDateSelect}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  // className="rounded-lg shadow-md custom-calendar"
                  // rangeColors={["#2563eb"]}
                  className="custom-calendar"
                  rangeColors={["hsl(var(--p))"]}
                  maxDate={new Date("2100-12-31")}
                />
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleUnplanned}
              >
                Unplanned
              </button>
            </div>

            {errors.endDate && (
              <p className="text-error text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
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
