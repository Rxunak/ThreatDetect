import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");

    navigate("/login");
  }; 
  return (
    <div className="navbar">
      <span className="logo">THREAT DETECT</span>
      <div className="nav-links">
        <li >
          <Link to="/" className="link">Home</Link>
        </li>
        <li>
          <Link to="/texttual-analysis-page" className="link">Let's Chat</Link>
        </li>
        <li>
          <Link to="/log-page" className="link">Log Detection</Link>
        </li>
        <li>
          <Link to="/log-page" className="link">Contacts</Link>
        </li>
      </div>

      <div className="buttonDiv">
        <button className="contact" onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default Navbar;
