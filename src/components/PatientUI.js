import React, { useState, Component, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { Sidebar } from "./Navbar";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const fetchUserData = async () => {
  const auth = await getAuth();
  const user = auth.currentUser;
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
export default function PatientUI() {
  const [userData, setUserData] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomeText, setWelcomeText] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let data = await fetchUserData();
      console.log(data);
      setUserData(data);
      
    }
    fetchData();
    console.log(userData);
  }, []);
  const handleInputChange = (event) => {
    setIsTyping(event.target.value !== '');
  };
  if (userData != null) {
    console.log("USER DATA:", userData);
    return (
      <div className="div-patientUI">
        <div className="div-sidebar">
          <Sidebar />
        </div>
        
        <div className="div-chatbox">
          {showWelcomeText && 
            <div className="div-main-content">
              <h1>{isTyping ? "" : "Welcome to the Chat!"}</h1>
            </div>
          }
          
          <Chatbox showWelcomeText={setWelcomeText} userId={userData.uid} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="div-patientUI">
        <p>Not signed in...</p>
      </div>
    )
  }
}
