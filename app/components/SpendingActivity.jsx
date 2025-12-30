"use client";

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

    const chartData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Spent",
                data: [300, 500, 200, 400],
                borderColor: "rgba(12, 84, 199, 0.4)",
                borderWidth: 2,
                tension: 0.45,
                fill: true,

                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) return null;

                    const gradient = ctx.createLinearGradient(
                        0,
                        chartArea.top,
                        0,
                        chartArea.bottom
                    );

                    gradient.addColorStop(0, "rgba(12, 84, 199, 0.4)");
                    gradient.addColorStop(1, "rgba(59,130,246,0)");

                    return gradient;
                },


            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#9ca3af" },
            },
            y: {
                grid: { color: "rgba(255,255,255,0.05)" },
                ticks: { display: false },
            },
        },
    };

    return (
        <div className="bg-[#1e2430] p-4 rounded-lg w-full h-100 pb-6 pt-6">
            <h2 className="text-white font-semibold mb-3">
                Spending Activity
            </h2>

            <div className="h-full">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
