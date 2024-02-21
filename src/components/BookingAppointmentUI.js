import React, { useState } from "react";

function BookingAppointmentUI({ doctors, onBookAppointment }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [reason, setReason] = useState("");

  const handleDoctorSelection = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null); // Reset selected time slot when selecting a new doctor
  };

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor) {
      alert("Please select a doctor.");
    } else if (!selectedSlot) {
      alert("Please select a time slot.");
    } else if (!patientName.trim()) {
      alert("Please enter your name.");
    } else if (!reason.trim()) {
      alert("Please enter a reason for the appointment.");
    } else {
      const appointmentDetails = {
        doctor: selectedDoctor,
        timeSlot: selectedSlot,
        patientName: patientName.trim(),
        reason: reason.trim(),
      };
      onBookAppointment(appointmentDetails);
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <div>
        <label htmlFor="patientName">Your Name:</label>
        <input
          type="text"
          id="patientName"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="reason">Reason for Appointment:</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
      </div>
      <div>
        <p>Select a doctor:</p>
        <select onChange={(e) => handleDoctorSelection(e.target.value)}>
          <option value="">Select a doctor</option>
          {doctors.map((doctor, index) => (
            <option key={index} value={doctor.name}>
              {doctor.name}
            </option>
          ))}
        </select>
      </div>
      {selectedDoctor && (
        <div>
          <p>Select an available time slot for {selectedDoctor}:</p>
          <div>
            {/* Display available time slots for the selected doctor */}
            {doctors
              .find((doc) => doc.name === selectedDoctor.name)
              .timeSlots.map((slot, index) => (
                <button key={index} onClick={() => handleSlotSelection(slot)}>
                  {slot}
                </button>
              ))}
          </div>
        </div>
      )}
      <button onClick={handleBookAppointment}>Book Appointment</button>
    </div>
  );
}

export default BookingAppointmentUI;
