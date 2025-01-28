import React, { useEffect, useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "../styles/Camera.css";
import * as tf from "@tensorflow/tfjs";

const Camera = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const canvasRef = useRef(null);

  const [message, setMessage] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [item, setItem] = useState("");
  const [stream, setStream] = useState(null);
  const [conScore, setConScore] = useState([]);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocossd.load();
      console.log("Model loaded");
      modelRef.current = model;
    };

    loadModelAndDetect();
  }, []);

  const getCameraFeed = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        };
      }
      setStream(stream);
    } catch (error) {
      console.error("Error while accessing camera feed:", error);
    }
  };

  const getVideoListener = () => {
    videoRef.current.addEventListener("loadeddata", () => {
      if (modelRef.current) {
        detectObjects(modelRef.current);
      }
    });
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleDetection = async () => {
    if (isDetecting) {
      stopRecording();
      setIsDetecting(false);
    } else {
      await getCameraFeed();
      getVideoListener();
      setIsDetecting(true);
    }
  };

  const detectObjects = async (model) => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const predictions = await model.detect(videoRef.current);
      drawPredictions(predictions);
      confidenceScore(predictions);
      // screenshot(predictions);

      const detected = predictions.some(
        (prediction) =>
          prediction.class === "bottle" || prediction.class === "cell phone"
      );

      if (detected) {
        const detectedObject = predictions.find(
          (prediction) =>
            prediction.class === "bottle" || prediction.class === "cell phone"
        ).class;
        setMessage(
          `${
            detectedObject.charAt(0).toUpperCase() + detectedObject.slice(1)
          } Detected!`
        );
        setItem(detectedObject);
      } else {
        setMessage("");
        setItem("");
      }
      requestAnimationFrame(() => detectObjects(model));
    }
  };

  const drawPredictions = (predictions) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    predictions.forEach((prediction) => {
      context.beginPath();
      context.rect(
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2],
        prediction.bbox[3]
      );
      context.lineWidth = 5;
      context.strokeStyle = "red";
      context.fillRect = "yellow";
      context.stroke();

      const font = (context.font = prediction.class);
      context.fillText(font, prediction.bbox[0], prediction.bbox[1]);

      if (prediction.class === "bottle" || prediction.class === "cell phone") {
        context.drawImage(
          video,
          prediction.bbox[0],
          prediction.bbox[1],
          prediction.bbox[2],
          prediction.bbox[3]
        );

        const image = canvas.toDataURL("image/jpeg");
      }
    });
  };

  const confidenceScore = (predictions) => {
    const getConf = predictions.find(
      (confidence) =>
        confidence.class === "cell phone" || confidence.class === "bottle"
    );
    let finalconfidence = null;
    if (getConf) {
      finalconfidence = `${parseFloat(getConf.score * 100).toFixed(2)}%`;
    }
    setConScore(finalconfidence);
  };

  useEffect(() => {
    let intervalId;
    if (isDetecting) {
      intervalId = setInterval(() => {
        const getUser = localStorage.getItem("auth");
        const getUserID = getUser ? JSON.parse(getUser) : null;

        if (!getUserID || !getUserID.userId) {
          console.log("User ID not found!");
          return;
        }

        const sendDetectionData = async () => {
          const detectionData = {
            getUserID: getUserID.userId,
            itemDetected: item,
            confidenceScore: conScore,
            timestamp: new Date(),
          };

          try {
            const response = await fetch(
              "http://localhost:5001/api/detections",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(detectionData),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to send data");
            }

            const result = await response.json();

            if (result.isBlocked) {
              alert("You have been blocked due to a violation.");
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
            console.error("Error:", error);
          }
        };

        sendDetectionData();
      }, 30);
    }
    return () => clearInterval(intervalId);
  }, [item, conScore, isDetecting]);

  return (
    <div className="cameraMainContainer">
      <div className="firstContainerCam">
        <div className="phone">
          <div className="videoRef">
            <video className="videoRef1" ref={videoRef} autoPlay playsInline />

            <canvas ref={canvasRef} className="canRef" />
          </div>
          <div>
            {message && (
              <div
                style={{
                  top: 0,
                  left: 0,
                  color: "red",
                  fontSize: "20px",
                }}
              >
                {message}
              </div>
            )}
          </div>
          <div>
            <button onClick={handleDetection} className="detectButton">
              {isDetecting ? "Stop Detection" : "Start Detection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
