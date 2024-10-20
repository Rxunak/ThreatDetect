import Camera from "../components/Camera";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/LiveDetectionPage.css";

const LiveDetectionPage = () => {
  return (
    <div>
      <Navbar />
      <div className="liveContainerPage">
        <Camera />
      </div>
      <Footer />
    </div>
  );
};

export default LiveDetectionPage;
