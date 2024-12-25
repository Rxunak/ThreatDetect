import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/LogDetection.css";

const LogPage = () => {
  const [detectionData, setDetectionData] = useState([]);
  const [textAnalysis, setTextAnalysis] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState(null);
  const [textAnalysisEdit, setTextAnalysisEdit] = useState(false);
  const [textAnalysisEditing, setTextAnalysisEditing] = useState(null);

  useEffect(() => {
    const fetchDetection = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/detections");
        const data = await response.json();
        setDetectionData(data);
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
      } catch (error) {
        console.log("Error while fetching the data", error);
      }
    };
    fetchTextAnalysis();
  }, []);

  const handleDelete = async (id) => {
    console.log("handle called with id", id);
    try {
      const response = await fetch(
        `http://localhost:5001/api/detections/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDetectionData((prevDetections) => {
          const updatedDetections = prevDetections.filter(
            (detection) => detection._id !== id
          );
          return [...updatedDetections];
        });
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const handleEdit = (detection) => {
    setEditMode(true);
    setEditing(detection);
  };

  const handleTextEdit = (text) => {
    setTextAnalysisEdit(true);
    setTextAnalysisEditing(text);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/api/detections/${editing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editing),
        }
      );

      if (response.ok) {
        const updatedDetection = await response.json();
        setDetectionData((prevDetections) =>
          prevDetections.map((detection) =>
            detection._id === updatedDetection._id
              ? updatedDetection
              : detection
          )
        );
        setEditing(false);
        setEditMode(false);
      } else {
        alert("not working");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitText = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5001/api/analysis/${textAnalysisEditing._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textAnalysisEditing),
        }
      );

      if (response.ok) {
        const updatedAnalysis = await response.json();
        console.log("This is the new detection", updatedAnalysis);
        setTextAnalysis((prevAnalysis) =>
          prevAnalysis.map((textAnalyse) =>
            textAnalyse._id === updatedAnalysis._id
              ? updatedAnalysis
              : textAnalyse
          )
        );
        setTextAnalysisEdit(false);
      } else {
        alert("not working");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteText = async (_id) => {
    console.log(_id);
    try {
      const response = await fetch(
        `http://localhost:5001/api/analysis/${_id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        console.log("Before", textAnalysis);
        setTextAnalysis((prevAnalysis) => {
          const updatedAnalysis = prevAnalysis.filter(
            (textAnalyse) => textAnalyse._id !== _id
          );
          console.log("After", textAnalysis);
          return [...updatedAnalysis];
        });
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="mainContainerLog">
      <Navbar />
      <div className="mainContent">
        <div className="blockedUsers">
          <div className="loghead">
            <h1 className="logHeading">Blocked Users</h1>
          </div>

          <div
            className="detectionOne"
            // style={{ height: "400px", overflowY: "scroll" }}
          >
            {detectionData.map((detection, index) => {
              return detection.confidenceScore > "80%" ? (
                <ol className="orderList" key={detection._id || index} type="1">
                  <div className="mainListComp">
                    <div className="listOL">
                      <li>
                        {<strong>Detected User: </strong>}
                        {detection.getUserID}
                      </li>
                      <li>
                        {<strong>Detected Item: </strong>}
                        {detection.itemDetected}
                      </li>
                      <li>
                        {<strong>Confidence Score: </strong>}
                        {detection.confidenceScore}
                      </li>
                    </div>

                    <div className="buttonList">
                      <button
                        className="editButton"
                        onClick={() => {
                          handleEdit(detection);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() => {
                          console.log(
                            "Delete button clicked for ID:",
                            detection._id
                          );
                          handleDelete(detection._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </ol>
              ) : null;
            })}
          </div>
        </div>

        <div className="review">
          <div className="loghead">
            <h1 className="logHeading">Review blocked users</h1>
          </div>

          <div className="reviewDetection">
            {detectionData.map((detection, index) => {
              return detection.confidenceScore <= "60%" ? (
                <ol className="orderList" key={detection._id || index}>
                  <div className="reviewList">
                    <div className="listOL">
                      <li>
                        {<strong>Detected User: </strong>}
                        {detection.getUserID}
                      </li>
                      <li>
                        {<strong>Detected Item: </strong>}
                        {detection.itemDetected}
                      </li>
                      <li>
                        {<strong>Confidence Score: </strong>}
                        {detection.confidenceScore}
                      </li>
                    </div>

                    <div className="buttonList">
                      <button
                        className="editButton"
                        onClick={() => {
                          handleEdit(detection);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="deleteButton"
                        onClick={() => {
                          handleDelete(detection._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </ol>
              ) : null;
            })}
          </div>
        </div>

        <div className="popup" style={{ display: editMode ? "flex" : "none" }}>
          <div className="popup-content">
            {editMode && editing ? (
              <div>
                <form onSubmit={handleSubmit}>
                  <label htmlFor="">Edit Detected Item:</label>
                  <input
                    type="text"
                    value={editing.itemDetected}
                    onChange={(e) =>
                      setEditing({ ...editing, itemDetected: e.target.value })
                    }
                  />
                  <br />
                  <label htmlFor="">Edit Confidence Score:</label>
                  <input
                    type="text"
                    value={editing.confidenceScore}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        confidenceScore: e.target.value,
                      })
                    }
                  />
                  <br />
                  <input type="submit" />
                  <button
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    Close
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </div>

        <div className="textAnalysis">
          <div className="loghead">
            {" "}
            <h1 className="logHeading">Text Analysis Detection</h1>
          </div>

          <div className="textDetection">
            {textAnalysis.map((text, index) => (
              <ol className="orderList" key={text._id || index}>
                <div className="reviewList">
                  <div className="listOL">
                    <li>{<strong>Detected User: </strong>}{text.getUserID}</li>
                    <li className="textWrap">{<strong>Detected Item: </strong>}{text.textAnalysed}</li>
                  </div>

                  <div className="buttonList">
                    <button
                      className="editButton"
                      onClick={() => {
                        handleTextEdit(text);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="deleteButton"
                      onClick={() => {
                        handleDeleteText(text._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </ol>
            ))}
          </div>
        </div>
        <div
          className="popup"
          style={{ display: textAnalysisEdit ? "flex" : "none" }}
        >
          <div className="popup-content">
            {textAnalysisEdit && textAnalysisEditing ? (
              <form onSubmit={handleSubmitText}>
                <label htmlFor="">Edit Detected User</label>
                <input
                  type="text"
                  value={textAnalysisEditing.textAnalysed}
                  onChange={(e) =>
                    setTextAnalysisEditing({
                      ...textAnalysisEditing,
                      textAnalysed: e.target.value,
                    })
                  }
                />
                <input type="submit" />
                <button
                  onClick={() => {
                    setTextAnalysisEdit(false);
                  }}
                >
                  Close
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LogPage;
