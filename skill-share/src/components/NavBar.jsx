import create from '../assets/icons/create.png'
import profile from '../assets/icons/profile.png'
import search from '../assets/icons/search.png'
import home from '../assets/icons/home.png'
import message from '../assets/icons/messages.png'
import more from '../assets/icons/more.png'
import './NavBar.css'
import { useParams } from 'react-router-dom'

function NavBar() {
    const { username } = useParams();

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
                    {username ? <span>{username}</span> :<span>Profile</span>}
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