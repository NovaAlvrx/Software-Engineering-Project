import React, { useState } from 'react';
import NavBar from '../components/navbar/NavBar.jsx'; // Use the NavBar component provided
import './Posts.css';

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Stop propagation to prevent clicks inside the modal from closing it via the overlay
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
// ---------------------------------


function Posts() {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // State for Modals
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [isMoreOptionsModalOpen, setIsMoreOptionsModalOpen] = useState(false);

  // State for Modal Data (Example)
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [altText, setAltText] = useState('');


  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSharePost = () => {
    console.log('Sharing post:', { 
      description, 
      image,
      skills: selectedSkills,
      altText: altText
    });
    alert('Post shared! (Check console for data)');
    // Reset form after sharing (or navigate away)
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setSelectedSkills([]);
    setAltText('');
  };

  return (
    <div className="posts-page-container">
      {/* <NavBar /> */} 

      <div className="posts-content-area">
        <h2 className="posts-title">New Post</h2>

        <div className="post-creation-section">
          
          <div 
            className="post-option-circle"
            onClick={() => setIsSkillsModalOpen(true)}
          >
            Skills Overview
          </div>

          <div className="image-upload-section">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded preview" className="uploaded-image-preview" />
            ) : (
              <label htmlFor="image-upload-input" className="image-placeholder">
                <i className="fas fa-camera"></i> <br/> Upload Image
              </label>
            )}
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div 
            className="post-option-circle"
            onClick={() => setIsMoreOptionsModalOpen(true)}
          >
            More Options
          </div>
        </div>

        <div className="description-input-container">
          <textarea
            className="description-textarea"
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="share-button-container">
          <button className="share-button" onClick={handleSharePost}>
            Share
          </button>
        </div>
      </div>
      
      {/* --- Skills Overview Modal --- */}
      <Modal 
        isOpen={isSkillsModalOpen} 
        onClose={() => setIsSkillsModalOpen(false)} 
        title="Skills Overview & Tagging"
      >
        <p>Select relevant skills and your proficiency level for this post:</p>
        <div className="modal-input-group">
          <label>Skills:</label>
          {/* Example: Replace with a multi-select or tagging component */}
          <input type="text" placeholder="e.g., Photography, React, Cooking" />
        </div>
        <div className="modal-input-group">
          <label>Proficiency:</label>
          <select>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Expert</option>
          </select>
        </div>
        <button className="modal-action-button" onClick={() => setIsSkillsModalOpen(false)}>Save & Close</button>
      </Modal>

      {/* --- More Options Modal --- */}
      <Modal 
        isOpen={isMoreOptionsModalOpen} 
        onClose={() => setIsMoreOptionsModalOpen(false)} 
        title="Post Settings & Options"
      >
        <div className="modal-input-group">
          <label>Image Alt Text (Accessibility):</label>
          <textarea 
            rows="2" 
            placeholder="Describe the image for screen readers (e.g., 'A colorful sunset over a mountain range')" 
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          ></textarea>
        </div>
        <div className="modal-input-group">
          <label>Post Visibility:</label>
          <select>
            <option>Public</option>
            <option>Private (Only me)</option>
          </select>
        </div>
        <div className="modal-input-group checkbox-group">
          <input type="checkbox" id="allow-comments" defaultChecked />
          <label htmlFor="allow-comments">Allow comments</label>
        </div>
        <button className="modal-action-button" onClick={() => setIsMoreOptionsModalOpen(false)}>Done</button>
      </Modal>

    </div>
  );
}

export default Posts;