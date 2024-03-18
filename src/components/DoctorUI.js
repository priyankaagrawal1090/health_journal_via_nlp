import React, { useState, Component } from 'react';
import { Route, Routes } from "react-router-dom";
import { DoctorSidebar } from "./Navbar";
import '../App.css'
import AppointmentView from './AppointmentView';
import CreateTimeSlot from './CreateTimeSlot';

export default function DoctorUI () {
  return (
    <div className="div-patientUI">
      <div className="div-sidebar">
        <DoctorSidebar/>
      </div>
      <div className="div-chatbox">
        <Routes>
          <Route path='/create-time-slot' element={<CreateTimeSlot />}/>
          <Route path='/view-appointments' element={<AppointmentView />}/>
        </Routes>
        {/* <CreateTimeSlot /> */}
        {/* <AppointmentView/> */}
      </div>
    </div>
  )
}
