import React from "react";
import { useNavigate } from "react-router-dom";
import image from "../assets/image copy.png";
import "../styles/BlockedPage.css";
import { MdContactSupport } from "react-icons/md";
import { IoLogOutSharp } from "react-icons/io5";

const BlockedRedirect = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };
  return (
    <div className="mainBlockPage">
      <div className="secondMainPage">
        <div className="firstBlock">
          <div className="blockPageHeading">
            <h1>Access Restricted</h1>
          </div>
          <div className="blockPageImage">
            <img className="blockPageImage1" src={image} alt="" />
          </div>
        </div>

        <div className="secondBlock">
          <div className="blockPageText">
            <p>
              Your account has been temporarily blocked due to <br />
              suspicious activity. If you beleive this is a mistake, <br />
              please contact support.
            </p>
          </div>

          <div className="blockPageButton">
            <button className="button1">
              <a className="button2css" href="mailto:raunakuk2016@gmail.com">
                <MdContactSupport />
              </a>
            </button>

            <button className="button2" onClick={handleLogout}>
              <IoLogOutSharp />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockedRedirect;
