import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    CartesianGrid,
} from "recharts";

const dummyBudgetData = {
    totalSpent: 126000,
    categoryBreakdown: {
        travel: 55000,
        stay: 45000,
        food: 20000,
        transport: 6000,
    },
    dailySpending: {
        "2025-06-20": 126000,
    },
    topExpenses: [
        {
            _id: "1",
            title: "Flight",
            amount: 55000,
            category: "travel",
            notes: "Estimated by AI",
            generatedByAI: true,
            date: "2025-06-20T08:33:01.030Z",
        },
        {
            _id: "2",
            title: "Accommodation",
            amount: 45000,
            category: "stay",
            notes: "Estimated by AI",
            generatedByAI: true,
            date: "2025-06-20T08:33:01.057Z",
        },
        {
            _id: "3",
            title: "Food",
            amount: 20000,
            category: "food",
            notes: "Estimated by AI",
            generatedByAI: true,
            date: "2025-06-20T08:33:01.081Z",
        },
        {
            _id: "4",
            title: "Transport",
            amount: 6000,
            category: "transport",
            notes: "Estimated by AI",
            generatedByAI: true,
            date: "2025-06-20T08:33:01.105Z",
        },
    ],
};

const COLORS = ["#6366F1", "#F59E0B", "#10B981", "#EF4444"];

const BudgetTab = () => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const { totalSpent, categoryBreakdown, topExpenses, dailySpending } =
        dummyBudgetData;

    const pieData = Object.entries(categoryBreakdown).map(([key, value]) => ({
        name: key,
        value,
    }));

    const barData = Object.entries(dailySpending).map(([date, amount]) => ({
        date,
        amount,
    }));

    return (
        <div className="p-4 max-w-screen-xl mx-auto">
            {/* Header with Date Range */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">Budget Overview</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                    <label className="label">Date Range:</label>
                    <input type="date" className="input input-sm" />
                    <span>to</span>
                    <input type="date" className="input input-sm" />
                </div>
            </div>

            {/* Total + Bar Graph */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-base-100 p-4 rounded-xl shadow col-span-1">
                    <h2 className="text-xl font-semibold mb-2">Total Spent</h2>
                    <p className="text-3xl font-bold text-primary">
                        ₹{totalSpent.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Across all categories</p>
                </div>

                <div className="bg-base-100 p-4 rounded-xl shadow col-span-1 md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Daily Spending</h2>
                    <ResponsiveContainer width="100%" height={isMobile ? 160 : 240}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart + Top Expenses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-base-100 p-4 rounded-xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
                    <ResponsiveContainer
                        width="100%"
                        height={isMobile ? 180 : 280}
                        className="mx-auto"
                    >
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={isMobile ? 70 : 100}
                                label
                            >
                                {pieData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-base-100 p-4 rounded-xl shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Top Expenses</h2>
                        <button className="btn btn-sm btn-outline">View All</button>
                    </div>
                    <ul className="space-y-3">
                        {topExpenses.map((exp) => (
                            <li
                                key={exp._id}
                                className="border border-base-300 rounded-lg p-3 flex justify-between gap-4 items-start"
                            >
                                <div className="min-w-0">
                                    <h3 className="font-medium text-sm truncate">
                                        {exp.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {exp.category}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(exp.date).toDateString()}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-semibold text-primary whitespace-nowrap">
                                        ₹{exp.amount.toLocaleString()}
                                    </p>
                                    <button className="btn btn-xs btn-link text-xs text-blue-500">
                                        Edit
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Floating Add Expense Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="dropdown dropdown-top dropdown-end">
                    <label tabIndex={0} className="btn btn-primary btn-circle btn-lg">
                        <Plus className="w-5 h-5" />
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
                        <li>
                            <a onClick={() => console.log("Open AddExpenseModal")}>Add Expense</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BudgetTab;
