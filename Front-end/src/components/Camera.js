import React, { useEffect, useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "../styles/Camera.css";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [detectionMessage, setDetectionMessage] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const streamRef = useRef(null);
  const modelRef = useRef(null);

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
      streamRef.current = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopRecording = () => {
    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const toggleDetection = async () => {
    if (isDetecting) {
      stopRecording();
      setIsDetecting(false);
    } else {
      await getCameraFeed();
      attachVideoListener();
      setIsDetecting(true);
    }
  };

  const attachVideoListener = () => {
    videoRef.current.addEventListener("loadeddata", () => {
      if (modelRef.current) {
        detectObjects(modelRef.current);
      }
    });
  };

  useEffect(() => {
    const loadModelAndDetect = async () => {
      const model = await cocossd.load();
      console.log("Model loaded");
      modelRef.current = model;
    };

    loadModelAndDetect();
  }, []);

  // Function to detect objects continuously
  const detectObjects = async (model) => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const predictions = await model.detect(videoRef.current); // Detect objects in video
      drawPredictions(predictions); // Draw predictions on canvas

      // Check for knife or weapon in the predictions and update the detection message
      const detected = predictions.some(
        (prediction) =>
          prediction.class === "knife" || prediction.class === "weapon"
      );

      // If a knife or weapon is detected, set the message
      if (detected) {
        setDetectionMessage("Knife or Weapon Detected!");
      } else {
        setDetectionMessage(""); // Clear message if no knife or weapon detected
      }

      requestAnimationFrame(() => detectObjects(model)); // Continue detection
    }
  };

  // Function to draw predictions on the canvas
  const drawPredictions = (predictions) => {
    const ctx = canvasRef.current.getContext("2d"); // Get canvas context
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); // Clear previous drawings

    // Draw each prediction
    predictions.forEach((prediction) => {
      ctx.beginPath();
      ctx.rect(
        prediction.bbox[0], // x-coordinate
        prediction.bbox[1], // y-coordinate
        prediction.bbox[2], // width
        prediction.bbox[3] // height
      );
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red"; // Rectangle border color
      ctx.fillStyle = "red"; // Text color
      ctx.stroke();

      // Draw label text
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`, // Text label
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
    });
  };

  useEffect(() => {
    const sendDetectionData = async () => {
      const detectionData = {
        itemDetected: "knife", // Example of the detected item
        timestamp: new Date(),
      };

      try {
        const response = await fetch("http://localhost:5001/api/detections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detectionData),
        });

        if (!response.ok) {
          throw new Error("Failed to send data");
        }

        const result = await response.json();
        console.log("Detection sent:", result);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    sendDetectionData(); // Call the function to send the data
  }, []);

  return (
    <div className="cameraMainContainer">
      <div className="firstContainerCam">
        <div className="phone">
          <div className="videoRef">
            <video className="videoRef1" ref={videoRef} autoPlay playsInline />

            <canvas ref={canvasRef} className="canRef" />
          </div>
          <div>
            {detectionMessage && (
              <div
                style={{
                  top: 0,
                  left: 0,
                  color: "red",
                  fontSize: "20px",
                }}
              >
                {detectionMessage}
              </div>
            )}
          </div>
          <div>
            <button onClick={toggleDetection}>
              {isDetecting ? "Stop " : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
