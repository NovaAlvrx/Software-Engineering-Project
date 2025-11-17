import create from '../../assets/icons/create.png'
import profile from '../../assets/icons/profile.png'
import search from '../../assets/icons/search.png'
import home from '../../assets/icons/home.png'
import message from '../../assets/icons/messages.png'
import more from '../../assets/icons/more.png'
import './NavBar.css'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

/**
 * Add additional functionality to NavBar such as:
 * - Display user's name if logged in
 * - Display user profile picture if logged in
 * - Link to proper pages
 */

function NavBar() {
    // Current logged-in user (replace with actual auth context later)
    const [currentUser, setCurrentUser] = useState(null);
    const [userId, setUserId] = useState(null)
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate()
    
    // Fetch logged-in user's data
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) return;

                const response = await axios.get('http://localhost:8000/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                const userData = response.data
                setCurrentUser(userData.fName + ' ' + userData.lName);
                setUserId(userData.id);
                console.log('user id: ', userId)
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };
        
        fetchCurrentUser();
    }, [userId]);

    const onClickLogout = () => {
        localStorage.removeItem('access_token');
        navigate('/login');
    }

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

                <Link to={currentUser ? `/profile/${userId}` : "/login"} className="nav-item">
                    <img src={profile} alt="Profile"/>
                    <span>{currentUser || "Login"}</span>
                </Link>
            </div>

            <div className="nav-links more-links" onClick={() => setShowMore(prev => !prev)}>
                    <div className="nav-item">
                        <img src={more} alt="More" />
                        <span>More</span>
                    </div>
                    {
                        showMore ? (
                            <div className="more-items">
                                <button className="more-item" onClick={onClickLogout}>Log out</button>
                                <button className="more-item">About</button>
                                <button className="more-item">Contact</button>
                            </div>
                        ) : (
                            <></>
                        )
                    }
                </div>
        </nav>
    )
}

export default NavBar;