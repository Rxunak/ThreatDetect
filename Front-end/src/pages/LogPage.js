import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../styles/LogDetection.css";

const LogPage = () => {
  const [detectionData, setDetectionData] = useState([]);
  const [textAnalysis, setTextAnalysis] = useState([]);
 
 

  //state to turn on the edit mode
  const [editMode, setEditMode] = useState(false);

  //state to store the detection being edited
  const [editing, setEditing] = useState(null);

  const [preFills, setPreFills] = useState("jhjh")

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

        console.log(textAnalysis);
      } catch (error) {
        console.log("Error while fetching the data", error);
      }
    };

    fetchTextAnalysis();
  }, []);


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
    console.log(detection)
    setEditMode(true);
    setEditing(detection);
    
    setPreFills(detection.itemDetected);
  }

  const handleSubmit = async (event) => {
    console.log("This is the first Data",editing)
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
        setPreFills("");

      }else{
        alert("not working")
      }
    }catch(error){
      console.log(error)
    }

  }


   

  return (
    <div>
      <Navbar />
      <div className="mainContainerLog">
        <div>
          <div>
            <h1>Knife / Weapon Detection</h1>
            <div style={{ height: "400px", overflowY: "scroll" }}>
              {detectionData.map((detection, index) => (
                <ol key={detection._id || index}>
                  <li>{"Detected Item: " + detection.itemDetected}</li>
                  <li>{"Detected User: " + detection.getUserID}</li>
                  <li>{"Confidence Score: " + detection.confidenceScore}</li>
                  <button onClick={() => {handleEdit(detection)}}>Edit</button>
                  <button onClick={() =>{handleDelete(detection._id)}} >Delete</button>
                </ol>
              ))}
            </div>

            {editMode && editing ? (<div>
              <form onSubmit={handleSubmit} >
                <label htmlFor="">Edit Detected Item:</label>
                <input type="text" value={editing.itemDetected} onChange={(e) => setEditing({ ...editing, itemDetected: e.target.value })}  />
                <br />
                <input type="submit" />
                <button onClick={() => {setEditMode(false)}}>Close</button>
              </form>
            </div>) : null}
            
            <div>
              <button>Clear</button>
            </div>
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
                  <li>{"Detected Item: " + text.textAnalysed}</li>
                  <li>{"Detected User: " + text.getUserID}</li>
                </ol>
              ))}
            </div>
            <div>
              <button>Clear</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LogPage;
