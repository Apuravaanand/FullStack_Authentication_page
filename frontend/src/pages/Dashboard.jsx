import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-xl">Welcome, {user?.name}</p>
            </div>
        </>

    );
}
