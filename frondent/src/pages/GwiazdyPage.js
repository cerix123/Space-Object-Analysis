import { useEffect, useState, Fragment, useRef } from "react";

import Navbar from "../components/Navbar";

function GwiazdyPage({ user }) {
    const [gwiazdy, setGwiazdy] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);


    const [nazwa, setNazwa] = useState("");
    const [masa, setMasa] = useState("");
    const [promien, setPromien] = useState("");
    const [typSpektralny, setTypSpektralny] = useState("");
    const [jasnosc, setJasnosc] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [galaktykaId, setGalaktykaId] = useState("");
    const [gwiazdozbiorId, setGwiazdozbiorId] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortDir, setSortDir] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentGwiazdy = filtered.slice(indexOfFirst, indexOfLast);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);


    function Tooltip({ text }) {
        const [visible, setVisible] = useState(false);
        const [pos, setPos] = useState({ x: 0, y: 0 });
        const ref = useRef(null);
        let timeoutRef = useRef(null);

        const showTooltip = (e) => {
            const rect = e.target.getBoundingClientRect();
            setPos({
                x: rect.left + rect.width / 2,
                y: rect.top
            });
            clearTimeout(timeoutRef.current);
            setVisible(true);
        };

        const hideTooltip = () => {

            timeoutRef.current = setTimeout(() => setVisible(false), 150);
        };

        return (
            <span style={{ position: "relative", display: "inline-block", marginLeft: "6px" }}
                  onMouseEnter={showTooltip}
                  onMouseLeave={hideTooltip}
            >
            ❓
            <div
                ref={ref}
                onMouseEnter={() => { clearTimeout(timeoutRef.current); setVisible(true); }}
                onMouseLeave={hideTooltip}
                style={{
                    position: "fixed",
                    top: pos.y,
                    left: pos.x,
                    transform: "translate(-50%, -100%)",
                    background: "#003049",
                    color: "#fff",
                    padding: "8px",
                    borderRadius: "8px",
                    width: "200px",
                    maxHeight: "300px",
                    overflowY: "auto",
                    boxShadow: "0 0 12px #00b4d8",
                    fontSize: "0.75rem",
                    pointerEvents: "auto",
                    zIndex: 1000000,
                    visibility: visible ? "visible" : "hidden"
                }}
            >
                {text}
            </div>
        </span>
        );
    }



    const [filter, setFilter] = useState({
        nazwa: "",
        typSpektralny: "",
        temperaturaMin: "",
        temperaturaMax: "",
        masaMin: "",
        masaMax: "",
        galaktyka: "",
        gwiazdozbior: ""
    });



    const fetchGwiazdy = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/gwiazdy", {
                credentials: "include",
                headers: { Accept: "application/json" }
            });
            const data = await res.json();
            if (data?.error) {
                throw new Error(data.message);
            }

            const embedded = data._embedded || {};
            const lista =
                embedded.gwiazdaDTOList ||
                Object.values(embedded)[0] ||
                data;

            const arr = Array.isArray(lista) ? lista : [lista];

            setGwiazdy(arr);
            setFiltered(arr);

        } catch (err) {
            setError("Błąd pobierania gwiazd: " + err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchGwiazdy();
    }, []);

    const toggleExpand = (id) => setExpanded(expanded === id ? null : id);

    const handleAddGwiazda = async () => {
        setError(null);

        try {
            const newGwiazda = {
                nazwa,
                masa: parseFloat(masa),
                promien: parseFloat(promien),
                typSpektralny,
                jasnosc: parseFloat(jasnosc),
                temperatura: parseFloat(temperatura),
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                gwiazdozbiorId: gwiazdozbiorId ? parseInt(gwiazdozbiorId) : null,
                usernameUtworzyl: user?.username
            };
            const res = await fetch("http://localhost:8080/gwiazdy/add", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(newGwiazda)
            });
            const data = await res.json();
            if (data?.error) {
                throw new Error(data.message);
            }
            await fetchGwiazdy();
            setShowModal(false);
            resetForm();
        } catch (err) {
            setError("Błąd dodawania gwiazdy: " + err.message);
        }
    };


    const handleEditGwiazda = (gwiazda) => {
        setEditMode(true);
        setEditId(gwiazda.id);
        setNazwa(gwiazda.nazwa);
        setMasa(gwiazda.masa);
        setPromien(gwiazda.promien);
        setTypSpektralny(gwiazda.typSpektralny);
        setJasnosc(gwiazda.jasnosc);
        setTemperatura(gwiazda.temperatura);
        setGalaktykaId(gwiazda.galaktykaId || "");
        setGwiazdozbiorId(gwiazda.gwiazdozbiorId || "");
        setShowModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedGwiazda = {
                id: editId,
                nazwa,
                masa: parseFloat(masa),
                promien: parseFloat(promien),
                typSpektralny,
                jasnosc: parseFloat(jasnosc),
                temperatura: parseFloat(temperatura),
                galaktykaId: galaktykaId ? parseInt(galaktykaId) : null,
                gwiazdozbiorId: gwiazdozbiorId ? parseInt(gwiazdozbiorId) : null,
                utworzylUsername: user?.username
            };
            const res = await fetch(`http://localhost:8080/gwiazdy/${editId}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedGwiazda)
            });
            if (!res.ok) throw new Error("Nie udało się zaktualizować gwiazdy");
            await fetchGwiazdy();
            setShowModal(false);
            resetForm();
            setEditMode(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteGwiazda = async (id) => {
        if (!window.confirm("Na pewno chcesz usunąć tę gwiazdę?")) return;
        setError(null);
        try {
            const res = await fetch(
                `http://localhost:8080/gwiazdy/${id}?username=${user?.username}`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: { Accept: "application/json" }
                }
            );

            let data = null;
            try {
                data = await res.json();
            } catch {
                data = null;
            }

            if (data?.error) {
                throw new Error(data.message);
            }

            await fetchGwiazdy();

        } catch (err) {
            setError("Błąd usuwania gwiazdy: " + err.message);
        }
    };


    const applyFilter = async () => {
        try {
            const params = new URLSearchParams();

            if (filter.nazwa) params.append("nazwa", filter.nazwa);
            if (filter.typSpektralny) params.append("typSpektralny", filter.typSpektralny);
            if (filter.masaMin) params.append("masaMin", filter.masaMin);
            if (filter.masaMax) params.append("masaMax", filter.masaMax);
            if (filter.temperaturaMin) params.append("temperaturaMin", filter.temperaturaMin);
            if (filter.temperaturaMax) params.append("temperaturaMax", filter.temperaturaMax);

            const res = await fetch(
                `http://localhost:8080/gwiazdy/filter?${params.toString()}`,
                { credentials: "include" }
            );

            if (!res.ok) throw new Error("Błąd filtrowania");

            const data = await res.json();
            const embedded = data._embedded || {};
            const lista = embedded.gwiazdaDTOList || Object.values(embedded)[0] || [];

            setFiltered(lista);
            setCurrentPage(1);

        } catch (err) {
            alert("❌ " + err.message);
        }
    };


    const resetFilters = () => {
        setFilter({
            nazwa: "",
            typSpektralny: "",
            temperaturaMin: "",
            temperaturaMax: "",
            masaMin: "",
            masaMax: "",
            galaktyka: "",
            gwiazdozbior: ""
        });
        setFiltered(gwiazdy);
    };


    const resetForm = () => {
        setNazwa("");
        setMasa("");
        setPromien("");
        setTypSpektralny("");
        setJasnosc("");
        setTemperatura("");
        setGalaktykaId("");
        setGwiazdozbiorId("");
        setEditMode(false);
        setEditId(null);
    };

    return (
        <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)", color: "#e0e0e0", fontFamily: "Orbitron, sans-serif" }}>
            <div style={{ padding: "40px" }}>


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px"
                }}>
                    <h2
                        style={{
                            color: "#90e0ef",
                            fontSize: "2rem",
                            textShadow: "0 0 15px #00b4d8",
                            margin: 0,
                            flex: 1,
                            textAlign: "center",
                            transform: "translateX(40px)"
                        }}
                    >
                        ⭐ Lista Gwiazd
                    </h2>

                    <button
                        onClick={() => window.location.href = "/diagram-hr"}
                        style={{
                            padding: "6px 12px",
                            background: "#ffd60a",
                            color: "#000",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                            boxShadow: "0 0 6px #ffd60a",
                            whiteSpace: "nowrap"
                        }}
                    >
                        Diagram Hertzsprunga-Russella
                    </button>
                </div>



                <div style={filterContainer}>
                    <input placeholder="🔍 Nazwa" value={filter.nazwa} onChange={(e) => setFilter({ ...filter, nazwa: e.target.value })} style={inputStyleFilter} />
                    <input placeholder="Typ spektralny" value={filter.typSpektralny} onChange={(e) => setFilter({ ...filter, typSpektralny: e.target.value })} style={inputStyleFilter} />
                    <input
                        placeholder="Masa min"
                        value={filter.masaMin}
                        onChange={(e) => setFilter({ ...filter, masaMin: e.target.value })}
                        style={inputStyleFilter}
                    />

                    <input
                        placeholder="Masa max"
                        value={filter.masaMax}
                        onChange={(e) => setFilter({ ...filter, masaMax: e.target.value })}
                        style={inputStyleFilter}
                    />

                    <input placeholder="Temp. min" value={filter.temperaturaMin} onChange={(e) => setFilter({ ...filter, temperaturaMin: e.target.value })} style={inputStyleFilter} />
                    <input placeholder="Temp. max" value={filter.temperaturaMax} onChange={(e) => setFilter({ ...filter, temperaturaMax: e.target.value })} style={inputStyleFilter} />
                    <input placeholder="Galaktyka" value={filter.galaktyka} onChange={(e) => setFilter({ ...filter, galaktyka: e.target.value })} style={inputStyleFilter} />
                    <input placeholder="Gwiazdozbiór" value={filter.gwiazdozbior} onChange={(e) => setFilter({ ...filter, gwiazdozbior: e.target.value })} style={inputStyleFilter} />
                    <button onClick={applyFilter} style={buttonStyleAdd}>🔍 Filtruj</button>
                    <button onClick={resetFilters} style={buttonStyleCancel}>🔄 Reset</button>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <select value={sortKey} onChange={(e) => setSortKey(e.target.value)} style={inputStyleFilter}>
                            <option value="">Sortuj według...</option>
                            <option value="nazwa">Nazwa</option>
                            <option value="masa">Masa</option>
                            <option value="promien">Promień</option>
                            <option value="temperatura">Temperatura</option>
                            <option value="jasnosc">Jasność</option>
                            <option value="typspektralny">Typ spektralny</option>
                            <option value="galaktyka">Galaktyka</option>
                            <option value="gwiazdozbior">Gwiazdozbiór</option>
                        </select>

                        <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} style={inputStyleFilter}>
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>

                        <button
                            onClick={async () => {
                                if (!sortKey) return alert("Wybierz pole sortowania!");

                                try {
                                    const res = await fetch(`http://localhost:8080/gwiazdy/sort?by=${sortKey}&dir=${sortDir}`, {
                                        credentials: "include",
                                        headers: { Accept: "application/json" }
                                    });

                                    const data = await res.json();
                                    const embedded = data._embedded || {};
                                    const lista = embedded.gwiazdaDTOList || Object.values(embedded)[0] || data;

                                    const arr = Array.isArray(lista) ? lista : [lista];
                                    setFiltered(arr);
                                    setCurrentPage(1);

                                } catch (err) {
                                    alert("Błąd sortowania: " + err.message);
                                }
                            }}
                            style={buttonStyleAdd}
                        >
                            ↕ Sortuj
                        </button>
                    </div>

                    <button onClick={() => { resetForm(); setShowModal(true); }} style={buttonStyleAdd}>➕ Dodaj</button>
                </div>

                {loading && <p style={{ textAlign: "center" }}>🔄 Ładowanie gwiazd...</p>}
                {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}

                {filtered.length > 0 && (
                    <div>
                        <table style={tableStyle}>

                        <thead>
                            <tr style={{ background: "#003049", color: "#fff" }}>
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>Nazwa</th>
                                <th style={thStyle}>Masa (kg)
                                    <Tooltip text=" Masa gwiazdy determinuje jej grawitację, ewolucję i długość życia." />
                                </th>
                                <th style={thStyle}>Promień (km)
                                    <Tooltip text=" Promień wpływa na jasność i etap życia gwiazdy" />
                                </th>
                                <th style={thStyle}>
                                    Typ spektralny
                                    <Tooltip
                                        text={
                                            <>
                                                <strong>
                                                    Klasyfikacja gwiazdy według temperatury i koloru<br />
                                                    Litera (typ widmowy):</strong><br />
                                                O: &gt;30 000 K (niebieskie)<br />
                                                B: 10 000–30 000 K (niebiesko-białe)<br />
                                                A: 7 500–10 000 K (białe)<br />
                                                F: 6 000–7 500 K (żółto-białe)<br />
                                                G: 5 200–6 000 K (żółte)<br />
                                                K: 3 700–5 200 K (pomarańczowe)<br />
                                                M: &lt;3 700 K (czerwone)<br /><br />

                                                <strong>Cyfra (podklasa temperaturowa):</strong><br />
                                                0 = najgorętsza w danej klasie, 9 = najchłodniejsza<br /><br />

                                                <strong>Klasa jasności (Cyfra rzymska):</strong><br />
                                                0/Ia+ = hiperolbrzymy<br />
                                                Ia/Iab/Ib = nadolbrzymy<br />
                                                II = jasne olbrzymy<br />
                                                III = olbrzymy<br />
                                                IV = podolbrzymy<br />
                                                V = karły<br />
                                                VI/sd = podkarły<br />
                                                D/VII = białe karły
                                            </>
                                        }
                                    />
                                </th>

                                <th style={thStyle}>Jasność (L☉)
                                    <Tooltip text=" Jasność to ilość energii emitowanej przez gwiazdę w stosunku do Słońca." />
                                </th>
                                <th style={thStyle}>Temperatura (K)
                                    <Tooltip text=" Temperatura powierzchni wpływa na kolor i typ spektralny gwiazdy." />
                                </th>
                                <th style={thStyle}>Akcje</th>
                            </tr>
                            </thead>
                            <tbody>
                            {currentGwiazdy.map((g) => (
                                <Fragment key={g.id}>
                                    <tr style={rowStyle}>
                                        <td style={tdStyle}>{g.id}</td>
                                        <td style={tdStyle}>{g.nazwa}</td>
                                        <td style={tdStyle}>{g.masa}</td>
                                        <td style={tdStyle}>{g.promien}</td>
                                        <td style={tdStyle}>{g.typSpektralny}</td>
                                        <td style={tdStyle}>{g.jasnosc}</td>
                                        <td style={tdStyle}>{g.temperatura}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => toggleExpand(g.id)} style={buttonSmall}>{expanded === g.id ? "▲" : "▼"}</button>
                                            {user && (user.username === g.utworzylUsername || user.roles?.includes("ADMIN")) && (
                                                <>
                                                    <button onClick={() => handleEditGwiazda(g)} style={buttonEdit}>✏️</button>
                                                    <button onClick={() => handleDeleteGwiazda(g.id)} style={buttonDelete}>🗑️</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                    {expanded === g.id && (
                                        <tr>
                                            <td colSpan="8" style={expandedStyle}>
                                                <div style={{ paddingLeft: "20px" }}>

                                                    <p><b>👤 Utworzył:</b> {g.utworzylUsername || "Nieznany"}</p>
                                                    {g.galaktykaNazwa && <p><b>🌌 Galaktyka:</b> {g.galaktykaNazwa}</p>}
                                                    {g.gwiazdozbiorNazwa && <p><b>✨ Gwiazdozbiór:</b> {g.gwiazdozbiorNazwa}</p>}
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

                {showModal && (
                    <div style={modalOverlay}>
                        <div style={modalBox}>
                            <h3 style={{ color: "#00b4d8", marginBottom: "15px" }}>{editMode ? "✏️ Edytuj Gwiazdę" : "➕ Dodaj Gwiazdę"}</h3>
                            <input placeholder="Nazwa" value={nazwa} onChange={e => setNazwa(e.target.value)} style={inputStyle} />
                            <input placeholder="Masa" value={masa} onChange={e => setMasa(e.target.value)} style={inputStyle} />
                            <input placeholder="Promień" value={promien} onChange={e => setPromien(e.target.value)} style={inputStyle} />
                            <input placeholder="Typ spektralny" value={typSpektralny} onChange={e => setTypSpektralny(e.target.value)} style={inputStyle} />
                            <input placeholder="Jasność" value={jasnosc} onChange={e => setJasnosc(e.target.value)} style={inputStyle} />
                            <input placeholder="Temperatura" value={temperatura} onChange={e => setTemperatura(e.target.value)} style={inputStyle} />
                            <input placeholder="ID Galaktyki (opcjonalnie)" value={galaktykaId} onChange={e => setGalaktykaId(e.target.value)} style={inputStyle} />
                            <input placeholder="ID Gwiazdozbioru (opcjonalnie)" value={gwiazdozbiorId} onChange={e => setGwiazdozbiorId(e.target.value)} style={inputStyle} />
                            <div style={{ marginTop: "15px", textAlign: "right" }}>
                                <button onClick={() => setShowModal(false)} style={buttonStyleCancel}>❌</button>
                                <button onClick={editMode ? handleSaveEdit : handleAddGwiazda} style={buttonStyleAdd}>{editMode ? "💾 Zapisz" : "✅ Dodaj"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "30px",
    background: "rgba(13, 27, 42, 0.8)",
    borderRadius: "12px",
    overflow: "visible",
    position: "relative",
    zIndex: 1
};const thStyle = { padding: "12px", borderBottom: "2px solid #00b4d8" };
const tdStyle = { padding: "10px", color: "#e0e0e0" };
const rowStyle = { textAlign: "center", borderBottom: "1px solid #1d3557" };
const expandedStyle = { padding: "20px", background: "rgba(0, 0, 0, 0.4)", color: "#caf0f8", textAlign: "left", borderBottom: "1px solid #1d3557" };
const inputStyle = { width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #00b4d8", background: "#001f3f", color: "#e0e0e0" };
const inputStyleFilter = { padding: "6px", borderRadius: "6px", border: "1px solid #00b4d8", background: "#001f3f", color: "#e0e0e0", width: "140px" };
const buttonStyleAdd = { padding: "8px 15px", background: "#00b4d8", color: "#000", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonStyleCancel = { padding: "8px 15px", background: "#f94144", color: "#fff", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const buttonEdit = { padding: "5px 10px", background: "#ffd166", color: "#000", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" };
const buttonDelete = { padding: "5px 10px", background: "#ef233c", color: "#fff", borderRadius: "5px", fontWeight: "bold", cursor: "pointer", marginLeft: "5px" };
const buttonSmall = { padding: "5px 10px", background: "#118ab2", color: "#fff", borderRadius: "5px", cursor: "pointer", marginRight: "5px" };
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
    zIndex: 999999
};
const modalBox = { background: "#0d1b2a", padding: "30px", borderRadius: "12px", minWidth: "320px" };

const filterContainer = { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "25px" };

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
    zIndex: 999999,
    bottom: "125%",
    left: "50%",
    marginLeft: "-110px",
    boxShadow: "0 0 10px #00b4d8",
    fontSize: "0.85rem",

    pointerEvents: "none",
};



const tooltipContainerHover = {
    ...tooltipBubble,
    visibility: "visible",
};

export default GwiazdyPage;