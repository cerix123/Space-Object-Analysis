import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    PointElement,
    LinearScale,
    LogarithmicScale,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

ChartJS.register(PointElement, LinearScale, LogarithmicScale, Tooltip, Legend, Title);

export default function DiagramPlanetsPage() {
    const [planets, setPlanets] = useState([]);
    const [xAxis, setXAxis] = useState('masa');
    const [yAxis, setYAxis] = useState('promien');


    const getAxisLabel = (axis) => {
        switch (axis) {
            case 'masa': return 'Masa [kg]';
            case 'promien': return 'Promień [km]';
            case 'odlegloscOdGwiazdy': return 'Odległość od Gwiazdy [km]';
            default: return axis;
        }
    };

    useEffect(() => {
        fetch("http://localhost:8080/api/planety")
            .then(res => res.json())
            .then(data => setPlanets(data._embedded?.planetaDTOList || []));
    }, []);

    const chartData = {
        datasets: [
            {
                label: "Planety",
                data: planets.map(p => ({ x: p[xAxis], y: p[yAxis] })),
                pointRadius: 10,
                backgroundColor: planets.map(p => p.maAtmosfere ? "rgba(0, 150, 255, 0.8)" : "rgba(255, 100, 100, 0.8)"),
                borderColor: planets.map(p => p.maAtmosfere ? "rgba(0, 100, 200, 1)" : "rgba(200, 50, 50, 1)"),
                pointStyle: 'circle',
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1500, easing: 'easeInOutBounce' },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: "#ffffff !important",
                    fontColor: "#ffffff",
                    usePointStyle: true,
                    boxWidth: 20,
                    padding: 20,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    generateLabels: (chart) => [
                        {
                            text: "Ma atmosferę",
                            fontColor: "#ffffff",
                            fillStyle: "rgba(0, 150, 255, 0.9)",
                            strokeStyle: "rgba(0, 100, 200, 1)",
                            lineWidth: 2,
                            hidden: false,
                            index: 0
                        },
                        {
                            text: "Brak atmosfery",
                            fillStyle: "rgba(255, 100, 100, 0.9)",
                            strokeStyle: "rgba(200, 50, 50, 1)",
                            lineWidth: 2,
                            hidden: false,
                            index: 1
                        }
                    ]
                }
            },
            tooltip: {
                titleFont: { size: 18, weight: 'bold' },
                bodyFont: { size: 16 },
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                callbacks: {
                    label: (ctx) => {
                        const planet = planets[ctx.dataIndex];
                        return `${planet.nazwa}: ${getAxisLabel(xAxis)} = ${planet[xAxis]?.toExponential(2) || 'brak danych'}, ${getAxisLabel(yAxis)} = ${planet[yAxis]?.toExponential(2) || 'brak danych'}, Atmosfera = ${planet.maAtmosfere ? "tak" : "nie"}`;
                    }
                }
            },
            title: {
                display: true,
                text: "Diagram Planet - Masa, Promień i Odległość",
                color: "#ffffff",
                font: { size: 24, weight: "bold" },
                padding: { top: 20, bottom: 20 }
            }
        },
        scales: {
            x: {
                type: "logarithmic",
                title: { display: true, text: getAxisLabel(xAxis), color: "#ffffff", font: { size: 20, weight: "bold" } },
                ticks: { color: "#f0f0f0", font: { size: 16 } },
                grid: { color: "rgba(255,255,255,0.1)" }
            },
            y: {
                type: "logarithmic",
                title: { display: true, text: getAxisLabel(yAxis), color: "#ffffff", font: { size: 20, weight: "bold" } },
                ticks: { color: "#f0f0f0", font: { size: 16 } },
                grid: { color: "rgba(255,255,255,0.1)" }
            }
        }
    };

    return (
        <div style={{
            padding: "20px",
            width: "100%",
            height: "100vh",
            background: "linear-gradient(to bottom, #111, #222)",
            color: "white",
            boxSizing: "border-box",
            borderRadius: "10px",
            boxShadow: "0 0 20px rgba(0, 150, 255, 0.3)"
        }}>
            <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>Diagram planet – wybierz osie! </h1>
            <p style={{ fontSize: "18px", marginBottom: "20px" }}>
                Masa vs promień vs odległość od gwiazdy. Kolor: niebieski = ma atmosferę, czerwony = brak.
            </p>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <select
                    value={xAxis}
                    onChange={(e) => setXAxis(e.target.value)}
                    style={{ padding: "10px", fontSize: "16px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }}
                >
                    <option value="masa">Masa</option>
                    <option value="promien">Promień</option>
                    <option value="odlegloscOdGwiazdy">Odległość od Gwiazdy</option>
                </select>
                <select
                    value={yAxis}
                    onChange={(e) => setYAxis(e.target.value)}
                    style={{ padding: "10px", fontSize: "16px", borderRadius: "5px", background: "#333", color: "white", border: "1px solid #555" }}
                >
                    <option value="promien">Promień</option>
                    <option value="masa">Masa</option>
                    <option value="odlegloscOdGwiazdy">Odległość od Gwiazdy</option>
                </select>
            </div>
            <div style={{ width: "100%", height: "70vh" }}>
                <Scatter data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}