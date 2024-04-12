import React, { useState, Component, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import { PatientSidebar } from "./Navbar";
import Chatbox from "./Chatbox"
import '../App.css'

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP"
};

const PatientUI = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setShowLoading(false);
      if (user) {
        setUserData(user);
      } else {
        navigate("/auth");
      }
    });
  }, []);
  
  if (userData) {
    return (
      <div className="div-patientUI">
        {
          showLoading ?
            <div className='flex h-screen justify-center items-center'>
              <ClimbingBoxLoader
                size={30}
                color={"#334155"}
                loading={showLoading}
              />
            </div> :
            <div>
              <PatientSidebar userEmail={userData.email} />
              <Chatbox userId={userData.uid} />
            </div>
        }

      </div>
    );
  } else {
    navigate("/auth");
  }

}

export default PatientUI;