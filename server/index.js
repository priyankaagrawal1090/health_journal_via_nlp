const express = require('express');
const moment = require('moment');
const http = require('http');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, addDoc, getDoc, doc, collection, query, getDocs, where } = require('firebase/firestore');
const { Server } = require('socket.io');

const firebaseConfig = {
    apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
    authDomain: "mental-health-journal-2605e.firebaseapp.com",
    projectId: "mental-health-journal-2605e",
    storageBucket: "mental-health-journal-2605e.appspot.com",
    messagingSenderId: "725820602981",
    appId: "1:725820602981:web:b16539f99e4678bc51248c",
    measurementId: "G-7V9YPQPLEP"
};

const fireApp = initializeApp(firebaseConfig);
const db = getFirestore(fireApp);

const app = express();
app.use(cors);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

const fetchTimeSlots = async (slotDate) => {
    const slots = [];
    const slotQuery = query(collection(db, "Time Slots"), where("slotDate", "==", slotDate));
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
        let data = doc.data();
        data.slotId = doc.id;
        slots.push(data);
    });
    return slots;
}

const fetchDoctorById = async (doctorId) => {
    const doctorDocRef = doc(db, "Users", doctorId);
    const doctorDataSnap = await getDoc(doctorDocRef);
    if (doctorDataSnap.exists()) {
        return doctorDataSnap.data();
    }
    return null;
}

const fetchSlotsByDoctorIDAndDate = async (doctorID, date) => {
    const filteredSlots = [];
    const slotQuery = query(collection(db, "Time Slots"), where("doctorId", "==", doctorID), where("slotDate", "==", date));
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((slot) => {
        let data = slot.data();
        data.slotId = slot.id;
        filteredSlots.push(data);
    });
    return filteredSlots;
}

const fetchBookTimes = async (date, patientId) => {
    const bookedTimes = [];
    const slotQuery = query(collection(db, "Booked Time Slots"), where("slotDate", "==", date), where("userId", "==", patientId));
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((slot) => {
        let data = slot.data();
        data.slotId = slot.id;
        bookedTimes.push(data);
    });
    return bookedTimes;
}

io.on("connection", (socket) => {
    socket.on("send_message", async (data, callback) => {
        const messagesRef = collection(db, "chatbot messages");
        const messageQuery = query(messagesRef, where("message", "==", data.message));
        const messageSnapshot = await getDocs(messageQuery);
        if (messageSnapshot.empty) {
            console.log('Adding new message to database', data.message);
            const newMessage = {
                message: data.message,
                verified: false,
            }
            await addDoc(messagesRef, newMessage);
            socket.broadcast.emit("signal_update_messages");
        }
        callback({
            status: "success",
        });
    });

    socket.on("selected_appointment_date", async (data, callback) => {
        let timeSlots = await fetchTimeSlots(moment(data.selectedDate).format('YYYY-MM-DD'));
        console.log(moment(data.selectedDate).format('YYYY-MM-DD'));
        console.log(timeSlots);
        let doctors = [];
        for (let i = 0; i < timeSlots.length; i++) {
            let doctorInfo = await fetchDoctorById(timeSlots[i].doctorId);
            if (!doctors.some(doctor => doctor.firstName === doctorInfo.firstName)) {
                doctors.push(doctorInfo);
            }
        }
        socket.emit("fetch_available_doctors", { availableDoctors: doctors });
    });

    socket.on("selected_doctor_id", async (data, callback) => {
        let slots = await fetchSlotsByDoctorIDAndDate(data.doctorId, moment(data.selectedDate).format('YYYY-MM-DD'));
        console.log("OPEN DOCTOR SLOTS: ", slots);
        socket.emit("fetch_doctor_slots", {availableSlots: slots});
    });

    socket.on("selected_cancel_date", async (data, callback) => {
        let userSlots = await fetchBookTimes(data.cancelDate, data.patientId);
        socket.emit("fetch_user_booked_slots", {userSlots: userSlots});
    });
})

server.listen(4000, () => {
    console.log('Listening on port 4000');
});