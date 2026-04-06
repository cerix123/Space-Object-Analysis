import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UzytkownicyPage({ user }) {
    const [uzytkownicy, setUzytkownicy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editUserId, setEditUserId] = useState(null);
    const [form, setForm] = useState({ username: "", email: "", password: "" });

    const [toast, setToast] = useState(null);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        if (!user?.roleNames?.includes("ADMIN")) {
            navigate("/home");
        }
    }, [user, navigate]);


    const changeRole = async (id, role) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/uzytkownicy/${id}/role?role=${role}&username=${user.username}`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Błąd zmiany roli");

            showToast("🔁 Rola zmieniona");
            fetchUzytkownicy();
        } catch (err) {
            showToast("❌ " + err.message);
        }
    };


    const deleteUser = async () => {
        if (!deleteCandidate) return;

        try {
            const res = await fetch(
                `http://localhost:8080/api/uzytkownicy/${deleteCandidate.id}/admin?username=${user.username}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (!res.ok) throw new Error("Błąd usuwania");

            showToast("🗑️ Użytkownik usunięty");
            setDeleteCandidate(null);
            fetchUzytkownicy();
        } catch (err) {
            showToast("❌ " + err.message);
        }
    };



    const fetchUzytkownicy = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/uzytkownicy", {
                credentials: "include",
                headers: { Accept: "application/json" },
            });

            const data = await res.json();

            if (data?.error) {
                throw new Error(data.message);
            }

            const embedded = data._embedded || {};
            const lista =
                embedded.uzytkownikDTOList ||
                embedded.uzytkownicy ||
                Object.values(embedded)[0] ||
                data;

            setUzytkownicy(Array.isArray(lista) ? lista : [lista]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.roleNames?.includes("ADMIN")) {
            fetchUzytkownicy();
        }
    }, [user]);



    const startEdit = (u) => {
        setEditUserId(u.id);
        setForm({
            username: u.username,
            email: u.email,
            password: "",
        });
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const saveUser = async (id, originalUser) => {
        const payload = {};

        if (form.username && form.username !== originalUser.username) {
            payload.username = form.username;
        }

        if (form.email && form.email !== originalUser.email) {
            payload.email = form.email;
        }

        if (form.password) {
            payload.password = form.password;
        }

        if (Object.keys(payload).length === 0) {
            showToast("ℹ️ Brak zmian do zapisania");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:8080/api/uzytkownicy/${id}/admin?username=${user.username}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();

            if (data?.error) {
                throw new Error(data.message);
            }

            await fetchUzytkownicy();
            setEditUserId(null);
            showToast("✅ Użytkownik zaktualizowany");
        } catch (err) {
            showToast("❌ " + err.message);
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
            {toast && <div style={toastStyle}>{toast}</div>}

            <h2
                style={{
                    textAlign: "center",
                    color: "#90e0ef",
                    fontSize: "2rem",
                    textShadow: "0 0 15px #00b4d8",
                    marginBottom: "30px",
                }}
            >
                Panel administratora – użytkownicy
            </h2>

            {loading && <p style={{ textAlign: "center" }}>Ładowanie...</p>}
            {error && (
                <p style={{ textAlign: "center", color: "red" }}>{error}</p>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                }}
            >
                {uzytkownicy.map((u) => (
                    <div key={u.id} style={cardStyle}>
                        <h3 style={{ color: "#00b4d8" }}>🧑‍💻 {u.username}</h3>

                        {editUserId === u.id ? (
                            <>
                                <input
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    style={input}
                                />
                                <input
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    style={input}
                                />
                                <input
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Nowe hasło (opcjonalnie)"
                                    style={input}
                                />
                                <select
                                    onChange={(e) => changeRole(u.id, e.target.value)}
                                    defaultValue=""
                                    style={{ ...input, marginTop: "8px" }}
                                >
                                    <option value="" disabled>Zmień rolę</option>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>

                                <button
                                    style={btn}
                                    onClick={() => saveUser(u.id, u)}
                                >
                                    💾 Zapisz
                                </button>
                                <button
                                    style={{
                                        ...btn,
                                        background: "#444",
                                        marginTop: "6px",
                                    }}
                                    onClick={() => setEditUserId(null)}
                                >
                                    ❌ Anuluj
                                </button>
                            </>
                        ) : (
                            <>
                                <p>
                                    <b>Email:</b> {u.email}
                                </p>
                                <p>
                                    <b>Rola:</b>{" "}
                                    {Array.from(u.roleNames || []).join(", ")}
                                </p>

                                <button
                                    style={btn}
                                    onClick={() => startEdit(u)}
                                >
                                    ✏️ Edytuj
                                </button>

                                <button
                                    style={{ ...btn, background: "#c1121f", marginTop: "6px" }}
                                    onClick={() => setDeleteCandidate(u)}
                                >
                                    🗑️ Usuń
                                </button>


                            </>
                        )}
                    </div>
                ))}
            </div>
            {deleteCandidate && (
                <div style={modalOverlay}>
                    <div style={modalContent}>
                        <h3>⚠️ Potwierdzenie</h3>
                        <p>
                            Na pewno chcesz usunąć użytkownika<br />
                            <b>{deleteCandidate.username}</b>?
                        </p>

                        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                            <button
                                style={{ ...btn, background: "#c1121f", flex: 1 }}
                                onClick={deleteUser}
                            >
                                🗑️ Usuń
                            </button>

                            <button
                                style={{ ...btn, background: "#444", flex: 1 }}
                                onClick={() => setDeleteCandidate(null)}
                            >
                                ❌ Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}



const toastStyle = {
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#00b4d8",
    color: "#000",
    padding: "12px 25px",
    borderRadius: "10px",
    fontWeight: "bold",
    boxShadow: "0 0 20px rgba(0,180,216,0.6)",
    zIndex: 9999,
};

const cardStyle = {
    background: "rgba(13, 27, 42, 0.85)",
    border: "1px solid #00b4d8",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 180, 216, 0.3)",
    textAlign: "center",
};

const input = {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #3a506b",
    background: "#1b263b",
    color: "white",
};

const btn = {
    backgroundColor: "#00b4d8",
    color: "#000",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.9rem",
};
const modalOverlay = {
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
};

const modalContent = {
    background: "#111",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "90%",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 0 30px rgba(0,180,216,0.4)",
};

export default UzytkownicyPage;
