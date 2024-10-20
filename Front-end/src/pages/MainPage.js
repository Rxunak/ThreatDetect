import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import "../styles/MainPage.css";

import image from "../assets/Image.png";
import Footer from "../components/Footer";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <div className="mainContainer">
        <div className="firstContainer">
          <div className="heading">
            <h1 className="h1Heading">Welcome to Threat Detect</h1>
            <p className="headingDescription">
              At Threat Detect, we specialize in real-time detection of knives,
              weapons, and sharp objects in live video streams. Our mission is
              to provide a safer environment on social media platforms by
              identifying dangerous content and offensive language in real time.
            </p>
          </div>

          <div className="optionContainer">
            <p className="option">What would you like to start with?</p>
          </div>

          <div className="button1">
            <li className="live1">
              <Link to="/live-detection">Live Detection</Link>
            </li>
            <li className="text1">
              <Link to="/texttual-analysis-page">Text Analysis</Link>
            </li>
          </div>
        </div>

        <div className="secondaryContainer">
          <img src={image} alt="" className="image" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainPage;
