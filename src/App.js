import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Dropzone from './Dropzone';
import './App.css';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          CSV Location Finder
        </h1>
      </header>
      <main>
        <BrowserRouter>
          <Route path="/">

            <h2>Get addresses based on Long and Lat</h2>
            <p>Please use Google Chrome, other browsers may not work as expected</p>
            <p>Each CSV file must at least have the Latitude and Longtitude headers in the first row</p>
            <p>Files are processed in the broswer locally and not sent anywhere</p>
            <p>Refreshing the page will cause you to lose any files in progress</p>
            <Dropzone />
          </Route>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
