import { useEffect, useState, Fragment } from "react";

function CzarneDziuryPage({ user }) {
    const [czarneDziury, setCzarneDziury] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCzarnaDziura, setEditingCzarnaDziura] = useState(null);


    const [nazwa, setNazwa] = useState("");
    const [masa, setMasa] = useState("");
    const [promienSchwarzschilda, setPromienSchwarzschilda] = useState("");
    const [typ, setTyp] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");

    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCzarneDziury = czarneDziury.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(czarneDziury.length / itemsPerPage);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

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




    const fetchCzarneDziury = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/czarne-dziury", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error("Nie udało się pobrać czarnych dziur");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.czarnaDziuraDTOList ||
                Object.values(embedded)[0] ||
                [];
            setCzarneDziury(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd pobierania czarnych dziur: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCzarneDziury();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const resetForm = () => {
        setNazwa("");
        setMasa("");
        setPromienSchwarzschilda("");
        setTyp("");
        setGalaktykaId("");
    };


    const handleAddCzarnaDziura = async () => {
        try {
            const nowa = {
                nazwa,
                masa: masa ? parseFloat(masa) : null,
                promienSchwarzschilda: promienSchwarzschilda ? parseFloat(promienSchwarzschilda) : null,
                typ,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                utworzylUsername: user?.username,
            };

            const res = await fetch("http://localhost:8080/api/czarne-dziury", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(nowa),
            });

            if (!res.ok) throw new Error("Nie udało się dodać czarnej dziury");
            await fetchCzarneDziury();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const requestDelete = (id) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = async () => {
        if (!showDeleteConfirm) return;

        try {
            const res = await fetch(`http://localhost:8080/api/czarne-dziury/${showDeleteConfirm}?username=${user?.username}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) throw new Error("Nie udało się usunąć czarnej dziury");
            await fetchCzarneDziury();
        } catch (err) {
            alert(err.message);
        } finally {
            setShowDeleteConfirm(null);
        }
    };


    const handleEditClick = (cz) => {
        setEditingCzarnaDziura(cz);
        setNazwa(cz.nazwa);
        setMasa(cz.masa);
        setPromienSchwarzschilda(cz.promienSchwarzschilda);
        setTyp(cz.typ);
        setGalaktykaId(cz.galaktykaId || "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        try {
            const updated = {
                ...editingCzarnaDziura,
                nazwa,
                masa: masa ? parseFloat(masa) : null,
                promienSchwarzschilda: promienSchwarzschilda ? parseFloat(promienSchwarzschilda) : null,
                typ,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
            };

            const res = await fetch(`http://localhost:8080/api/czarne-dziury/${editingCzarnaDziura.id}?username=${user?.username}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });

            if (!res.ok) throw new Error("Nie udało się zaktualizować czarnej dziury");
            await fetchCzarneDziury();
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
        if (promienSchwarzschilda) query.push(`promienMin=${promienSchwarzschilda}`);
        if (typ) query.push(`typ=${encodeURIComponent(typ)}`);
        if (galaktykaId) query.push(`galaktykaId=${galaktykaId}`);
        const url = `http://localhost:8080/api/czarne-dziury/filter?${query.join("&")}`;

        setLoading(true);
        try {
            const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error("Nie udało się pobrać filtrowanych danych");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.czarnaDziuraDTOList || Object.values(embedded)[0] || [];
            setCzarneDziury(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/czarne-dziury/sort?by=${sortField}&order=${sortOrder}`,
                { credentials: "include", headers: { Accept: "application/json" } }
            );

            if (!res.ok) throw new Error("Nie udało się posortować czarnych dziur");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.czarnaDziuraDTOList ||
                Object.values(embedded)[0] ||
                [];

            setCzarneDziury(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Błąd sortowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)", color: "#e0e0e0", fontFamily: "Orbitron, sans-serif", padding: "40px" }}>
            <h2 style={{ textAlign: "center", color: "#90e0ef", fontSize: "2rem", textShadow: "0 0 15px #00b4d8", marginBottom: "20px" }}>
                🕳️ Lista Czarnych Dziur
            </h2>


            <div style={filterContainer}>
                <input placeholder="🔍 Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa min" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Promień min" value={promienSchwarzschilda} onChange={(e) => setPromienSchwarzschilda(e.target.value)} style={inputStyle} />
                <input placeholder="Typ" value={typ} onChange={(e) => setTyp(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
                <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                <button onClick={fetchCzarneDziury} style={buttonStyleCancel}>🔄 Reset</button>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)} style={inputStyle}>
                    <option value="id">ID</option>
                    <option value="nazwa">Nazwa</option>
                    <option value="masa">Masa</option>
                    <option value="promienschwarzschilda">Promień Schwarzschilda</option>
                    <option value="typ">Typ</option>
                </select>

                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={inputStyle}>
                    <option value="asc">Rosnąco</option>
                    <option value="desc">Malejąco</option>
                </select>

                <button onClick={handleSort} style={buttonStyleAdd}>⬇️ Sortuj</button>

                <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj</button>
            </div>

            {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie danych...</p>}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

            {czarneDziury.length > 0 && (
                <table style={tableStyle}>
                    <thead>
                    <tr style={{ background: "#003049", color: "#fff" }}>
                        <th style={thStyle}>ID</th>
                        <th style={thStyle}>
                            Nazwa
                            <Tooltip text="Oficjalna nazwa czarnej dziury używana w katalogach astronomicznych." />
                        </th>
                        <th style={thStyle}>
                            Masa (kg)
                            <Tooltip text="Określa „siłę przyciągania” czarnej dziury, czyli jak ogromną ilość materii udało się upchnąć w jednym obiekcie." />
                        </th>
                        <th style={thStyle}>
                            Promień Schwarzschilda (m)
                            <Tooltip text="To granica (punkt bez powrotu), po której przekroczeniu nic, nawet światło, nie jest w stanie uciec przed przyciąganiem czarnej dziury." />
                        </th>
                        <th style={thStyle}>
                            Typ
                            <Tooltip text="Pozwala odróżnić małe czarne dziury powstałe z zapadniętych gwiazd (gwiazdowe) od gigantycznych czarnych dziur w centrach galaktyk (supermasywne)." />
                        </th>
                        <th style={thStyle}>
                            Galaktyka
                            <Tooltip text="Wskazuje galaktykę, w której znajduje się czarna dziura." />
                        </th>
                        <th style={thStyle}>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentCzarneDziury.map((c) => (
                        <Fragment key={c.id}>
                            <tr style={rowStyle}>
                                <td style={tdStyle}>{c.id}</td>
                                <td style={tdStyle}>{c.nazwa}</td>
                                <td style={tdStyle}>{c.masa ?? "—"}</td>
                                <td style={tdStyle}>{c.promienSchwarzschilda ?? "—"}</td>
                                <td style={tdStyle}>{c.typ || "—"}</td>
                                <td style={tdStyle}>{c.galaktykaNazwa || "—"}</td>
                                <td style={tdStyle}>
                                    <button onClick={() => toggleExpand(c.id)} style={buttonStyleExpand}>
                                        {expanded === c.id ? "▲" : "▼"}
                                    </button>
                                    {(user?.username === c.utworzylUsername || user?.roles?.includes("ADMIN")) && (
                                        <>
                                            <button onClick={() => handleEditClick(c)} style={buttonStyleEdit}>✏️</button>
                                            <button onClick={() => requestDelete(c.id)} style={buttonStyleDelete}>🗑️</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                            {expanded === c.id && (
                                <tr>
                                    <td colSpan="7" style={expandedStyle}>
                                        <p><b>👤 Utworzył:</b> {c.utworzylUsername || "Nieznany"}</p>
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


            {showAddModal && <Modal title="Dodaj Czarną Dziurę" nazwa={nazwa} masa={masa} promienSchwarzschilda={promienSchwarzschilda} typ={typ} galaktykaId={galaktykaId} setNazwa={setNazwa} setMasa={setMasa} setPromienSchwarzschilda={setPromienSchwarzschilda} setTyp={setTyp} setGalaktykaId={setGalaktykaId} onCancel={() => setShowAddModal(false)} onConfirm={handleAddCzarnaDziura} confirmLabel="✅ Dodaj" />}
            {showEditModal && <Modal title="Edytuj Czarną Dziurę" nazwa={nazwa} masa={masa} promienSchwarzschilda={promienSchwarzschilda} typ={typ} galaktykaId={galaktykaId} setNazwa={setNazwa} setMasa={setMasa} setPromienSchwarzschilda={setPromienSchwarzschilda} setTyp={setTyp} setGalaktykaId={setGalaktykaId} onCancel={() => setShowEditModal(false)} onConfirm={handleEditSave} confirmLabel="💾 Zapisz" />}
            {showDeleteConfirm && (
                <div style={modalOverlay}>
                    <div style={modalBox}>
                        <h3 style={{ color: "#e63946", marginBottom: "20px" }}>Na pewno chcesz usunąć?</h3>

                        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                style={buttonStyleCancel}
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={confirmDelete}
                                style={{ ...buttonStyleDelete, padding: "12px 24px", fontSize: "1.1rem" }}
                            >
                                Tak
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function Modal({ title, nazwa, masa, promienSchwarzschilda, typ, galaktykaId, setNazwa, setMasa, setPromienSchwarzschilda, setTyp, setGalaktykaId, onCancel, onConfirm, confirmLabel }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>
                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Promień Schwarzschilda" value={promienSchwarzschilda} onChange={(e) => setPromienSchwarzschilda(e.target.value)} style={inputStyle} />
                <input placeholder="Typ" value={typ} onChange={(e) => setTyp(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />
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
const buttonStyleAdd = { padding: "8px 15px", marginLeft: "10px", background: "#00b4d8", color: "#000", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleCancel = { padding: "8px 15px", background: "#f94144", color: "#fff", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleDelete = { marginLeft: "5px", background: "#e63946", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleEdit = { marginLeft: "5px", background: "#ffb703", color: "black", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const buttonStyleExpand = { background: "#023e8a", color: "white", border: "none", padding: "5px 10px", borderRadius: "6px", cursor: "pointer" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalBox = { background: "#0d1b2a", padding: "30px", borderRadius: "12px", minWidth: "300px" };

export default CzarneDziuryPage;
