import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AlbumDetailsPage from "./pages/AlbumDetailsPage"; 
import NotFoundPage from "./pages/NotFoundPage"; // <-- Import the 404 page

function App() {
  return (
    <div className="App">
      <Navbar /> 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/albums/:albumId" element={<AlbumDetailsPage />} />
        
        {/* Catch-all route must always be at the bottom */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;