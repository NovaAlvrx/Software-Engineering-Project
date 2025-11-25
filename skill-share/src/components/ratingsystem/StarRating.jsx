import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

/**
 * StarRating Component for interactive 1-5 star rating.
 * @param {number} rating - The current selected rating value (1-5).
 * @param {function} setRating - Function to update the rating state.
 */
function StarRating({ rating, setRating }) {
    const [hover, setHover] = useState(0); // State for hover effect

    return (
        <div className="star-rating-input">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                        />
                        <FaStar
                            className="star-icon"
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            size={30}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(0)}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default StarRating;