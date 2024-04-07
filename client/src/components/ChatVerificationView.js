import React, { useState, Component, useEffect } from 'react';
import { io } from 'socket.io-client';
import { getFirestore, collection, getDocs, doc, query, where, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Alert, AlertDescription, AlertTitle } from "./alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button"
import { ScrollArea } from "./scroll-area";
import { BotMessageSquare } from "lucide-react";

const socket = io('http://localhost:4000');
const db = getFirestore();
const auth = getAuth();

const fetchUnverifiedMessages = async () => {
    const user = auth.currentUser;
    const unverifiedMessages = [];
    if (user) {
        const messageQuery = query(collection(db, "chatbot messages"), where("verified", "==", false));
        const messageQuerySnap = await getDocs(messageQuery);
        messageQuerySnap.forEach((doc) => {
            unverifiedMessages.push({ id: doc.id, ...doc.data() });
        });
        return unverifiedMessages;
    }
}

const verifyMessageById = async (id) => {
    const user = auth.currentUser;
    if (user) {
        const messageToUpdate = doc(db, "chatbot messages", id);
        await updateDoc(messageToUpdate, { verified: true });
    }
}

export default function ChatVerificationView() {
    const [unverifiedMessages, setUnverifiedMessages] = useState([]);
    useEffect(() => {
        const getMessages = async () => {
            const currMessages = await fetchUnverifiedMessages();
            setUnverifiedMessages(currMessages);
        }
        getMessages();
    }, []);

    useEffect(() => {
        socket.on("signal_update_messages", async () => {
            const updateMessages = await fetchUnverifiedMessages();
            setUnverifiedMessages(updateMessages);
            console.log(unverifiedMessages);
        })
    }, [socket])
    return (
        <div className="message-container ml-64 h-screen">
            <div className="chat-messages flex justify-center h-3/4">
                <ScrollArea className="mt-10 h-4/5 w-4/5">
                    {unverifiedMessages.map((message) => (
                        <div className='pending-message-verification-container'>
                            <Alert className="w-2/4 mt-5">
                                <BotMessageSquare className="h-4 w-4" />
                                <AlertTitle>Unverified Message</AlertTitle>
                                <AlertDescription>
                                    {message.message}
                                </AlertDescription>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild className="ml-6 mt-2">
                                        <Button variant="outline" className="pr-6">Verify Message</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Please double check to make sure you would like to verify this message.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={async () => {
                                                await verifyMessageById(message.id);
                                                const updateMessages = await fetchUnverifiedMessages();
                                                setUnverifiedMessages(updateMessages);
                                            }}>Verify Message</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Alert>
                            <br />
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div >
    );
}