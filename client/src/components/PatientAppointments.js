import React, { useState, Component, useEffect } from "react";
// import '../App.css'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { formatDate, formatTime } from "./formatutils";
import { Separator } from "./separator";
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
    const userDataPatientRef = doc(db, "Users", user.uid);
    const userDataPatientSnap = await getDoc(userDataPatientRef);
    if (userDataPatientSnap.exists()) {
      return userDataPatientSnap.data();
    } else {
      return null;
    }
  }
};

const fetchBookedAppointments = async () => {
  const bookedAppointments = [];
  const user = getAuth().currentUser;
  if (user) {
    const slotQuery = query(
      collection(db, "Booked Appointments"),
      where("patientId", "==", user.uid)
    );
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
      bookedAppointments.push({ id: doc.id, ...doc.data() });
    });
  }
  return bookedAppointments;
};

const cancelBookedAppointment = async (appointmentId) => {
  await deleteDoc(doc(db, "Booked Appointments", appointmentId));
};

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
      let data = await fetchBookedAppointments();
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
          //   fontFamily: "Roboto, sans-serif",
          //   fontSize: "24px",
          //   fontWeight: "bold",
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
                    <Label>Slot Date:</Label>
                    <p>{formatDate(appointment.appointmentDate)}</p>
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
                    cancelBookedAppointment(appointment.id);
                    let updatedData = await fetchBookedAppointments();
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
