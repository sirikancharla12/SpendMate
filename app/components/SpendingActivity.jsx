"use client";

import { useTheme } from "next-themes";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

export default function SpendingActivty() {
    const { theme } = useTheme();

    // Determine colors based on theme (simplified approach)
    const isDark = theme === "dark";
    const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    const textColor = isDark ? "#9ca3af" : "#64748b";

    const chartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Spent",
                data: [300, 500, 200, 400],
                borderColor: "#3b82f6", // Fintech Blue
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null;
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, "rgba(59, 130, 246, 0.25)");
                    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)");
                    return gradient;
                },
                pointBackgroundColor: "#3b82f6",
                pointBorderColor: isDark ? "#1e293b" : "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                titleColor: isDark ? "#f8fafc" : "#0f172a",
                bodyColor: isDark ? "#cbd5e1" : "#334155",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                borderWidth: 1,
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: (context) => `Spent: ₹${context.raw}`
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: textColor, font: { size: 12 } },
            },
            y: {
                grid: { color: gridColor, borderDash: [4, 4] },
                ticks: { display: false },
                border: { display: false }
            },
        },
    };

    return (
        <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6 w-full h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Spending Activity</h2>
                    <p className="text-sm text-muted-foreground">Weekly Overview</p>
                </div>
                {/* Optional: Filter Dropdown could go here */}
            </div>

            <div className="h-[300px] w-full">
                <Line data={chartData} options={options} key={theme} />
            </div>
        </div>
    );
}
