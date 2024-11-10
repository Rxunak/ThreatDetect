import React, { useEffect, useRef, useState } from "react";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "../styles/Camera.css";

const Camera = () => {
  const videoRef = useRef(null);
  const modelRef = useRef(null);
  const canvasRef = useRef(null);

  const [message, setMessage] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [item, setItem] = useState("");
  const [stream, setStream] = useState(null);

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

      const detected = predictions.some(
        (prediction) =>
          prediction.class === "bottle" || prediction.class === "person"
      );

      if (detected) {
        const detectedObject = predictions.find(
          (prediction) =>
            prediction.class === "bottle" || prediction.class === "person"
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
      //This is where it is running it continiously
      requestAnimationFrame(() => detectObjects(model));
    }
  };

  // draw object bounding boxes
  const drawPredictions = (predictions) => {
    const ctx = canvasRef.current.getContext("2d");
    //clears any previous drawings
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    //Drawing Rectengales now
    predictions.forEach((prediction) => {
      ctx.beginPath();
      ctx.rect(
        prediction.bbox[0],
        prediction.bbox[1],
        prediction.bbox[2],
        prediction.bbox[3]
      );
      ctx.lineWidth = 5;
      ctx.strokeStyle = "green";
      ctx.fillStyle = "green";
      //Darws the Rectangle
      ctx.stroke();

      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        prediction.bbox[0],
        prediction.bbox[1] > 10 ? prediction.bbox[1] - 5 : 10
      );
    });
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
            console.log("Detection sent:", result);
          } catch (error) {
            console.error("Error:", error);
          }
        };

        sendDetectionData();
      }, 30000);
    }

    return () => clearInterval(intervalId);
  }, [item]);

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
            <button onClick={handleDetection}>
              {isDetecting ? "Stop " : "Start"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
