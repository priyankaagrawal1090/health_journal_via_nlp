const express = require('express');
const http = require('http');
const cors = require('cors');
const { initializeApp } = require('firebase/app');
const { getFirestore, addDoc, collection, query, getDocs, where } = require('firebase/firestore');
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

io.on("connection", (socket) => {
    socket.on("send_message", async (data, callback) => {
        const messagesRef = collection(db, "chatbot messages");
        const messageQuery = query(messagesRef, where("message", "==", data.message));
        const messageSnapshot = await getDocs(messageQuery);
        if(messageSnapshot.empty) {
            console.log('Adding new message to database');
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
})

server.listen(4000, () => {
    console.log('Listening on port 4000');
});