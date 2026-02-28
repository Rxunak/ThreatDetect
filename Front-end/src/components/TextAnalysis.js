import { useState } from "react";
import "../styles/TextAnalysis.css";
import Camera from "../components/Camera";
import { FaCamera } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IoMdCloseCircle } from "react-icons/io";

const TextAnalysis = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [turnCameraOn, setTurnCameraOn] = useState(false);

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      textAnalyse();
    }
  };

  const analyzeText = (text) => {
    const phraseRules = [
      { phrase: "i hate you", label: "toxicity", confidence: 0.92 },
      { phrase: "watch your back", label: "threat", confidence: 0.95 },
      { phrase: "you are going to regret this", label: "threat", confidence: 0.94 },
      { phrase: "idiot", label: "insult", confidence: 0.84 },
      { phrase: "stupid", label: "insult", confidence: 0.82 },
      { phrase: "kill", label: "threat", confidence: 0.9 },
    ];

    const normalizedText = text.toLowerCase();
    const matches = [];
    const seenLabels = new Set();

    phraseRules.forEach((rule) => {
      if (normalizedText.includes(rule.phrase) && !seenLabels.has(rule.label)) {
        matches.push({
          label: rule.label,
          results: [{ match: true, probabilities: [1 - rule.confidence, rule.confidence] }],
        });
        seenLabels.add(rule.label);
      }
    });

    return matches;
  };

  const textAnalyse = async () => {
    if (inputValue) {
      const predictions = analyzeText(inputValue);

      sendAnalysedData(inputValue, predictions);
      setChatHistory((prevChatHistory) => {
        const updatedChat = [
          ...prevChatHistory,
          { messageInput: inputValue, analysis: predictions },
        ];
        return updatedChat;
      });
      setInputValue("");
    } else {
      console.log("Input is empty!");
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
        <div className="chatBody">
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
                          *This text contains: <b>{filteredLabels}</b>*
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
                onKeyDown={handleKeyDown}
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
