import React, { useState } from 'react';
import NavBar from '../components/navbar/NavBar.jsx'; // Use the NavBar component provided
import StarRating from '../components/ratingsystem/StarRating.jsx'; // Component for the star rating input
import './SessionsRev.css';

// Mock data for demonstration
const mockReviews = [
    { id: 1, name: "Alice", session: "React Hooks Basics", description: "Excellent session, very clear and hands-on examples.", rating: 5, pfp: "path/to/alice-pfp.png" },
    { id: 2, name: "Bob", session: "Advanced CSS Grid", description: "The instructor was knowledgeable, though the pace was a bit fast.", rating: 4, pfp: "path/to/bob-pfp.png" },
    { id: 3, name: "Charlie", session: "Intro to Python", description: "Learned a lot! The content was perfectly tailored for beginners.", rating: 5, pfp: "path/to/charlie-pfp.png" },
];

/**
 * Individual Review Card Component
 */
function ReviewCard({ review }) {
    // Helper to render the star icons based on the rating
    const renderStars = (rating) => {
        const fullStars = Array(rating).fill('★');
        const emptyStars = Array(5 - rating).fill('☆');
        return [...fullStars, ...emptyStars].map((star, index) => (
            <span key={index} className={star === '★' ? 'star-filled' : 'star-empty'}>
                {star}
            </span>
        ));
    };

    return (
        <div className="review-card">
            {/* Mock PFP */}
            <div className="review-pfp"></div> 
            <div className="review-content">
                <div className="review-name">{review.name}</div>
                <div className="review-session-name">{review.session}</div>
                <p className="review-description">{review.description}</p>
                <div className="review-rating">{renderStars(review.rating)}</div>
            </div>
        </div>
    );
}

/**
 * Review Submission Form Component
 */
function ReviewForm({ onSubmit }) {
    const [rating, setRating] = useState(0);
    // NEW: State for sessionName
    const [sessionName, setSessionName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // INCLUDED: sessionName in the submitted data
        console.log("Submitting Review:", { rating, sessionName, description });
        onSubmit({ rating, sessionName, description });
        
        // Reset form
        setRating(0);
        // NEW: Reset sessionName state
        setSessionName('');
        setDescription('');
        
        console.log("Review submitted!"); 
    };

    // Disabled logic now checks for session name
    const isDisabled = rating === 0 || description.trim() === '' || sessionName.trim() === '';

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3 className="form-title">Submit Your Review</h3>
            
            {/* NEW: Added new input field for Session Name */}
            <div className="form-group">
                <input
                    type="text"
                    id="sessionName"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="Session Name (e.g., 'React Hooks Basics')"
                    required
                    className="session-name-input"
                />
            </div>
            
            <div className="form-group">
                <StarRating rating={rating} setRating={setRating} />
            </div>
            <div className="form-group">
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    required
                    placeholder="Share your experience..." 
                />
            </div>
            {/* Disabled button check updated */}
            <button type="submit" className="submit-button" disabled={isDisabled}>
                Post Review
            </button>
        </form>
    );
}

/**
 * SessionReviewsPage Component
 */
function SessionsRev() {
    const [reviews, setReviews] = useState(mockReviews);

    const handleNewReview = (newReview) => {
        // Update to use the submitted sessionName
        const newReviewWithId = { 
            id: reviews.length + 1, 
            name: "Current User", 
            session: newReview.sessionName, 
            description: newReview.description, 
            rating: newReview.rating, 
            pfp: "path/to/default-pfp.png" 
        };
        setReviews([newReviewWithId, ...reviews]);
    };

    return (
        <div className="page-container">
            <NavBar /> 
            <div className="reviews-main-content">
                <div className="reviews-header">
                    <h1 className="page-title">Session Reviews</h1>
                </div>
                
                <ReviewForm onSubmit={handleNewReview} />

                <div className="reviews-list">
                    {reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SessionsRev;