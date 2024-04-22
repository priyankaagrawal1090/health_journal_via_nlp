import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import { DoctorSidebar } from "./Navbar";
import { initializeApp } from 'firebase/app';
import ClipLoader from "react-spinners/ClipLoader";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";
import AppointmentView from './AppointmentView';
import Settings from './Settings';
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

export default function DoctorUI() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userData, setUserData] = useState({});
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
    <div className="div-doctorUI dark">
      {
        showLoading ?
          <div className='flex h-screen justify-center items-center'>
            <ClipLoader
              size={30}
              color={"#334155"}
              loading={showLoading}
            />
          </div> :
          <div className='h-screen relative'>
            {/* <div className="absolute div-sidebar"> */}
              <DoctorSidebar 
              userEmail={userData.email} 
              pfp={auth.currentUser.photoURL}
              logOut={() => {
                signOut(auth).then(() => {
                  navigate("/auth");
                }).catch((error) => {
                  toast({
                    title: "An error has occurred",
                    description: "An error has occurred while signing you out.",
                  });
                });
              }} />
            {/* </div> */}
            {/* <div className="absolute float-right div-doctor"> */}
              <Routes>
                <Route path='/' element={<AppointmentView />} />
                <Route path='/view-unverified-chatbot' element={<ChatVerificationView />} />
                <Route path='/create-time-slot' element={<CreateTimeSlot doctorId={userData.uid} />} />
                <Route path='/settings' element={<Settings userId={userData.uid} isDoctor={true} />} />
              </Routes>
            {/* </div> */}
          </div>
      }

    </div>
  )
}
