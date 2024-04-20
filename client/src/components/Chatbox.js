import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import "../App.css";
import { initializeApp } from "firebase/app";
import moment from "moment";
import { formatDate, formatTime } from "./formatutils";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import Typewriter from "typewriter-effect";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Send, BotMessageSquare } from "lucide-react";
import { ScrollArea } from "./scroll-area";

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

const Chatbox = (props) => {
  const [messages, setMessages] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const [filteredTimeSlots, setFilteredTimeSlots] = useState([]);
  const [doctorsForSelectedDate, setDoctorsForSelectedDate] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctorID, setSelectedDoctorID] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const [isCancelAppointment, setIsCancelAppointment] = useState(false);

  useEffect(() => {
    socket.on("fetch_available_doctors", async (data) => {
      setDoctorsForSelectedDate(data.availableDoctors);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("fetch_doctor_slots", async (data) => {
      setFilteredTimeSlots(data.availableSlots);
      console.log(filteredTimeSlots);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("fetch_user_booked_slots", async (data) => {
      setFilteredTimeSlots(data.userSlots);
    });
  }, [socket]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const resetState = () => {
    setEnabledDates([]);
    setFilteredTimeSlots([]);
    setDoctorsForSelectedDate([]);
    setSelectedDate("");
    setSelectedDoctorID("");
    setSelectedSlotId("");
  };

  const validateBookAppointmentFields = () => {
    return selectedDoctorID !== "" && selectedSlotId !== "";
  };

  const validateCancelAppointmentFields = () => {
    return selectedDate !== "" && selectedSlotId !== "";
  };

  const fetchAvailableDates = async () => {
    const slotDates = [];
    const slotDateQuery = query(collection(db, "Time Slots"));
    const slotDateQuerySnap = await getDocs(slotDateQuery);
    slotDateQuerySnap.forEach((doc) => {
      let data = doc.data();
      if (!slotDates.includes(data.slotDate)) {
        slotDates.push(data.slotDate);
      }
    });
    return slotDates;
  };

  const fetchBookedDates = async (userId) => {
    const slotDates = [];
    const slotDateQuery = query(
      collection(db, "Booked Time Slots"),
      where("userId", "==", userId)
    );
    const slotDateQuerySnap = await getDocs(slotDateQuery);
    slotDateQuerySnap.forEach((doc) => {
      let data = doc.data();
      if (!slotDates.includes(data.slotDate)) {
        slotDates.push(data.slotDate);
      }
    });
    return slotDates;
  };

  const fetchDoctorById = async (doctorId) => {
    const doctorDocRef = doc(db, "Users", doctorId);
    const doctorDataSnap = await getDoc(doctorDocRef);
    if (doctorDataSnap.exists()) {
      return doctorDataSnap.data();
    }
    return null;
  };

  const fetchResources = async (userInput) => {
    let response = await axios.post("http://192.168.1.5:5000/process_query", {
      query: userInput,
    });
    let top_5_links = response.data.links.slice(0, 5);
    let top5linkstr = "";
    for (let i = 0; i < top_5_links.length; i++) {
      top5linkstr += top_5_links[i];
      if (i != top_5_links.length - 1) {
        top5linkstr += "\n\n";
      }
    }
    return top5linkstr;
  };

  const fetchUserAppointments = async (userId) => {
    const patientAppointments = [];
    const patientTimeSlotsQuery = query(
      collection(db, "Booked Time Slots"),
      where("userId", "==", userId)
    );
    const patientTimeSlotsQuerySnap = await getDocs(patientTimeSlotsQuery);
    patientTimeSlotsQuerySnap.forEach((doc) => {
      let data = doc.data();
      patientAppointments.push(data);
    });
    return patientAppointments;
  };

  const dateMatcher = (date) => {
    return !enabledDates.includes(moment(date).format("YYYY-MM-DD"));
  };

  const fetchChatbotMessage = async (message) => {
    const chatbotMessages = [];
    const chatbotMessageQuery = query(
      collection(db, "chatbot messages"),
      where("message", "==", message)
    );
    const chatbotMessageQuerySnap = await getDocs(chatbotMessageQuery);
    chatbotMessageQuerySnap.forEach((doc) => {
      let data = doc.data();
      chatbotMessages.push(data);
    });
    return chatbotMessages;
  };

  const fetchChatResponse = async (userQuestion) => {
    let response = await axios.post(
      "http://192.168.1.5:5000/chatresponse",
      userQuestion
    ).catch((error) => {
      console.log(error)
    })
    return response.data.chat_response;
  };

  const fetchUserIntent = async (userQuestion) => {
    let response = await axios
      .post("http://192.168.1.5:5000/userintent", userQuestion)
      .catch((error) => {
        console.log(error);
      });
    console.log(response);
    let labels = response.data.user_intent;
    labels.sort((a, b) => b.score - a.score);
    return labels[0].label;
  };

  useEffect(() => {
    console.log("Messages Updated: ", messages);
  }, [messages]);

  const handleSendMessage = async () => {
    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    setMessages((prevMessages) => {
      return [...prevMessages, { text: userInput, user: "You" }];
    });
    setUserInput("");

    const userQuestion = new FormData();
    userQuestion.append("prompt", userInput);
    let userIntent = await fetchUserIntent(userQuestion);
    if (isBookingAppointment || isCancelAppointment) {
      resetState();
      setIsBookingAppointment(false);
      setIsCancelAppointment(false);
    }
    if (userIntent === "chat" || userIntent === "question") {
      let chatResponse = await fetchChatResponse(userQuestion);
      socket.emit(
        "send_message",
        { message: chatResponse.replace(/\n/g, "") },
        async (response) => {
          if (response.status == "success") {
            let chatbotMessages = await fetchChatbotMessage(
              chatResponse.replace(/\n/g, "")
            );
            let chatbotMessage = chatbotMessages[0];
            setMessages((prevMessages) => {
              return [
                ...prevMessages,
                {
                  text: chatResponse,
                  user: "bot",
                  verified: chatbotMessage.verified,
                  userIntent: "chat",
                },
              ];
            });
          }
        }
      );
    } else if (userIntent === "search for resources") {
      let urls = await fetchResources(userInput);
      socket.emit("send_message", { message: urls }, async (response) => {
        console.log("Emitted successfully");
        if (response.status == "success") {
          let chatbotMessages = await fetchChatbotMessage(urls);
          let chatbotMessage = chatbotMessages[0];
          console.log("URLS: ", chatbotMessage);
          setMessages((prevMessages) => {
            return [
              ...prevMessages,
              {
                text: chatbotMessage.message,
                user: "bot",
                verified: chatbotMessage.verified,
                userIntent: "search",
              },
            ];
          });
        }
      });
    } else if (userIntent === "view appointments") {
      let patientAppointments = await fetchUserAppointments(props.userId);
      let patientApptInfo = [
        {
          text: `You currently have ${patientAppointments.length} upcoming appointments`,
          user: "bot",
          userIntent: "view",
        },
      ];
      for (let i = 0; i < patientAppointments.length; i++) {
        let doctorInfo = await fetchDoctorById(patientAppointments[i].doctorId);
        patientAppointments[i].doctorEmail = doctorInfo.email;
        patientAppointments[i].doctorFName = doctorInfo.firstName;
        patientAppointments[i].doctorLName = doctorInfo.lastName;
        let apptInfoStr =
          "You have an appointment with Dr. " +
          doctorInfo.firstName +
          " " +
          doctorInfo.lastName +
          " on " +
          formatDate(patientAppointments[i].slotDate) +
          " from " +
          formatTime(patientAppointments[i].startTime) +
          " to " +
          formatTime(patientAppointments[i].endTime);
        patientApptInfo.push({
          text: apptInfoStr,
          user: "bot",
          userIntent: "view",
        });
      }
      setMessages((prevMessages) => {
        return [...prevMessages, ...patientApptInfo];
      });
    } else if (userIntent == "cancel appointment") {
      let enabledDates = await fetchBookedDates(props.userId);
      setIsCancelAppointment(true);
      setEnabledDates(enabledDates);
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            text: "I would be glad to assist you in cancelling an appointment!",
            user: "bot",
            userIntent: "cancel",
          },
        ];
      });
    } else {
      let enabledDates = await fetchAvailableDates();
      setIsBookingAppointment(true);
      setEnabledDates(enabledDates);
      console.log(enabledDates);
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            text: "I would be glad to assist you in booking an appointment! What date would you like to book for?",
            user: "bot",
            userIntent: "book",
          },
        ];
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    let verificationMessage = "";
    if (
      message.user == "bot" &&
      message.verified &&
      (message.userIntent == "chat" || message.userIntent == "search")
    ) {
      verificationMessage +=
        "<br><br><span>Message Verified by Medical Professional</span>";
    } else if (
      message.user == "bot" &&
      !message.verified &&
      (message.userIntent == "chat" || message.userIntent == "search")
    ) {
      verificationMessage +=
        "<br><br><span>Message NOT Verified by Medical Professional</span>";
    } else {
      return message.text;
    }

    if (message.userIntent == "search") {
      let responseMessage = message.text.split("\n\n");
      let outputMessage = "";
      for (let i = 0; i < responseMessage.length; i++) {
        outputMessage += responseMessage[i] + "<br>";
      }
      return (
        <div>
          <Typewriter
            options={{ delay: 30, cursor: "" }}
            onInit={(typewriter) => {
              typewriter
                .typeString(outputMessage)
                .start()
                .typeString(verificationMessage)
                .start();
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <Typewriter
          options={{ delay: 30, cursor: "" }}
          onInit={(typewriter) => {
            typewriter
              .typeString(message.text)
              .start()
              .typeString(verificationMessage)
              .start();
          }}
        />
      </div>
    );
  };

  const renderMessages = () => {
    return messages.map((message, index) => (
      <div
        className={
          "flex " + (message.user == "bot" ? "justify-start" : "justify-end")
        }
      >
        <Alert key={index} className="w-2/4 mt-5">
          <BotMessageSquare className="h-4 w-4" />
          <AlertTitle>{message.user}</AlertTitle>
          <AlertDescription>{renderMessage(message)}</AlertDescription>
        </Alert>
      </div>
    ));
  };

  const renderCancelAppointment = () => {
    return (
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Cancel Appointment</CardTitle>
            <CardDescription>Cancel an appointment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Appointment Date</Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedDate(value);
                      setFilteredTimeSlots([]);
                      setSelectedSlotId("");
                      console.log(value);
                      console.log(props.userId);
                      socket.emit("selected_cancel_date", {
                        cancelDate: value,
                        patientId: props.userId,
                      });
                    }}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {enabledDates.map((date) => (
                        <SelectItem value={date}>{formatDate(date)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Doctors</Label>
                  <Select
                    onValueChange={(value) => {
                      setSelectedSlotId(value);
                      console.log(value);
                    }}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {filteredTimeSlots.map((slot) => (
                        <SelectItem value={slot.slotId}>
                          {"Start Time: " +
                            formatTime(slot.startTime) +
                            " End Time: " +
                            formatTime(slot.endTime)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                resetState();
                setIsCancelAppointment(false);
              }}
            >
              Cancel
            </Button>
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={!validateCancelAppointmentFields()}
                onClick={async () => {
                  setLoading(true);
                  let selectedSlot = filteredTimeSlots.filter(
                    (slot) => slot.slotId === selectedSlotId
                  );
                  delete selectedSlot[0]["userId"];
                  await setDoc(
                    doc(db, "Time Slots", selectedSlotId),
                    selectedSlot[0]
                  );
                  await deleteDoc(doc(db, "Booked Time Slots", selectedSlotId));
                  setIsCancelAppointment(false);
                  setMessages((prevMessages) => {
                    return [
                      ...prevMessages,
                      {
                        text: "Thank you for allowing us to help you cancel your appointment! Have a great day!",
                        user: "bot",
                      },
                    ];
                  });
                  setUserInput("");
                  resetState();
                  setLoading(false);
                }}
              >
                Cancel Appointment
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderBookAppointment = () => {
    return (
      <div>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>Book a new appointment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Appointment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        disabled={dateMatcher}
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate);
                          setSelectedDoctorID("");
                          setDoctorsForSelectedDate([]);
                          setFilteredTimeSlots([]);
                          setSelectedSlotId("");
                          socket.emit("selected_appointment_date", {
                            selectedDate: selectedDate,
                          });
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Doctors</Label>
                  <Select
                    value={selectedDoctorID}
                    onValueChange={(value) => {
                      setSelectedDoctorID(value);
                      console.log(value);
                      socket.emit("selected_doctor_id", {
                        doctorId: value,
                        selectedDate: date,
                      });
                    }}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {doctorsForSelectedDate.map((doctor) => (
                        <SelectItem key={doctor.uid} value={doctor.uid}>
                          {"Dr. " + doctor.firstName + " " + doctor.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="framework">Time Slot</Label>
                  <Select
                    onValueChange={(slotId) => {
                      setSelectedSlotId(slotId);
                      console.log(slotId);
                    }}
                  >
                    <SelectTrigger id="framework">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {filteredTimeSlots.map((slot) => (
                        <SelectItem key={slot.slotId} value={slot.slotId}>
                          {"Start: " +
                            formatTime(slot.startTime) +
                            " " +
                            "End: " +
                            formatTime(slot.endTime)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                resetState();
                setIsBookingAppointment(false);
              }}
            >
              Cancel
            </Button>
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                disabled={!validateBookAppointmentFields()}
                onClick={async () => {
                  setLoading(true);
                  let userId = props.userId;
                  let doctorInfo = await fetchDoctorById(selectedDoctorID);
                  let selectedSlot = filteredTimeSlots.filter((slot) => {
                    return slot.slotId === selectedSlotId;
                  });
                  selectedSlot[0].userId = userId;
                  // add updated slot to "booked time slots"
                  await setDoc(
                    doc(db, "Booked Time Slots", selectedSlotId),
                    selectedSlot[0]
                  );
                  // remove slot from "time slots" collection
                  await deleteDoc(doc(db, "Time Slots", selectedSlotId));
                  resetState();
                  setIsBookingAppointment(false);
                  let updateMessages = [
                    ...messages,
                    {
                      text: `Thank you for booking an appointment! You are all set for your appointment on ${formatDate(
                        selectedSlot[0].slotDate
                      )} with ${
                        "Dr. " +
                        doctorInfo.firstName +
                        " " +
                        doctorInfo.lastName
                      } from ${
                        formatTime(selectedSlot[0].startTime) +
                        " to " +
                        formatTime(selectedSlot[0].endTime)
                      }`,
                      user: "bot",
                    },
                  ];
                  setMessages(updateMessages);
                  setUserInput("");
                  setLoading(false);
                }}
              >
                Book Appointment
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="chat-container ml-64 h-screen">
      <div className="chat-messages flex justify-center h-3/4">
        <ScrollArea className="mt-10 h-4/5 w-4/5">
          {renderMessages()}
          <br />
          {isCancelAppointment && renderCancelAppointment()}
          {isBookingAppointment && renderBookAppointment()}
        </ScrollArea>
      </div>
      <center>
        <div className="chat-input flex justify-center bottom-0">
          <Input
            className="w-80 mt-40"
            type="text"
            placeholder="Type a message..."
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          ></Input>
          <Button className="ml-2 mt-40" onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </center>
    </div>
  );
};

export default Chatbox;
