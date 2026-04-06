import { useEffect, useState, Fragment } from "react";

function KsiezycePage({ user }) {
    const [ksiezyce, setKsiezyce] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingKsiezyc, setEditingKsiezyc] = useState(null);

    const [nazwa, setNazwa] = useState("");
    const [masa, setMasa] = useState("");
    const [promien, setPromien] = useState("");
    const [odlegloscOdPlanety, setOdlegloscOdPlanety] = useState("");
    const [planetaId, setPlanetaId] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");

    const [sortField, setSortField] = useState("id");
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentKsiezyce = ksiezyce.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(ksiezyce.length / itemsPerPage);



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



    const fetchKsiezyce = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/ksiezyce", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });
            if (!res.ok) throw new Error("Nie udalo sie pobrac ksiezycow");
            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.ksiezycDTOList ||
                Object.values(embedded)[0] ||
                data;
            setKsiezyce(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Blad pobierania ksiezycow: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKsiezyce();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const resetForm = () => {
        setNazwa("");
        setMasa("");
        setPromien("");
        setOdlegloscOdPlanety("");
        setPlanetaId("");
        setGalaktykaId("");
    };

    const handleAddKsiezyc = async () => {
        try {
            const nowy = {
                nazwa,
                masa: masa ? parseFloat(masa) : null,
                promien: promien ? parseFloat(promien) : null,
                odlegloscOdPlanety: odlegloscOdPlanety ? parseFloat(odlegloscOdPlanety) : null,
                planetaId: planetaId ? parseInt(planetaId) : null,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                utworzylUsername: user?.username,
            };

            const res = await fetch("http://localhost:8080/api/ksiezyce", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify(nowy),
            });

            if (!res.ok) throw new Error("Nie udalo sie dodac ksiezyca");
            await fetchKsiezyce();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEditClick = (k) => {
        setEditingKsiezyc(k);
        setNazwa(k.nazwa);
        setMasa(k.masa || "");
        setPromien(k.promien || "");
        setOdlegloscOdPlanety(k.odlegloscOdPlanety || "");
        setPlanetaId(k.planetaId || "");
        setGalaktykaId(k.galaktykaId || "");
        setShowEditModal(true);
    };

    const handleEditSave = async () => {
        try {
            const updated = {
                ...editingKsiezyc,
                nazwa,
                masa: masa ? parseFloat(masa) : null,
                promien: promien ? parseFloat(promien) : null,
                odlegloscOdPlanety: odlegloscOdPlanety ? parseFloat(odlegloscOdPlanety) : null,
                planetaId: planetaId ? parseInt(planetaId) : null,
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
            };

            const res = await fetch(
                `http://localhost:8080/api/ksiezyce/${editingKsiezyc.id}?username=${user?.username}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updated),
                }
            );

            if (!res.ok) throw new Error("Nie udalo sie zaktualizowac ksiezyca");

            await fetchKsiezyce();
            setShowEditModal(false);
            resetForm();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Na pewno chcesz usunac tego ksiezyca?")) return;
        try {
            const res = await fetch(
                `http://localhost:8080/api/ksiezyce/${id}?username=${user?.username}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error("Nie udalo sie usunac ksiezyca");
            await fetchKsiezyce();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFilter = async () => {
        const query = [];
        if (nazwa) query.push(`nazwa=${encodeURIComponent(nazwa)}`);
        if (masa) query.push(`masaMin=${masa}`);
        if (promien) query.push(`promienMin=${promien}`);
        if (odlegloscOdPlanety) query.push(`odlegloscMin=${odlegloscOdPlanety}`);
        if (planetaId) query.push(`planetaId=${planetaId}`);
        if (galaktykaId) query.push(`galaktykaId=${galaktykaId}`);

        const url = `http://localhost:8080/api/ksiezyce/filter?${query.join("&")}`;
        setLoading(true);

        try {
            const res = await fetch(url, {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            if (!res.ok) throw new Error("Nie udalo sie pobrac filtrowanych danych");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.ksiezycDTOList ||
                Object.values(embedded)[0] ||
                data;

            setKsiezyce(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Blad filtrowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/ksiezyce/sort?by=${sortField}&order=${sortOrder}`,
                { credentials: "include", headers: { Accept: "application/json" } }
            );

            if (!res.ok) throw new Error("Nie udalo sie posortowac ksiezycow");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista =
                embedded.ksiezycDTOList ||
                Object.values(embedded)[0] ||
                data;

            setKsiezyce(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError("Blad sortowania: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                minHeight: "100vh",
                background:
                    "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
                color: "#e0e0e0",
                fontFamily: "Orbitron, sans-serif",
                padding: "40px",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    color: "#90e0ef",
                    fontSize: "2rem",
                    textShadow: "0 0 15px #00b4d8",
                    marginBottom: "20px",
                }}
            >
                🌕 Lista Ksiezycow
            </h2>

            <div style={filterContainer}>
                <input placeholder="🔍 Nazwa" value={nazwa} onChange={e => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa min" type="number" value={masa} onChange={e => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Promien min" type="number" value={promien} onChange={e => setPromien(e.target.value)} style={inputStyle} />
                <input placeholder="Odleglosc min" type="number" value={odlegloscOdPlanety} onChange={e => setOdlegloscOdPlanety(e.target.value)} style={inputStyle} />
                <input placeholder="ID Planety" value={planetaId} onChange={e => setPlanetaId(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={e => setGalaktykaId(e.target.value)} style={inputStyle} />

                <button onClick={handleFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                <button onClick={fetchKsiezyce} style={buttonStyleCancel}>🔄 Reset</button>
                <select value={sortField} onChange={e => setSortField(e.target.value)} style={inputStyle}>
                    <option value="id">ID</option>
                    <option value="nazwa">Nazwa</option>
                    <option value="masa">Masa</option>
                    <option value="promien">Promień</option>
                    <option value="odlegloscodplanety">Odległość od planety</option>
                </select>

                <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={inputStyle}>
                    <option value="asc">Rosnąco</option>
                    <option value="desc">Malejąco</option>
                </select>

                <button onClick={handleSort} style={buttonStyleAdd}>🔽 Sortuj</button>

                <button onClick={() => setShowAddModal(true)} style={buttonStyleAdd}>➕ Dodaj</button>
            </div>

            {loading && <p style={{ textAlign: "center" }}>🔄 Ladowanie ksiezycow...</p>}
            {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

            {/* SCROLL WRAPPER */}
            {ksiezyce.length > 0 && (
                <div style={tableWrapper}>
                    <table style={tableStyle}>
                        <thead>
                        <tr style={{ background: "#003049", color: "#fff" }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>
                                Nazwa
                                <Tooltip text="Oficjalna nazwa księżyca używana w katalogach astronomicznych." />
                            </th>

                            <th style={thStyle}>
                                Masa (kg)
                                <Tooltip text="Masa księżyca – wpływa na jego grawitację oraz potencjalne zagrożenie kolizyjne." />
                            </th>

                            <th style={thStyle}>
                                Promień (m)
                                <Tooltip text="Przybliżony promień księżyca wyrażony w metrach." />
                            </th>

                            <th style={thStyle}>
                                Planeta
                                <Tooltip text="Planeta, którą okrąża księżyc." />
                            </th>
                            <th style={thStyle}>
                                Galaktyka
                                <Tooltip text="Galaktyka, w której znajduje się księżyc." />
                            </th>
                            <th style={thStyle}>Akcje</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentKsiezyce.map((k) => (
                            <Fragment key={k.id}>
                                <tr style={rowStyle}>
                                    <td style={tdStyle}>{k.id}</td>
                                    <td style={tdStyle}>{k.nazwa}</td>
                                    <td style={tdStyle}>{k.masa || "—"}</td>
                                    <td style={tdStyle}>{k.promien || "—"}</td>
                                    <td style={tdStyle}>{k.planetaNazwa || "—"}</td>
                                    <td style={tdStyle}>{k.galaktykaNazwa || "—"}</td>
                                    <td style={tdStyle}>
                                        <button onClick={() => toggleExpand(k.id)} style={buttonStyleExpand}>
                                            {expanded === k.id ? "▲" : "▼"}
                                        </button>

                                        {(user?.username === k.utworzylUsername ||
                                            user?.roles?.includes("ADMIN")) && (
                                            <>
                                                <button onClick={() => handleEditClick(k)} style={buttonStyleEdit}>✏️</button>
                                                <button onClick={() => handleDelete(k.id)} style={buttonStyleDelete}>🗑️</button>
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {expanded === k.id && (
                                    <tr>
                                        <td colSpan="7" style={expandedStyle}>
                                            <div style={{ paddingLeft: "20px" }}>
                                                <p><b>🌍 Odleglosc od planety:</b> {k.odlegloscOdPlanety || "brak danych"}</p>
                                                <p><b>👤 Utworzyl:</b> {k.utworzylUsername || "Nieznany"}</p>

                                            </div>
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
                    title="Dodaj Ksiezyc"
                    nazwa={nazwa}
                    masa={masa}
                    promien={promien}
                    odlegloscOdPlanety={odlegloscOdPlanety}
                    planetaId={planetaId}
                    galaktykaId={galaktykaId}
                    setNazwa={setNazwa}
                    setMasa={setMasa}
                    setPromien={setPromien}
                    setOdlegloscOdPlanety={setOdlegloscOdPlanety}
                    setPlanetaId={setPlanetaId}
                    setGalaktykaId={setGalaktykaId}
                    onCancel={() => { setShowAddModal(false); resetForm(); }}
                    onConfirm={handleAddKsiezyc}
                    confirmLabel="✅ Dodaj"
                />
            )}

            {showEditModal && (
                <Modal
                    title="Edytuj Ksiezyc"
                    nazwa={nazwa}
                    masa={masa}
                    promien={promien}
                    odlegloscOdPlanety={odlegloscOdPlanety}
                    planetaId={planetaId}
                    galaktykaId={galaktykaId}
                    setNazwa={setNazwa}
                    setMasa={setMasa}
                    setPromien={setPromien}
                    setOdlegloscOdPlanety={setOdlegloscOdPlanety}
                    setPlanetaId={setPlanetaId}
                    setGalaktykaId={setGalaktykaId}
                    onCancel={() => { setShowEditModal(false); resetForm(); }}
                    onConfirm={handleEditSave}
                    confirmLabel="💾 Zapisz"
                />
            )}
        </div>
    );
}

function Modal({
                   title,
                   nazwa,
                   masa,
                   promien,
                   odlegloscOdPlanety,
                   planetaId,
                   galaktykaId,
                   setNazwa,
                   setMasa,
                   setPromien,
                   setOdlegloscOdPlanety,
                   setPlanetaId,
                   setGalaktykaId,
                   onCancel,
                   onConfirm,
                   confirmLabel,
               }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{title}</h3>

                <input placeholder="Nazwa" value={nazwa} onChange={(e) => setNazwa(e.target.value)} style={inputStyle} />
                <input placeholder="Masa" type="number" value={masa} onChange={(e) => setMasa(e.target.value)} style={inputStyle} />
                <input placeholder="Promien" type="number" value={promien} onChange={(e) => setPromien(e.target.value)} style={inputStyle} />
                <input placeholder="Odleglosc od planety" type="number" value={odlegloscOdPlanety} onChange={(e) => setOdlegloscOdPlanety(e.target.value)} style={inputStyle} />
                <input placeholder="ID Planety" value={planetaId} onChange={(e) => setPlanetaId(e.target.value)} style={inputStyle} />
                <input placeholder="ID Galaktyki" value={galaktykaId} onChange={(e) => setGalaktykaId(e.target.value)} style={inputStyle} />

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
    marginBottom: "25px",
};

const tableWrapper = {
    borderRadius: "12px",
    border: "1px solid #1d3557",
    marginTop: "20px",
};


const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(13,27,42,0.8)",
};

const thStyle = {
    padding: "12px",
    borderBottom: "2px solid #00b4d8",
};

const tdStyle = {
    padding: "10px",
    color: "#e0e0e0",
};

const rowStyle = {
    textAlign: "center",
    borderBottom: "1px solid #1d3557",
};

const expandedStyle = {
    padding: "20px",
    background: "rgba(0,0,0,0.4)",
    color: "#caf0f8",
    textAlign: "left",
    borderBottom: "1px solid #1d3557",
};

const inputStyle = {
    width: "140px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #00b4d8",
    background: "#001f3f",
    color: "#e0e0e0",
};

const buttonStyleAdd = {
    padding: "8px 15px",
    marginLeft: "10px",
    background: "#00b4d8",
    color: "#000",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
};

const buttonStyleCancel = {
    padding: "8px 15px",
    background: "#f94144",
    color: "#fff",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
};

const buttonStyleDelete = {
    marginLeft: "5px",
    background: "#e63946",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const buttonStyleEdit = {
    marginLeft: "5px",
    background: "#ffb703",
    color: "black",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const buttonStyleExpand = {
    background: "#023e8a",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
};

const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const modalBox = {
    background: "#0d1b2a",
    padding: "30px",
    borderRadius: "12px",
    minWidth: "300px",
};

export default KsiezycePage;
