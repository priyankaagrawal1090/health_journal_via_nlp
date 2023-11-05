import React, { useState, Component } from 'react';
import { Sidebar } from "./Navbar";
import Chatbox from "./Chatbox"
import '../App.css'

export default function PatientUI () {
  return (
    <div className="div-patientUI">
      <div className="div-sidebar">
        <Sidebar/>
      </div>
      <div className="div-chatbox">
        <Chatbox/>
      </div>
    </div>
  )
}
