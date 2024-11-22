import { useEffect, useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import "../styles/TextAnalysis.css";
import Camera from "../components/Camera";

const TextAnalysis = () => {
  const [inputValue, setInputValue] = useState("");

  const [model, setModel] = useState(null);

  const [analysisResult, setAnalysisResult] = useState([]);

  const [turnCameraOn, setTurnCameraOn] = useState(false);

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const loadModel = async () => {
      const threshold = 0.7;
      const model = await toxicity.load(threshold);
      setModel(model);
    };

    loadModel();
  }, []);

  const textAnalyse = async () => {
    if (model && inputValue) {
      const predictions = await model.classify([inputValue]);
      setAnalysisResult(predictions);
      sendAnalysedData(inputValue, predictions);
    } else {
      console.log("Model is not loaded or input is empty!");
    }
  };

  const sendAnalysedData = async (userText, analysisResult) => {
    const filteredResults = analysisResult
      .filter((category) => category.results[0].match === true)
      .map((category) => ({
        label: category.label,
        match: category.results[0].match,
      }));

    const getUser = localStorage.getItem("auth");
    const getUserID = getUser ? JSON.parse(getUser) : null;

    if (!getUserID || !getUserID.userId) {
      console.log("User ID not found!");
      return;
    }

    const backendData = {
      getUserID: getUserID.userId,
      textAnalysed: userText,
      analysis: filteredResults,
    };

    console.log(backendData);

    try {
      const response = await fetch("http://localhost:5001/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        throw new Error("Failed to send data");
      }

      const resData = await response.json();
      console.log("Backend Response", resData);
    } catch (error) {
      console.log("Error while sending data to the backend", error);
    }
  };

  const OpenCamera = () => {
    setTurnCameraOn(true);
  };

  const CloseCamera = () => {
    setTurnCameraOn(false);
  };

  return (
    <div className="textmainCon">
      <div className="textSeconCon">
        <div className="textFirstContainer">Hello</div>
        <div className="resultDiv">
          <div>
            <h3>Detected Categories:</h3>
            <ul>
              {analysisResult
                .filter((category) => category.results[0].match === true)
                .map((category, index) => (
                  <li key={index}>{category.label}</li>
                ))}
            </ul>
          </div>
        </div>

        <div className="secondDivtext">
          <div className="inputDiv">
            <input
              type="text"
              value={inputValue}
              onChange={onChange}
              placeholder="Text to Analyse"
              className="test"
            />
          </div>

          <div>
            <button onClick={textAnalyse}>Analyze</button>
            <button onClick={OpenCamera} style={{ marginLeft: "10px" }}>
              Open Camera
            </button>
          </div>
        </div>
      </div>
      {turnCameraOn && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={CloseCamera}>
              Close
            </button>
            <Camera />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;
