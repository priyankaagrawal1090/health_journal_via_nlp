import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { DoctorSidebar } from "./Navbar";
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
// import '../App.css'
import AppointmentView from './AppointmentView';
import ChatVerificationView from './ChatVerificationView';
import CreateTimeSlot from './CreateTimeSlot';

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const fetchUserData = async () => {
  const user = getAuth().currentUser;
  if (user) {
    const userDataDocRef = doc(db, "Users", user.uid);
    const userDataDocSnap = await getDoc(userDataDocRef);
    if (userDataDocSnap.exists()) {
      return userDataDocSnap.data();
    } else {
      return null;
    }
  }
}

export default function DoctorUI() {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    async function fetchUser() {
      let data = await fetchUserData();
      setUserData(data);
    }
    fetchUser();
  }, []);

  return (
    <div className="div-doctorUI dark">
      <div className="div-sidebar">
        <DoctorSidebar userEmail={userData.email} />
      </div>
      <div className="div-chatbox">
        <Routes>
          <Route path='/create-time-slot' element={<CreateTimeSlot />} />
          <Route path='/view-appointments' element={<AppointmentView />} />
          <Route path='/view-unverified-chatbot' element={<ChatVerificationView />} />
        </Routes>
        {/* <CreateTimeSlot /> */}
        {/* <AppointmentView/> */}
      </div>
    </div>
  )
}
