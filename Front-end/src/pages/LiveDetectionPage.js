import Camera from "../components/Camera";
import Navbar from "../components/Navbar";
import "../styles/LiveDetectionPage.css";

const LiveDetectionPage = () => {
  return (
    <div>
      <Navbar />
      <div className="liveContainerPage">
        <Camera />
      </div>
    </div>
  );
};

export default LiveDetectionPage;
