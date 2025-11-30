import './Profile.css'
import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loading from '../../components/Loading/Loading'

function Profile() {
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const isOwnProfile = useState(true); // TODO: check if param id == auth id

    const navigate = useNavigate();
            
    // Profile data
    const [profileData, setProfileData] = useState({
        firstName: 'First Name',
        lastName: 'Last Name',
        profilePicture: null,
        posts: 0,
        wishList: []
    });
    
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    
    // Fetch profile data from backend (mock data for now)
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // If viewing another user's profile, fetch their data
                const response = await axios(`http://localhost:8000/users/profile?id=${id}`, {
                    withCredentials: true
                });
                
                const data = response.data

                setProfileData({
                    firstName: data.user_name.fName,
                    lastName: data.user_name.lName,
                    profilePicture: data.user_data.profile_picture,
                    posts: data.posts,
                    wishList: data.wish_list ?? []
                });

                console.log('Reading post data: ', data.posts)

            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [id, refresh]);
    
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({...profileData});

    // State for active tab
    const [activeTab, setActiveTab] = useState('posts');
    
    const handleOpenEdit = () => {
        setEditForm({...profileData});
        setIsEditing(true);
    };
 
    const handleEditProfilePicture = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditForm({
                    ...editForm,
                    profilePicture: reader.result,
                    file: file
                });
            };
            reader.readAsDataURL(file);
        }
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
    
    const removeWishListItem = (index) => {
        const newWishList = editForm.wishList.filter((_, i) => i !== index);
        setEditForm({
            ...editForm,
            wishList: newWishList
        });
    };

    const handleProfileChange = async (e) => {
        e.preventDefault();

        let updated = false;

        const updatedData = new FormData();

        if (editForm.firstName !== profileData.firstName) {
            updatedData.append('fName', editForm.firstName);
        }

        if (editForm.lastName !== profileData.lastName) {
            updatedData.append('lName', editForm.lastName);
        }

        if (editForm.wishList !== profileData.wishList) {
            console.log('Change in wish list!', editForm.wishList)
            updatedData.append('wishList', JSON.stringify(editForm.wishList));
        }

        // For updating profile information (name, skills, etc.)
        if ([...updatedData.keys()].length > 0) {
            try {
                await axios.patch(`http://localhost:8000/users/update?id=${id}`, updatedData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );
                console.log('Updated wish list!')
                updated = true;

            } catch (error) {
                console.error('Error updating user profile data: ', error)
            }
        }

        // For updating pfp
        if (editForm.file) {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('file', editForm.file);
            try {
                await axios.post(`http://localhost:8000/upload/pfp?id=${id}`, formData, 
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data'}
                    }
                );

                updated = true;

                setEditForm({...profileData})
            } catch (error) {
                console.error('Error uploading image: ', error)
            }
        }

        if (updated) {
            setIsEditing(false);
            setRefresh(prev => !prev);
        }
    }


    if (loading) {
        return (
            <div className="profile-container">
                <div className="profile">
                    <Loading />
                </div>
            </div>
        );
    }

    const handleOpenPost = (post_id) => {
        const post_path = `/profile/${id}/post/${post_id}`;
        navigate(post_path);
    }

    return (
        <div className="profile-container">       
            <div className="profile">
                {isEditing && (
                    <div className="edit-modal-overlay" onClick={handleCancelEdit}>
                        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="edit-modal-header">
                                <button className="close-btn" onClick={handleCancelEdit}>×</button>
                                <button className="update-btn" onClick={handleProfileChange}>Update</button>
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    setEditForm({
                                                        ...editForm,
                                                        wishList: [...editForm.wishList, e.target.value.trim().toLowerCase()]
                                                    });
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    <div className="wish-list-edit">
                                        {editForm.wishList.length === 0 ?
                                            <></> 
                                        :
                                            editForm.wishList.map((item, index) => (
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
                                <span className="stat-number">{profileData.posts.length}</span> Posts
                            </div>
                        </div>
                        
                        <div className="wish-list-section">
                            <strong>Wish List:</strong>
                            <div className="wish-list">
                                {profileData.wishList.length === 0 ? 
                                <p>Not looking for particular skill</p>
                                :
                                profileData.wishList.map((item, index) => (
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
                        <>
                            {profileData.posts.length === 0 ? 
                                <div className="no-posts-content">
                                    <p>No posts yet</p>
                                </div>
                            :
                                <div className="profile-posts-grid">
                                    {profileData.posts.map(post => (
                                        <div key={post.post_id} className="post-item" onClick={() => handleOpenPost(post.post_id)}>
                                            <img src={post.post_img} alt={`Post ${post.post_id}`} />
                                        </div>
                                    ))}
                                </div>
                            }
                        </>
                    )}
                    
                    {activeTab === 'skills' && (
                        <div className="no-skills-content">
                            <p>Skills content coming soon...</p>
                        </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="no-reviews-content">
                            <p>Reviews content coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;
