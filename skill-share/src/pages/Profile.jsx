import './Profile.css'
import NavBar from '../components/NavBar'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Profile() {
    const { username } = useParams();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    
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
        wishList: ['Web Development', 'Moving Photography', 'Cooking', 'Guitar', 'Spanish', 'Yoga'],
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
    
    // Fetch profile data from backend (mock data for now)
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                // If viewing another user's profile, fetch their data
                const endpoint = username 
                    ? `http://localhost:8000/api/profile/${username}`
                    : 'http://localhost:8000/api/profile';
                    
                const response = await fetch(endpoint);
                
                if (response.ok) {
                    const data = await response.json();
                    setProfileData(prev => ({
                        ...prev,
                        ...data,
                        skills: data.skills ?? prev.skills,
                        reviews: data.reviews ?? prev.reviews
                    }));
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProfileData();
    }, [username]);
    
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({...profileData});
    
    // State for active tab
    const [activeTab, setActiveTab] = useState('posts');
    
    // Dummy posts data
    const [posts] = useState([
        { 
            id: 1, 
            image: 'https://images.unsplash.com/photo-1761405378543-e74453424152?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1964',
            title: 'Post 1',
            description: 'A photo I took while shopping',
            tags: ['Fashion', 'Photography', 'Portraits']
        },
        { 
            id: 2, 
            image: 'https://images.unsplash.com/photo-1761405378558-3688471ba000?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1964',
            title: 'Post 2',
            description: 'Photo from my time travelling up north.',
            tags: ['Fashion', 'Photography', 'Portraits']
        },
        { 
            id: 3, 
            image: 'https://images.unsplash.com/photo-1761405378333-9eb3a4658a13?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1965',
            title: 'Post 3',
            description: 'Photo I took while walking on the streets of New York.',
            tags: ['Fashion', 'Photography', 'Street']
        },
        { 
            id: 4, 
            image: 'https://images.unsplash.com/photo-1761562964790-77f9f5ac45b9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1587',
            title: 'Post 4',
            description: 'Photo I took while travelling',
            tags: ['Fashion', 'Photography', 'Portraits']
        },
        { 
            id: 5, 
            image: 'https://images.unsplash.com/photo-1761216674297-6ffa4d89400c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1587',
            title: 'Post 5',
            description: 'Photo I took in the mountains.',
            tags: ['Fashion', 'Photography', 'Portraits']
        },
        { 
            id: 6, 
            image: 'https://images.unsplash.com/photo-1761522001036-dc4a66722464?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=4287',
            title: 'Post 6',
            description: 'Portrait I took during my trip to Europe.',
            tags: ['Fashion', 'Photography', 'Portraits']
        },
    ]);

    const primarySkill = profileData.skills?.[0];

    const handlePostClick = (post) => {
        const basePath = username ? `/profile/${username}` : '/profile';
        const destination = `${basePath}/post/${post.id}`;
        navigate(destination, { state: { post } });
    };
    
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

    if (loading) {
        return (
            <div className="profile-container">
                <NavBar />
                <div className="profile">
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading profile...</p>
                </div>
            </div>
        );
    }

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
                                <div 
                                    key={post.id} 
                                    className="post-item"
                                    onClick={() => handlePostClick(post)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handlePostClick(post);
                                        }
                                    }}
                                >
                                    <img src={post.image} alt={post.title || `Post ${post.id}`} />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {activeTab === 'skills' && (
                        <div className="skills-content">
                            <header className="skills-header">
                                <h2>{primarySkill?.name ?? 'Primary Skill'}</h2>
                                {primarySkill?.yearsExperience ? (
                                    <span className="skill-meta">
                                        {primarySkill.level} • {primarySkill.yearsExperience}+ years experience
                                    </span>
                                ) : null}
                            </header>

                            <p className="skill-description">
                                {primarySkill?.description ?? 'This creator is currently curating their skill story. Check back soon for a closer look at their craft.'}
                            </p>

                            <div className="skill-details-grid">
                                {primarySkill?.focusAreas?.length ? (
                                    <section className="skill-card">
                                        <h3>Focus Areas</h3>
                                        <ul>
                                            {primarySkill.focusAreas.map(area => (
                                                <li key={area}>{area}</li>
                                            ))}
                                        </ul>
                                    </section>
                                ) : null}

                                {primarySkill?.offerings?.length ? (
                                    <section className="skill-card">
                                        <h3>How I Can Help</h3>
                                        <ul>
                                            {primarySkill.offerings.map(item => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </section>
                                ) : null}

                                {primarySkill?.tools?.length ? (
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
