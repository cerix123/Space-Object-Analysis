import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
    Chart as ChartJS,
    PointElement,
    LinearScale,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(PointElement, LinearScale, Tooltip, Legend);

export default function DiagramHRPage() {
    const [stars, setStars] = useState([]);
    const [selectedStarIds, setSelectedStarIds] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/gwiazdy")
            .then(res => res.json())
            .then(data => setStars(data._embedded?.gwiazdaDTOList || []));
    }, []);
    const [search, setSearch] = useState("");

    const starsForChart =
        selectedStarIds.length === 0
            ? stars
            : stars.filter(s => selectedStarIds.includes(s.id));

    const toggleStar = (id) => {
        setSelectedStarIds(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };
    const filteredStars = stars.filter(s =>
        s.nazwa.toLowerCase().includes(search.toLowerCase())
    );

    const chartData = {
        datasets: [
            {
                label: "Gwiazdy",
                data: starsForChart.map(star => ({
                    x: Math.log10(star.temperatura),
                    y: Math.log10(star.jasnosc || 1),
                })),
                pointRadius: 7,
                backgroundColor: starsForChart.map(star => {
                    const t = star.temperatura;
                    if (t >= 30000) return "rgb(80,180,255)";
                    if (t >= 10000) return "rgb(120,160,255)";
                    if (t >= 7500) return "rgb(170,190,255)";
                    if (t >= 6000) return "rgb(255,255,200)";
                    if (t >= 5200) return "rgb(255,255,120)";
                    if (t >= 3700) return "rgb(255,180,90)";
                    return "rgb(255,90,60)";
                }),
            },
        ],
    };
    const LegendItem = ({ color, title, desc }) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{
                width: "18px",
                height: "18px",
                background: color,
                marginTop: "4px",
                borderRadius: "3px"
            }} />
            <div>
                <strong>{title}</strong>
                <div style={{ fontSize: "13px", color: "#ccc" }}>{desc}</div>
            </div>
        </div>
    );

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const star = starsForChart[ctx.dataIndex];
                        return `${star.nazwa} | T=${star.temperatura} K | L=${star.jasnosc}`;
                    },
                },
            },
        },
        scales: {
            x: {
                reverse: true,
                title: {
                    display: true,
                    text: "log(Temperatura)",
                    color: "#fff",
                    font: { size: 18, weight: "bold" },
                },
                ticks: { color: "#eee" },
                grid: { color: "rgba(255,255,255,0.1)" },
            },
            y: {
                title: {
                    display: true,
                    text: "log(Jasność)",
                    color: "#fff",
                    font: { size: 18, weight: "bold" },
                },
                ticks: { color: "#eee" },
                grid: { color: "rgba(255,255,255,0.1)" },
            },
        },
    };

    return (
        <div style={{ padding: "20px", background: "#111", color: "#fff", minHeight: "100vh" }}>
            <h1 style={{ fontSize: "32px" }}>Diagram Hertzsprunga–Russella</h1>

            <p style={{ color: "#90e0ef" }}>
                Wykres oparty na temperaturze i jasności gwiazd.
            </p>

            <p style={{ fontSize: "16px", marginBottom: "20px", color: "#ccc", lineHeight: 1.5 }}>
                Ten uproszczony diagram HR pokazuje zależność między temperaturą a jasnością gwiazd.
                Gwiazdy gorętsze są po lewej, zimniejsze po prawej. Jasność jest na skali logarytmicznej,
                więc duże różnice w prawdziwej jasności są dobrze widoczne. Kolory punktów odpowiadają barwie gwiazd.
            </p>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "10px",
                marginBottom: "20px"
            }}>
                <LegendItem color="rgb(80,180,255)" title="Bardzo gorące gwiazdy"
                            desc=" (≥30 000 K)" />

                <LegendItem color="rgb(120,160,255)" title="Gorące gwiazdy"
                            desc="10 000–30 000 K" />

                <LegendItem color="rgb(170,190,255)" title="Nieco gorące gwiazdy"
                            desc="7 500–10 000 K" />

                <LegendItem color="rgb(255,255,200)" title="Gwiazdy umiarkowane"
                            desc="6 000–7 500 K" />

                <LegendItem color="rgb(255,255,120)" title="Chłodne gwiazdy"
                            desc="5 200–6 000 K" />

                <LegendItem color="rgb(255,180,90)" title="Bardzo chłodne gwiazdy"
                            desc="3 700–5 200 K" />

                <LegendItem color="rgb(255,90,60)" title="Zimne gwiazdy"
                            desc="&lt;3700 K" />
            </div>


            <div style={{
                display: "grid",
                gridTemplateColumns: "300px 1fr",
                gap: "20px",
                height: "65vh"
            }}>
           <div
                style={{
                    background: "#0d1b2a",
                    border: "1px solid #00b4d8",
                    borderRadius: "10px",
                    padding: "10px",
                    overflowY: "auto",
                }}
            >
                <input
                    type="text"
                    placeholder="🔍 Szukaj gwiazdy..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        width: "100%",
                        marginBottom: "10px",
                        padding: "6px 8px",
                        borderRadius: "6px",
                        border: "1px solid #00b4d8",
                        background: "#111",
                        color: "#fff",
                    }}
                />

                <h3 style={{ color: "#90e0ef", marginBottom: "4px" }}>
                    Wybór gwiazd do wykresu
                </h3>
                <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "10px" }}>
                    Nic nie zaznaczone = wszystkie
                </p>

                {filteredStars.map((s) => {
                    const checked = selectedStarIds.includes(s.id);

                    return (
                        <div
                            key={s.id}
                            onClick={() => toggleStar(s.id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "6px 8px",
                                marginBottom: "4px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                background: checked ? "#003049" : "transparent",
                                transition: "background 0.2s",
                            }}
                        >
                <span
                    style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "200px",
                        fontSize: "14px",
                    }}
                    title={s.nazwa}
                >
                    {s.nazwa}
                </span>

                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleStar(s.id)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                }}
                            />
                        </div>
                    );
                })}
            </div>



                <div style={{ position: "relative" }}>
                    <Scatter data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
}
