import create from '../../assets/icons/create.png'
import profile from '../../assets/icons/profile.png'
import search from '../../assets/icons/search.png'
import home from '../../assets/icons/home.png'
import message from '../../assets/icons/messages.png'
import more from '../../assets/icons/more.png'
import './NavBar.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/**
 * Add additional functionality to NavBar such as:
 * - Display user's name if logged in
 * - Display user profile picture if logged in
 * - Link to proper pages
 */

function NavBar() {
    // Current logged-in user (replace with actual auth context later)
    const [currentUser, setCurrentUser] = useState(null);
    
    // Fetch logged-in user's data
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/profile');
                if (response.ok) {
                    const userData = await response.json();
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        
        fetchCurrentUser();
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-logo flex-column-center">
                Skill <br/> Swap
            </div>

            <div className="nav-links">
                <Link to="/" className="nav-item">
                    <img src={home} alt="Home" />
                    <span>Home</span>
                </Link>
                <Link to="/explore" className="nav-item">
                    <img src={search} alt="Search" />
                    <span>Explore</span>
                </Link>
                <Link to="/create" className="nav-item">
                    <img src={create} alt="Create" />
                    <span>Create</span>
                </Link>
                <Link to="/messages" className="nav-item">
                    <img src={message} alt="Messages" />
                    <span>Messages</span>
                </Link>
                <Link to="/profile" className="nav-item">
                    <img src={profile} alt="Profile" className="nav-item" />
                    {currentUser ? <span>{currentUser.firstName} {currentUser.lastName}</span> : <span>Profile</span>}
                </Link>
            </div>

            <div className="nav-links">
                <a href="/more" className="nav-item">
                    <img src={more} alt="More" />
                    <span>More</span>
                </a>
            </div>
        </nav>
    )
}

export default NavBar;