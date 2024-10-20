import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LiveDetectionPage from "./pages/LiveDetectionPage";
import LogPage from "./pages/LogPage";
import TextualAnalysisPage from "./pages/TextualAnalysisPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { div } from "@tensorflow/tfjs-core";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route index path="/" element={<MainPage />} />
          <Route path="/live-detection" element={<LiveDetectionPage />} />
          <Route path="/log-page" element={<LogPage />} />
          <Route
            path="/texttual-analysis-page"
            element={<TextualAnalysisPage />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
