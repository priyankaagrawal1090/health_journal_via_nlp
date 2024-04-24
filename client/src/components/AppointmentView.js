import React, { useState, Component, useEffect } from "react";
// import '../App.css'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { io } from "socket.io-client";
import { formatDate, formatTime } from "./formatutils"
import { Separator } from "./separator";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
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

const socket = io("http://localhost:4000");
const auth = getAuth();
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

const fetchPatientInfo = async (patientId) => {
  const patientDocRef = doc(db, "Users", patientId);
  const patientDataSnap = await getDoc(patientDocRef);
  if (patientDataSnap.exists()) {
    return patientDataSnap.data();
  }
  return null;
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
    slotQuerySnap.forEach(async (document) => {
      let docData = document.data();
      let currDate = new Date();
      let slotDate = new Date(docData.slotDate);
      if (currDate >= slotDate) {
        let docRef = doc(db, "Time Slots", document.id);
        await deleteDoc(docRef)
      } else {
        openSlots.push({ id: document.id, ...docData });
      }
    });
  }
  return openSlots;
};

const getAppointmentDate = (data) => {
  const dateSplit = data.slotDate.split('-');
  const startTimeSplit = data.startTime.split(':');
  console.log(dateSplit);
  const date = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[2]), parseInt(startTimeSplit[0]), parseInt(startTimeSplit[1]))
  return date;
}

const addToPastAppointments = async (apptId, data) => {
  const pastAppointmentsRef = doc(db, "Past Appointments", apptId);
  const bookedAppointmentRef = doc(db, "Booked Time Slots", apptId);
  await setDoc(pastAppointmentsRef, data);
  await deleteDoc(bookedAppointmentRef);
}

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
      let data = doc.data();
      const apptDate = getAppointmentDate(data);
      const currDate = new Date();
      if (currDate > apptDate) {
        console.log('Moving to past appointments!');
        addToPastAppointments(doc.id, data);
      } else {
        bookedSlots.push({ id: doc.id, ...data });
      }
    });
  }
  return bookedSlots;
};

const fetchPastAppointments = async (doctorId) => {
  const pastAppointments = [];
  const pastAppointmentsQuery = query(
    collection(db, "Past Appointments"),
    where("doctorId", "==", doctorId)
  );
  const pastAppointmentsQueryQuerySnap = await getDocs(pastAppointmentsQuery);
  pastAppointmentsQueryQuerySnap.forEach((doc) => {
    let data = doc.data();
    pastAppointments.push({ ...data });
  });
  return pastAppointments;
};

const cancelBookedSlot = async (slotId, userData) => {
  let slotRef = doc(db, "Booked Time Slots", slotId);
  let slotSnap = await getDoc(slotRef);
  let slotData = slotSnap.data();
  const patientInfo = await fetchPatientInfo(slotData["userId"]);
  await deleteDoc(doc(db, "Booked Time Slots", slotId));
  socket.emit("send_doctor_cancellation_email", { userInfo: patientInfo, selectedSlot: slotData, doctorInfo: userData });
};

const deleteOpenSlot = async (slotId) => {
  await deleteDoc(doc(db, "Time Slots", slotId));
};

export default function AppointmentView() {
  const [userData, setUserData] = useState({});
  const [openSlotData, setOpenSlotData] = useState([]);
  const [bookedSlotData, setBookedSlotData] = useState([]);
  const [pastAppointmentData, setPastAppointmentData] = useState([]);

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
      for (let i = 0; i < data.length; i++) {
        let patientData = await fetchPatientInfo(data[i].userId);
        data[i]["patientName"] = patientData.firstName + " " + patientData.lastName
        data[i]["patientPhone"] = patientData.pNum
      }
      setBookedSlotData(data);
    }
    fetchBookedSlotsData();
  }, []);

  useEffect(() => {
    async function fetchPastAppointmentData() {
      let data = await fetchPastAppointments(auth.currentUser.uid);
      for (let i = 0; i < data.length; i++) {
        let patientData = await fetchPatientInfo(data[i].userId);
        data[i]["patientName"] = patientData.firstName + " " + patientData.lastName
        data[i]["patientPhone"] = patientData.pNum
      }
      setPastAppointmentData(data);
    }
    fetchPastAppointmentData();
  }, []);

  useEffect(() => {
    async function fetchOpenSlotsData() {
      let data = await fetchOpenSlots();
      setOpenSlotData(data);
    }
    fetchOpenSlotsData();
  }, []);

  const hasBookedSlots = bookedSlotData.length !== 0;
  const hasPastAppointments = pastAppointmentData.length !== 0;
  const hasOpenSlots = openSlotData.length !== 0;

  return (
    <div className="appointment-view-container">
      <h2
        className="text-3xl font-medium leading-none flex justify-center items-center"
        style={{
          paddingTop: "20px",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        Booked Slots
      </h2>
      <Separator className="my-4" />
      {!hasBookedSlots && (
        <h3 className="flex justify-center items-center">
          No slots booked currently
        </h3>
      )}
      <div className="ml-64 px-2 pending-appointment-view-container grid grid-cols-5 gap-1 justify-evenly flex justify-center items-center">
        {bookedSlotData.map((slot) => (
          <div className="pending-appointment-card-container">
            <Card className="w-[250px]">
              <CardHeader>
                <CardTitle>Booked Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Patient Name:</Label>
                    <p>{slot.patientName}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Patient Phone:</Label>
                    <p>{slot.patientPhone}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Slot Date:</Label>
                    <p>{formatDate(slot.slotDate)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{formatTime(slot.startTime)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{formatTime(slot.endTime)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between justify-center">
                <Button
                  onClick={async () => {
                    cancelBookedSlot(slot.id, userData);
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
        className="text-3xl font-medium leading-none flex justify-center items-center"
        style={{
          marginTop: "10px",
          paddingTop: "20px",
          marginBottom: "20px",
          padding: "10px",
        }}
      >
        Open Slots
      </h2>
      <Separator className="my-4" />
      <div className="ml-64 px-2 upcoming-appointment-view-container grid grid-cols-6 gap-1 justify-evenly flex justify-center items-center">
        {!hasOpenSlots && <h3 className="flex justify-center items-center">No open slots currently</h3>}
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
                    <p>{formatDate(slot.slotDate)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{formatTime(slot.startTime)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{formatTime(slot.endTime)}</p>
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
      <h2
        className="text-3xl font-medium leading-none flex justify-center items-center"
        style={{
          paddingTop: "20px",
          marginBottom: "10px",
          padding: "10px",
        }}
      >
        Past Appointments
      </h2>
      <Separator className="my-4" />
      {!hasPastAppointments && (
        <h3 className="flex justify-center items-center">
          No past appointments to view
        </h3>
      )}
      <div className="ml-64 px-2 pending-appointment-view-container grid grid-cols-5 gap-1 justify-evenly flex justify-center items-center">
        {pastAppointmentData.map((slot) => (
          <div className="pending-appointment-card-container">
            <Card className="w-[250px]">
              <CardHeader>
                <CardTitle>Past Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Patient Name:</Label>
                    <p>{slot.patientName}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Patient Phone:</Label>
                    <p>{slot.patientPhone}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Slot Date:</Label>
                    <p>{formatDate(slot.slotDate)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{formatTime(slot.startTime)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{formatTime(slot.endTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}
