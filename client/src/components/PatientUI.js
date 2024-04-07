import React, { useState, Component, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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
export default function PatientUI() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      let data = await fetchUserData();
      setUserData(data);
    }
    fetchData();
  }, []);
  if (userData != null) {
    console.log("USER DATA:", userData);
    return (
      <div className="div-patientUI">
        <PatientSidebar userEmail={userData.email} />
        <Chatbox userId={userData.uid} />
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
