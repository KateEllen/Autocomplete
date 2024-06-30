import { useState } from 'react'
import './App.css'
import Autocomplete from './autocomplete'


function App() {
  return (
      <div className="App">
          <header className="App-header">
              <h1>Song Suggestions</h1>
              <Autocomplete />
          </header>
      </div>
  );
}

export default App
