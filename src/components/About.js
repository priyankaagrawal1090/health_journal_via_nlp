import React, { Component } from "react";
import "../App.css";

export default function About() {
  return (
    <div className="aboutContent">
      <h1>
        Health Journal is revolutionizing in making mental healthcare
        accessible, efficient, and effective.{" "}
      </h1>
      <div class="container text-center">
        <div class="about-features">
          <div class="feature">
            <h4>Personalized Treatment Search</h4>
            <p>
              Say goodbye to endless online searches. Our intuitive chatbot is
              here to assist you 24/7. Simply ask about the resources, and
              receive accurate and relevant information instantly.
            </p>
          </div>
          <div class="feature">
            <h4>Seamless Appointment Booking</h4>
            <p>
              Booking appointments has never been easier. With just a few
              clicks, patients can schedule appointments with their preferred
              doctors, eliminating the hassle of phone calls and waiting times.
            </p>
          </div>
          <div class="feature">
            <h4>Efficient Doctor Portal</h4>
            <p>
              Doctors have full control over their schedules with our
              user-friendly portal. They can manage pending and upcoming
              appointments, accept or reject bookings, and update their
              availability in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
