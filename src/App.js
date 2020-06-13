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
        <p>Each file must at least have the Latitude, Longtitude headers in the first row</p>
        <Dropzone />
      </main>
    </div>
  );
}

export default App;
