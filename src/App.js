import React from "react";
import Home from "./components/Home";
// import "font-awesome/css/font-awesome.min.css";
// import "bootstrap/dist/css/bootstrap.css";
import PatientUI from "./components/PatientUI";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DoctorUI from "./components/DoctorUI";
import BookingAppointmentUI from "./components/BookingAppointmentUI";
import SignIn from "./components/SignIn";
import Auth from "./components/Auth";
import About from "./components/About";

function App() {
  document.body.classList.add("dark");
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/patient-ui" element={<PatientUI />} />
          <Route path="/doctor-ui/*" element={<DoctorUI />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
