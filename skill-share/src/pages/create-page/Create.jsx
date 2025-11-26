import React from 'react';
import './Create.css';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

const CreatePage = () => {
  return (
    <div className="create-page-container">
      <div className="title-box">
        Where will your Skills lead you Today?
      </div>
      <div className="options-container">
        <Link to="/create-post" className="option-link post-option">
          <div className="option-button red-button">
            Create a Post
          </div>
        </Link>
        <Link to="/create-a-sessionreview" className="option-link review-option">
          <div className="option-button blue-button">
            Create a Session Review
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CreatePage;