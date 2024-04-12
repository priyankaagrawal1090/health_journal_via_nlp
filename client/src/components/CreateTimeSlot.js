import React, { useState } from 'react';
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import moment from "moment";
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { useToast } from "./use-toast"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { Calendar } from "./calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "./popover"

const firebaseConfig = {
    apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
    authDomain: "mental-health-journal-2605e.firebaseapp.com",
    projectId: "mental-health-journal-2605e",
    storageBucket: "mental-health-journal-2605e.appspot.com",
    messagingSenderId: "725820602981",
    appId: "1:725820602981:web:b16539f99e4678bc51248c",
    measurementId: "G-7V9YPQPLEP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

const CreateTimeSlot = (props) => {
    const [slotDate, setSlotDate] = useState(new Date());
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [loading, setLoading] = useState(false);

    const { toast } = useToast();

    const timeDiff = (startTime, endTime) => {
        let start = startTime.split(":");
        let end = endTime.split(":");
        let tempDate = new Date(slotDate);
        let sDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), start[0], start[1], 0);
        let eDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), end[0], end[1], 0);
        let timeDiff = eDate.getTime() - sDate.getTime();
        let minutesDiff = Math.floor((timeDiff / 1000) / 60);
        return minutesDiff;
    }

    const validateSlot = () => {
        if (startTime === null || endTime === null || startTime === "" || endTime === "") {
            return false;
        }
        let timeDifference = timeDiff(startTime, endTime);
        return timeDifference > 15;
    }

    const handleSubmit = async () => {
        setLoading(true);
        let isValidated = validateSlot();
        if (isValidated) {
            const timeSlotsRef = collection(db, "Time Slots");
            const slotData = {
                doctorId: props.doctorId,
                slotDate: slotDate,
                startTime: startTime,
                endTime: endTime,
            };
            await addDoc(timeSlotsRef, slotData).then((slotDocRef) => {
                toast({
                    title: "Created Time Slot",
                    description: "Your time slot has successfully been created!",
                });
                setStartTime("");
                setEndTime("");
            }).catch((error) => {
                toast({
                    title: "An error has occurred",
                    description: "An error has occurred while creating your account. Please try again later",
                });
            });
        } else {
            toast({
                title: "Please select valid times",
                description: "Please make sure to select both a start and end time and make sure the end time is at least 15 minutes after the start time.",
            });
        }
        setLoading(false);
    }

    return (
        <div className='h-screen flex items-center justify-center'>
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>Create Time Slot</CardTitle>
                    <CardDescription>Create appointment slots that patients can book.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Time Slot Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            disabled={loading}
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal",
                                                !slotDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {slotDate ? format(slotDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={slotDate}
                                            onSelect={
                                                (slotDate) => {
                                                    setSlotDate(moment(slotDate).format('YYYY-MM-DD'));
                                                }
                                            }
                                            disabled={(slotDate) =>
                                                slotDate < new Date()
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="start-time">Time Slot Start Time</Label>
                                <Input id="start-time" type='time' disabled={loading} value={startTime} className="w-full" placeholder="Start time for your slot" onInput={i => setStartTime(i.target.value)} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="end-time">Time Slot End Time</Label>
                                <Input id="end-time" type='time' disabled={loading} value={endTime} placeholder="End time for your slot" onInput={i => setEndTime(i.target.value)} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between justify-center">
                    {
                        loading ?
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button> :
                            <Button onClick={handleSubmit}>Create Slot</Button>
                    }
                </CardFooter>
            </Card>
        </div>
    )
}

export default CreateTimeSlot;