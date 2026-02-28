import "../styles/Navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo" aria-label="Threat Detect home">
        ThreatDetect
      </Link>

      <nav>
        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/live-detection"
              className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
            >
              Live Detection
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/texttual-analysis-page"
              className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
            >
              Text Analysis
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/log-page"
              className={({ isActive }) => `link ${isActive ? "link-active" : ""}`}
            >
              Admin Logs
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="buttonDiv">
        <button className="contact" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
};

export default Navbar;
