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

const Settings = () => {
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
                                    <Input id="fname" placeholder="First name" />
                                </div>
                                <div className="flex flex-col space-y-1.5  grid gap-2">
                                    <Label htmlFor="lname">Last Name</Label>
                                    <Input id="lname" placeholder="Last name" />
                                </div>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="gender">Gender</Label>
                                <Select>
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
                                <Input id="email" placeholder="Email Address" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" type="tel" placeholder="Phone Number" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="pwrd">Password</Label>
                                <Input id="pwrd" placeholder="Password" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Settings;