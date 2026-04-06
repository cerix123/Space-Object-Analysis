import { useEffect, useState, Fragment } from "react";

function GwiazdozbioryPage({ user }) {
    const [gwiazdozbiory, setGwiazdozbiory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGwiazdozbior, setEditingGwiazdozbior] = useState(null);


    const [nazwa, setNazwa] = useState("");
    const [opis, setOpis] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");


    const [minGwiazdy, setMinGwiazdy] = useState("");
    const [maxGwiazdy, setMaxGwiazdy] = useState("");

    const [sortField, setSortField] = useState("");
    const [sortDir, setSortDir] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentGwiazdozbiory = gwiazdozbiory.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(gwiazdozbiory.length / itemsPerPage);


    function Tooltip({ text }) {
        const [hover, setHover] = useState(false);
        const [pos, setPos] = useState({ x: 0, y: 0 });

        return (
            <span
                onMouseEnter={(e) => {
                    const rect = e.target.getBoundingClientRect();
                    setPos({
                        x: rect.left + rect.width / 2,
                        y: rect.top
                    });
                    setHover(true);
                }}
                onMouseLeave={() => setHover(false)}
                style={{ cursor: "pointer", marginLeft: "6px" }}
            >
            ❓
                {hover && (
                    <div
                        style={{
                            position: "fixed",
                            top: pos.y - 10,
                            left: pos.x,
                            transform: "translate(-50%, -100%)",
                            zIndex: 1000000,
                            background: "#003049",
                            color: "#fff",
                            padding: "10px",
                            borderRadius: "8px",
                            width: "230px",
                            boxShadow: "0 0 12px #00b4d8",
                            fontSize: "0.85rem",
                            pointerEvents: "none"
                        }}
                    >
                        {text}
                    </div>
                )}
        </span>
        );
    }




    const fetchGwiazdozbiory = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/gwiazdozbiory", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            if (!res.ok)
                throw new Error("Nie udało się pobrać gwiazdozbiorów (status: " + res.status + ")");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.gwiazdozbiorDTOList ||
                embedded.gwiazdozbiors ||
                Object.values(embedded)[0] ||
                data;
            setGwiazdozbiory(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd pobierania gwiazdozbiorów: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGwiazdozbiory();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const resetForm = () => {
        setNazwa("");
        setOpis("");
        setGalaktykaId("");
        setMinGwiazdy("");
        setMaxGwiazdy("");
    };

    const handleAddGwiazdozbior = async () => {
        try {
            const nowy = {
                nazwa,
                opis,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                utworzylUsername: user?.username,
            };

            const res = await fetch("http://localhost:8080/api/gwiazdozbiory", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(nowy),
            });

            if (!res.ok) throw new Error("Nie udało się dodać gwiazdozbioru");
            await fetchGwiazdozbiory();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć ten gwiazdozbiór?")) return;
        try {
            const res = await fetch(`http://localhost:8080/api/gwiazdozbiory/${id}?username=${user?.username}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Nie udało się usunąć gwiazdozbioru");
            await fetchGwiazdozbiory();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = (g) => {
        setEditingGwiazdozbior(g);
        setNazwa(g.nazwa);
        setOpis(g.opis);
        setGalaktykaId(g.galaktykaId || "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        try {
            const updated = {
                ...editingGwiazdozbior,
                nazwa,
                opis,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
            };

            const res = await fetch(`http://localhost:8080/api/gwiazdozbiory/${editingGwiazdozbior.id}?username=${user?.username}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });

            if (!res.ok) throw new Error("Nie udało się zaktualizować gwiazdozbioru");
            await fetchGwiazdozbiory();
            setShowEditModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFilter = async () => {
        let query = [];
        if (nazwa) query.push(`nazwa=${encodeURIComponent(nazwa)}`);
        if (galaktykaId) query.push(`galaktykaId=${galaktykaId}`);
        if (minGwiazdy && !isNaN(minGwiazdy)) query.push(`minGwiazdy=${parseInt(minGwiazdy)}`);
        if (maxGwiazdy && !isNaN(maxGwiazdy)) query.push(`maxGwiazdy=${parseInt(maxGwiazdy)}`);
        const url = `http://localhost:8080/api/gwiazdozbiory/filter?${query.join("&")}`;

        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error("Nie udało się pobrać filtrowanych danych");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.gwiazdozbiorDTOList ||
                embedded.gwiazdozbiors ||
                Object.values(embedded)[0] ||
                data;
            setGwiazdozbiory(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async () => {
        if (!sortField) return;

        const url = `http://localhost:8080/api/gwiazdozbiory/sort?field=${sortField}&direction=${sortDir}`;

        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" }});
            if (!res.ok) throw new Error("Nie udało się posortować danych");

            const data = await res.json();
            setGwiazdozbiory(Array.isArray(data) ? data : [data]);
        } catch (err) {
            setError("Błąd sortowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{
            minHeight: "100vh",
            background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
            color: "#e0e0e0",
            fontFamily: "Orbitron, sans-serif",
            padding: "40px"
        }}>
            <h2 style={{ textAlign: "center", color: "#90e0ef", fontSize: "2rem", textShadow: "0 0 15px #00b4d8", marginBottom: "20px" }}>
                🌌 Lista Gwiazdozbiorów
            </h2>


            <div style={filterContainer}>
                <input placeholder="🔍 Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Min gwiazdy" value={minGwiazdy} onChange={(e) => setMinGwiazdy(e.target.value)} style={inputStyle} />
                <input type="number" placeholder="Max gwiazdy" value={maxGwiazdy} onChange={(e) => setMaxGwiazdy(e.target.value)} style={inputStyle} />
                <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                <button onClick={fetchGwiazdozbiory} style={buttonStyleCancel}>🔄 Reset</button>
                <select value={sortField} onChange={(e)=>setSortField(e.target.value)} style={inputStyle}>
                    <option value="">Sortuj wg...</option>
                    <option value="id">ID</option>
                    <option value="nazwa">Nazwa</option>
                </select>

                <select value={sortDir} onChange={(e)=>setSortDir(e.target.value)} style={inputStyle}>
                    <option value="asc">Rosnąco</option>
                    <option value="desc">Malejąco</option>
                </select>

                <button onClick={handleSort} style={buttonStyleAdd}>⬆️⬇️ Sortuj</button>

                <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj</button>
            </div>

            {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie gwiazdozbiorów...</p>}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}


            {gwiazdozbiory.length > 0 && (
                <div style={{ maxHeight: "70vh", overflowY: "auto", marginTop: "20px" }}>
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "#003049", color: "#fff" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>
                                Nazwa
                                <Tooltip text="Oficjalna nazwa gwiazdozbioru używana w katalogach astronomicznych." />
                            </th>

                            <th style={thStyle}>
                                Opis
                                <Tooltip text="Opis gwiadozbioru." />
                            </th>

                            <th style={thStyle}>
                                Galaktyka
                                <Tooltip text="Galaktyka, w której znajduje się gwiazdozbiór." />
                            </th>
                            <th style={thStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentGwiazdozbiory.map((g) => (
                            <Fragment key={g.id}>
                                <tr style={rowStyle}>
                                    <td style={tdStyle}>{g.id}</td>
                                    <td style={tdStyle}>{g.nazwa}</td>
                                    <td style={tdStyle}>{g.opis}</td>
                                    <td style={tdStyle}>{g.galaktykaNazwa || g.galaktykaId || "—"}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => toggleExpand(g.id)} style={buttonStyleExpand}>
                                            {expanded === g.id ? "▲" : "▼"}
                                        </button>
                                        {(user?.username === g.utworzylUsername || user?.roles?.includes("ADMIN")) && (
                                            <>
                                                <button onClick={() => handleEditClick(g)} style={buttonStyleEdit}>✏️</button>
                                                <button onClick={() => handleDelete(g.id)} style={buttonStyleDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {expanded === g.id && (
                                    <tr>
                                        <td colSpan="5" style={expandedStyle}>

                                            <p><b>👤 Utworzył:</b> {g.utworzylUsername || "Nieznany"}</p>
                                            <p><b>⭐ Gwiazdy:</b> {g.gwiazdyNazwa && g.gwiazdyNazwa.length > 0 ? g.gwiazdyNazwa.join(", ") : "brak"}</p>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
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
                    title="Dodaj Gwiazdozbiór"
                    nazwa={nazwa}
                    opis={opis}
                    galaktykaId={galaktykaId}
                    setNazwa={setNazwa}
                    setOpis={setOpis}
                    setGalaktykaId={setGalaktykaId}
                    onCancel={() => setShowAddModal(false)}
                    onConfirm={handleAddGwiazdozbior}
                    confirmLabel="✅ Dodaj"
                />
            )}

            {showEditModal && (
                <Modal
                    title="Edytuj Gwiazdozbiór"
                    nazwa={nazwa}
                    opis={opis}
                    galaktykaId={galaktykaId}
                    setNazwa={setNazwa}
                    setOpis={setOpis}
                    setGalaktykaId={setGalaktykaId}
                    onCancel={() => setShowEditModal(false)}
                    onConfirm={handleEditSave}
                    confirmLabel="💾 Zapisz"
                />
            )}
        </div>
    );
}


function Modal({ title, nazwa, opis, galaktykaId, setNazwa, setOpis, setGalaktykaId, onCancel, onConfirm, confirmLabel }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>
                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <textarea placeholder="Opis" value={opis} onChange={(e) => setOpis(e.target.value)} style={{ ...inputStyle, height: "80px" }} />
                <input placeholder="ID Galaktyki (opcjonalnie)" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
                <div style={{ marginTop: "15px", textAlign: "right" }}>
                    <button onClick={onCancel} style={buttonStyleCancel}>❌ Anuluj</button>
                    <button onClick={onConfirm} style={buttonStyleAdd}>{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}


const filterContainer = { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "25px" };
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "30px", background: "rgba(13, 27, 42, 0.8)", borderRadius: "12px", overflow: "hidden" };
const thStyle = { padding: "12px", borderBottom: "2px solid #00b4d8" };
const tdStyle = { padding: "10px", color: "#e0e0e0" };
const rowStyle = { textAlign: "center", borderBottom: "1px solid #1d3557" };
const expandedStyle = { padding: "20px", background: "rgba(0,0,0,0.4)", color: "#caf0f8", textAlign: "left", borderBottom: "1px solid #1d3557" };
const inputStyle = { width: "140px", padding: "6px", borderRadius: "6px", border: "1px solid #00b4d8", background: "#001f3f", color: "#e0e0e0" };
const buttonStyleAdd = { padding: "8px 15px", background: "#00b4d8", color: "#000", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleCancel = { padding: "8px 15px", background: "#f94144", color: "#fff", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleDelete = { marginLeft: "5px", background: "#e63946", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleEdit = { marginLeft: "5px", background: "#ffb703", color: "black", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleExpand = { background: "#023e8a", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox = { background: "#0d1b2a", padding: "30px", borderRadius: "12px", minWidth: "300px" };

export default GwiazdozbioryPage;
