import create from '../../assets/icons/create.png'
import profile from '../../assets/icons/profile.png'
import search from '../../assets/icons/search.png'
import home from '../../assets/icons/home.png'
import message from '../../assets/icons/messages.png'
import more from '../../assets/icons/more.png'
import './NavBar.css'
import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from "../../context/UserContext.jsx";

/**
 * Add additional functionality to NavBar such as:
 * - Display user's name if logged in
 * - Display user profile picture if logged in
 * - Link to proper pages
 */

function NavBar() {
    const user = useContext(UserContext);  
    const [showMore, setShowMore] = useState(false);
    const username = user ? `${user.fName} ${user.lName}` : null;
    const userPic = user ? user.profile_picture : profile;

    const navigate = useNavigate()

    const onClickLogout = async () => {
        try {
            await axios.post('http://localhost:8000/auth/logout', {},
            { 
                withCredentials: true 
            });
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            navigate('/login');
        }
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

                <Link to={user ? `/profile/${user.id}` : "/login"} className="nav-item">
                    <img src={userPic} alt="Profile" className="user-profile"/>
                    <span>{username || 'Login'}</span>
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