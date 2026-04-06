import { useState, useEffect } from "react";

function ProfilePage({ user, setUser }) {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }



    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = toastAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include"
                });
                if (!res.ok) throw new Error("Nie zalogowany");
                const data = await res.json();
                setForm({ username: data.user.username, email: data.user.email, password: "" });
                setUser(data.user);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchUser();
    }, [setUser]);

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleUpdateField = async (field) => {
        if (!form[field]) return;

        try {
            const res = await fetch("http://localhost:8080/api/auth/me", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ [field]: form[field] })
            });

            if (!res.ok) throw new Error("Nie udało się zaktualizować " + field);

            const data = await res.json();
            setUser(data.user);

            setForm(prev => ({
                ...prev,
                [field]: field === "password" ? "" : prev[field]
            }));

            showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} zaktualizowane pomyślnie!`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    if (loading) return <p style={{ color: "white", padding: "40px" }}>Ładowanie profilu...</p>;

    return (
        <div
            style={{
                minHeight: "100vh",
                padding: "40px",
                background: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #000000 100%)",
                color: "#e0e0e0",
                fontFamily: "Orbitron, sans-serif",
                position: "relative",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    color: "#90e0ef",
                    fontSize: "2rem",
                    textShadow: "0 0 15px #00b4d8",
                    marginBottom: "40px",
                }}
            >
                Twój profil
            </h2>

            <div style={cardContainer}>

                <div style={card}>
                    <h3 style={cardTitle}>👤 Nazwa użytkownika</h3>
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        style={input}
                    />
                    <button onClick={() => handleUpdateField("username")} style={btn}>
                        Zmień nazwę
                    </button>
                </div>


                <div style={card}>
                    <h3 style={cardTitle}>📧 Email</h3>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        style={input}
                    />
                    <button onClick={() => handleUpdateField("email")} style={btn}>
                        Zmień email
                    </button>
                </div>


                <div style={card}>
                    <h3 style={cardTitle}>🔒 Hasło</h3>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Nowe hasło"
                        style={input}
                    />
                    <button onClick={() => handleUpdateField("password")} style={btn}>
                        Zmień hasło
                    </button>
                </div>
            </div>


            {toast && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        backgroundColor: toast.type === 'success' ? "#2a9d8f" : "#e63946",
                        color: "white",
                        fontSize: "16px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                        zIndex: 1000,
                        animation: "fadeInOut 3s forwards",
                        minWidth: "300px",
                        textAlign: "center",
                    }}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}



const cardContainer = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
};

const card = {
    background: "rgba(13, 27, 42, 0.85)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #00b4d8",
    boxShadow: "0 0 20px rgba(0, 180, 216, 0.25)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
};

const cardTitle = {
    marginBottom: "15px",
    color: "#00b4d8",
    textAlign: "center",
    fontSize: "1.2rem",
};

const input = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #3a506b",
    background: "#1b263b",
    color: "white",
    fontSize: "1rem",
    marginBottom: "15px",
};

const btn = {
    backgroundColor: "#00b4d8",
    color: "#000",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "0.2s",
};


const toastAnimation = `
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, 20px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    90% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 20px); }
}
`;


export default ProfilePage;