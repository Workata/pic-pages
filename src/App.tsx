import React from 'react';
import './App.css';

// * navigation
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

// * pages
import Home from "./pages/Home";
import Album from "./pages/Album";

import AppWrapper from "./wrappers/AppWrapper";

function App() {
  return (
    // TODO verify basename and homepage setting after deploy
    <Router basename="/pic-pages">  

      <AppWrapper>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/album" element={<Album />} /> */}
          <Route path="/album/:folderId" element={<Album />} />

        
        </Routes>
    
      </AppWrapper>

    </Router>
  );
}

export default App;
