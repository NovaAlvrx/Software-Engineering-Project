import './Profile.css'
import NavBar from '../components/NavBar'
import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'

function Profile() {
    const { username } = useParams();
    const fileInputRef = useRef(null);
    
    // Current user (fix when auth context in production)
    const [currentUser] = useState('currentUsername'); // Replace with actual auth
    
    // Determine if this is the user's own profile
    const isOwnProfile = !username || username === currentUser;
    
    // Profile data
    const [profileData, setProfileData] = useState({
        firstName: 'First Name',
        lastName: 'Last Name',
        bio: '',
        profilePicture: null,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0,
        wishList: ['Web Development', 'Photography', 'Cooking', 'Guitar', 'Spanish', 'Yoga']
    });
    
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({...profileData});
    
    // State for active tab
    const [activeTab, setActiveTab] = useState('posts');
    
    // Dummy posts data
    const [posts] = useState([
        { id: 1, image: 'https://via.placeholder.com/300' },
        { id: 2, image: 'https://via.placeholder.com/300' },
        { id: 3, image: 'https://via.placeholder.com/300' },
        { id: 4, image: 'https://via.placeholder.com/300' },
        { id: 5, image: 'https://via.placeholder.com/300' },
        { id: 6, image: 'https://via.placeholder.com/300' },
    ]);
    
    const handleOpenEdit = () => {
        setEditForm({...profileData});
        setIsEditing(true);
    };
 
    const handleEditProfilePicture = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({
                    ...editForm,
                    profilePicture: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSaveProfile = () => {
        setProfileData({...editForm});
        setIsEditing(false);
    };
    
    const handleCancelEdit = () => {
        setEditForm({...profileData});
        setIsEditing(false);
    };
    
    const handleInputChange = (field, value) => {
        setEditForm({
            ...editForm,
            [field]: value
        });
    };
    
    const handleWishListChange = (index, value) => {
        const newWishList = [...editForm.wishList];
        newWishList[index] = value;
        setEditForm({
            ...editForm,
            wishList: newWishList
        });
    };
    
    const addWishListItem = () => {
        setEditForm({
            ...editForm,
            wishList: [...editForm.wishList, '']
        });
    };
    
    const removeWishListItem = (index) => {
        const newWishList = editForm.wishList.filter((_, i) => i !== index);
        setEditForm({
            ...editForm,
            wishList: newWishList
        });
    };

    return (
        <div className="profile-container">
            <NavBar />
       
            <div className="profile">
                {isEditing && (
                    <div className="edit-modal-overlay" onClick={handleCancelEdit}>
                        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="edit-modal-header">
                                <button className="close-btn" onClick={handleCancelEdit}>×</button>
                                <button className="update-btn" onClick={handleSaveProfile}>Update</button>
                            </div>
                            
                            <div className="edit-modal-content">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <div className="edit-profile-picture">
                                    {editForm.profilePicture ? (
                                        <img src={editForm.profilePicture} alt="Profile" />
                                    ) : (
                                        <div className="profile-picture-placeholder"></div>
                                    )}
                                    <button className="edit-profile-picture-btn" onClick={handleEditProfilePicture}>Edit</button>
                                </div>
                                
                                <div className="edit-form">
                                    <div className="edit-field">
                                        <label>First Name:</label>
                                        <input
                                            type="text"
                                            value={editForm.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            placeholder="[first_name]"
                                            className="edit-input-field"
                                        />
                                    </div>
                                    
                                    <div className="edit-field">
                                        <label>Last Name:</label>
                                        <input
                                            type="text"
                                            value={editForm.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            placeholder="[last_name]"
                                            className="edit-input-field"
                                        />
                                    </div>
                                    
                                    <div className="edit-field">
                                        <label>Wish List:</label>
                                        <input
                                            type="text"
                                            placeholder="Add new skill..."
                                            className="edit-input-field"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    setEditForm({
                                                        ...editForm,
                                                        wishList: [...editForm.wishList, e.target.value.trim()]
                                                    });
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="wish-list-edit">
                                        {editForm.wishList.map((item, index) => (
                                            <span key={index} className="wish-list-edit-tag">
                                                {item}
                                                <button 
                                                    className="remove-wish-tag-btn"
                                                    onClick={() => removeWishListItem(index)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="profile-header">
                    <div className="profile-picture-section">
                        <div className="profile-picture">
                            {profileData.profilePicture ? (
                                <img src={profileData.profilePicture} alt="Profile" />
                            ) : (
                                <div className="profile-picture-placeholder"></div>
                            )}
                        </div>
                    </div>
                    
                    <div className="profile-info">
                        <div className="profile-top">
                            <h1 className="profile-name">
                                {profileData.firstName} {profileData.lastName}
                            </h1>
                            
                            {isOwnProfile && (
                                <button 
                                    className="edit-profile-btn"
                                    onClick={handleOpenEdit}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                        
                        <div className="profile-stats">
                            <div className="stat">
                                <span className="stat-number">{profileData.postsCount}</span> Posts
                            </div>
                            <div className="stat">
                                <span className="stat-number">{profileData.followersCount}</span> Followers
                            </div>
                            <div className="stat">
                                <span className="stat-number">{profileData.followingCount}</span> Following
                            </div>
                        </div>
                        
                        <div className="wish-list-section">
                            <strong>Wish List:</strong>
                            <div className="wish-list">
                                {profileData.wishList.map((item, index) => (
                                    <span key={index} className="wish-list-tag">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button 
                        className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        Posts
                    </button>
                    <button 
                        className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
                        onClick={() => setActiveTab('skills')}
                    >
                        Skills
                    </button>
                    <button 
                        className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>
                
                <div className="profile-content">
                    {activeTab === 'posts' && (
                        <div className="posts-grid">
                            {posts.map(post => (
                                <div key={post.id} className="post-item">
                                    <img src={post.image} alt={`Post ${post.id}`} />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {activeTab === 'skills' && (
                        <div className="skills-content">
                            <p>Skills content coming soon...</p>
                        </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            <p>Reviews content coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;