import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

function AuthPage({ setUser }) {
    const [isRegister, setIsRegister] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const url = isRegister
            ? "http://localhost:8080/api/auth/register"
            : "http://localhost:8080/api/auth/login";

        const body = isRegister ? { username, email, password } : { username, password };

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
                credentials: "include"
            });

            const data = await res.json();

            if (data.error) {
                setMessage(data.message);
            } else {

                const userData = data.user
                    ? { ...data.user, roles: data.user.roleNames || [] }
                    : { username, roles: [] };
                setUser(userData);
                navigate("/home");
            }

        } catch (err) {
            setMessage("Błąd po stronie klienta: " + err.message);
        }
    };

    return (
        <div className="auth-container">
            <div className="stars"></div>
            <div className="twinkling"></div>
            <div className="auth-title">Analiza obiektów kosmicznych</div>
            <div className="auth-card">
                <h2>{isRegister ? "Rejestracja" : "Logowanie"}</h2>
                <form onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <input
                                type="text"
                                placeholder="Nazwa użytkownika"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </>
                    )}
                    {!isRegister && (
                        <input
                            type="text"
                            placeholder="Nazwa użytkownika"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="password"
                        placeholder="Hasło"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="auth-btn">
                        {isRegister ? "Zarejestruj się" : "Zaloguj"}
                    </button>
                </form>
                <p className="auth-message">{message}</p>
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="switch-btn"
                >
                    {isRegister ? "Masz konto? Zaloguj się" : "Nie masz konta? Zarejestruj się"}
                </button>
            </div>
        </div>
    );
}

export default AuthPage;
