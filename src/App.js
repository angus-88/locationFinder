import React from 'react';

import Dropzone from './Dropzone';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Location Finder
        </h1>
      </header>
      <main>
        <h2>Please only upload one file at a time</h2>
        <Dropzone />
      </main>
    </div>
  );
}

export default App;
