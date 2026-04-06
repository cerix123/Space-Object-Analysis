import { useEffect, useState } from "react";

function TestConnection() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/uzytkownicy") // leci przez proxy na localhost:8080
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Błąd:", err));
    }, []);

    return (
        <div>
            <h1>Dane z backendu:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default TestConnection;
