import React, { useState, Component, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
    getFirestore,
    collection,
    getDocs,
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
    const dateMatcher = (date) => {return !enabledDates.includes(moment(date).format("YYYY-MM-DD"));};
    const doctorQuery = query(collection(db, "Users"), where("userType", "==", "doctor"));
    useEffect(() => {
        onSnapshot(doctorQuery, (querySnap) => {
            let docs = []
            querySnap.docs.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });
            setDoctors(docs);
        })
    }, [])

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
                            <Alert key={index} className="w-2/4 mt-5">
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
                                {/* <div className="inline-block">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline">Book Appointment!</Button>
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
                                                    <Label htmlFor="name" className="text-right">
                                                        Date
                                                    </Label>
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
                                                                }}
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="username" className="text-right">
                                                        Slot Time
                                                    </Label>
                                                    <Input
                                                        id="username"
                                                        defaultValue="@peduarte"
                                                        className="col-span-3"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Book Appointment</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div> */}
                            </Alert>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
