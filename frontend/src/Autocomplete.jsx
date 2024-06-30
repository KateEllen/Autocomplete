// src/Autocomplete.js
import React, { useState, useRef } from 'react';
import axios from 'axios';

const Autocomplete = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        fetchSuggestions(e.target.value);
    };

    const fetchSuggestions = async (query) => {
        if (query.length > 0) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/suggestions?q=${query}`);
                setSuggestions(response.data.results);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for a song..."
            />
            <ul>
                {suggestions.map((suggestion, index) => (
                    <li key={index}>
                        {suggestion.title} by {suggestion.artist} from the album {suggestion.album}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Autocomplete;
