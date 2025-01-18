import { useEffect, useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import "../styles/TextAnalysis.css";
import Camera from "../components/Camera";
import chat from "../assets/deltabackground.jpg";
import { FaCamera } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const TextAnalysis = () => {
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

  const fallbackText = (text) => {
    const toxicText = [
      "i hate you",
      "watch your back",
      "you are going to regret this",
    ];
    const isTextToxic = toxicText.some((phrase) =>
      text.toLowerCase().includes(phrase)
    );
    return isTextToxic;
  };

  const textAnalyse = async () => {
    if (model && inputValue) {
      const predictions = await model.classify([inputValue]);
      const isFallbacktext = fallbackText(inputValue);

      if (isFallbacktext) {
        predictions.push({
          label: "toxicText",
          results: [{ match: true }],
        });
      }

      setAnalysisResult(predictions);
      sendAnalysedData(inputValue, predictions);
      setChatHistory([
        ...chatHistory,
        { messageInput: inputValue, analysis: predictions },
      ]);
      setInputValue("");
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

      if (resData.isBlocked) {
        alert("You have been blocked due to a violation");

        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...getUserID,
            isBlocked: true,
          })
        );
        window.location.href = "/block";
      }
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
        <div className="chatHead" />
        <div className="chatBody" style={{ backgroundImage: `url(${chat})` }}>
          <div className="chat">
            <ul className="chatOutput">
              {chatHistory &&
                chatHistory.map((chat, index) => {
                  const filteredLabels = chat.analysis
                    .filter((category) => category.results[0].match === true)
                    .map((category) => category.label)
                    .join(", ");

                  return (
                    <li key={index} className="list2">
                      <p className="chattext">{chat.messageInput}</p>
                      {filteredLabels && (
                        <p className="threat">
                          <li>
                            *This text contains: <b>{filteredLabels}</b>*
                          </li>
                        </p>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>

          <div className="inputField">
            <div className="textArea">
              <input
                type="text"
                value={inputValue}
                onChange={onChange}
                placeholder="Type...."
                className="text"
              />
            </div>

            <div className="camera">
              <button onClick={OpenCamera} className="cameraIcon">
                <FaCamera />
              </button>
            </div>

            <div className="send">
              <button onClick={textAnalyse} className="sendIcon">
                <IoSend />
              </button>
            </div>
          </div>
        </div>
      </div>

      {turnCameraOn && (
        <div className="modalOverlay">
          <div className="modalContent">
            <button className="closeButton" onClick={CloseCamera}>
              <IoMdCloseCircle />
            </button>
            <Camera />
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;
