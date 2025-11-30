import React, { useState } from "react";
import "./Explore.css";

const posts = [
  { id: 1, title: "Sewing" },
  { id: 2, title: "Python with Jane" },
  { id: 3, title: "Cooking" },
  { id: 4, title: "Guitar Lessons" },
  { id: 5, title: "Harmonica" },
  { id: 6, title: "Artsy Crafts" },
  { id: 7, title: "Creative Painting" },
  { id: 8, title: "Piano" },
  { id: 9, title: "Memes Making" },
  { id: 10, title: "Math Fun" },
  { id: 11, title: "Gardening" },
  { id: 12, title: "Dancing" },
];

function Explore() {
  console.log("Explore rendered");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); 
  
  //for button
  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  // changed to real-time filtering
  const displayPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="explore-main">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>


      {activeSearch && displayPosts.length === 0 ? (
        <p className="no-results">No results found for “{activeSearch}”.</p>
      ) : (
        <div className="posts-grid">
          {displayPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-icon">🎞️</div>
              <p>{post.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;