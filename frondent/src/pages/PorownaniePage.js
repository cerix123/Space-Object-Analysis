import { useState, useEffect } from "react";

const typyObiektow = [
    { name: "Planety", endpoint: "/api/planety" },
    { name: "Gwiazdy", endpoint: "/gwiazdy" },
    { name: "Asteroidy", endpoint: "/asteroidy" },
    { name: "Galaktyki", endpoint: "/galaktyki" },
    { name: "Gwiazdozbiory", endpoint: "/api/gwiazdozbiory" },
    { name: "Księżyce", endpoint: "/api/ksiezyce" },
    { name: "Czarne Dziury", endpoint: "/api/czarne-dziury" }
];

const fieldGroups = {
    Planety: { "Podstawowe": ["nazwa", "maAtmosfere"], "Fizyczne": ["masa", "promien"], "Lokalizacja": ["odlegloscOdGwiazdy", "gwiazdaNazwa", "galaktykaNazwa"] },
    Gwiazdy: { "Podstawowe": ["nazwa", "typSpektralny"], "Fizyczne": ["masa", "promien", "jasnosc"], "Lokalizacja": ["galaktykaNazwa", "gwiazdozbiorNazwa"] },
    Asteroidy: { "Podstawowe": ["nazwa", "sklad", "orbita"], "Fizyczne": ["masa", "srednica"], "Lokalizacja": ["galaktykaNazwa"] },
    Galaktyki: { "Podstawowe": ["nazwa", "typ"], "Fizyczne": ["srednica", "liczbaGwiazd"] },
    Gwiazdozbiory: { "Podstawowe": ["nazwa", "opis"], "Lokalizacja": ["galaktykaNazwa"] },
    Księżyce: { "Podstawowe": ["nazwa"], "Fizyczne": ["masa", "promien"], "Lokalizacja": ["odlegloscOdPlanety", "planetaNazwa", "galaktykaNazwa"] },
    "Czarne Dziury": { "Podstawowe": ["nazwa", "typ"], "Fizyczne": ["masa", "promienSchwarzschilda"], "Lokalizacja": ["galaktykaNazwa"] }
};

const numericFields = {
    Planety: ["masa", "promien", "odlegloscOdGwiazdy"],
    Gwiazdy: ["masa", "promien", "jasnosc"],
    Asteroidy: ["masa", "srednica"],
    Galaktyki: ["srednica", "liczbaGwiazd"],
    Gwiazdozbiory: [],
    Księżyce: ["masa", "promien", "odlegloscOdPlanety"],
    "Czarne Dziury": ["masa", "promienSchwarzschilda"]
};

const niceFieldNames = {
    nazwa: "Nazwa", masa: "Masa", promien: "Promień", maAtmosfere: "Atmosfera",
    odlegloscOdGwiazdy: "Odległość od gwiazdy", odlegloscOdPlanety: "Odległość od planety",
    gwiazdaNazwa: "Gwiazda", galaktykaNazwa: "Galaktyka", utworzylUsername: "Utworzył",
    typSpektralny: "Typ spektralny", jasnosc: "Jasność", srednica: "Średnica",
    sklad: "Skład", orbita: "Orbita", gwiazdozbiorNazwa: "Gwiazdozbiór", typ: "Typ",
    opis: "Opis", planetaNazwa: "Planeta", promienSchwarzschilda: "Promień Schwarzschilda",
    liczbaGwiazd: "Liczba gwiazd"
};

