import { useEffect, useState, Fragment } from "react";

function PlanetyPage({ user }) {
    const [planety, setPlanety] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPlaneta, setEditingPlaneta] = useState(null);
    const [sortField, setSortField] = useState("masa");
    const [sortDirection, setSortDirection] = useState("asc");

    const [nazwa, setNazwa] = useState("");
    const [masa, setMasa] = useState("");
    const [promien, setPromien] = useState("");
    const [maAtmosfere, setMaAtmosfere] = useState(false);
    const [odlegloscOdGwiazdy, setOdlegloscOdGwiazdy] = useState("");
    const [gwiazdaId, setGwiazdaId] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentPlanety = planety.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(planety.length / itemsPerPage);


    const tooltipContainer = {
        position: "relative",
        display: "inline-block",
        marginLeft: "6px",
        cursor: "pointer",
    };

    const tooltipBubble = {
        visibility: "hidden",
        width: "220px",
        backgroundColor: "#003049",
        color: "#fff",
        textAlign: "left",
        borderRadius: "8px",
        padding: "10px",
        position: "absolute",
        zIndex: 9999,
        bottom: "125%",
        left: "50%",
        marginLeft: "-110px",
        boxShadow: "0 0 10px #00b4d8",
        fontSize: "0.85rem",
    };

    const tooltipContainerHover = {
        ...tooltipBubble,
        visibility: "visible",
    };


    function Tooltip({ text }) {
        const [hover, setHover] = useState(false);

        return (
            <span
                style={tooltipContainer}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
            ❓
            <span style={hover ? tooltipContainerHover : tooltipBubble}>
                {text}
            </span>
        </span>
        );
    }



    const fetchPlanety = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/planety", {
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            if (!res.ok) throw new Error("Nie udało się pobrać planet");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.planetaDTOList ||
                embedded.planetas ||
                Object.values(embedded)[0] ||
                data;

            const final = Array.isArray(lista) ? lista : [lista];
            setPlanety(applySorting(final));
            setCurrentPage(1);


        } catch (err) {
            setError("Błąd pobierania planet: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    const applySorting = (data) => {
        let sorted = [...data];
        sorted.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            if (valA == null) return 1;
            if (valB == null) return -1;

            if (typeof valA === "string") {
                return sortDirection === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            } else {
                return sortDirection === "asc"
                    ? valA - valB
                    : valB - valA;
            }
        });
        return sorted;
    };

    useEffect(() => {
        fetchPlanety();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const resetForm = () => {
        setNazwa("");
        setMasa("");
        setPromien("");
        setMaAtmosfere(false);
        setOdlegloscOdGwiazdy("");
        setGwiazdaId("");
        setGalaktykaId("");
    };


    const handleAddPlaneta = async () => {
        try {
            const newPlaneta = {
                nazwa,
                masa: parseFloat(masa),
                promien: parseFloat(promien),
                maAtmosfere,
                odlegloscOdGwiazdy: parseFloat(odlegloscOdGwiazdy),
                gwiazdaId: gwiazdaId ? parseInt(gwiazdaId) : null,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                utworzylUsername: user?.username
            };

            const res = await fetch("http://localhost:8080/api/planety", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlaneta)
            });

            if (!res.ok) throw new Error("Nie udało się dodać planety");
            await fetchPlanety();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć tę planetę?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/planety/${id}?username=${user?.username}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Nie udało się usunąć planety");
            await fetchPlanety();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = (planeta) => {
        setEditingPlaneta(planeta);
        setNazwa(planeta.nazwa);
        setMasa(planeta.masa);
        setPromien(planeta.promien);
        setMaAtmosfere(planeta.maAtmosfere);
        setOdlegloscOdGwiazdy(planeta.odlegloscOdGwiazdy);
        setGwiazdaId(planeta.gwiazdaId || "");
        setGalaktykaId(planeta.galaktykaId || "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        try {
            const updatedPlaneta = {
                ...editingPlaneta,
                nazwa,
                masa: parseFloat(masa),
                promien: parseFloat(promien),
                maAtmosfere,
                odlegloscOdGwiazdy: parseFloat(odlegloscOdGwiazdy),
                gwiazdaId: gwiazdaId ? parseInt(gwiazdaId) : null,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null
            };

            const res = await fetch(`http://localhost:8080/api/planety/${editingPlaneta.id}?username=${user?.username}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPlaneta)
            });

            if (!res.ok) throw new Error("Nie udało się zaktualizować planety");
            await fetchPlanety();
            setShowEditModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };


    const handleFilter = async () => {
        let query = [];
        if (nazwa) query.push(`nazwa=${encodeURIComponent(nazwa)}`);
        if (masa) query.push(`masaMin=${masa}`);
        if (promien) query.push(`promienMin=${promien}`);
        if (maAtmosfere) query.push(`maAtmosfere=true`);
        if (gwiazdaId) query.push(`gwiazdaId=${gwiazdaId}`);
        if (galaktykaId) query.push(`galaktykaId=${galaktykaId}`);
        const url = `http://localhost:8080/api/planety/filter?${query.join("&")}`;

        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error("Nie udało się pobrać filtrowanych danych");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.planetaDTOList ||
                embedded.planetas ||
                Object.values(embedded)[0] ||
                data;

            const final = Array.isArray(lista) ? lista : [lista];
            setPlanety(applySorting(final));
            setCurrentPage(1);


        } catch (err) {
            setError("Błąd filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
                color: "#e0e0e0",
                fontFamily: "Orbitron, sans-serif"
            }}
        >
            <button
                onClick={() => window.location.href = "/diagram-planets"}
                style={{
                    padding: "10px 20px",
                    background: "#ffd60a",
                    color: "#000",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontSize: "1rem",
                    boxShadow: "0 0 10px #ffd60a"
                }}
            >
                Wykres
            </button>
            <div style={{ padding: "40px" }}>
                <h2
                    style={{
                        textAlign: "center",
                        color: "#90e0ef",
                        fontSize: "2rem",
                        textShadow: "0 0 15px #00b4d8",
                        marginBottom: "20px"
                    }}
                >
                    🪐 Lista Planet
                </h2>


                <div style={filterContainer}>
                    <input placeholder="🔍 Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                    <input placeholder="Masa min" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                    <input placeholder="Promień min" value={promien} onChange={(e) => setPromien(e.target.value)} style={inputStyle} />
                    <input placeholder="ID Gwiazdy" value={gwiazdaId} onChange={(e) => setGwiazdaId(e.target.value)} style={inputStyle} />
                    <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
                    <label style={{ marginLeft: "10px", color: "#caf0f8", display: "flex", alignItems: "center" }}>
                        <input
                            type="checkbox"
                            checked={maAtmosfere}
                            onChange={(e) => setMaAtmosfere(e.target.checked)}
                            style={{ marginRight: "5px" }}
                        />
                        Atmosfera
                    </label>

                    <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                    <button onClick={fetchPlanety} style={buttonStyleCancel}>🔄 Reset</button>
                    <select
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="nazwa">Nazwa</option>
                        <option value="masa">Masa</option>
                        <option value="promien">Promień</option>
                        <option value="odlegloscOdGwiazdy">Odległość od gwiazdy</option>
                    </select>

                    <select
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value)}
                        style={inputStyle}
                    >
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>
                    </select>

                    <button
                        onClick={() => setPlanety(applySorting(planety))}

                        style={buttonStyleAdd}
                    >
                        ↕ Sortuj
                    </button>

                    <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj</button>
                </div>

                {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie planet...</p>}
                {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}


                {planety.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "#003049", color: "#fff" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nazwa</th>
                            <th style={thStyle}>
                                Masa (kg)
                                <Tooltip text="Masa planety – im większa, tym silniejsze przyciąganie grawitacyjne. Pozwala określić typ planety i jej strukturę." />
                            </th>

                            <th style={thStyle}>
                                Promień (km)
                                <Tooltip text="Promień planety – odległość od środka planety do powierzchni. W połączeniu z masą określa klasę planety." />
                            </th>

                            <th style={thStyle}>
                                Atmosfera
                                <Tooltip text="Czy planeta ma atmosferę – informacja istotna dla potencjalnej obecności życia oraz ochrony przed promieniowaniem." />
                            </th>

                            <th style={thStyle}>
                                Odległość od gwiazdy (km)
                                <Tooltip text="Odległość planety od gwiazdy – kluczowa dla temperatury, strefy życia oraz okresu orbitalnego." />
                            </th>

                            <th style={thStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentPlanety.map((p) => (
                            <Fragment key={p.id}>
                                <tr style={rowStyle}>
                                    <td style={tdStyle}>{p.id}</td>
                                    <td style={tdStyle}>{p.nazwa}</td>
                                    <td style={tdStyle}>{p.masa}</td>
                                    <td style={tdStyle}>{p.promien}</td>
                                    <td style={tdStyle}>{p.maAtmosfere ? "✅" : "❌"}</td>
                                    <td style={tdStyle}>{p.odlegloscOdGwiazdy}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => toggleExpand(p.id)} style={buttonStyleExpand}>
                                            {expanded === p.id ? "▲" : "▼"}
                                        </button>
                                        {(user?.username === p.utworzylUsername || user?.roles?.includes("ADMIN")) && (
                                            <>
                                                <button onClick={() => handleEditClick(p)} style={buttonStyleEdit}>✏️</button>
                                                <button onClick={() => handleDelete(p.id)} style={buttonStyleDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {expanded === p.id && (
                                    <tr>
                                        <td colSpan="7" style={expandedStyle}>
                                            <div style={{ paddingLeft: "20px" }}>

                                                <p><b>👤 Utworzył:</b> {p.utworzylUsername || "Nieznany"}</p>
                                                <p><b>🌟 Gwiazda:</b> {p.gwiazdaNazwa ?? "brak"}</p>
                                                <p><b>🌌 Galaktyka:</b> {p.galaktykaNazwa ?? "brak"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        </tbody>
                    </table>

                )}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        style={{
                            marginRight: "10px",
                            padding: "8px 15px",
                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                            background: "#ffd60a",
                            color: "#000",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            opacity: currentPage === 1 ? 0.5 : 1
                        }}
                    >
                        ◀ Poprzednia
                    </button>

                    <span style={{ margin: "0 10px", color: "#fff" }}>
        Strona {currentPage} / {totalPages}
    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        style={{
                            marginLeft: "10px",
                            padding: "8px 15px",
                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                            background: "#ffd60a",
                            color: "#000",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            opacity: currentPage === totalPages ? 0.5 : 1
                        }}
                    >
                        Następna ▶
                    </button>
                </div>




                {showAddModal && (
                    <Modal
                        title="Dodaj Planetę"
                        nazwa={nazwa}
                        masa={masa}
                        promien={promien}
                        maAtmosfere={maAtmosfere}
                        odlegloscOdGwiazdy={odlegloscOdGwiazdy}
                        gwiazdaId={gwiazdaId}
                        galaktykaId={galaktykaId}
                        setNazwa={setNazwa}
                        setMasa={setMasa}
                        setPromien={setPromien}
                        setMaAtmosfere={setMaAtmosfere}
                        setOdlegloscOdGwiazdy={setOdlegloscOdGwiazdy}
                        setGwiazdaId={setGwiazdaId}
                        setGalaktykaId={setGalaktykaId}
                        onCancel={() => setShowAddModal(false)}
                        onConfirm={handleAddPlaneta}
                        confirmLabel="✅ Dodaj"
                    />
                )}

                {showEditModal && (
                    <Modal
                        title="Edytuj Planetę"
                        nazwa={nazwa}
                        masa={masa}
                        promien={promien}
                        maAtmosfere={maAtmosfere}
                        odlegloscOdGwiazdy={odlegloscOdGwiazdy}
                        gwiazdaId={gwiazdaId}
                        galaktykaId={galaktykaId}
                        setNazwa={setNazwa}
                        setMasa={setMasa}
                        setPromien={setPromien}
                        setMaAtmosfere={setMaAtmosfere}
                        setOdlegloscOdGwiazdy={setOdlegloscOdGwiazdy}
                        setGwiazdaId={setGwiazdaId}
                        setGalaktykaId={setGalaktykaId}
                        onCancel={() => setShowEditModal(false)}
                        onConfirm={handleEditSave}
                        confirmLabel="💾 Zapisz"
                    />
                )}
            </div>
        </div>
    );
}


function Modal({
                   title,
                   nazwa,
                   masa,
                   promien,
                   maAtmosfere,
                   odlegloscOdGwiazdy,
                   gwiazdaId,
                   galaktykaId,
                   setNazwa,
                   setMasa,
                   setPromien,
                   setMaAtmosfere,
                   setOdlegloscOdGwiazdy,
                   setGwiazdaId,
                   setGalaktykaId,
                   onCancel,
                   onConfirm,
                   confirmLabel
               }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>
                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Promień" value={promien} onChange={(e) => setPromien(e.target.value)} style={inputStyle} />
                <input placeholder="Odległość" value={odlegloscOdGwiazdy} onChange={(e) => setOdlegloscOdGwiazdy(e.target.value)} style={inputStyle} />
                <input placeholder="ID Gwiazdy" value={gwiazdaId} onChange={(e) => setGwiazdaId(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
                <label style={{ display: "block", marginTop: "10px" }}>
                    <input type="checkbox" checked={maAtmosfere} onChange={(e) => setMaAtmosfere(e.target.checked)} /> Ma atmosferę
                </label>
                <div style={{ marginTop: "15px", textAlign: "right" }}>
                    <button onClick={onCancel} style={buttonStyleCancel}>❌ Anuluj</button>
                    <button onClick={onConfirm} style={buttonStyleAdd}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}


const filterContainer = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px"
};

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "30px", background: "rgba(13, 27, 42, 0.8)", borderRadius: "12px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #00b4d8" };
const tdStyle = { padding: "10px", color: "#e0e0e0" };
const rowStyle = { textAlign: "center", borderBottom: "1px solid #1d3557" };
const expandedStyle = { padding: "20px", background: "rgba(0,0,0,0.4)", color: "#caf0f8" };
const inputStyle = { width: "140px", padding: "6px", borderRadius: "6px", border: "1px solid #00b4d8", background: "#001f3f", color: "#e0e0e0" };
const buttonStyleAdd = { padding: "8px 15px", background: "#00b4d8", color: "#000", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleCancel = { padding: "8px 15px", background: "#f94144", color: "#fff", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleDelete = { marginLeft: "5px", background: "#e63946", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleEdit = { marginLeft: "5px", background: "#ffb703", color: "black", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleExpand = { background: "#023e8a", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox = { background: "#0d1b2a", padding: "30px", borderRadius: "12px", minWidth: "300px" };
const paginationBtn = {
    padding: "8px 16px",
    background: "#00b4d8",
    color: "#000",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
};

export default PlanetyPage;
