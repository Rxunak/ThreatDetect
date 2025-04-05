import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/LogDetection.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { FaRegSmile } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

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

  const handleDelete = async (id) => {
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
        setTextAnalysis((prevAnalysis) =>
          prevAnalysis.map((textAnalyse) =>
            textAnalyse._id === updatedAnalysis._id
              ? updatedAnalysis
              : textAnalyse
          )
        );
        setTextAnalysisEdit(false);
      } else {
        console.log("not working");
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
        console.log(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
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
        console.log(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      console.log("An error occurred: " + error.message);
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

  const currentDate = (date) => {
    const d = new Date(date);

    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    let detectTime = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    day = day < 10 ? "0" + day : day;

    month = month < 10 ? "0" + month : month;

    const newDate = `${day}/${month}/${year} ${detectTime}:${minutes}:${seconds}`;

    return newDate;
  };
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
                            <div className="detectionListMain">
                              <div>
                                <p>
                                  <strong>User Id:</strong>{" "}
                                  {detection.getUserID}
                                </p>
                                <p>
                                  <strong>Detected Item:</strong>{" "}
                                  {detection.itemDetected}
                                </p>
                                <p>
                                  <strong>Confidence Score: </strong>
                                  {detection.confidenceScore}
                                </p>
                                <p>
                                  <strong>Detected at </strong>
                                  {currentDate(detection.timestamp)}
                                </p>
                                <img
                                  src={detection.image}
                                  alt=""
                                  className="detectionText"
                                />
                              </div>
                              <div className="buttton">
                                <button
                                  className="buttonLog"
                                  onClick={() => handleDelete(detection._id)}
                                >
                                  <MdDeleteForever />
                                </button>
                              </div>
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
                            <div className="detectionListMain">
                              <div>
                                <p>
                                  <strong>User Id:</strong>{" "}
                                  {detection.getUserID}
                                </p>
                                <p>
                                  <strong>Detected Item:</strong>{" "}
                                  {detection.itemDetected}
                                </p>
                                <p>
                                  <strong>Confidence Score: </strong>
                                  {detection.confidenceScore}
                                </p>
                                <p>
                                  <strong>Detected at </strong>
                                  {currentDate(detection.timestamp)}
                                </p>
                                <img
                                  src={detection.image}
                                  alt=""
                                  className="detectionText"
                                />
                              </div>
                              <div className="buttton">
                                <button
                                  className="buttonLog"
                                  onClick={() => handleDelete(detection._id)}
                                >
                                  <MdDeleteForever />
                                </button>
                              </div>
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
                            <div className="detectionListMain">
                              <div>
                                <p>
                                  <strong>User Id: </strong> {text.getUserID}
                                </p>
                                <p>
                                  <strong>Detected Text:</strong>{" "}
                                  {text.textAnalysed}
                                </p>
                                <p>
                                  <strong>Threat Category:</strong>{" "}
                                  {text.analysis.map((a) => a.label).join(", ")}
                                </p>
                                <p>
                                  <strong>Detected at </strong>
                                  {currentDate(text.timestamp)}
                                </p>
                              </div>
                              <div className="buttton">
                                <button
                                  className="buttonLog"
                                  onClick={() => handleDeleteText(text._id)}
                                  onCl
                                >
                                  <MdDeleteForever />
                                </button>
                              </div>
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
                  <ul className="userEachListOne">
                    {user.map((users) => (
                      <li key={users._id} className="userEachList">
                        <div className="userDivCon">
                          <div className="userDiv1">
                            <li>
                              <strong>Name: </strong>
                              {users.username}
                            </li>
                            <li>
                              <strong>User ID: </strong>
                              {users._id}
                            </li>
                            <li>
                              <strong>Account creattion: </strong>
                              {currentDate(users.createdAt)}
                            </li>
                            <li>
                              <strong>Last Update: </strong>
                              {currentDate(users.updatedAt)}
                            </li>
                          </div>
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
          <div className="popup-detection">
            {editMode && editing ? (
              <div>
                <form onSubmit={handleSubmit} className="formTextDetection">
                  <div className="formtextTwo">
                    <button
                      className="closeText"
                      onClick={() => {
                        setEditMode(false);
                      }}
                    >
                      <IoMdCloseCircle />
                    </button>
                  </div>
                  <div className="formtextOneDetection">
                    <label htmlFor="" className="textLabel">
                      Edit Detected Item:
                    </label>
                    <input
                      type="text"
                      className="inputTextLabel"
                      value={editing.itemDetected}
                      onChange={(e) =>
                        setEditing({ ...editing, itemDetected: e.target.value })
                      }
                    />
                    <br />
                    <label htmlFor="" className="textLabel">
                      Edit Confidence Score:
                    </label>
                    <input
                      type="text"
                      className="inputTextLabel"
                      value={editing.confidenceScore}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          confidenceScore: e.target.value,
                        })
                      }
                    />
                    <br />
                    <input
                      type="submit"
                      value="Save Changes"
                      className="formSave"
                    />
                  </div>
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
              <form onSubmit={handleSubmitText} className="formText">
                <div className="formtextTwo">
                  <button
                    className="closeText"
                    onClick={() => {
                      setTextAnalysisEdit(false);
                    }}
                  >
                    <IoMdCloseCircle />
                  </button>
                </div>
                <div className="formtextOne">
                  <label htmlFor="" className="textLabel">
                    Modify Detected Text Below!!
                  </label>
                  <input
                    type="text"
                    value={textAnalysisEditing.textAnalysed}
                    onChange={(e) =>
                      setTextAnalysisEditing({
                        ...textAnalysisEditing,
                        textAnalysed: e.target.value,
                      })
                    }
                    className="inputTextLabel"
                  />
                  <input
                    type="submit"
                    value="Save Changes"
                    className="formSave"
                  />
                </div>
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
