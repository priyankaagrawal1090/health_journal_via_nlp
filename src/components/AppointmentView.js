import React, { useState, Component, useEffect } from 'react';
import '../App.css'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import PendingAppointmentCard from './PendingAppointmentCard';
import AppointmentCard from './AppointmentCard';

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

const fetchBookedSlots = async () => {
    const bookedSlots = [];
    const user = getAuth().currentUser;
    if (user) {
        const slotQuery = query(collection(db, "Booked Time Slots"), where("doctorId", "==", user.uid));
        const slotQuerySnap = await getDocs(slotQuery);
        slotQuerySnap.forEach((doc) => {
            bookedSlots.push(doc.data());
        });
    }
    return bookedSlots;
}
export default function AppointmentView() {
    const [userData, setUserData] = useState({});
    const [bookedSlotData, setBookedSlotData] = useState([]);
    useEffect(() => {
        async function fetchUser() {
            let data = await fetchUserData();
            setUserData(data);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchBookedSlotsData() {
            let data = await fetchBookedSlots();
            setBookedSlotData(data);
        }
        fetchBookedSlotsData();
    }, []);
    return (
        <div className="appointment-view-container">
            <div className='pending-appointment-view-container'>
                <h2>Booked Slots</h2>
                {bookedSlotData.map((slot) => (
                <div className='pending-appointment-card-container'>
                    <PendingAppointmentCard name={userData.firstName} date={slot.slotDate} description={slot.startTime} />
                </div>
                ))}
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
