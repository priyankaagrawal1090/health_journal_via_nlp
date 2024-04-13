import React from "react";
import PatientUI from "./components/PatientUI";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DoctorUI from "./components/DoctorUI";
import Auth from "./components/Auth";
import About from "./components/About";
import { Toaster } from "./components/toaster";

function App() {
  document.body.classList.add("dark");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/patient-ui/*" element={<PatientUI />} />
          <Route path="/doctor-ui/*" element={<DoctorUI />} />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
