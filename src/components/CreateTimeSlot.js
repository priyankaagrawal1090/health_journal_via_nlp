import React, { useState, Component, useEffect } from 'react';
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, addDoc } from 'firebase/firestore';
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
export default function CreateTimeSlot() {
    const [userData, setUserData] = useState(null);
    const [slotDate, setSlotDate] = useState(new Date());
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();

    useEffect(() => {
        async function fetchUser() {
            let data = await fetchUserData();
            console.log(data);
            setUserData(data);
        }
        fetchUser();
    }, []);
    const timeDiff = (startTime, endTime) => {
        let start = startTime.split(":");
        let end = endTime.split(":");
        let tempDate = new Date(slotDate);
        let sDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), start[0], start[1], 0);
        let eDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), end[0], end[1], 0);
        let timeDiff = eDate.getTime() - sDate.getTime();
        let minutesDiff = Math.floor((timeDiff / 1000) / 60);
        return minutesDiff;
    }

    const validateSlot = () => {
        let timeDifference = timeDiff(startTime, endTime);
        return timeDifference > 15;
    }

    const handleSubmit = () => {
        let isValidated = validateSlot();
        if (isValidated && userData != null) {
            const timeSlotsRef = collection(db, "Time Slots");
            const timeSlotsDoctorRef = collection(db, "Users", userData.uid, "Open Time Slots");
            const slotData = {
                doctorId: userData.uid,
                slotDate: slotDate,
                startTime: startTime,
                endTime: endTime,
            };
            addDoc(timeSlotsRef, slotData);
            addDoc(timeSlotsDoctorRef, slotData);
        }
    }
    return (
        <div id="form-container">
            <div id='date-container'>
                <label>Time Slot Date:</label>
                <input type='date' id='slot-date' onInput={i => setSlotDate(i.target.value)} />
            </div>
            <br />
            <div id='start-time-container'>
                <label>Appointment Start Time:</label>
                <input type='time' id='start-time' onInput={i => setStartTime(i.target.value)} />
            </div>
            <br />
            <div id='end-time-container'>
                <label>Appointment End Time:</label>
                <input type='time' id='end-time' onInput={i => setEndTime(i.target.value)} />
            </div>
            <br />
            <div id='submit-btn-container'>
                <input type='button' id='submit-slot-btn' value="Submit" onClick={handleSubmit} />
            </div>
        </div>
    )
}
