import React, { useState } from "react";
import "./Explore.css";

const Explore = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/search?query=${query}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="explore-container">
      <h1>Explore Page</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {results ? (
          <pre>{JSON.stringify(results, null, 2)}</pre>
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </div>
  );
};

export default Explore;
