import { useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8080/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            onLogout();
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <div>
                {user && `👤 ${user.username}`}
            </div>
            <div>
                {user && (
                    <>
                        <button style={buttonStyle} onClick={() => navigate("/home")}>Strona główna</button>
                        <button style={buttonStyle} onClick={() => navigate("/profile")}>Profil</button>
                        {user.roleNames?.includes("ADMIN") && (
                            <button style={buttonStyle} onClick={() => navigate("/uzytkownicy")}>Użytkownicy</button>
                        )}
                        <button style={buttonStyle} onClick={() => navigate("/porownanie")}>Porównaj obiekty</button>
                        <button style={buttonStyle} onClick={handleLogout}>Wyloguj</button>
                    </>
                )}
            </div>
        </div>
    );
}

const buttonStyle = {
    backgroundColor: "#555",
    color: "white",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    marginLeft: "5px",
    borderRadius: "6px",
    fontWeight: "bold"
};

export default Navbar;
