import { useEffect, useState } from "react";
import * as toxicity from "@tensorflow-models/toxicity";
import * as tf from "@tensorflow/tfjs";
import "../styles/TextAnalysis.css";

const TextAnalysis = () => {
  const [inputValue, setInputValue] = useState("");

  const [model, setModel] = useState(null);

  const [analysisResult, setAnalysisResult] = useState([]);

  const onChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const loadModel = async () => {
      const threshold = 0.7;
      const model = await toxicity.load(threshold);
      setModel(model);
    };

    loadModel();
  }, []);

  const textAnalyse = async () => {
    if (model && inputValue) {
      const predictions = await model.classify([inputValue]);
      setAnalysisResult(predictions);
      console.log(predictions);
    } else {
      console.log("Model is not loaded or input is empty!");
    }
  };

  const filteredResults = analysisResult.filter(
    (category) => category.results[0].match === true
  );

  return (
    <div className="textmainCon">
      <div className="textSeconCon">
        <div className="resultDiv">
          <div>
            <h3>Detected Categories:</h3>
            <ul>
              {filteredResults.map((category, index) => (
                <li key={index}>{category.label}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="secondDivtext">
          <div className="inputDiv">
            <input
              type="text"
              value={inputValue}
              onChange={onChange}
              placeholder="Text to Analyse"
              className="test"
            />
          </div>

          <div>
            <button onClick={textAnalyse}>Analyze</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextAnalysis;
