import './Layout.css'
import NavBar from '../components/navbar/NavBar.jsx';
import { Outlet } from 'react-router-dom';

function Layout() {
    console.log("Layout rendered");
    return (
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
    )
}
export default Layout;