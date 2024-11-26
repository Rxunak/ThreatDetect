import { useEffect, useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import "../styles/TextAnalysis.css";
import Camera from "../components/Camera";

const TextAnalysis = ({ socket, username, room }) => {
  const [inputValue, setInputValue] = useState("");

  const [chatHistory, setChatHistory] = useState([]);

  const [model, setModel] = useState(null);

  const [analysisResult, setAnalysisResult] = useState([]);

  const [turnCameraOn, setTurnCameraOn] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const threshold = 0.7;
      const model = await toxicity.load(threshold);
      setModel(model);
    };

    loadModel();
  }, []);

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const textAnalyse = async () => {
    if (model && inputValue) {
      const predictions = await model.classify([inputValue]);
      //saving the predictions
      setAnalysisResult(predictions);
      //sennding the parameters for backend
      sendAnalysedData(inputValue, predictions);
      //saving the inputvalue into chatArray state
      setChatHistory([
        ...chatHistory,
        { messageInput: inputValue, analysis: predictions },
      ]);
      //setting input value state to empty
      setInputValue("");
    } else {
      console.log("Model is not loaded or input is empty!");
    }
  };

  console.log(analysisResult);

  //BACKEND SECTION

  const sendAnalysedData = async (userText, analysisResult) => {
    const filteredResults = analysisResult
      .filter((category) => category.results[0].match === true)
      .map((category) => ({
        label: category.label,
        match: category.results[0].match,
        probabilities: category.results[0].probabilities,
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
    <div className="textMainContainer">
      <div className="detectionContainer">
        <div className="chatHead">
          <p>Let's Chat with Text Analysis</p>
        </div>

        <div className="chatBody">
          <ul>
            {chatHistory &&
              chatHistory.map((chat, index) => (
                <li key={index}>
                  <p>{chat.messageInput}</p>
                  <ul>
                    {chat.analysis
                      .filter((category) => category.results[0].match === true)
                      .map((category) => `- Violets: ${category.label}`)
                      .join(", ")}
                  </ul>
                </li>
              ))}
          </ul>
        </div>

        <div className="chatFootter">
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={onChange}
              placeholder="Type...."
              className="text"
            />
          </div>

          <div>
            <button onClick={textAnalyse}>Send</button>
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
              Close Camera
            </button>
            <Camera />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;
