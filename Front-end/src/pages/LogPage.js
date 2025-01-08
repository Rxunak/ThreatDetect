import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/LogDetection.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";

const LogPage = () => {
  const [detectionData, setDetectionData] = useState([]);
  const [textAnalysis, setTextAnalysis] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editing, setEditing] = useState(null);
  const [textAnalysisEdit, setTextAnalysisEdit] = useState(false);
  const [textAnalysisEditing, setTextAnalysisEditing] = useState(null);
  const [user, setUser] = useState([]);
  const [selectedSection, setSelectedSection] = useState("home");

  useEffect(() => {
    const fetchDetection = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/detections");
        const data = await response.json();
        setDetectionData(data);
        console.log(data);
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/users/users");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log("Error while fetching the data", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    console.log("thgus is user data", user);
  });

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
        setTextAnalysis((prevAnalysis) => {
          const updatedAnalysis = prevAnalysis.filter(
            (textAnalyse) => textAnalyse._id !== _id
          );

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

  const handleBlockUser = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/block/${_id}`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUser((prevUsers) =>
          prevUsers.map((user) =>
            user._id === _id ? { ...user, isBlocked: true } : user
          )
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("Error blocking user:", error);
      alert("An error occurred while blocking the user");
    }
  };

  const handleUnblockUser = async (_id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/users/unblock/${_id}`,
        {
          method: "PATCH",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUser((prevUsers) =>
          prevUsers.map((user) =>
            user._id === _id ? { ...user, isBlocked: false } : user
          )
        );
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log("Error blocking user:", error);
      alert("An error occurred while blocking the user");
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/users/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUser((prevUser) => {
          const updatedUser = prevUser.filter((users) => users._id !== id);

          return [...updatedUser];
        });
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  };

  const totalNumberofBlockedDetection = detectionData.filter(
    (detection) => detection.confidenceScore >= "80%"
  ).length;

  const totalNumberofReviewdDetection = detectionData.filter(
    (detection) => detection.confidenceScore < "80%"
  ).length;

  const totalTextBlocked = textAnalysis.filter(
    (text) => text.analysis.length >= 1
  ).length;

  const totalReviewBlocked = textAnalysis.filter(
    (text) => text.analysis.length === 0
  ).length;
  return (
    <div className="mainContainerLog">
      <Navbar />

      <div className="sidebarMain">
        <div className="sidebar">
          <ul className="tabs">
            <li
              className={`sidebar-bar ${
                selectedSection === "home" ? "active" : ""
              }`}
              onClick={() => setSelectedSection("home")}
            >
              Admin Home
            </li>
            <li
              className={`sidebar-bar ${
                selectedSection === "detection" ? "active" : ""
              }`}
              onClick={() => setSelectedSection("detection")}
            >
              Detection
            </li>
            <li
              className={`sidebar-bar ${
                selectedSection === "textAnalysis" ? "active" : ""
              }`}
              onClick={() => setSelectedSection("textAnalysis")}
            >
              Text Analysis
            </li>
            <li
              className={`sidebar-bar ${
                selectedSection === "userManagement" ? "active" : ""
              }`}
              onClick={() => setSelectedSection("userManagement")}
            >
              User Managment
            </li>
          </ul>
        </div>

        <div className="content-area">
          {selectedSection === "home" && (
            <div className="logPageHomeMain">
              <div className="logPageHome">
                <div className="welcome">
                  <h1>Welcome, Admin!</h1>
                  <p className="overview">
                    Here’s an overview of the system at a glance.
                  </p>
                </div>

                <div className="glance">
                  <div className="blockedDetec">
                    <div className="glanceTab">
                      <div className="glanceTabs">
                        <p>{totalNumberofBlockedDetection}</p>
                      </div>
                    </div>
                    <div className="textTab">
                      <p>Blocked Detection</p>
                    </div>
                  </div>

                  <div className="blockedDetec">
                    <div className="glanceTab">
                      <div className="glanceTabs">
                        <p>{totalNumberofReviewdDetection}</p>
                      </div>
                    </div>
                    <div className="textTab">
                      <p>Pending Detection Review</p>
                    </div>
                  </div>

                  <div className="blockedDetec">
                    <div className="glanceTab">
                      <div className="glanceTabs">
                        <p>{totalTextBlocked}</p>
                      </div>
                    </div>
                    <div className="textTab">
                      <p>Blocked Text</p>
                    </div>
                  </div>

                  <div className="blockedDetec">
                    <div className="glanceTab">
                      <div className="glanceTabs">
                        <p>{totalReviewBlocked}</p>
                      </div>
                    </div>
                    <div className="textTab">
                      <p>Pending Text Review</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedSection === "detection" && (
            <div className="detection">
              <div className="blockedDetection">
                <div className="detectHeading">
                  <h3>Blocked Users</h3>
                </div>
                <div className="info">
                  <ul className="eachListOne">
                    {detectionData.filter(
                      (detection) => detection.confidenceScore >= "80%"
                    ).length === 0 ? (
                      <div className="noData">
                        <h2>No Blocked Users </h2>
                        {<FaRegSmile />}
                      </div>
                    ) : (
                      detectionData

                        .filter(
                          (detection) => detection.confidenceScore >= "80%"
                        )
                        .map((detection) => (
                          <li key={detection._id} className="eachList">
                            <p>
                              <strong>User:</strong> {detection.getUserID}
                            </p>
                            <p>
                              <strong>Item Detected:</strong>{" "}
                              {detection.itemDetected}
                            </p>
                            <p>
                              <strong>Confidence:</strong>
                              {detection.confidenceScore}
                            </p>
                            <div className="buttton">
                              <button
                                className="buttonLog"
                                onClick={() => handleEdit(detection)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="buttonLog"
                                onClick={() => handleDelete(detection._id)}
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="reviewDetection">
                <div className="detectHeading">
                  <h3>Review Users</h3>
                </div>
                <div className="info">
                  <ul className="eachListOne">
                    {detectionData.filter(
                      (detection) => detection.confidenceScore < "80%"
                    ).length === 0 ? (
                      <div className="noData">
                        <h2>Nothing to Review </h2>
                        {<FaRegSmile />}
                      </div>
                    ) : (
                      detectionData
                        .filter(
                          (detection) => detection.confidenceScore < "80%"
                        )
                        .map((detection) => (
                          <li key={detection._id} className="eachList">
                            <p>
                              <strong>User:</strong> {detection.getUserID}
                            </p>
                            <p>
                              <strong>Item Detected:</strong>{" "}
                              {detection.itemDetected}
                            </p>
                            <p>
                              <strong>Confidence: </strong>
                              {detection.confidenceScore}
                            </p>
                            <div className="buttton">
                              <button
                                className="buttonLog"
                                onClick={() => handleEdit(detection)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="buttonLog"
                                onClick={() => handleDelete(detection._id)}
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedSection === "textAnalysis" && (
            <div className="detection">
              <div className="reviewDetection">
                <div className="detectHeading">
                  <h3>Blocked Text</h3>
                </div>
                <div className="info">
                  <ul className="eachListOne">
                    {textAnalysis.filter((text) => text.analysis.length >= 1)
                      .length === 0 ? (
                      <div className="noData">
                        <h2>No Blocked Users </h2>
                        {<FaRegSmile />}
                      </div>
                    ) : (
                      textAnalysis
                        .filter((text) => text.analysis.length >= 1)
                        .map((text) => (
                          <li key={text._id} className="eachList">
                            <p>User: {text.getUserID}</p>
                            <p>Text: {text.textAnalysed}</p>
                            <p>
                              Category:{" "}
                              {text.analysis.map((a) => a.label).join(", ")}
                            </p>
                            <div className="buttton">
                              <button
                                className="buttonLog"
                                onClick={() => handleTextEdit(text)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="buttonLog"
                                onClick={() => handleDeleteText(text._id)}
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
              <div className="reviewDetection">
                <div className="detectHeading">
                  <h3>Review Text</h3>
                </div>
                <div className="info">
                  <ul className="eachListOne">
                    {textAnalysis.filter((text) => text.analysis.length === 0)
                      .length === 0 ? (
                      <div className="noData">
                        <h2>No Blocked Users </h2>
                        {<FaRegSmile />}
                      </div>
                    ) : (
                      textAnalysis
                        .filter((text) => text.analysis.length === 0)
                        .map((text) => (
                          <li key={text._id} className="eachList">
                            <p>User: {text.getUserID}</p>
                            <p>Text: {text.textAnalysed}</p>
                            <p>Category: None</p>
                            <div className="buttton">
                              <button
                                className="buttonLog"
                                onClick={() => handleTextEdit(text)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="buttonLog"
                                onClick={() => handleDeleteText(text._id)}
                              >
                                <MdDeleteForever />
                              </button>
                            </div>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedSection === "userManagement" && (
            <div className="userMain">
              <div className="userDetection">
                <div className="detectHeading">
                  <h1>Users</h1>
                </div>
                <div className="userInfo">
                  <div></div>
                  <ul className="userEachListOne">
                    {user.map((users) => (
                      <li key={users._id} className="userEachList">
                        <li>
                          <strong>Name: </strong>
                          {users.username}
                        </li>
                        <li>
                          <strong>User ID: </strong>
                          {users._id}
                        </li>
                        <div className="userButtons">
                          <div>
                            {users.isBlocked ? (
                              <button
                                className="userButton"
                                onClick={() => handleUnblockUser(users._id)}
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                className="userButton"
                                onClick={() => handleBlockUser(users._id)}
                              >
                                Block
                              </button>
                            )}
                          </div>
                          <div>
                            <button
                              className="userButton"
                              onClick={() => deleteUser(users._id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detection pop up*/}
      <div>
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
      </div>

      {/* Detection pop up*/}
      <div>
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
