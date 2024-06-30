import React, { useState, useRef } from "react";
import axios from "axios";
import "./Autocomplete.css";

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const fetchSuggestions = async (query) => {
    if (query.length > 0) {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/suggestions?q=${query}&search_by=${searchBy}`
        );
        console.log("Suggestions received:", response.data.results); // Log the response

        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="autocomplete-container">
      <label htmlFor="search-input">Search for a song:</label>
      <input
        type="text"
        id="search-input"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a song..."
        className="autocomplete-input"
      />
      <div className="search-options">
        <label>
          <input
            type="radio"
            value="title"
            checked={searchBy === "title"}
            onChange={() => setSearchBy("title")}
          />
          Search by Title
        </label>

        <label>
          <input
            type="radio"
            value="artist"
            checked={searchBy === "artist"}
            onChange={() => setSearchBy("artist")}
          />
          Search by Artist
        </label>
      </div>
      {loading && <div className="loading-indicator">Loading...</div>}{" "}
      {/* Display text or spinner for loading state */}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item">
              <div>
                <strong>{suggestion.title}</strong> by {suggestion.artist}{" "}
                (Album: {suggestion.album})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
