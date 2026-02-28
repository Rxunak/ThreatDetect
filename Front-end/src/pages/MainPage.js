import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/MainPage.css";
import image from "../assets/Image.png";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      <main className="mainContainer">
        <section className="firstContainer">
          <div className="heading">
            <p className="eyebrow">AI Safety Platform</p>
            <h1 className="h1Heading">Detect harmful content before it spreads.</h1>
            <p className="headingDescription">
              ThreatDetect combines live visual detection and text analysis to identify risky behavior,
              support moderation teams, and improve digital safety in real time.
            </p>
          </div>

          <div className="button1">
            <Link to="/live-detection" className="live1">
              Start Live Scan
            </Link>
            <Link to="/texttual-analysis-page" className="text1">
              Analyze Text
            </Link>
          </div>

          <div className="featureStrip">
            <div className="featureCard">
              <h3>Real-time</h3>
              <p>Continuous webcam object monitoring.</p>
            </div>
            <div className="featureCard">
              <h3>Text Signals</h3>
              <p>Instant threat phrase flagging.</p>
            </div>
            <div className="featureCard">
              <h3>Admin Review</h3>
              <p>Centralized logs and account actions.</p>
            </div>
          </div>
        </section>

        <section className="secondaryContainer">
          <img src={image} alt="Threat detection dashboard illustration" className="image" />
        </section>
      </main>
    </div>
  );
};

export default MainPage;
