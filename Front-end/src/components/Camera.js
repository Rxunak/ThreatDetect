import React, { useEffect, useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import "../styles/Camera.css";
import { FaVideo } from "react-icons/fa";

const Camera = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionActiveRef = useRef(false);
  const streamRef = useRef(null);

  const [message, setMessage] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [item, setItem] = useState("");
  const [conScore, setConScore] = useState([]);
  const [detectionImage, setDetectionImage] = useState("");
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const loadModelAndDetect = async () => {
      await tf.ready();

      if (!tf.getBackend()) {
        try {
          await tf.setBackend("webgl");
        } catch (error) {
          await tf.setBackend("cpu");
        }
      }

      const model = await cocossd.load();
      console.log("Model loaded");
      modelRef.current = model;
      setModelReady(true);
    };

    loadModelAndDetect();

  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    return () => {
      detectionActiveRef.current = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoElement) {
        videoElement.srcObject = null;
      }
    };
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
        videoRef.current.onloadeddata = () => {
          if (modelRef.current && detectionActiveRef.current) {
            detectObjects(modelRef.current);
          }
        };
      }
      streamRef.current = stream;
    } catch (error) {
      console.error("Error while accessing camera feed:", error);
    }
  };

  const stopRecording = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setMessage("");
    setItem("");
  };

  const handleDetection = async () => {
    if (isDetecting) {
      detectionActiveRef.current = false;
      stopRecording();
      setIsDetecting(false);
    } else {
      detectionActiveRef.current = true;
      await getCameraFeed();
      setIsDetecting(true);
    }
  };

  const detectObjects = async (model) => {
    if (!detectionActiveRef.current) {
      return;
    }

    if (videoRef.current && videoRef.current.readyState >= 2) {
      const predictions = await model.detect(videoRef.current);
      drawPredictions(predictions);
      confidenceScore(predictions);

      const detected = predictions.some(
        (prediction) =>
          prediction.class === "bottle" || prediction.class === "cell phone",
      );

      if (detected) {
        const detectedObject = predictions.find(
          (prediction) =>
            prediction.class === "bottle" || prediction.class === "cell phone",
        ).class;
        setMessage(
          `${
            detectedObject.charAt(0).toUpperCase() + detectedObject.slice(1)
          } Detected!`,
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
    console.log(predictions);
    predictions.forEach((prediction) => {
      context.beginPath();
      context.rect(
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2],
        prediction.bbox[3],
      );
      context.lineWidth = 4;
      context.strokeStyle = "#58d6ff";
      context.stroke();

      context.font = "bold 18px Manrope";
      context.fillStyle = "#58d6ff";
      context.fillText(
        prediction.class,
        prediction.bbox[0],
        Math.max(20, prediction.bbox[1] - 8),
      );

      if (prediction.class === "bottle" || prediction.class === "cell phone") {
        context.drawImage(
          video,
          prediction.bbox[0],
          prediction.bbox[1],
          prediction.bbox[2],
          prediction.bbox[3],
        );

        const image = canvas.toDataURL("image/jpeg");
        setDetectionImage(image);
      }
    });
  };

  const confidenceScore = (predictions) => {
    const getConf = predictions.find(
      (confidence) =>
        confidence.class === "bottle" || confidence.class === "cell phone",
    );
    let finalconfidence = null;
    if (getConf) {
      finalconfidence = `${parseFloat(getConf.score * 100).toFixed(2)}%`;
    }
    setConScore(finalconfidence);
  };

  useEffect(() => {
    let intervalId;
    if (isDetecting && (item === "bottle" || item === "cell phone")) {
      intervalId = setInterval(() => {
        const getUser = localStorage.getItem("auth");
        const getUserID = getUser ? JSON.parse(getUser) : null;

        if (!getUserID || !getUserID.userId) {
          console.log("User ID not found! Skipping send.");
          return;
        }

        const sendDetectionData = async () => {
          if (!item || !conScore) {
            console.log(
              "Skipping send due to missing item or confidence score.",
            );
            return;
          }
          const detectionData = {
            getUserID: getUserID.userId,
            itemDetected: item,
            confidenceScore: conScore,
            image: detectionImage,
            timestamp: new Date(),
          };

          try {
            const response = await fetch(
              "http://localhost:5001/api/detections",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(detectionData),
              },
            );

            if (!response.ok) {
              throw new Error("Failed to send data");
            }

            const result = await response.json();

            if (result.isBlocked) {
              alert("You have been blocked due to a violation.");
              localStorage.setItem(
                "auth",
                JSON.stringify({ ...getUserID, isBlocked: true }),
              );
              window.location.href = "/block";
            }
          } catch (error) {
            console.error("Error sending detection:", error);
          }
        };

        sendDetectionData();
      }, 3);
    }
    return () => clearInterval(intervalId);
  }, [item, conScore, isDetecting, detectionImage]);

  return (
    <div className="cameraMainContainer">
      <div className="firstContainerCam">
        <div className="phone">
          <div className="cameraStatusRow">
            <span className={`statusChip ${modelReady ? "statusOk" : ""}`}>
              Model {modelReady ? "Ready" : "Loading"}
            </span>
            <span className={`statusChip ${isDetecting ? "statusOk" : ""}`}>
              Camera {isDetecting ? "On" : "Off"}
            </span>
            <span className="statusChip">
              Threat {item ? `${item} ${conScore || ""}` : "None"}
            </span>
          </div>

          <div className="videoRef">
            <video className="videoRef1" ref={videoRef} autoPlay playsInline />
            {!isDetecting && (
              <div className="emptyCameraState">
                <div className="emptyCameraIcon">
                  <FaVideo />
                </div>
                <h3>Live Detection Ready</h3>
                <p>
                  Start detection to open your camera and run real-time object scanning.
                </p>
              </div>
            )}

            <canvas ref={canvasRef} className="canRef" />
          </div>
          <div>
            {message && (
              <div
                className="detection-message"
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
          <div className="detectButtonWrap">
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
