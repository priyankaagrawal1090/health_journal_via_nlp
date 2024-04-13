import React, { useState, useEffect } from 'react';
import { Separator } from "./separator";
import { Button } from "./button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./card"
import { Input } from "./input"
import { Label } from "./label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select"
import { useToast } from "./use-toast"
import { Loader2 } from "lucide-react"
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth, updateEmail, updatePassword } from 'firebase/auth';

const checkEmail = (email) => {
    let emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailExp.test(email);
}

const checkPassword = (password) => {
    return password.length >= 6;
}

const checkPhone = (phone) => {
    let phoneExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneExp.test(phone);
}

const Settings = (props) => {
    const db = getFirestore();
    const auth = getAuth();
    const { toast } = useToast();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const noChanges = () => {
        return firstName === "" && lastName === "" && gender === "" && email === "" && phone === "" && password === "";
    }

    return (
        <div className='absolute ml-10 left-64 top-10'>
            <div className="space-y-1">
                <h1 className="text-3xl font-medium leading-none">Settings</h1>
            </div>
            <Separator className="my-4" />
            <Card className="w-[950px]">
                <CardHeader>
                    <CardTitle>Update Personal Details</CardTitle>
                    <CardDescription>Change any of your account details here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col space-y-1.5  grid gap-2">
                                    <Label htmlFor="fname">First Name</Label>
                                    <Input id="fname" placeholder="First name" value={firstName} disabled={loading} onInput={i => { setFirstName(i.target.value) }} />
                                </div>
                                <div className="flex flex-col space-y-1.5  grid gap-2">
                                    <Label htmlFor="lname">Last Name</Label>
                                    <Input id="lname" placeholder="Last name" value={lastName} disabled={loading} onInput={i => { setLastName(i.target.value) }} />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="gender">Gender</Label>
                                <Select disabled={loading} value={gender} onValueChange={(gender) => { setGender(gender) }}>
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectItem value="man">Man</SelectItem>
                                        <SelectItem value="woman">Woman</SelectItem>
                                        <SelectItem value="nonbinary">Non-binary</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="na">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" placeholder="Email Address" value={email} disabled={loading} onInput={i => { setEmail(i.target.value) }} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="Phone Number" value={phone} disabled={loading} onInput={i => { setPhone(i.target.value) }} />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="pwrd">Password</Label>
                                <Input id="pwrd" placeholder="Password" value={password} disabled={loading} onInput={i => { setPassword(i.target.value) }} />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {
                        loading ?
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                            :
                            <Button disabled={noChanges()} onClick={async () => {
                                setLoading(true);
                                let userRef = doc(db, "Users", props.userId);

                                let emailNotBlank = (email !== "");
                                let phoneNotBlank = (phone !== "");
                                let fNameNotBlank = (firstName !== "");
                                let lNameNotBlank = (lastName !== "");
                                let genderNotBlank = (gender !== "");
                                let passwordNotBlank = (password !== "");

                                if (emailNotBlank) {
                                    let verifyEmail = checkEmail(email);
                                    if (!verifyEmail) {
                                        toast({
                                            title: "Please enter a valid email address",
                                            description: "The email address you have entered is not properly formatted",
                                        });
                                    } else {
                                        updateEmail(auth.currentUser, email).then(async () => {
                                            await updateDoc(userRef, {
                                                email: email,
                                            }).then(() => { }).catch((error) => {
                                                console.log(error);
                                                toast({
                                                    title: "An error has occurred",
                                                    description: "An error has occurred while updating your email.",
                                                });
                                            })
                                        }).catch((error) => {
                                            console.log(error);
                                            toast({
                                                title: "An error has occurred",
                                                description: "An error has occurred while updating your email.",
                                            });
                                        });
                                    }
                                }

                                if (phoneNotBlank) {
                                    let verifyPhone = checkPhone(phone);
                                    if (!verifyPhone) {
                                        toast({
                                            title: "Please enter a valid phone number",
                                            description: "The phone number you have entered is not properly formatted",
                                        });
                                    } else {
                                        await updateDoc(userRef, {
                                            pNum: phone,
                                        })
                                    }
                                }

                                if (fNameNotBlank) { await updateDoc(userRef, { firstName: firstName, }); }
                                if (lNameNotBlank) { await updateDoc(userRef, { lastName: lastName, }); }
                                if (genderNotBlank) { await updateDoc(userRef, { gender: gender, }); }

                                if (passwordNotBlank) {
                                    let verifyPassword = checkPassword(password);
                                    if (!verifyPassword) {
                                        toast({
                                            title: "Strong password required",
                                            description: "Please make sure your password is at least 6 characters long",
                                        });
                                    } else {
                                        updatePassword(auth.currentUser, password).then(() => { }).catch((error) => {
                                            toast({
                                                title: "An error has occurred",
                                                description: "An error has occurred while updating your password.",
                                            });
                                        });
                                    }
                                }
                                setFirstName("");
                                setLastName("");
                                setEmail("");
                                setPhone("");
                                setPassword("");
                                setGender("");
                                setLoading(false);
                            }}>Save Changes</Button>
                    }
                </CardFooter>
            </Card>
        </div>
    );
}

export default Settings;