function PorownaniePage() {
    const [typ, setTyp] = useState("");
    const [lista, setLista] = useState([]);
    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [o1, setO1] = useState(null);
    const [o2, setO2] = useState(null);
    const [modal, setModal] = useState(null);
    const [filterA, setFilterA] = useState("");
    const [filterB, setFilterB] = useState("");

    useEffect(() => {
        if (!typ) return;
        const ep = typyObiektow.find(t => t.name === typ)?.endpoint;
        fetch(`http://localhost:8080${ep}`, { credentials: "include" })
            .then(r => r.json())
            .then(d => {
                const list = d._embedded ? Object.values(d._embedded)[0] : d;
                setLista(Array.isArray(list) ? list : [list]);
                setId1(""); setId2(""); setO1(null); setO2(null);
            });
    }, [typ]);


    const filteredListA = lista.filter(o =>
        (o.nazwa ?? "")
            .toLowerCase()
            .includes(filterA.toLowerCase())
    );

    const filteredListB = lista.filter(o =>
        (o.nazwa ?? "")
            .toLowerCase()
            .includes(filterB.toLowerCase())
    );


    const compare = async () => {
        if (!typ) {
            setModal({ title: "Brak typu obiektu", message: "Wybierz typ obiektu zanim porównasz." });
            return;
        }
        if (!id1 || !id2) return;
        if (id1 === id2) {
            setModal({ title: "Ten sam obiekt", message: "Nie możesz porównywać tego samego obiektu z samym sobą." });
            return;
        }

        const ep = typyObiektow.find(t => t.name === typ)?.endpoint;
        try {
            const [a, b] = await Promise.all([
                fetch(`http://localhost:8080${ep}/${id1}`, { credentials: "include" }).then(r => r.json()),
                fetch(`http://localhost:8080${ep}/${id2}`, { credentials: "include" }).then(r => r.json())
            ]);
            setO1(a);
            setO2(b);
        } catch (err) {
            setModal({ title: "Błąd pobierania", message: "Nie udało się pobrać szczegółów obiektów." });
        }
    };

    const better = (key, v, ov) =>
        numericFields[typ]?.includes(key) && v > ov ? { color: "#80ffdb", fontWeight: 600 } : {};

    const renderValue = v =>
        v === null || v === undefined
            ? <span style={{ opacity: 0.5, fontStyle: "italic" }}>brak danych</span>
            : typeof v === "boolean" ? v ? "✅" : "❌" : v;

    return (
        <div style={page}>
            <h2 style={title}>🔎 Porównanie obiektów</h2>

            <div style={controls}>
                <select value={typ} onChange={e => setTyp(e.target.value)} style={input}>
                    <option value="">Typ obiektu</option>
                    {typyObiektow.map(t => <option key={t.name}>{t.name}</option>)}
                </select>

                <input
                    placeholder="Szukaj obiektu A..."
                    value={filterA}
                    onChange={e => setFilterA(e.target.value)}
                    style={searchInput}
                />

                <select value={id1} onChange={e => setId1(e.target.value)} style={input}>
                    <option value="">Obiekt A</option>
                    {filteredListA.map(o => (
                        <option key={o.id} value={o.id}>
                            {o.nazwa ?? o.id}
                        </option>
                    ))}
                </select>


                <input
                    placeholder="Szukaj obiektu B..."
                    value={filterB}
                    onChange={e => setFilterB(e.target.value)}
                    style={searchInput}
                />

                <select value={id2} onChange={e => setId2(e.target.value)} style={input}>
                    <option value="">Obiekt B</option>
                    {filteredListB.map(o => (
                        <option key={o.id} value={o.id}>
                            {o.nazwa ?? o.id}
                        </option>
                    ))}
                </select>


                <button onClick={compare} style={button}>Porównaj</button>
            </div>

            {o1 && o2 && (
                <div style={compareBox}>
                    <div style={headerRow}>
                        <div />
                        <div style={objHeader}>{o1.nazwa}</div>
                        <div style={objHeader}>{o2.nazwa}</div>
                    </div>

                    {Object.entries(fieldGroups[typ]).map(([group, fields]) => (
                        <div key={group} style={groupBox}>
                            <h4 style={groupTitle}>{group}</h4>
                            {fields.map(f => (
                                <div key={f} style={row}>
                                    <div style={label}>{niceFieldNames[f] ?? f}</div>
                                    <div style={{ ...cell, ...better(f, o1[f], o2[f]) }}>{renderValue(o1[f])}</div>
                                    <div style={{ ...cell, ...better(f, o2[f], o1[f]) }}>{renderValue(o2[f])}</div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}


            {modal && (
                <div onClick={() => setModal(null)} style={modalOverlay}>
                    <div onClick={e => e.stopPropagation()} style={modalContent}>
                        <h3>{modal.title}</h3>
                        <p>{modal.message}</p>
                        <button onClick={() => setModal(null)} style={modalButton}>Zamknij</button>
                    </div>
                </div>
            )}
        </div>
    );
}



const page = {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000)",
    color: "#e0e0e0",
    fontFamily: "Orbitron, sans-serif",
    padding: "40px"
};

const title = { textAlign: "center", color: "#90e0ef", marginBottom: "20px" };
const controls = { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" };
const input = { padding: "6px 10px", background: "#001f3f", color: "#fff", border: "1px solid #00b4d8", borderRadius: "6px" };
const searchInput = {
    ...input,
    width: "160px",
    opacity: 0.85
};


const button = { padding: "6px 14px", background: "#00b4d8", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" };
const compareBox = { maxWidth: "900px", margin: "30px auto", display: "flex", flexDirection: "column", gap: "20px" };
const headerRow = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" };
const objHeader = { fontWeight: 700, color: "#80ffdb" };
const groupBox = { background: "rgba(13,27,42,0.7)", padding: "15px", borderRadius: "12px" };
const groupTitle = { marginBottom: "10px", color: "#90e0ef" };
const row = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 0", borderBottom: "1px solid #1d3557" };
const label = { opacity: 0.85 };
const cell = { textAlign: "center" };

const modalOverlay = { position: "fixed", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.7)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 };
const modalContent = { background:"#111", padding:"30px", borderRadius:"12px", maxWidth:"400px", width:"90%", color:"#fff", textAlign:"center" };
const modalButton = { padding:"8px 16px", borderRadius:"6px", border:"none", cursor:"pointer", background:"#00b4d8", color:"#fff", fontWeight:"bold" };

export default PorownaniePage;
