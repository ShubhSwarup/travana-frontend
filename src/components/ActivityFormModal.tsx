import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { AppDispatch, RootState } from "../app/store";
import {
    fetchDestinationSuggestions,
} from "../features/destination/destinationThunk";
import { clearSuggestions } from "../features/destination/destinationSlice";
import { CATEGORY_OPTIONS } from "../utils/constants";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css"; // Or another theme if you prefer

export type ActivityFormValues = {
    _id: string;
    name: string;
    description?: string;
    location: string;
    category: string;
    time: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    expense?: {
        title?: string;
        amount?: number;
        category?: string;
        notes?: string;
    };
};

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialData?: ActivityFormValues | null;
}

export default function ActivityModal({ isOpen, onClose, initialData }: Props) {
    const locationRef = useRef<HTMLDivElement>(null);

    const [timeValue, setTimeValue] = useState<string>("12:00");

    useEffect(() => {
        if (isOpen && initialData) {
            reset(initialData); // <-- reset all fields
            const date = new Date(initialData.time);
            setDateValue({ startDate: date, endDate: date });
            setTimeValue(
                `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
            );
            setShowExpenseFields(!!initialData.expense);
        } else if (isOpen) {
            reset({});
            setDateValue({ startDate: null, endDate: null });
            setTimeValue("12:00");
            setShowExpenseFields(false);
        }
    }, [isOpen, initialData]);




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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        clearErrors,
        formState: { errors },
    } = useForm<ActivityFormValues>({
        defaultValues: initialData || {},
    });
    const [showExpenseFields, setShowExpenseFields] = useState<boolean>(
        !!initialData?.expense
    );

    const [query, setQuery] = useState<string>("");
    const [skipNextEffect, setSkipNextEffect] = useState(false);
    const { suggestions } = useSelector((state: RootState) => state.destination);
    const [dateValue, setDateValue] = useState<DateValueType>({
        startDate: null,
        endDate: null,
    });

    useEffect(() => {
        if (initialData?.time) {
            const date = new Date(initialData.time);
            setDateValue({ startDate: date, endDate: date });
            setValue("time", date.toISOString());
        }
    }, [initialData]);

    useEffect(() => {
        if (query.length < 2 || skipNextEffect) {
            setSkipNextEffect(false);
            return;
        }
        const debounce = setTimeout(() => {
            dispatch(fetchDestinationSuggestions(query));
        }, 500);
        return () => clearTimeout(debounce);
    }, [query]);


    const onSubmit = (data: ActivityFormValues) => {
        const payload = {
            ...data,
            time:
                dateValue && dateValue.startDate
                    ? new Date(dateValue.startDate).toISOString()
                    : "",
        };

        // Expense validation
        const { title, category, notes, amount } = data.expense || {};
        const hasExpenseFields = title || category || notes;
        if (showExpenseFields && hasExpenseFields && (amount === undefined || isNaN(amount))) {
            alert("Amount is required when adding an expense");
            return;
        }

        console.log(initialData ? "Edit payload:" : "Create payload:", payload);
        onClose();
    };


    return (
        <dialog
            className={`modal ${isOpen ? "modal-open" : ""} backdrop-blur-sm bg-black/30`}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="modal-box w-[95vw] max-w-md overflow-y-auto max-h-[90vh]"
            >
                <h3 className="font-bold text-xl mb-4 text-center">
                    {initialData ? "Edit Activity" : "Add Activity"}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="label">Name</label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            {...register("name", {
                                required: "Name is required",
                                minLength: { value: 2, message: "Minimum 2 characters" },
                            })}
                        />
                        {errors.name && (
                            <p className="text-error text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea
                            className="textarea textarea-bordered w-full"
                            {...register("description")}
                        />
                    </div>

                    <div className="relative" ref={locationRef}>
                        <label className="label">Location</label>
                        <input
                            className="input input-bordered w-full"
                            value={watch("location") || ""}
                            {...register("location", {
                                required: "Location is required",
                                minLength: { value: 2, message: "Minimum 2 characters" },
                            })}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuery(value);
                                setValue("location", value);
                            }}
                        />
                        {suggestions.length > 0 && (
                            <ul className="absolute z-10 bg-base-100 border mt-1 rounded-box max-h-40 overflow-y-auto w-full shadow">
                                {suggestions.map((cityObj, idx) => (
                                    <li key={idx}>
                                        <button
                                            type="button"
                                            className="w-full text-left px-4 py-2 hover:bg-base-200"
                                            onClick={() => {
                                                setValue("location", cityObj.display_name);
                                                setQuery(cityObj.display_name);
                                                dispatch(clearSuggestions());
                                                setSkipNextEffect(true);

                                                if (cityObj.lat && cityObj.lon) {
                                                    setValue("coordinates", {
                                                        lat: parseFloat(cityObj.lat),
                                                        lng: parseFloat(cityObj.lon),
                                                    });
                                                }
                                            }}
                                        >
                                            {cityObj.display_name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {errors.location && (
                            <p className="text-error text-sm">{errors.location.message}</p>
                        )}
                    </div>

                    {/* <div>
                        <label className="label">Date & Time</label>
                        <Datepicker
                            inputClassName="input input-bordered w-full"
                            displayFormat="DD/MM/YYYY"
                            value={dateValue}
                            onChange={(val) => {
                                setDateValue(val);
                                if (val?.startDate) {
                                    setValue("time", new Date(val.startDate).toISOString());
                                    clearErrors("time");
                                }
                            }}
                            useRange={false}
                            asSingle
                        />
                        <input
                            type="hidden"
                            {...register("time", {
                                required: "Date is required",
                            })}
                        />
                        {errors.time && (
                            <p className="text-error text-sm">{errors.time.message}</p>
                        )}
                    </div> */}
                    <div>
                        <label className="label">Date & Time</label>
                        <Datepicker
                            inputClassName="input input-bordered w-full"
                            displayFormat="DD/MM/YYYY"
                            value={dateValue}
                            onChange={(val) => {
                                setDateValue(val);
                                if (val?.startDate) {
                                    // Combine with existing time
                                    const [h, m] = timeValue.split(":");
                                    const dateWithTime = new Date(val.startDate);
                                    dateWithTime.setHours(+h, +m);
                                    setValue("time", dateWithTime.toISOString());
                                    clearErrors("time");
                                }
                            }}
                            useRange={false}
                            asSingle
                        />

                        <input
                            type="time"
                            className="input input-bordered w-full mt-2"
                            value={timeValue}
                            onChange={(e) => {
                                setTimeValue(e.target.value);
                                if (dateValue?.startDate) {
                                    const [h, m] = e.target.value.split(":");
                                    const updatedDate = new Date(dateValue.startDate);
                                    updatedDate.setHours(+h, +m);
                                    setValue("time", updatedDate.toISOString());
                                    clearErrors("time");
                                }
                            }}
                        />

                        <input
                            type="hidden"
                            {...register("time", {
                                required: "Date & time is required",
                            })}
                        />
                        {errors.time && (
                            <p className="text-error text-sm">{errors.time.message}</p>
                        )}
                    </div>



                    <div>
                        <label className="label">Category</label>
                        <select
                            {...register("category", {
                                required: "Category is required",
                            })}
                            className="select select-bordered w-full"
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {CATEGORY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-error text-sm">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">Add Expense</h4>
                        <input
                            type="checkbox"
                            className="toggle toggle-sm"
                            checked={showExpenseFields}
                            onChange={() => setShowExpenseFields((prev) => !prev)}
                        />
                    </div>

                    {showExpenseFields && (
                        <>
                            <input
                                type="text"
                                placeholder="Expense Title"
                                className="input input-bordered w-full mb-2"
                                {...register("expense.title")}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                className="input input-bordered w-full mb-2"
                                {...register("expense.amount", {
                                    valueAsNumber: true,
                                    min: {
                                        value: 0,
                                        message: "Amount must be positive",
                                    },
                                })}
                            />
                            <select
                                {...register("expense.category")}
                                className="select select-bordered w-full mb-2"
                                defaultValue={initialData?.expense?.category || ""}
                            >
                                <option value="" disabled>
                                    Expense category
                                </option>
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option.charAt(0).toUpperCase() + option.slice(1)}
                                    </option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Notes"
                                className="textarea textarea-bordered w-full"
                                {...register("expense.notes")}
                            />
                        </>
                    )}

                </div>

                <div className="modal-action mt-6 flex justify-end gap-3">
                    <button type="button" className="btn btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {initialData ? "Save Changes" : "Add Activity"}
                    </button>
                </div>
            </form>
        </dialog>
    );
}
