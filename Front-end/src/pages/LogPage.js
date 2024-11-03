import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/LogDetection.css";

const LogPage = () => {
  const [detectionData, setDetectionData] = useState([]);
  const [textAnalysis, setTextAnalysis] = useState([]);

  useEffect(() => {
    const fetchDetection = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/detections");
        const data = await response.json();

        setDetectionData(data);

        console.log(detectionData);
      } catch (error) {
        console.log("Error while fetching the data", error);
      }
    };

    fetchDetection();
  }, []);

  useEffect(() => {
    const fetchTextAnalysis = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/analysis");
        const data = await response.json();

        setTextAnalysis(data);

        console.log(textAnalysis);
      } catch (error) {
        console.log("Error while fetching the data", error);
      }
    };

    fetchTextAnalysis();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="mainContainerLog">
        <div>
          <div>
            <h1>Knife / Weapon Detection</h1>
            <div style={{ height: "400px", overflowY: "scroll" }}>
              {detectionData.map((detection, index) => (
                <ol key={detection._id || index}>
                  <li>{"Detected Item: " + detection.itemDetected}</li>
                  <li>{"Detected User: " + detection.getUserID}</li>
                </ol>
              ))}
            </div>
            <div>
              <button>Clear</button>
            </div>
          </div>
          <div>
            <h1>Text Analysis Detection</h1>
            <div
              style={{
                height: "400px",
                overflowY: "scroll",
                paddingBottom: "2rem",
              }}
            >
              {textAnalysis.map((text, index) => (
                <ol key={text._id || index}>
                  <li>{"Detected Item: " + text.textAnalysed}</li>
                  <li>{"Detected User: " + text.getUserID}</li>
                </ol>
              ))}
            </div>
            <div>
              <button>Clear</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LogPage;
