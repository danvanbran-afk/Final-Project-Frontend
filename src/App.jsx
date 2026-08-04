import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // <-- Import new Navbar
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <div className="App">
      {/* The Navbar sits outside the Routes so it always stays on screen */}
      <Navbar /> 

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;