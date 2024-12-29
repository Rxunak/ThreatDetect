import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LiveDetectionPage from "./pages/LiveDetectionPage";
import LogPage from "./pages/LogPage";
import TextualAnalysisPage from "./pages/TextualAnalysisPage";
import Login from "./components/Login";
import Signup from "./components/SignUp";
import BlockedRedirect from "./pages/BlockedRedirect";


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<ProtectedRoute element={<MainPage />} />} />
          <Route
            path="/live-detection"
            element={<ProtectedRoute element={<LiveDetectionPage />} />}
          />
          <Route path="/block" element={<BlockedRedirect />} />
          <Route
            path="/texttual-analysis-page"
            element={<ProtectedRoute element={<TextualAnalysisPage />} />}
          />
          <Route
            path="/log-page"
            element={
              <ProtectedRoute element={<LogPage />} requiredRole="admin" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
