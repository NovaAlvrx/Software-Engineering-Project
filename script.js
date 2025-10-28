document.addEventListener('DOMContentLoaded', () => {
    console.log('SkillSwap Session Reviews page loaded.');

    const reviewsContainer = document.getElementById('reviews-container');

    // Example of dynamic data (in a real app, this would come from an API)
    const reviewData = [
        { name: "Alice", session: "HTML/CSS Basics", description: "Clear and concise explanation of web fundamentals. Great pace!", rating: 5 },
        { name: "Bob", session: "Intro to Graphic Design", description: "Learned a few handy tricks for using GIMP. Satisfied with the outcome.", rating: 4 },
        { name: "Charlie", session: "Photography Lighting", description: "The theory was good, but I wish there were more practical examples.", rating: 3 },
    ];

    /**
     * Renders the star rating based on a numeric value.
     * @param {number} rating - The rating value (e.g., 4)
     * @returns {string} HTML string for the rating stars.
     */
    function renderRating(rating) {
        let starsHtml = '';
        const maxStars = 5;
        for (let i = 1; i <= maxStars; i++) {
            const isFilled = i <= rating;
            // Using Font Awesome classes
            starsHtml += `<i class="fas fa-star ${isFilled ? 'filled' : ''}"></i>`;
        }
        return starsHtml;
    }

    /**
     * Function to render the review cards based on the data.
     * In a real app, you would clear existing content before rendering.
     */
    function renderReviews() {
        // Clear placeholder content if dynamic data is used
        reviewsContainer.innerHTML = '';

        reviewData.forEach(review => {
            const card = document.createElement('div');
            card.classList.add('review-card');

            card.innerHTML = `
                <div class="pfp-container">
                    <div class="pfp">${review.name.charAt(0)}</div> </div>
                <div class="review-content">
                    <p class="reviewer-name">${review.name}</p>
                    <p class="session-name">${review.session}</p>
                    <p class="description">${review.description}</p>
                    <div class="rating">
                        ${renderRating(review.rating)}
                    </div>
                </div>
            `;
            reviewsContainer.appendChild(card);
        });

        // If the container was empty, use the placeholder content from HTML
        if (reviewData.length === 0) {
             console.log("No dynamic reviews to display, showing HTML placeholders.");
             // In a real application, you might show a "No Reviews Found" message instead.
        }
    }

    // Uncomment the line below to use the dynamic data instead of HTML placeholders
    // renderReviews();
});

// Note: If you choose to use the renderReviews() function, ensure you remove
// the placeholder review cards from the `index.html` file to avoid duplicates.