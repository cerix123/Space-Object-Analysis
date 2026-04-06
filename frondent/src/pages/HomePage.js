import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

function HomePage({ username, onLogout }) {
    const navigate = useNavigate();

    const elements = [
        { name: "Planety", path: "/elementy/planety", description: "Ciała niebieskie krążące wokół gwiazd, mogą mieć atmosferę i księżyce." },
        { name: "Gwiazdy", path: "/elementy/gwiazdy", description: "Ogniste kule gazu emitujące światło i energię, np. Słońce." },
        { name: "Asteroidy", path: "/elementy/asteroidy", description: "Małe skalne ciała w Układzie Słonecznym, najczęściej w pasie asteroid." },
        { name: "Galaktyki", path: "/elementy/galaktyka", description: "Ogromne systemy gwiazd, gazu i ciemnej materii, np. Droga Mleczna." },
        { name: "Gwiazdozbiory", path: "/elementy/gwiazdozbior", description: "Układy gwiazd tworzące charakterystyczne wzory na niebie." },
        { name: "Księżyce", path: "/elementy/ksiezyce", description: "Naturalne satelity krążące wokół planet." },
        { name: "Czarne Dziury", path: "/elementy/czarnedziury", description: "Obiekty o tak silnej grawitacji, że nic nie może uciec, nawet światło." }
    ];

    const [modalContent, setModalContent] = useState(null);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
                color: "#e0e0e0",
                overflow: "hidden"
            }}
        >
            <Navbar username={username} onLogout={onLogout} />

            <div style={{ padding: "50px 20px", textAlign: "center" }}>
                <h2 style={{ fontSize: "2rem", color: "#90e0ef" }}>
                    Witaj na stronie głównej {username}!
                </h2>
                <p style={{ color: "#adb5bd", marginTop: "10px" }}>
                    Wybierz kategorię obiektów kosmicznych, które chcesz przeglądać:
                </p>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "40px",
                        marginTop: "40px",
                        padding: "0 20px",
                        justifyItems: "center",
                    }}
                >
                    {elements.map((el) => (
                        <div key={el.name} style={{ textAlign: "center" }}>
                            {/* Kafelek */}
                            <div
                                onClick={() => navigate(el.path)}
                                style={{
                                    background: "rgba(13, 27, 42, 0.85)",
                                    border: "1px solid #00b4d8",
                                    borderRadius: "12px",
                                    padding: "25px",
                                    cursor: "pointer",
                                    color: "#caf0f8",
                                    boxShadow: "0 0 15px rgba(0, 180, 216, 0.6)",
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.08)";
                                    e.currentTarget.style.boxShadow =
                                        "0 0 30px rgba(0, 180, 216, 0.9)";
                                    e.currentTarget.style.color = "#fff";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow =
                                        "0 0 15px rgba(0, 180, 216, 0.6)";
                                    e.currentTarget.style.color = "#caf0f8";
                                }}
                            >
                                <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{el.name}</h3>
                            </div>

                            <button
                                onClick={() => setModalContent(el)}
                                style={{
                                    marginTop: "10px",
                                    padding: "6px 12px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    background: "#90e0ef",
                                    color: "#000",
                                    fontWeight: "bold"
                                }}
                            >
                                Więcej info
                            </button>
                        </div>
                    ))}
                </div>
            </div>


            {modalContent && (
                <div
                    onClick={() => setModalContent(null)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: "#111",
                            padding: "30px",
                            borderRadius: "12px",
                            maxWidth: "500px",
                            width: "90%",
                            color: "#fff",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ marginBottom: "15px" }}>{modalContent.name}</h3>
                        <p style={{ marginBottom: "20px" }}>{modalContent.description}</p>
                        <button
                            onClick={() => setModalContent(null)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "none",
                                cursor: "pointer",
                                background: "#00b4d8",
                                color: "#fff",
                                fontWeight: "bold"
                            }}
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomePage;
