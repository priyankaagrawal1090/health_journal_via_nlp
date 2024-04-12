import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast"
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
  const { toast } = useToast();
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

  return (
    <div className="div-patientUI">
      {
        showLoading ?
          <div className='flex h-screen justify-center items-center'>
            <ClipLoader
              size={30}
              color={"#334155"}
              loading={showLoading}
            />
          </div> :
          <div>
            <PatientSidebar userEmail={userData.email} logOut={() => {
              signOut(auth).then(() => {
                navigate("/auth");
              }).catch((error) => {
                toast({
                  title: "An error has occurred",
                  description: "An error has occurred while signing you out.",
                });
              });
            }} />
            <Chatbox userId={userData.uid} />
          </div>
      }
    </div>
  );

}

export default PatientUI;