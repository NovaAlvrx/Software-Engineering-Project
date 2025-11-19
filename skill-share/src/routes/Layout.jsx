import './Layout.css'
import NavBar from '../components/navbar/NavBar.jsx';
import { Outlet } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";

function Layout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:8000/auth/me", {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    console.log("Layout rendered");
    return (
        <UserContext.Provider value={user}>
        <div className="layout-container">
            <div className="navbar-container">
                <NavBar />
            </div>
            <div className="main-content">
                <div className="outlet-wrapper">
                    <Outlet />
                </div>
            </div>
        </div>
        </UserContext.Provider>
    )
}
export default Layout;