import React from 'react';
import './App.css';

// * navigation
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// * pages
import Home from "./pages/Home";

function App() {
  return (
    // verify basename and homepage after deploy
    <Router basename="/pic-pages">  

      <Routes>
        <Route path="/" element={<Home />} />

      
      </Routes>

    </Router>
  );
}

export default App;
