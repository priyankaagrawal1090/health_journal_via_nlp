import React from "react";
import Home from "./components/Home";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.css";
import PatientUI from "./components/PatientUI";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-ui" element={<PatientUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
