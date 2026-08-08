import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AlbumDetailsPage from "./pages/AlbumDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import IsPrivate from "./components/IsPrivate"; 
import AddAlbumPage from "./pages/AddAlbumPage"; // Note: You will need to create this component next!

function App() {
  return (
    <div className="App">
      <Navbar /> 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* --- PROTECTED ROUTES --- */}
        <Route 
          path="/albums/create" 
          element={
            <IsPrivate>
              <AddAlbumPage />
            </IsPrivate>
          } 
        />
        
        {/* --- DYNAMIC ROUTES --- */}
        <Route path="/albums/:albumId" element={<AlbumDetailsPage />} />
        
        {/* Catch-all route must always be at the bottom */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;