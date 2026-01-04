import { AppContext } from "AppContext";
import { useContext, useEffect } from "react";

import { Navigate, Route, HashRouter as Router, Routes } from "react-router-dom";
import Album from "./pages/album/Album";
import CategoriesAlbum from "./pages/album/CategoriesAlbum";
import Categories from "./pages/Categories";
import ImgMap from "./pages/ImgMap";
import Login from "./pages/Login";
import AppWrapper from "./wrappers/AppWrapper";

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
      <Routes>
        <Route element={<AppWrapper />}>
          <Route path="/" element={<Navigate to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`} />} />

          <Route path="/login" element={<Login />} />

          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:currentCategory" element={<CategoriesAlbum />} />
          <Route path="/categories/:currentCategory/:currentImgId" element={<CategoriesAlbum />} />

          <Route path="/album" element={<Navigate to={`/album/${process.env.REACT_APP_ROOT_FOLDER_ID}`} />} />
          <Route path="/album/:currentFolderId" element={<Album />} />
          <Route path="/album/:currentFolderId/:currentImgId" element={<Album />} />

          <Route path="/map" element={<ImgMap />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
