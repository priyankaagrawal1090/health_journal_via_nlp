import React, { useState, Component, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { io } from "socket.io-client";
import { formatDate, formatTime } from "./formatutils";
import moment from "moment";
import { format } from "date-fns";
import { Separator } from "./separator";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./avatar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";
import { useToast } from "./use-toast";
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    setDoc,
    doc,
    deleteDoc,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
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
const auth = getAuth();

const fetchAvailableDatesForDoctor = async (doctorId) => {
    const slotDates = [];
    const slotDateQuery = query(collection(db, "Time Slots"), where("doctorId", "==", doctorId));
    const slotDateQuerySnap = await getDocs(slotDateQuery);
    slotDateQuerySnap.forEach((doc) => {
        let data = doc.data();
        if (!slotDates.includes(data.slotDate)) {
            slotDates.push(data.slotDate);
        }
    });
    return slotDates;
};

export default function ViewDoctors() {
    const [enabledDates, setEnabledDates] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [date, setDate] = useState(new Date());

    const [doctorOpenSlots, setDoctorOpenSlots] = useState([]);
    const [selectedSlotId, setSelectedSlotId] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [userData, setUserData] = useState({});

    const dateMatcher = (date) => { return !enabledDates.includes(moment(date).format("YYYY-MM-DD")); };
    const doctorQuery = query(collection(db, "Users"), where("userType", "==", "doctor"));
    const { toast } = useToast();
    
    const validateBookAppointmentFields = () => {
        return selectedSlotId !== "";
    };

    const fetchDoctorById = async (doctorId) => {
        const doctorDocRef = doc(db, "Users", doctorId);
        const doctorDataSnap = await getDoc(doctorDocRef);
        if (doctorDataSnap.exists()) {
            return doctorDataSnap.data();
        }
        return null;
    };

    useEffect(() => {
        onSnapshot(doctorQuery, (querySnap) => {
            let docs = []
            querySnap.docs.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            setDoctors(docs);
        })
    }, [])

    useEffect(() => {
        async function fetchUser() {
            let data = await fetchUserData();
            setUserData(data);
        }
        fetchUser();
    }, []);

    useEffect(() => {
        socket.on("fetch_doctor_slots", async (data) => {
            setDoctorOpenSlots(data.availableSlots);
            console.log(data.availableSlots);
        });
    }, [socket]);

    const fetchUserData = async () => {
        const user = auth.currentUser;
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
                Doctors
            </h2>
            <Separator className="my-4" />
            <div className="doctors-container ml-64 h-screen">
                <div className="doctor-items flex justify-center h-3/4">
                    <ScrollArea className="mt-10 h-4/5 w-4/5">
                        {doctors.map((doctor, index) => (
                            <Alert key={index} className="w-2/4 mt-5 block ml-auto mr-auto">
                                <div className="inline-block">
                                    <Avatar>
                                        <AvatarImage src={doctor.profilePhotoLink} alt="profile-pic" />
                                        <AvatarFallback>HJ</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="ml-8 inline-block">
                                    <AlertTitle>{doctor.firstName + " " + doctor.lastName}</AlertTitle>
                                    <AlertDescription>{doctor.bio}</AlertDescription>
                                </div>
                                <div className="inline-block">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="mt-2 ml-8" onClick={async () => {
                                                setDoctorOpenSlots([]);
                                                setSelectedSlotId("");
                                                setDate(new Date());
                                                let availableDates = await fetchAvailableDatesForDoctor(doctor.uid);
                                                setEnabledDates(availableDates);
                                            }}>Book Appointment!</Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Book Appointment</DialogTitle>
                                                <DialogDescription>
                                                    Book an appointment easily with just a few clicks!
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="" className="text-right">
                                                        Date
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "justify-start text-left font-normal col-span-3",
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
                                                                    console.log("SELECTED DATE: ", selectedDate);
                                                                    socket.emit("selected_doctor_id", {
                                                                        doctorId: doctor.uid,
                                                                        selectedDate: selectedDate,
                                                                    });
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="" className="text-right">
                                                        Slot Time
                                                    </Label>
                                                    <Select
                                                        value={selectedSlotId}
                                                        onValueChange={(value) => {
                                                            setSelectedSlotId(value);
                                                            console.log("SELECTED SLOT ID: ", value);
                                                        }}
                                                    >
                                                        <SelectTrigger id="framework" className="col-span-3">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper">
                                                            {doctorOpenSlots.map((slot, index) => (
                                                                <SelectItem key={index} value={slot.slotId}>
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
                                            <DialogFooter>
                                                {submitLoading ? (
                                                    <Button disabled>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Please wait
                                                    </Button>
                                                ) : (
                                                    <Button type="submit" disabled={!validateBookAppointmentFields()} onClick={async () => {
                                                        setSubmitLoading(true);
                                                        let doctorInfo = await fetchDoctorById(doctor.uid);
                                                        let selectedSlot = doctorOpenSlots.filter((slot) => {
                                                            return slot.slotId === selectedSlotId;
                                                        });
                                                        selectedSlot[0].userId = auth.currentUser.uid;
                                                        // add updated slot to "booked time slots"
                                                        await setDoc(
                                                            doc(db, "Booked Time Slots", selectedSlotId),
                                                            selectedSlot[0]
                                                        );
                                                        // remove slot from "time slots" collection
                                                        await deleteDoc(doc(db, "Time Slots", selectedSlotId));
                                                        socket.emit("send_confirmation_email", { recipient: auth.currentUser.email, userInfo: userData, selectedSlot: selectedSlot[0], doctorInfo: doctorInfo });
                                                        toast({
                                                            title: "Booked Appointment!",
                                                            description: "Successfully booked appointment!",
                                                          });
                                                        setDoctorOpenSlots([]);
                                                        setSelectedSlotId("");
                                                        setDate(new Date());
                                                        setSubmitLoading(false);
                                                    }}>Book Appointment</Button>
                                                )}
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </Alert>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
