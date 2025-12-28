import React, { useContext, useEffect } from "react";

// * navigation
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// * pages
import Login from "./pages/Login";
import Album from "./pages/album/Album";
import CategoriesAlbum from "./pages/album/CategoriesAlbum";
import ImgMap from "./pages/ImgMap";
import Categories from "./pages/Categories";

import AppWrapper from "./wrappers/AppWrapper";
import { AppContext } from "AppContext";

function App() {
  const { getTokenCookie, tokenValue, setTokenValue } = useContext(AppContext);
  // * on app load check if token exists in cookie
  useEffect(() => {
    if (!tokenValue) {
      setTokenValue(getTokenCookie("token"));
    }
  });

  return (
    <Router>
      <AppWrapper>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Navigate to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`} />} />

          <Route path="/login" element={<Login />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:currentCategory" element={<CategoriesAlbum />} />
          <Route path="/categories/:currentCategory/:currentImgId" element={<CategoriesAlbum />} />

          <Route path="/album" element={<Navigate to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`} />} />
          <Route path="/album/:currentFolderId" element={<Album />} />
          <Route path="/album/:currentFolderId/:currentImgId" element={<Album />} />

          <Route path="/map" element={<ImgMap />} />
        </Routes>
      </AppWrapper>
    </Router>
  );
}

export default App;
