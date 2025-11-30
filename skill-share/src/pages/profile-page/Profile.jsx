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
        posts: [],
        wishList: [],
        skills: [
            {
                name: 'Photography',
                level: 'Professional',
                yearsExperience: 6,
                description: 'Lifestyle and portrait photographer focused on capturing candid, story-driven moments that highlight authentic emotion.',
                focusAreas: ['Portrait Sessions', 'Travel & Lifestyle', 'Community Events'],
                offerings: ['One-on-one coaching for aspiring photographers', 'Creative direction for brand shoots', 'Hands-on editing workshops'],
                tools: ['Canon EOS R6', 'Adobe Lightroom Classic', 'Capture One Pro']
            }
        ],
        reviews: [
            {
                id: 1,
                reviewerName: 'Jasmine R.',
                reviewerInitials: 'JR',
                sessionType: 'Portrait Masterclass',
                rating: 5,
                comment: 'Suzuna breaks down complex photography concepts into approachable steps. I finally understand how to work with natural light thanks to her patient guidance.',
                date: 'October 2024'
            },
            {
                id: 2,
                reviewerName: 'Marco L.',
                reviewerInitials: 'ML',
                sessionType: 'Creative Direction Coaching',
                rating: 5,
                comment: 'The one-on-one coaching challenged me to think more critically about storytelling in my shoots. The personalized feedback was exactly what I needed to level up.',
                date: 'August 2024'
            },
            {
                id: 3,
                reviewerName: 'Priya S.',
                reviewerInitials: 'PS',
                sessionType: 'Editing Workshop',
                rating: 4,
                comment: 'Loved the real-time editing walkthroughs! I left with a Lightroom workflow I use every day. Hoping for a follow-up session focused on color grading.',
                date: 'June 2024'
            }
        ]
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
                
                const data = response.data;

                setProfileData(prev => ({
                    ...prev,
                    firstName: data.user_name?.fName ?? prev.firstName,
                    lastName: data.user_name?.lName ?? prev.lastName,
                    profilePicture: data.user_data?.profile_picture ?? prev.profilePicture,
                    posts: Array.isArray(data.posts) ? data.posts : prev.posts,
                    wishList: data.wish_list ?? prev.wishList,
                    skills: data.skills ?? prev.skills,
                    reviews: data.reviews ?? prev.reviews,
                }));

                console.log('Reading post data: ', data.posts);
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
    
    const primarySkill = profileData.skills?.[0];

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
                        <div className="skills-content">
                            {primarySkill ? (
                                <>
                                    <header className="skills-header">
                                        <h2>{primarySkill.name}</h2>
                                        {primarySkill.yearsExperience ? (
                                            <span className="skill-meta">
                                                {primarySkill.level} • {primarySkill.yearsExperience}+ years experience
                                            </span>
                                        ) : null}
                                    </header>

                                    <p className="skill-description">
                                        {primarySkill.description ?? 'This creator is currently curating their skill story. Check back soon for a closer look at their craft.'}
                                    </p>

                                    <div className="skill-details-grid">
                                        {primarySkill.focusAreas?.length ? (
                                            <section className="skill-card">
                                                <h3>Focus Areas</h3>
                                                <ul>
                                                    {primarySkill.focusAreas.map(area => (
                                                        <li key={area}>{area}</li>
                                                    ))}
                                                </ul>
                                            </section>
                                        ) : null}

                                        {primarySkill.offerings?.length ? (
                                            <section className="skill-card">
                                                <h3>How I Can Help</h3>
                                                <ul>
                                                    {primarySkill.offerings.map(item => (
                                                        <li key={item}>{item}</li>
                                                    ))}
                                                </ul>
                                            </section>
                                        ) : null}

                                        {primarySkill.tools?.length ? (
                                            <section className="skill-card">
                                                <h3>Gear & Tools</h3>
                                                <div className="skill-tags">
                                                    {primarySkill.tools.map(tool => (
                                                        <span key={tool} className="skill-tag">{tool}</span>
                                                    ))}
                                                </div>
                                            </section>
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                <div className="no-skills-content">
                                    <p>Skills content coming soon...</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            {profileData.reviews?.length ? (
                                <ul className="reviews-list">
                                    {profileData.reviews.map(review => (
                                        <li key={review.id} className="review-card">
                                            <div className="review-header">
                                                <div className="reviewer-avatar" aria-hidden="true">
                                                    {review.reviewerInitials ?? review.reviewerName?.charAt(0) ?? '?'}
                                                </div>
                                                <div className="reviewer-meta">
                                                    <span className="reviewer-name">{review.reviewerName}</span>
                                                    {review.sessionType ? (
                                                        <span className="review-session">{review.sessionType}</span>
                                                    ) : null}
                                                </div>
                                                <div className="review-rating" aria-label={`${review.rating} out of 5 stars`}>
                                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                                </div>
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                            {review.date ? <span className="review-date">{review.date}</span> : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reviews yet. Be the first to share your experience.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;
