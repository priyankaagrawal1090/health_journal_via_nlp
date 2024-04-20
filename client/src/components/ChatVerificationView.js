import React, { useState, Component, useEffect } from "react";
import { io } from "socket.io-client";
import { Separator } from "./separator";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
import { Label } from "./label";
import { Textarea } from "./textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { BotMessageSquare } from "lucide-react";
import { getOverflowOptions } from "antd/es/_util/placements";

const socket = io("http://localhost:4000");
const db = getFirestore();
const auth = getAuth();

const fetchUnverifiedMessages = async () => {
  const user = auth.currentUser;
  const unverifiedMessages = [];
  if (user) {
    const messageQuery = query(
      collection(db, "chatbot messages"),
      where("verified", "==", false)
    );
    const messageQuerySnap = await getDocs(messageQuery);
    messageQuerySnap.forEach((doc) => {
      unverifiedMessages.push({ id: doc.id, ...doc.data() });
    });
    return unverifiedMessages;
  }
};

const verifyMessageById = async (id) => {
  const user = auth.currentUser;
  if (user) {
    const messageToUpdate = doc(db, "chatbot messages", id);
    await updateDoc(messageToUpdate, { verified: true });
  }
};

const editMessageAndVerifyById = async (newMessage, id) => {
  const messageToUpdate = doc(db, "chatbot messages", id);  
  await updateDoc(messageToUpdate, { message: newMessage, verified: true });
}

export default function ChatVerificationView() {
  const [unverifiedMessages, setUnverifiedMessages] = useState([]);
  const [editUnverifiedMessage, setEditUnverifiedMessage] = useState("");
  useEffect(() => {
    const getMessages = async () => {
      const currMessages = await fetchUnverifiedMessages();
      setUnverifiedMessages(currMessages);
    };
    getMessages();
  }, []);

  useEffect(() => {
    socket.on("signal_update_messages", async () => {
      const updateMessages = await fetchUnverifiedMessages();
      setUnverifiedMessages(updateMessages);
      console.log(unverifiedMessages);
    });
  }, [socket]);

  return (
    <div className="verify-message-container">
      <h2
        className="text-3xl font-medium leading-none flex justify-center items-center"
        style={{
          marginBottom: "10px",
          paddingTop: "20px",
          padding: "10px",
          //   fontFamily: "Roboto, sans-serif",
          //   fontSize: "24px",
          //   fontWeight: "bold",
        }}
      >
        Verify Chatbot Messages
      </h2>

      <Separator className="my-4" />

      <div
        className="message-container ml-64 flex items-center justify-center"
        style={{ paddingLeft: "50px" }}
      >
        <div
          className="chat-messages flex justify-center h-3/4"
        //   style={{ display: "flex", flexDirection: "column" }}
        >
          <ScrollArea
            className="mt-10 h-4/5 w-4/5"
            style={{ flex: 1, overflowY: "auto", padding: "10px" }}
          >
            {unverifiedMessages.map((message) => (
              <div className="pending-message-verification-container">
                <Alert className="w-2/4 mt-5">
                  <BotMessageSquare className="h-4 w-4" />
                  <AlertTitle>Unverified Message</AlertTitle>
                  <AlertDescription>{message.message}</AlertDescription>
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="ml-6 mt-2">
                      <Button variant="outline" className="pr-6">
                        Verify Message
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please double check to make sure you would like to
                          verify this message.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            await verifyMessageById(message.id);
                            const updateMessages =
                              await fetchUnverifiedMessages();
                            setUnverifiedMessages(updateMessages);
                          }}
                        >
                          Verify Message
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="ml-6 mt-2">
                      <Button onClick={() => {
                        setEditUnverifiedMessage(message.message);
                        console.log(editUnverifiedMessage);
                      }} variant="outline" className="pr-6">
                        Edit Message
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Edit Chatbot Response
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          You can edit the chatbot response to correct it, or add information.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Chatbot Response
                          </Label>
                          <Textarea
                            id="name"
                            value={editUnverifiedMessage}
                            onChange={(e) => {
                              setEditUnverifiedMessage(e.target.value)
                            }}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            await editMessageAndVerifyById(editUnverifiedMessage, message.id);
                            const updateMessages = await fetchUnverifiedMessages();
                            setUnverifiedMessages(updateMessages);
                          }}
                        >
                          Save Changes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Alert>
                <br />
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
