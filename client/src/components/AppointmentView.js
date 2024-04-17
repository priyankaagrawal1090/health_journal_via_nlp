import React, { useState, Component, useEffect } from "react";
// import '../App.css'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import PendingAppointmentCard from "./PendingAppointmentCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP",
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
};

const fetchOpenSlots = async () => {
  const openSlots = [];
  const user = getAuth().currentUser;
  if (user) {
    const slotQuery = query(
      collection(db, "Time Slots"),
      where("doctorId", "==", user.uid)
    );
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
      openSlots.push({ id: doc.id, ...doc.data() });
    });
  }
  return openSlots;
};

const fetchBookedSlots = async () => {
  const bookedSlots = [];
  const user = getAuth().currentUser;
  if (user) {
    const slotQuery = query(
      collection(db, "Booked Time Slots"),
      where("doctorId", "==", user.uid)
    );
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
      bookedSlots.push({ id: doc.id, ...doc.data() });
    });
  }
  return bookedSlots;
};

const cancelBookedSlot = async (slotId) => {
  await deleteDoc(doc(db, "Booked Time Slots", slotId));
};

const deleteOpenSlot = async (slotId) => {
  await deleteDoc(doc(db, "Time Slots", slotId));
};

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
      <h2
        className="flex justify-center items-center"
        style={{
          marginBottom: "10px",
          padding: "10px",
          fontFamily: "Roboto, sans-serif",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Booked Slots
      </h2>
      {!hasBookedSlots && (
        <h3 className="flex justify-center items-center">
          No slots booked currently
        </h3>
      )}
      <div className="pending-appointment-view-container grid grid-cols-6 gap-1 justify-evenly flex justify-center items-center">
        {bookedSlotData.map((slot) => (
          <div className="pending-appointment-card-container">
            <Card className="w-[250px]">
              <CardHeader>
                <CardTitle>Booked Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Slot Date:</Label>
                    <p>{slot.slotDate}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{slot.startTime}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{slot.endTime}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between justify-center">
                <Button
                  onClick={async () => {
                    cancelBookedSlot(slot.id);
                    let updatedData = await fetchBookedSlots();
                    setBookedSlotData(updatedData);
                  }}
                >
                  Cancel Appointment
                </Button>
              </CardFooter>
            </Card>
            <br />
          </div>
        ))}
      </div>

      <h2
        className="flex justify-center items-center"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          borderTop: "1px solid #ccc",
          fontFamily: "Roboto, sans-serif",
          fontSize: "24px",
          fontWeight: "bold",
          padding: "10px",
        }}
      >
        Open Slots
      </h2>
      <div className="upcoming-appointment-view-container grid grid-cols-6 gap-1 justify-evenly flex justify-center items-center">
        {!hasOpenSlots && <h3>No open slots currently</h3>}
        {openSlotData.map((slot) => (
          <div className="pending-appointment-card-container">
            <Card className="w-[250px]">
              <CardHeader>
                <CardTitle>Open Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Slot Date:</Label>
                    <p>{slot.slotDate}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{slot.startTime}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{slot.endTime}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between justify-center">
                <Button
                  onClick={async () => {
                    deleteOpenSlot(slot.id);
                    let updatedData = await fetchOpenSlots();
                    setOpenSlotData(updatedData);
                  }}
                >
                  Delete Slot
                </Button>
              </CardFooter>
            </Card>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
