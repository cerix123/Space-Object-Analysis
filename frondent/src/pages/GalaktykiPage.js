import { useEffect, useState, Fragment } from "react";

function GalaktykiPage({ user }) {
    const [galaktyki, setGalaktyki] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingGalaktyka, setEditingGalaktyka] = useState(null);


    const [nazwa, setNazwa] = useState("");
    const [typ, setTyp] = useState("");
    const [srednica, setSrednica] = useState("");
    const [liczbaGwiazd, setLiczbaGwiazd] = useState("");


    const [fNazwa, setFNazwa] = useState("");
    const [fTyp, setFTyp] = useState("");
    const [fSrednicaMin, setFSMin] = useState("");
    const [fSrednicaMax, setFSMax] = useState("");
    const [fGwiazdMin, setFGMin] = useState("");
    const [fGwiazdMax, setFGMax] = useState("");
    const [fUtworzylId, setFUtworzylId] = useState("");

    const [sortField, setSortField] = useState("");
    const [sortDir, setSortDir] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentGalaktyki = galaktyki.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(galaktyki.length / itemsPerPage);


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



    const fetchGalaktyki = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/galaktyki", {
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            if (!res.ok) throw new Error("Nie udało się pobrać galaktyk");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.galaktykaDTOList || Object.values(embedded)[0] || data;

            setGalaktyki(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd pobierania galaktyk: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGalaktyki();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const resetForm = () => {
        setNazwa("");
        setTyp("");
        setSrednica("");
        setLiczbaGwiazd("");
    };


    const handleAddGalaktyka = async () => {
        if (!user) { alert("Brak użytkownika!"); return; }
        try {
            const payload = {
                nazwa,
                typ,
                srednica: srednica ? parseFloat(srednica) : null,
                liczbaGwiazd: liczbaGwiazd ? parseInt(liczbaGwiazd) : null,
                usernameUtworzyl: user.username
            };

            const res = await fetch("http://localhost:8080/galaktyki/add", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Nie udało się dodać galaktyki");

            await fetchGalaktyki();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć tę galaktykę?")) return;
        if (!user) { alert("Brak użytkownika!"); return; }

        try {
            const res = await fetch(`http://localhost:8080/galaktyki/${id}?username=${user.username}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Nie udało się usunąć galaktyki");

            await fetchGalaktyki();
        } catch (err) {
            alert(err.message);
        }
    };


    const handleEditClick = (g) => {
        setEditingGalaktyka(g);
        setNazwa(g.nazwa ?? "");
        setTyp(g.typ ?? "");
        setSrednica(g.srednica ?? "");
        setLiczbaGwiazd(g.liczbaGwiazd ?? "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        if (!user) { alert("Brak użytkownika!"); return; }
        try {
            const payload = {
                ...editingGalaktyka,
                nazwa,
                typ,
                srednica: srednica ? parseFloat(srednica) : null,
                liczbaGwiazd: liczbaGwiazd ? parseInt(liczbaGwiazd) : null
            };

            const res = await fetch(`http://localhost:8080/galaktyki/${editingGalaktyka.id}?username=${user.username}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Nie udało się zaktualizować galaktyki");

            await fetchGalaktyki();
            setShowEditModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };


    const handleFilter = async () => {
        let query = [];
        if (fNazwa) query.push(`nazwa=${encodeURIComponent(fNazwa)}`);
        if (fTyp) query.push(`typ=${encodeURIComponent(fTyp)}`);
        if (fSrednicaMin) query.push(`srednicaMin=${fSrednicaMin}`);
        if (fSrednicaMax) query.push(`srednicaMax=${fSrednicaMax}`);
        if (fGwiazdMin) query.push(`gwiazdyMin=${fGwiazdMin}`);
        if (fGwiazdMax) query.push(`gwiazdyMax=${fGwiazdMax}`);
        if (fUtworzylId) query.push(`utworzylId=${fUtworzylId}`);

        const url = `http://localhost:8080/galaktyki/filter?${query.join("&")}`;
        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error("Nie udało się pobrać filtrowanych danych");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.galaktykaDTOList || Object.values(embedded)[0] || data;

            setGalaktyki(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async () => {
        if (!sortField) return;

        const url = `http://localhost:8080/galaktyki/sort?field=${sortField}&direction=${sortDir}`;

        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) throw new Error("Nie udało się posortować danych");

            const data = await res.json();
            setGalaktyki(data);
        } catch (err) {
            setError("Błąd sortowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    const renderObjectsList = (label, list) => {
        if (!list || list.length === 0) return null;
        return <p><b>{label}:</b> {list.join(", ")}</p>;
    };

    return (
        <div style={{ minHeight: "100vh", background: "#0d1b2a", color: "#e0e0e0", fontFamily: "Orbitron, sans-serif" }}>
            <div style={{ padding: "40px" }}>
                <h2 style={{ textAlign: "center", color: "#90e0ef", fontSize: "2rem", marginBottom: "20px" }}>🌌 Lista Galaktyk</h2>


                <div style={filterContainer}>
                    <input placeholder="Nazwa" value={fNazwa} onChange={(e) => setFNazwa(e.target.value)} style={inputStyle} />
                    <input placeholder="Typ" value={fTyp} onChange={(e) => setFTyp(e.target.value)} style={inputStyle} />
                    <input placeholder="Średnica min" value={fSrednicaMin} onChange={(e) => setFSMin(e.target.value)} style={inputStyle} />
                    <input placeholder="Średnica max" value={fSrednicaMax} onChange={(e) => setFSMax(e.target.value)} style={inputStyle} />
                    <input placeholder="Gwiazd min" value={fGwiazdMin} onChange={(e) => setFGMin(e.target.value)} style={inputStyle} />
                    <input placeholder="Gwiazd max" value={fGwiazdMax} onChange={(e) => setFGMax(e.target.value)} style={inputStyle} />
                    <input placeholder="ID tworzącego" value={fUtworzylId} onChange={(e) => setFUtworzylId(e.target.value)} style={inputStyle} />
                    <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                    <button onClick={fetchGalaktyki} style={buttonStyleCancel}>🔄 Reset</button>
                    <select value={sortField} onChange={(e)=>setSortField(e.target.value)} style={inputStyle}>
                        <option value="">Sortuj wg...</option>
                        <option value="nazwa">Nazwa</option>
                        <option value="typ">Typ</option>
                        <option value="srednica">Średnica</option>
                        <option value="liczbaGwiazd">Liczba gwiazd</option>
                        <option value="id">ID</option>
                    </select>

                    <select value={sortDir} onChange={(e)=>setSortDir(e.target.value)} style={inputStyle}>
                        <option value="asc">Rosnąco</option>
                        <option value="desc">Malejąco</option>
                    </select>

                    <button onClick={handleSort} style={buttonStyleAdd}>⬆️⬇️ Sortuj</button>

                    <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj</button>
                </div>


                {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie galaktyk...</p>}
                {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}


                {galaktyki.length > 0 && (
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "#003049", color: "#fff" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>
                                Nazwa
                                <Tooltip text="Oficjalna nazwa galaktyki używana w katalogach astronomicznych." />
                            </th>

                            <th style={thStyle}>
                                Typ
                                <Tooltip text="Morfologiczny typ galaktyki, np. spiralna, eliptyczna lub nieregularna." />
                            </th>

                            <th style={thStyle}>
                                Średnica (ly)
                                <Tooltip text="Przybliżona średnica galaktyki wyrażona w latach świetlnych." />
                            </th>

                            <th style={thStyle}>
                                Liczba gwiazd
                                <Tooltip text="Szacunkowa liczba gwiazd znajdujących się w obrębie galaktyki." />
                            </th>

                            <th style={thStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentGalaktyki.map((g) => (
                            <Fragment key={g.id}>
                                <tr style={rowStyle}>
                                    <td style={tdStyle}>{g.id}</td>
                                    <td style={tdStyle}>{g.nazwa}</td>
                                    <td style={tdStyle}>{g.typ}</td>
                                    <td style={tdStyle}>{g.srednica}</td>
                                    <td style={tdStyle}>{g.liczbaGwiazd}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => toggleExpand(g.id)} style={buttonStyleExpand}>
                                            {expanded === g.id ? "▲" : "▼"}
                                        </button>
                                        {(user?.username === g.nazwaUtworzyl || user?.roles?.includes("ADMIN")) && (
                                            <>
                                                <button onClick={() => handleEditClick(g)} style={buttonStyleEdit}>✏️</button>
                                                <button onClick={() => handleDelete(g.id)} style={buttonStyleDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {expanded === g.id && (
                                    <tr>
                                        <td colSpan="6" style={expandedStyle}>
                                            <div style={{ paddingLeft: "20px" }}>

                                                <p><b>👤 Utworzył:</b> {g.nazwaUtworzyl ?? "Nieznany"}</p>
                                                {renderObjectsList("Gwiazdy", g.gwiazdy)}
                                                {renderObjectsList("Planety", g.planety)}
                                                {renderObjectsList("Księżyce", g.ksiezyce)}
                                                {renderObjectsList("Gwiazdozbiory", g.gwiazdozbiory)}
                                                {renderObjectsList("Asteroidy", g.asteroidy)}
                                                {renderObjectsList("Czarne dziury", g.czarneDziury)}
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
                        title="Dodaj Galaktykę"
                        nazwa={nazwa}
                        typ={typ}
                        srednica={srednica}
                        liczbaGwiazd={liczbaGwiazd}
                        setNazwa={setNazwa}
                        setTyp={setTyp}
                        setSrednica={setSrednica}
                        setLiczbaGwiazd={setLiczbaGwiazd}
                        onCancel={() => setShowAddModal(false)}
                        onConfirm={handleAddGalaktyka}
                        confirmLabel="✅ Dodaj"
                    />
                )}

                {showEditModal && (
                    <Modal
                        title="Edytuj Galaktykę"
                        nazwa={nazwa}
                        typ={typ}
                        srednica={srednica}
                        liczbaGwiazd={liczbaGwiazd}
                        setNazwa={setNazwa}
                        setTyp={setTyp}
                        setSrednica={setSrednica}
                        setLiczbaGwiazd={setLiczbaGwiazd}
                        onCancel={() => setShowEditModal(false)}
                        onConfirm={handleEditSave}
                        confirmLabel="💾 Zapisz"
                    />
                )}
            </div>
        </div>
    );
}


function Modal({ title, nazwa, typ, srednica, liczbaGwiazd, setNazwa, setTyp, setSrednica, setLiczbaGwiazd, onCancel, onConfirm, confirmLabel }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>
                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Typ" value={typ} onChange={(e) => setTyp(e.target.value)} style={inputStyle} />
                <input placeholder="Średnica" value={srednica} onChange={(e) => setSrednica(e.target.value)} style={inputStyle} />
                <input placeholder="Liczba gwiazd" value={liczbaGwiazd} onChange={(e) => setLiczbaGwiazd(e.target.value)} style={inputStyle} />
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
const tdStyle = { padding: "10px", color: "#e0e0e0", textAlign: "center" };
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

export default GalaktykiPage;
