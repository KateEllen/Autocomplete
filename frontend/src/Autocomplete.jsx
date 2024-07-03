import { useState, useRef } from "react";
import axios from "axios";
import debounce from "./utils/debounce";
import "./Autocomplete.css";

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [funFact, setFunFact] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const inputRef = useRef(null);
  const inputValueRef = useRef("");

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    inputValueRef.current = inputValue;
    setQuery(inputValue);
    setIsTyping(true);
    setActiveSuggestion(0);
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
        const response = await axios.get(
          `http://127.0.0.1:5000/suggestions?q=${query}&search_by=${searchBy}`
        );
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

  const handleSuggestionInteraction = (suggestion) => {
    const selectedQuery =
      searchBy === "title" ? suggestion.title : suggestion.artist;
    setQuery(selectedQuery);
    setLastSearch(selectedQuery);
    setSuggestions([]);
    setIsTyping(false);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev === suggestions.length - 1 ? 0 : prev + 1
        );

        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev === 0 ? suggestions.length - 1 : prev - 1
        );

        break;

      case "Enter":
        e.preventDefault();
        handleSuggestionInteraction(suggestions[activeSuggestion]);

        break;

      default:
        break;
    }
  };

  const handleSearchByChange = (e) => {
    const searchByValue = e.target.value;
    setSearchBy(searchByValue);
    debounceFetchSuggestions(query, searchByValue);
  };

  const handleFocus = () => {
    setIsTyping(true);
  };

  const getHighlightedText = (text, highlight) => {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));

    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleButtonClick = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/funfact", {
        query: inputValueRef.current,
        context: "Generate a fun fact about music related to the query",
      });

      if (response.data.fun_fact) {
        setFunFact(response.data.fun_fact);
      }
    } catch (error) {
      console.error("Error sending request to backend:", error);
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
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        placeholder="Search for a song..."
        className="autocomplete-input"
        ref={inputRef}
        aria-autocomplete="list"
        aria-controls="suggestions-list"
        aria-expanded={isTyping && suggestions.length > 0}
      />
      {loading && <div className="loading-indicator">Loading...</div>}
      {isTyping && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`suggestion-item ${
                index === activeSuggestion ? "active" : ""
              }`}
              onClick={() => {
                handleSuggestionInteraction(suggestion);
              }}
              role="option"
              aria-selected={index === activeSuggestion}
            >
              <div>
                <strong>{getHighlightedText(suggestion.title, query)}</strong>{" "}
                by {suggestion.artist} (Album: {suggestion.album})
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className={`search-options`}>
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

      {lastSearch && (
        <div className="last-search">Last Selected: {lastSearch}</div>
      )}
      <button className="fun-fact-button" onClick={handleButtonClick}>
        Get A Fun Music Fact!
      </button>
      {funFact && (
        <div className="fun-fact">
          <p>{funFact}</p>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
