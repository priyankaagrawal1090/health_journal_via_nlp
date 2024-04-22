const express = require('express');
const moment = require('moment');
const http = require('http');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { initializeApp } = require('firebase/app');
const { getFirestore, addDoc, getDoc, doc, collection, query, getDocs, where } = require('firebase/firestore');
const { Server } = require('socket.io');
let env = require('dotenv').config()

const firebaseConfig = {
    apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
    authDomain: "mental-health-journal-2605e.firebaseapp.com",
    projectId: "mental-health-journal-2605e",
    storageBucket: "mental-health-journal-2605e.appspot.com",
    messagingSenderId: "725820602981",
    appId: "1:725820602981:web:b16539f99e4678bc51248c",
    measurementId: "G-7V9YPQPLEP"
};

// ENTER YOUR OWN CREDENTIALS IN ENV FILE
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PWRD
    }
});

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


const formatDate = (date) => {
    const dateObj = date.split('-');
    return dateObj[1] + "/" + dateObj[2] + "/" + dateObj[0];
}

const formatTime = (time) => {
    const timeObj = time.split(':');
    const hours = parseInt(timeObj[0]);
    if (hours > 12) {
        return (hours - 12) + ":" + timeObj[1] + " PM"
    } else {
        return hours + ":" + timeObj[1] + " AM"
    }
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
        const messageQuery = query(messagesRef, where("question", "==", data.question));
        const messageSnapshot = await getDocs(messageQuery);
        if (messageSnapshot.empty) {
            console.log('Adding new message to database', data.message);
            const newMessage = {
                question: data.question,
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
        socket.emit("fetch_doctor_slots", { availableSlots: slots });
    });

    socket.on("selected_cancel_date", async (data, callback) => {
        let userSlots = await fetchBookTimes(data.cancelDate, data.patientId);
        socket.emit("fetch_user_booked_slots", { userSlots: userSlots });
    });

    socket.on("send_confirmation_email", (data, callback) => {
        const patientMailDetails = {
            from: 'ganeshsusarla01@gmail.com',
            to: data.recipient,
            subject: 'Appointment Booking Confirmation',
            html: `<h1>Appointment Confirmation</h1>
            <p>This is a confirmation email for your recent appointment booking. Thank you for using Health Journal!</p>
            <p>Doctor Name: ${data.doctorInfo.firstName + " " + data.doctorInfo.lastName} </p>
            <p>Doctor Phone Number: ${data.doctorInfo.pNum}</p>
            <p>Appointment Date: ${formatDate(data.selectedSlot.slotDate)}</p>
            <p>Appointment Start Time: ${formatTime(data.selectedSlot.startTime)}</p>
            <p>Appointment End Time: ${formatTime(data.selectedSlot.endTime)}</p>
            <br>
            <p>Please be prepared to receive a call from your doctor by phone on the day of your appointment.</p>
            <br>
            <p>Thank you,</p>
            <p>Health Journal Team</p>`,
        }

        const doctorMailDetails = {
            from: 'ganeshsusarla01@gmail.com',
            to: data.doctorInfo.email,
            subject: 'Appointment Booking Confirmation',
            html: `<h1>Appointment Booked!</h1>
            <p>This is a confirmation email to notify that you that one of your appointment slots has been booked.</p>
            <p>Patient Name: ${data.userInfo.firstName + " " + data.userInfo.lastName} </p>
            <p>Patient Phone Number: ${data.userInfo.pNum}</p>
            <p>Appointment Date: ${formatDate(data.selectedSlot.slotDate)}</p>
            <p>Appointment Start Time: ${formatTime(data.selectedSlot.startTime)}</p>
            <p>Appointment End Time: ${formatTime(data.selectedSlot.endTime)}</p>
            <br>
            <p>Please be prepared to call your patient by phone on the day of your appointment.</p>
            <br>
            <p>Thank you,</p>
            <p>Health Journal Team</p>`,
        }

        transporter.sendMail(patientMailDetails, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info.response);
            }
        });

        transporter.sendMail(doctorMailDetails, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info.response);
            }
        });
    });
    socket.on("send_patient_cancellation_email", (data, callback) => {
        const patientMailDetails = {
            from: 'ganeshsusarla01@gmail.com',
            to: data.recipient,
            subject: 'Appointment Cancel Confirmation',
            html: `<h1>Appointment Cancellation</h1>
            <p>This is a confirmation email to notify you that your appointment on ${formatDate(data.selectedSlot.slotDate)} with Dr. ${data.doctorInfo.firstName + " " + data.doctorInfo.lastName} from ${formatTime(data.selectedSlot.startTime)} to ${formatTime(data.selectedSlot.endTime)} has been cancelled.</p>
            <br>
            <p>Thank you,</p>
            <p>Health Journal Team</p>`,
        }

        const doctorMailDetails = {
            from: 'ganeshsusarla01@gmail.com',
            to: data.doctorInfo.email,
            subject: 'Appointment Cancellation',
            html: `<h1>Appointment Canceled</h1>
            <p>This is a confirmation email to notify you that your appointment on ${formatDate(data.selectedSlot.slotDate)} with ${data.userInfo.firstName + " " + data.userInfo.lastName} from ${formatTime(data.selectedSlot.startTime)} to ${formatTime(data.selectedSlot.endTime)} has been cancelled.</p>
            <br>
            <p>Thank you,</p>
            <p>Health Journal Team</p>`,
        }

        transporter.sendMail(patientMailDetails, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info.response);
            }
        });

        transporter.sendMail(doctorMailDetails, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info.response);
            }
        });
    });

    socket.on("send_doctor_cancellation_email", (data, callback) => {
        const patientMailDetails = {
            from: 'ganeshsusarla01@gmail.com',
            to: data.userInfo.email,
            subject: 'Appointment Cancel Notification',
            html: `<h1>Appointment Cancellation</h1>
            <p>This email is to notify you that your appointment on ${formatDate(data.selectedSlot.slotDate)} with Dr. ${data.doctorInfo.firstName + " " + data.doctorInfo.lastName} from ${formatTime(data.selectedSlot.startTime)} to ${formatTime(data.selectedSlot.endTime)} has been cancelled.</p>
            <br>
            <p>Thank you,</p>
            <p>Health Journal Team</p>`,
        }

        transporter.sendMail(patientMailDetails, (err, info) => {
            if (err) {
                console.log(err)
            } else {
                console.log(info.response);
            }
        });
    });

})

server.listen(4000, () => {
    console.log('Listening on port 4000');
});