import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import './Autocomplete.css';

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    console.log("Input changed:", inputValue);
    setQuery(inputValue);
    debounceFetchSuggestions(inputValue, searchBy);
  };

  const debounceFetchSuggestions = useRef(
    debounce((value, searchBy) => {
      fetchSuggestions(value, searchBy);
    }, 300)
  ).current;

  const fetchSuggestions = async (query, searchBy) => {
    if (query.length > 0) {
      setLoading(true);
      try {
        console.log("Fetching suggestions for query:", query, "searchBy:", searchBy);
        const response = await axios.get(
          `http://127.0.0.1:5000/suggestions?q=${query}&search_by=${searchBy}`
        );
        console.log("Suggestions received:", response.data.results);
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

  const handleSuggestionClick = (suggestion) => {
    console.log("Suggestion clicked:", suggestion);
    setQuery(suggestion.title); // Set the input value to the selected suggestion's title
    setSuggestions([]); // Clear suggestions list
  };

  const handleSearchByChange = (e) => {
    const searchByValue = e.target.value;
    console.log("Search by changed:", searchByValue);
    setSearchBy(searchByValue);
    // Fetch suggestions again with the new searchBy value
    debounceFetchSuggestions(query, searchByValue);
  };

  return (
    <div className="autocomplete-container">
      <label htmlFor="search-input">Search for a song:</label>
      <input
        type="text"
        id="search-input"
        value={query}
        onChange={handleInputChange}
        ref={inputRef}
        placeholder="Search for a song..."
        className="autocomplete-input"
      />
      <div className="search-options">
        <label>
          <input
            type="radio"
            value="title"
            checked={searchBy === "title"}
            onChange={handleSearchByChange}
          />
          Search by Title
        </label>

        <label>
          <input
            type="radio"
            value="artist"
            checked={searchBy === "artist"}
            onChange={handleSearchByChange}
          />
          Search by Artist
        </label>
      </div>
      {loading && <div className="loading-indicator">Loading...</div>}
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
              <div>
                <strong>{suggestion.title}</strong> by {suggestion.artist} (Album: {suggestion.album})
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      func(...args);
      clearTimeout(timeout);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
