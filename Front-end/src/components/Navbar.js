import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("auth");

    navigate("/login");
  };
  return (
    <div className="navbar">
      <span className="logo">THREAT DETECT</span>
      <div className="nav-links">
        <li>
          {" "}
          <Link to="/">Home</Link>
        </li>
        <li>
          {" "}
          <Link to="/live-detection">Live Detection</Link>
        </li>
        <li>
          <Link to="/texttual-analysis-page">Text Analysis</Link>
        </li>
        <li>
          <Link to="/log-page">Log Detection</Link>
        </li>
      </div>
      <div className="contact">
        <li>Contact</li>
      </div>

      <div className="contact">
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default Navbar;
