import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import GalaktykiPage from "./pages/GalaktykiPage";
import ProfilePage from "./pages/ProfilePage";
import PlanetyPage from "./pages/PlanetyPage";
import GwiazdyPage from "./pages/GwiazdyPage";
import AsteroidyPage from "./pages/AsteroidyPage";
import GwiazdozbioryPage from "./pages/GwiazdozbioryPage";
import KsiezycePage from "./pages/KsiezycePage";
import CzarneDziuryPage from "./pages/CzarneDziuryPage";
import UzytkownicyPage from "./pages/UzytkownicyPage";
import PorownaniePage from "./pages/PorownaniePage";
import DiagramHRPage from "./pages/DiagramHRPage";
import DiagramPlanetsPage from "./pages/DiagramPlanetsPage";

import "./App.css";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/auth/me", {
                    credentials: "include"
                });
                if (!res.ok) return;
                const data = await res.json();
                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMe();
    }, []);


    const handleLogout = () => setUser(null);

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar user={user} onLogout={handleLogout} />
                <Routes>
                    <Route path="/" element={user ? <Navigate to="/home" /> : <AuthPage setUser={setUser} />} />
                    <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/galaktyka" element={user ? <GalaktykiPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/profile" element={user ? <ProfilePage user={user} setUser={setUser} /> : <Navigate to="/" />} />
                    <Route path="/elementy/planety" element={user ? <PlanetyPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/gwiazdy" element={user ? <GwiazdyPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/asteroidy" element={user ? <AsteroidyPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/gwiazdozbior" element={user ? <GwiazdozbioryPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/ksiezyce" element={user ? <KsiezycePage user={user} /> : <Navigate to="/" />} />
                    <Route path="/elementy/czarnedziury" element={user ? <CzarneDziuryPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/uzytkownicy" element={user ? <UzytkownicyPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/porownanie" element={user ? <PorownaniePage user={user} /> : <Navigate to="/" />} />
                    <Route path="/diagram-hr" element={<DiagramHRPage />} />
                    <Route path="/diagram-planets" element={<DiagramPlanetsPage />} />


                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
