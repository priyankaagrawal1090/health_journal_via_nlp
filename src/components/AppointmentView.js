import React, { useState, Component } from 'react';
import '../App.css'
import PendingAppointmentCard from './PendingAppointmentCard';
import AppointmentCard from './AppointmentCard';

export default function AppointmentView () {
  return (
    <div className="appointment-view-container">
        <div className='pending-appointment-view-container'>
            <h2>Pending Appointments</h2>
            <div className='pending-appointment-card-container'>
                <PendingAppointmentCard name='John' date='2:00PM' description='Im having some trouble' />
            </div>
        </div>
        <div className='upcoming-appointment-view-container'>
            <h2>Upcoming Appointments</h2>
            <div className='upcoming-appointment-card-container'>
                <AppointmentCard name='John' date='2:00PM' description='Im having some trouble' />
            </div>        
        </div>
        <div className='past-appointment-view-container'>
            <h2>View Past Appointments</h2>
        </div>
    </div>
  )
}
