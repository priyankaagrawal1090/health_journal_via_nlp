import React, { useState, Component } from 'react';
import { Sidebar } from "./Navbar";
import '../App.css'
import AppointmentView from './AppointmentView';

export default function DoctorUI () {
  return (
    <div className="div-patientUI">
      <div className="div-sidebar">
        <Sidebar/>
      </div>
      <div className="div-chatbox">
        <AppointmentView/>
      </div>
    </div>
  )
}
