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
  const [textAnalysisEditing, setTextAnalysisEditing] =useState(null)

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
  }, [detectionData]);

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
  }, [textAnalysis]);

  const handleDelete = async (id) => {
      try {
        const response = await fetch(`http://localhost:5001/api/detections/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setDetectionData((prevDetections) =>
            prevDetections.filter((detection) => detection.id !== id)
          );
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
  }

  const handleTextEdit = (text) => {
    setTextAnalysisEdit(true);
    setTextAnalysisEditing(text);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
      const response = await fetch(`http://localhost:5001/api/detections/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editing )
      })

    if(response.ok){
        const updatedDetection = await response.json();
        console.log("This is the new detection",updatedDetection)
        setDetectionData((prevDetections) =>
          prevDetections.map((detection) =>
            detection._id === updatedDetection._id ? updatedDetection : detection
          )
        );
        setEditing(false);
      }else{
        alert("not working")
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleSubmitText = async (event) => {
    event.preventDefault();
    try{
      const response = await fetch(`http://localhost:5001/api/analysis/${textAnalysisEditing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textAnalysisEditing)
      })

    if(response.ok){
        const updatedAnalysis = await response.json();
        console.log("This is the new detection",updatedAnalysis)
        setTextAnalysis((prevAnalysis) =>
          prevAnalysis.map((textAnalyse) =>
            textAnalyse._id === updatedAnalysis._id ? updatedAnalysis : textAnalyse
          )
        );
        setTextAnalysisEdit(false)
      }else{
        alert("not working")
      }
    }catch(error){
      console.log(error)
    }
  }

  const handleDeleteText  = async (_id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/analysis/${_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTextAnalysis((prevAnalysis) =>
          prevAnalysis.filter((textAnalyse) => textAnalyse.id !== _id)
        );
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete the detection");
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="mainContainerLog">
        <div>
          <div>
            <h1>Blocked Users</h1>
            <div style={{ height: "400px", overflowY: "scroll" }}>
              {detectionData.map((detection, index) => {
                return detection.confidenceScore > "80%" ? (
                <ol key={detection._id || index}>
                  <li>{"Detected User: " + detection.getUserID}</li>
                  <li>{"Detected Item: " + detection.itemDetected}</li>
                  <li>{"Confidence Score: " + detection.confidenceScore}</li>
                  <button onClick={() => {handleEdit(detection)}}>Edit</button>
                  <button onClick={() =>{handleDelete(detection._id)}} >Delete</button>
                </ol>
                ) : null
              })}
            </div>


             <h1>Review</h1>
            <div style={{ height: "400px", overflowY: "scroll" }}>
              {detectionData.map((detection, index) => {
                return detection.confidenceScore <= "60%" ? (
                <ol key={detection._id || index}>
                  <li>{"Detected User: " + detection.getUserID}</li>
                  <li>{"Detected Item: " + detection.itemDetected}</li>
                  <li>{"Confidence Score: " + detection.confidenceScore}</li>
                  <button onClick={() => {handleEdit(detection)}}>Edit</button>
                  <button onClick={() =>{handleDelete(detection._id)}} >Delete</button>
                </ol>
                ) : null
              })}
            </div>

            {editMode && editing ? (<div>
              <form onSubmit={handleSubmit} >
                <label htmlFor="">Edit Detected Item:</label>
                <input type="text" value={editing.itemDetected} onChange={(e) => setEditing({ ...editing, itemDetected: e.target.value })}  />
                <br />
                <label htmlFor="">Edit Confidence Score:</label>
                <input type="text" value={editing.confidenceScore} onChange={(e) => setEditing({ ...editing, confidenceScore: e.target.value })}  />
                <br />
                <input type="submit" />
                <button onClick={() => {setEditMode(false)}}>Close</button>
              </form>
            </div>) : null}

          </div>
          <div>
            <h1>Text Analysis Detection</h1>
            <div
              style={{
                height: "400px",
                overflowY: "scroll",
                paddingBottom: "2rem",
              }}
            >
              {textAnalysis.map((text, index) => (
                <ol key={text._id || index}>
                  <li>{"Detected User: " + text.getUserID}</li>
                  <li>{"Detected Item: " + text.textAnalysed}</li>
                  <button onClick={() => {handleTextEdit(text)}}>Edit</button>
                  <button onClick={() => {handleDeleteText(text._id)}}>Delete</button>
                </ol>
              ))}

              {textAnalysisEdit && textAnalysisEditing ? (
                <form onSubmit={handleSubmitText}>
                <label htmlFor="">Edit Detected User</label>
                <input type="text" value={textAnalysisEditing.textAnalysed} onChange={(e) => setTextAnalysisEditing({ ...textAnalysisEditing, textAnalysed: e.target.value })} />
                <input type="submit" />
                <button onClick={() => {setTextAnalysisEdit(false)}}>Close</button>
                </form>
                ): null}

              
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LogPage;
