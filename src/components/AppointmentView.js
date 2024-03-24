import React, { useState, Component, useEffect } from 'react';
import '../App.css'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, getDocs, getDoc, deleteDoc, query, where } from 'firebase/firestore';
import PendingAppointmentCard from './PendingAppointmentCard';

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

const fetchOpenSlots = async () => {
    const openSlots = [];
    const user = getAuth().currentUser;
    if (user) {
        const slotQuery = query(collection(db, "Time Slots"), where("doctorId", "==", user.uid));
        const slotQuerySnap = await getDocs(slotQuery);
        slotQuerySnap.forEach((doc) => {
            openSlots.push({id: doc.id, ...doc.data()});
        });
    }
    return openSlots;
}

const fetchBookedSlots = async () => {
    const bookedSlots = [];
    const user = getAuth().currentUser;
    if (user) {
        const slotQuery = query(collection(db, "Booked Time Slots"), where("doctorId", "==", user.uid));
        const slotQuerySnap = await getDocs(slotQuery);
        slotQuerySnap.forEach((doc) => {
            bookedSlots.push({id: doc.id, ...doc.data()});
        });
    }
    return bookedSlots;
}

const cancelBookedSlot = async (slotId) => {
    await deleteDoc(doc(db, "Booked Time Slots", slotId));
}

const deleteOpenSlot = async (slotId) => {
    await deleteDoc(doc(db, "Time Slots", slotId));
}

export default function AppointmentView() {
    const [userData, setUserData] = useState({});
    const [openSlotData, setOpenSlotData] = useState([]);
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

    useEffect(() => {
        async function fetchOpenSlotsData() {
            let data = await fetchOpenSlots();
            setOpenSlotData(data);
        }
        fetchOpenSlotsData();
    }, []);
    const hasBookedSlots = bookedSlotData.length != 0;
    const hasOpenSlots = openSlotData.length != 0;
    return (
        <div className="appointment-view-container">
            <div className='pending-appointment-view-container'>
                <h2>Booked Slots</h2>
                {!hasBookedSlots && <h3>No slots booked currently</h3>}
                {bookedSlotData.map((slot) => (
                <div className='pending-appointment-card-container'>
                    <PendingAppointmentCard name={userData.firstName} date={slot.slotDate} description={slot.startTime} buttonLabel="Cancel" onButtonClick={async () => {
                        cancelBookedSlot(slot.id);
                        let updatedData = await fetchBookedSlots();
                        setBookedSlotData(updatedData);
                    }} />
                    <br/>
                </div>
                ))}
            </div>
            <div className='upcoming-appointment-view-container'>
                <h2>Open Slots</h2>
                {!hasOpenSlots && <h3>No open slots currently</h3>}
                {openSlotData.map((slot) => (
                <div className='pending-appointment-card-container'>
                    <PendingAppointmentCard name={userData.firstName} date={slot.slotDate} description={slot.startTime} buttonLabel="Delete" onButtonClick={async () => {
                        deleteOpenSlot(slot.id);
                        let updatedData = await fetchOpenSlots();
                        setOpenSlotData(updatedData);
                    }} />
                    <br/>
                </div>
                ))}
            </div>
        </div>
    )
}
