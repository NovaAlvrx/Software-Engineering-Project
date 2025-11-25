import create from '../assets/icons/create.png'
import profile from '../assets/icons/profile.png'
import search from '../assets/icons/search.png'
import home from '../assets/icons/home.png'
import message from '../assets/icons/messages.png'
import more from '../assets/icons/more.png'
import exchange from '../assets/icons/exchange.svg'
import './NavBar.css'
import { useState, useEffect } from 'react'

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
                Skill <br/> Share
            </div>

            <div className="nav-links">
                <a href="/" className="nav-item">
                    <img src={home} alt="Home" />
                    <span>Home</span>
                </a>
                <a href="/search" className="nav-item">
                    <img src={search} alt="Search" />
                    <span>Search</span>
                </a>
                <a href="/trade" className="nav-item">
                    <img src={exchange} alt="Trade" />
                    <span>Trade</span>
                </a>
                <a href="/create" className="nav-item">
                    <img src={create} alt="Create" />
                    <span>Create</span>
                </a>
                <a href="/messages" className="nav-item">
                    <img src={message} alt="Messages" />
                    <span>Messages</span>
                </a>
                <a href="/profile" className="nav-item">
                    <img src={profile} alt="Profile" className="nav-item" />
                    {currentUser ? <span>{currentUser.firstName} {currentUser.lastName}</span> : <span>Profile</span>}
                </a>
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
