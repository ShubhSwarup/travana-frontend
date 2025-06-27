import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import { Expense } from "../../types/trips";
import { expenseCategoryColors } from "../../utils/categoryColors";

interface Props {
    expenses: Expense[];
    tripId: string;
}

function ExpensesPreview({ expenses, tripId }: Props) {
    const [showChart, setShowChart] = useState(true);

    const groupedExpenses = useMemo(() => {
        const categoryTotals: Record<string, number> = {};
        expenses.forEach((exp) => {
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
        });

        return Object.entries(categoryTotals).map(([category, amount]) => ({
            category,
            amount,
        }));
    }, [expenses]);

    return (
        // <div className={`bg-base-200 rounded-xl p-4 shadow-sm ${showChart ? "h-5 sm:h-72" : "h-auto"}`}>

        // <div className="bg-base-200 rounded-xl p-4 shadow-sm h-full min-h-[220px]">
        // <div
        //     className={`bg-base-200 rounded-xl p-4 shadow-sm ${showChart ? "h-72" : "h-auto"
        //         }`}
        // >
        <div
            className={`bg-base-200 rounded-xl p-4 shadow-sm transition-all duration-300 "h-auto"
                }`}
        >



            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">Expenses Summary</h2>
                <Link
                    to={`/trip/${tripId}/expenses`}
                    className="text-sm text-primary hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* DaisyUI Toggle */}
            <div className="form-control w-fit mb-3">
                <label className="label cursor-pointer gap-2">
                    <span className="label-text text-sm">
                        {showChart ? "Pie View" : "List View"}
                    </span>
                    <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={showChart}
                        onChange={() => setShowChart((prev) => !prev)}
                    />
                </label>
            </div>

            {/* Chart or List */}
            {
                showChart ? (
                    // <div className="h-44 sm:h-52">
                    <div className="h-44 sm:h-52 min-w-0 overflow-hidden">

                        <ResponsiveContainer width="100%" height="100%" className="overflow-hidden">

                            <PieChart>
                                <Pie
                                    data={groupedExpenses}
                                    dataKey="amount"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={85}
                                    label={({ percent }) =>
                                        percent ? `${(percent * 100).toFixed(0)}%` : ""
                                    }
                                >
                                    {groupedExpenses.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={expenseCategoryColors[entry.category] || "#8884d8"}
                                            stroke="#ffffff"
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {expenses.slice(0, 4).map((exp, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow-sm gap-2 flex-wrap"
                            >
                                <div className="min-w-0">
                                    <p className="font-medium capitalize truncate">{exp.title || exp.category}</p>
                                    <p className="text-sm text-gray-500 truncate">{exp.category}</p>
                                </div>
                                <p className="text-right font-semibold text-primary text-sm whitespace-nowrap">
                                    ₹{exp.amount.toFixed(2)}
                                </p>
                            </div>

                        ))}
                    </div>
                )
            }
        </div >
    );
}

export default ExpensesPreview;
