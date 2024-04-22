import React, { useState, Component, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { io } from "socket.io-client";
import { formatDate, formatTime } from "./formatutils";
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
  addDoc,
} from "firebase/firestore";
import {
  Card,
  CardContent,
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
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

const fetchUserData = async () => {
  const user = getAuth().currentUser;
  if (user) {
    const userDataPatientRef = doc(db, "Users", user.uid);
    const userDataPatientSnap = await getDoc(userDataPatientRef);
    if (userDataPatientSnap.exists()) {
      return userDataPatientSnap.data();
    } else {
      return null;
    }
  }
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

const fetchUserAppointments = async (userId) => {
  const patientAppointments = [];
  const patientTimeSlotsQuery = query(
    collection(db, "Booked Time Slots"),
    where("userId", "==", userId)
  );
  const patientTimeSlotsQuerySnap = await getDocs(patientTimeSlotsQuery);
  patientTimeSlotsQuerySnap.forEach((doc) => {
    let data = doc.data();
    const apptDate = getAppointmentDate(data);
    console.log(apptDate);
    const currDate = new Date();
    if (currDate > apptDate) {
      console.log('Moving to past appointments!');
      addToPastAppointments(doc.id, data);
    } else {
      patientAppointments.push(data);
    }
  });
  return patientAppointments;
};

const cancelBookedAppointment = async (appointmentId) => {
  await deleteDoc(doc(db, "Booked Appointments", appointmentId));
};

const fetchDoctorInfo = async (doctorId) => {
  const doctorDocRef = doc(db, "Users", doctorId);
  const doctorDataSnap = await getDoc(doctorDocRef);
  if (doctorDataSnap.exists()) {
    return doctorDataSnap.data();
  }
  return null;
}

const cancelAppointment = async (selectedSlot, userData) => {
  let doctorInfo = await fetchDoctorInfo(selectedSlot['doctorId']);
  delete selectedSlot["userId"];
  await setDoc(
    doc(db, "Time Slots", selectedSlot.slotId),
    selectedSlot
  );
  await deleteDoc(doc(db, "Booked Time Slots", selectedSlot.slotId));
  socket.emit("send_patient_cancellation_email", { recipient: auth.currentUser.email, userInfo: userData, selectedSlot: selectedSlot, doctorInfo: doctorInfo });
}

export default function PatientAppointments() {
  const [userData, setUserData] = useState({});
  const [bookedAppointmentData, setBookedAppointmentData] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      let data = await fetchUserData();
      setUserData(data);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchBookedAppointmentsData() {
      let data = await fetchUserAppointments(auth.currentUser.uid);
      for (let i = 0; i < data.length; i++) {
        let doctorData = await fetchDoctorInfo(data[i].doctorId);
        data[i]["doctorName"] = doctorData.firstName + " " + doctorData.lastName
        data[i]["doctorPhone"] = doctorData.pNum
      }
      setBookedAppointmentData(data);
    }
    fetchBookedAppointmentsData();
  }, []);

  const hasBookedAppointments = bookedAppointmentData.length != 0;

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
        Booked Appointments
      </h2>
      <Separator className="my-4" />
      {!hasBookedAppointments && (
        <h3 className="flex justify-center items-center">
          No appointments booked currently
        </h3>
      )}
      <div className="ml-64 px-2 appointment-view-container grid grid-cols-5 gap-1 justify-evenly flex justify-center items-center">
        {bookedAppointmentData.map((appointment) => (
          <div className="appointment-card-container">
            <Card className="w-[250px]">
              <CardHeader>
                <CardTitle>Booked Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label>Doctor Name:</Label>
                    <p>{appointment.doctorName}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Doctor Phone:</Label>
                    <p>{appointment.doctorPhone}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Slot Date:</Label>
                    <p>{formatDate(appointment.slotDate)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>Start Time:</Label>
                    <p>{formatTime(appointment.startTime)}</p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label>End Time:</Label>
                    <p>{formatTime(appointment.endTime)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between justify-center">
                <Button
                  onClick={async () => {
                    await cancelAppointment(appointment, userData);
                    let updatedData = await fetchUserAppointments(auth.currentUser.uid);
                    setBookedAppointmentData(updatedData);
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
    </div>
  );
}
