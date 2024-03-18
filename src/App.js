import React from "react";
import Home from "./components/Home";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.css";
import PatientUI from "./components/PatientUI";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DoctorUI from "./components/DoctorUI";
import BookingAppointmentUI from "./components/BookingAppointmentUI";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/patient-ui" element={<PatientUI />} />
          <Route path="/doctor-ui/*" element={<DoctorUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
