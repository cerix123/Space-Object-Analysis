import { useEffect, useState, Fragment } from "react";

function AsteroidyPage({ user }) {

    const [asteroidy, setAsteroid] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAsteroida, setEditingAsteroida] = useState(null);


    const [fNazwa, setFNazwa] = useState("");
    const [fMasaMin, setFMasaMin] = useState("");
    const [fMasaMax, setFMasaMax] = useState("");
    const [fSrednicaMin, setFSrednicaMin] = useState("");
    const [fSrednicaMax, setFSrednicaMax] = useState("");
    const [fSklad, setFSklad] = useState("");
    const [fOrbita, setFOrbita] = useState("");
    const [fGalaktykaId, setFGalaktykaId] = useState("");
    const [sortBy, setSortBy] = useState("nazwa");
    const [sortDir, setSortDir] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentAsteroidy = asteroidy.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(asteroidy.length / itemsPerPage);



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



    const handleFilter = async () => {
        try {
            setLoading(true);

            const params = new URLSearchParams();

            if (fNazwa) params.append("nazwa", fNazwa);
            if (fMasaMin) params.append("masaMin", fMasaMin);
            if (fMasaMax) params.append("masaMax", fMasaMax);
            if (fSrednicaMin) params.append("srednicaMin", fSrednicaMin);
            if (fSrednicaMax) params.append("srednicaMax", fSrednicaMax);
            if (fSklad) params.append("sklad", fSklad);
            if (fOrbita) params.append("orbita", fOrbita);
            if (fGalaktykaId) params.append("galaktykaId", fGalaktykaId);

            const res = await fetch("http://localhost:8080/asteroidy/filter?" + params.toString(), {
                credentials: "include",
                headers: { Accept: "application/json" }
            });

            if (!res.ok) throw new Error("Błąd filtrowania");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.asteroidaDTOList || embedded.asteroidas || Object.values(embedded)[0] || data;
            setAsteroid(Array.isArray(lista) ? lista : [lista]);

        } catch (err) {
            alert("Błąd filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:8080/asteroidy/sort?by=${sortBy}&dir=${sortDir}`,
                { credentials: "include", headers: { Accept: "application/json" } }
            );

            if (!res.ok) throw new Error("Błąd sortowania");

            const data = await res.json();

            const embedded = data._embedded || {};
            const lista =
                embedded.asteroidaDTOList ||
                embedded.asteroidas ||
                Object.values(embedded)[0] ||
                data;

            setAsteroid(Array.isArray(lista) ? lista : [lista]);

        } catch (err) {
            alert("Błąd sortowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };



    const [nazwa, setNazwa] = useState("");
    const [masa, setMasa] = useState("");
    const [srednica, setSrednica] = useState("");
    const [sklad, setSklad] = useState("");
    const [orbita, setOrbita] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");

    const resetForm = () => {
        setNazwa("");
        setMasa("");
        setSrednica("");
        setSklad("");
        setOrbita("");
        setGalaktykaId("");
    };


    const fetchAsteroid = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/asteroidy", {
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            if (!res.ok) throw new Error("Nie udało się pobrać asteroid");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.asteroidaDTOList || embedded.asteroidas || Object.values(embedded)[0] || data;
            setAsteroid(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd pobierania asteroid: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAsteroid(); }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);


    const handleAddAsteroida = async () => {
        try {
            const newAsteroida = {
                nazwa,
                masa: parseFloat(masa),
                srednica: parseFloat(srednica),
                sklad,
                orbita,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                utworzylUsername: user?.username
            };
            const res = await fetch("http://localhost:8080/asteroidy", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(newAsteroida)
            });
            if (!res.ok) throw new Error("Nie udało się dodać asteroidy");
            await fetchAsteroid();
            setShowAddModal(false);
            resetForm();
        } catch (err) { alert(err.message); }
    };

    const handleEditClick = (a) => {
        setEditingAsteroida(a);
        setNazwa(a.nazwa);
        setMasa(a.masa);
        setSrednica(a.srednica);
        setSklad(a.sklad);
        setOrbita(a.orbita);
        setGalaktykaId(a.galaktykaId || "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        try {
            const updated = {
                ...editingAsteroida,
                nazwa,
                masa: parseFloat(masa),
                srednica: parseFloat(srednica),
                sklad,
                orbita,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null
            };
            const res = await fetch(`http://localhost:8080/asteroidy/${editingAsteroida.id}?username=${user?.username}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });
            if (!res.ok) throw new Error("Nie udało się zaktualizować asteroidy");
            await fetchAsteroid();
            setShowEditModal(false);
            resetForm();
        } catch (err) { alert(err.message); }
    };

    const requestDelete = (id) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;

        try {
            const res = await fetch(`http://localhost:8080/asteroidy/${showDeleteConfirm}?username=${user?.username}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Nie udało się usunąć asteroidy");
            await fetchAsteroid();
        } catch (err) {
            alert(err.message);
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)", color: "#e0e0e0", fontFamily: "Orbitron, sans-serif" }}>
            <div style={{ padding: "40px" }}>

                <h2 style={{ textAlign: "center", color: "#90e0ef", fontSize: "2rem", textShadow: "0 0 15px #00b4d8", marginBottom: "20px" }}>☄️ Lista Asteroid</h2>



                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
                    <input placeholder="Nazwa" value={fNazwa} onChange={(e) => setFNazwa(e.target.value)} style={inputStyle} />
                    <input placeholder="Masa min" value={fMasaMin} onChange={(e) => setFMasaMin(e.target.value)} style={inputStyle} />
                    <input placeholder="Masa max" value={fMasaMax} onChange={(e) => setFMasaMax(e.target.value)} style={inputStyle} />
                    <input placeholder="Średnica min" value={fSrednicaMin} onChange={(e) => setFSrednicaMin(e.target.value)} style={inputStyle} />
                    <input placeholder="Średnica max" value={fSrednicaMax} onChange={(e) => setFSrednicaMax(e.target.value)} style={inputStyle} />
                    <input placeholder="Skład" value={fSklad} onChange={(e) => setFSklad(e.target.value)} style={inputStyle} />
                    <input placeholder="Orbita" value={fOrbita} onChange={(e) => setFOrbita(e.target.value)} style={inputStyle} />
                    <input placeholder="ID Galaktyki" value={fGalaktykaId} onChange={(e) => setFGalaktykaId(e.target.value)} style={inputStyle} />

                    <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                    <button onClick={fetchAsteroid} style={buttonStyleCancel}>🔄 Reset</button>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={inputStyle}>
                        <option value="id">ID</option>
                        <option value="nazwa">Nazwa</option>
                        <option value="masa">Masa</option>
                        <option value="srednica">Średnica</option>
                    </select>

                    <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} style={inputStyle}>
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>
                    </select>

                    <button onClick={handleSort} style={buttonStyleAdd}>
                        🔽 Sortuj
                    </button>

                </div>





                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj Asteroidę</button>
                </div>

                {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie asteroid...</p>}
                {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

                {asteroidy.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "#003049", color: "#fff" }}>
                            <th style={thStyle}>ID</th>

                            <th style={thStyle}>
                                Nazwa
                                <Tooltip text="Oficjalna nazwa asteroidy używana w katalogach astronomicznych." />
                            </th>

                            <th style={thStyle}>
                                Masa (kg)
                                <Tooltip text="Masa asteroidy – wpływa na jej grawitację oraz potencjalne zagrożenie kolizyjne." />
                            </th>

                            <th style={thStyle}>
                                Średnica (m)
                                <Tooltip text="Przybliżona średnica asteroidy wyrażona w metrach." />
                            </th>

                            <th style={thStyle}>Akcje</th>
                        </tr>
                        </thead>

                        <tbody>
                        {currentAsteroidy.map((a) => (
                            <Fragment key={a.id}>
                                <tr style={rowStyle}>
                                    <td style={tdStyle}>{a.id}</td>
                                    <td style={tdStyle}>{a.nazwa}</td>
                                    <td style={tdStyle}>{a.masa}</td>
                                    <td style={tdStyle}>{a.srednica}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => toggleExpand(a.id)} style={buttonStyleExpand}>{expanded === a.id ? "▲" : "▼"}</button>
                                        {(user?.username === a.utworzylUsername || user?.roles?.includes("ADMIN")) && (
                                            <>
                                                <button onClick={() => handleEditClick(a)} style={buttonStyleEdit}>✏️</button>
                                                <button onClick={() => requestDelete(a.id)} style={buttonStyleDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                                {expanded === a.id && (
                                    <tr>
                                        <td colSpan="5" style={expandedStyle}>
                                            <div style={{ paddingLeft: "20px" }}>
                                                <p><b>🌌 Galaktyka:</b> {a.galaktykaNazwa || "Brak"}</p>
                                                <p><b>🧪 Skład:</b> {a.sklad || "Brak"}</p>
                                                <p><b>🌀 Orbita:</b> {a.orbita || "Brak"}</p>

                                                <p><b>👤 Utworzył:</b> {a.utworzylUsername || "Nieznany"}</p>
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


                {showAddModal && <Modal
                    title="Dodaj Asteroidę"
                    nazwa={nazwa} setNazwa={setNazwa}
                    masa={masa} setMasa={setMasa}
                    srednica={srednica} setSrednica={setSrednica}
                    sklad={sklad} setSklad={setSklad}
                    orbita={orbita} setOrbita={setOrbita}
                    galaktykaId={galaktykaId} setGalaktykaId={setGalaktykaId}
                    onCancel={() => { setShowAddModal(false); resetForm(); }}
                    onConfirm={handleAddAsteroida}
                />}
                {showDeleteConfirm && (
                    <div style={modalOverlay}>
                        <div style={modalBox}>
                            <h3 style={{ color: "#e63946", marginBottom: "20px" }}>Na pewno chcesz usunąć?</h3>
                            <p style={{ marginBottom: "30px", textAlign: "center" }}>
                                Czy na pewno chcesz usunąć asteroidę?
                            </p>
                            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    style={buttonStyleCancel}
                                >Anuluj
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={buttonStyleDelete}
                                >Tak, usuń
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showEditModal && <Modal
                    title="Edytuj Asteroidę"
                    nazwa={nazwa} setNazwa={setNazwa}
                    masa={masa} setMasa={setMasa}
                    srednica={srednica} setSrednica={setSrednica}
                    sklad={sklad} setSklad={setSklad}
                    orbita={orbita} setOrbita={setOrbita}
                    galaktykaId={galaktykaId} setGalaktykaId={setGalaktykaId}
                    onCancel={() => { setShowEditModal(false); resetForm(); }}
                    onConfirm={handleEditSave}
                />}

            </div>
        </div>
    );
}



function Modal({ title, nazwa, setNazwa, masa, setMasa, srednica, setSrednica, sklad, setSklad, orbita, setOrbita, galaktykaId, setGalaktykaId, onCancel, onConfirm }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>
                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Średnica" value={srednica} onChange={(e) => setSrednica(e.target.value)} style={inputStyle} />
                <input placeholder="Skład" value={sklad} onChange={(e) => setSklad(e.target.value)} style={inputStyle} />
                <input placeholder="Orbita" value={orbita} onChange={(e) => setOrbita(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />

                <div style={{ marginTop: "15px", textAlign: "right" }}>
                    <button onClick={onCancel} style={buttonStyleCancel}>❌ Anuluj</button>
                    <button onClick={onConfirm} style={buttonStyleAdd}>✅ {title.includes("Edytuj") ? "Zapisz" : "Dodaj"}</button>
                </div>
            </div>
        </div>
    );
}



const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "30px", background: "rgba(13, 27, 42, 0.8)", borderRadius: "12px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #00b4d8" };
const tdStyle = { padding: "10px", color: "#e0e0e0" };
const rowStyle = { textAlign: "center", borderBottom: "1px solid #1d3557" };
const expandedStyle = { padding: "20px", background: "rgba(0,0,0,0.4)", color: "#caf0f8" };
const inputStyle = {
    width: "120px",
    height: "32px",
    padding: "0 8px",
    borderRadius: "6px",
    border: "1px solid #00b4d8",
    background: "#001f3f",
    color: "#e0e0e0",
    fontSize: "0.8rem",
    lineHeight: "32px"
};


const buttonStyleAdd = {
    height: "32px",
    padding: "0 12px",
    background: "#00b4d8",
    color: "#000",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.8rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    lineHeight: "32px",
    border: "none"
};


const buttonStyleCancel = {
    height: "32px",
    padding: "0 12px",
    background: "#f94144",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "0.8rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
    lineHeight: "32px",
    border: "none"
};


const buttonStyleDelete = { marginLeft: "5px", background: "#e63946", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleEdit = { marginLeft: "5px", background: "#ffb703", color: "black", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleExpand = { background: "#023e8a", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const modalOverlay = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1000
};

const modalBox = {
    background: "#0d1b2a", padding: "30px", borderRadius: "12px",
    minWidth: "350px", border: "2px solid #e63946",
    boxShadow: "0 0 30px rgba(230, 57, 70, 0.4)"
};

export default AsteroidyPage;
