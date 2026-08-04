import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      padding: "15px 30px", 
      backgroundColor: "#282c34", 
      color: "white",
      marginBottom: "20px"
    }}>
      <div>
        {/* The "Logo" that links back to the home page */}
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: "1.2rem", fontWeight: "bold" }}>
          Music Review Platform
        </Link>
      </div>

      <div>
        <Link to="/signup" style={{ marginRight: "15px" }}>
          <button style={{ padding: "8px 12px", cursor: "pointer" }}>Sign Up</button>
        </Link>
        
        <Link to="/login">
          <button style={{ padding: "8px 12px", cursor: "pointer" }}>Log In</button>
        </Link>
      </div>
    </nav>
  );
}