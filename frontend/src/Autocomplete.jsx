import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Autocomplete.css";

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lastSearch, setLastSearch] = useState("");

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    console.log("Input changed:", inputValue);
    setQuery(inputValue);
    setIsTyping(true);
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
        console.log(
          "Fetching suggestions for query:",
          query,
          "searchBy:",
          searchBy
        );
        const response = await axios.get(
          `http://127.0.0.1:5000/suggestions?q=${query}&search_by=${searchBy}`
        );
        console.log("Suggestions received:", response.data.results);
        setSuggestions(response.data.results);
        setLastSearch(query);
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
    if (searchBy === "title") {
      setQuery(suggestion.title); // Set the input value to the selected suggestion's title
    } else {
      setQuery(suggestion.artist); // Set the input value to the selected suggestion's artist
    }
    setSuggestions([]); // Clear suggestions list
    setIsTyping(false);
  };

  const handleSearchByChange = (e) => {
    const searchByValue = e.target.value;
    console.log("Search by changed:", searchByValue);
    setSearchBy(searchByValue);
    debounceFetchSuggestions(query, searchByValue);
  };

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = (e) => {
    if (!containerRef.current.contains(e.relatedTarget)) {
      setIsTyping(false);
    }
  };

  return (
    <div
      className="autocomplete-container"
      ref={containerRef}
      onBlur={handleBlur}
    >
      <label htmlFor="search-input">Search for a song:</label>
      <input
        type="text"
        id="search-input"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        ref={inputRef}
        autoComplete="off" // Disable autocomplete
        placeholder="Search for a song..."
        className="autocomplete-input"
      />
      <div className={`search-options ${isTyping ? "hidden" : ""}`}>
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
      {(isTyping || suggestions.length > 0) && (
        <ul className={`suggestions-list ${isTyping ? "" : "hidden"}`}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div>
                {searchBy === "title" ? (
                  <>
                    <strong>{suggestion.title}</strong> by {suggestion.artist}{" "}
                    (Album: {suggestion.album})
                  </>
                ) : (
                  <>
                    <strong>{suggestion.artist}</strong> - {suggestion.title}{" "}
                    (Album: {suggestion.album})
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="last-search">Last Searched: {lastSearch}</div>
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
