import React, { useState, Component } from "react";
// import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import "../App.css";
import logo from "../health-journal-high-resolution-logo-white.png";
import BookingAppointmentUI from "./BookingAppointmentUI";

export function HorizontalNavbar() {
  return (
    <div className="horizontal-navbar">
      <div className="navbar-logo">
        {/* <img className="img-logo" src={logo}></img> */}
        <p className="img-logo">Health Journal</p>
      </div>
      <div className="navbar-nav">
        <Link to="/home" className="nav-items">
          Home
        </Link>
        <Link to="/about" className="nav-items">
          About
        </Link>
        <Link to="/signin" className="nav-items">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [showBookingUI, setShowBookingUI] = useState(false);

  const handleBookAppointmentClick = () => {
    setShowBookingUI(true);
  };

  // Temporary data for doctors and time slots
  const doctorsData = [
    {
      name: "Dr. Smith",
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM"],
    },
    {
      name: "Dr. Johnson",
      timeSlots: ["1:00 PM", "2:00 PM", "3:00 PM"],
    },
  ];

  // Define the function to handle booking appointment
  const handleBookAppointment = (appointmentDetails) => {
    // Here you can implement the logic to handle booking appointment
    console.log("Booking appointment:", appointmentDetails);
    // For now, let's just log the appointment details
  };

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-picture">
          <i className="fa fa-user-circle-o" />
        </div>
        <div className="profile-info">
          <i className="fa fa-users" />
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="sidebar-home">
          <i className="fa fa-home" />
        </div>
        <div className="sidebar-settings">
          <i className="fa fa-cog" />
        </div>
        <div className="sidebar-logout">
          <i className="fa fa-sign-out" />
        </div>
        {showBookingUI && (
          <BookingAppointmentUI
            doctors={doctorsData}
            onBookAppointment={handleBookAppointment}
          />
        )}
        <div className="sidebar-book-aapointment">
          <button onClick={handleBookAppointmentClick}>Book Appointment</button>
        </div>
      </div>
    </div>
  );
}
