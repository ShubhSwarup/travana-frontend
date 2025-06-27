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
    const [showChart, setShowChart] = useState(true); // Toggle between chart and list

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
        <div className="bg-base-200 rounded-xl p-4 shadow-sm h-full">
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
            <div className="form-control w-fit mb-4">
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

            {/* Conditional Chart/List View */}
            {showChart ? (
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={groupedExpenses}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                innerRadius={50} // Donut effect
                                outerRadius={80}
                                label={({ percent }) => `${percent && (percent * 100).toFixed(0)}%`} // clean % labels
                            >
                                {groupedExpenses.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={expenseCategoryColors[entry.category] || "#8884d8"}
                                        stroke="#fff" // border
                                        strokeWidth={2}
                                    />
                                ))}
                            </Pie>

                            {/* <Pie
                                data={groupedExpenses}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {groupedExpenses.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={expenseCategoryColors[entry.category] || "#8884d8"}
                                    />
                                ))}
                            </Pie> */}
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="space-y-2">
                    {expenses.map((exp, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between items-center bg-base-100 p-3 rounded-lg shadow"
                        >
                            <div>
                                <p className="font-medium capitalize">
                                    {exp.title || exp.category}
                                </p>
                                <p className="text-sm text-gray-500">{exp.category}</p>
                            </div>
                            <p className="text-right font-semibold text-primary">
                                ₹{exp.amount.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default ExpensesPreview;
