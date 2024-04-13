import { Button } from "./button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"
import { Input } from "./input"
import { Label } from "./label"
import { useToast } from "./use-toast"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import { useFirebase } from "./FirebaseContext";
import { initializeApp } from "firebase/app";
import { Loader2 } from "lucide-react"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Topnav from "./Topnav";
import * as React from "react";

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP",
};

const checkEmail = (email) => {
  let emailExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailExp.test(email);
}

const checkPhone = (phone) => {
  let phoneExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneExp.test(phone);
}

const checkEmpty = (input) => {
  console.log(input.trim() !== "");
  return input.trim() !== "";
}

const signUp = async (db, auth, email, pNum, fName, lName, gender, password, accType) => {
  createUserWithEmailAndPassword(auth, email, password).then(async userCredential => {
    const user = userCredential.user;
    const usersRef = doc(db, "Users", user.uid);
    const userData = {
      uid: user.uid,
      email: email,
      pNum: pNum,
      gender: gender,
      firstName: fName,
      lastName: lName,
      userType: accType,
    };
    await setDoc(usersRef, userData);
    return true;
  }).catch(err => {
    const errCode = err.code;
    const errMessage = err.message;
    console.log("Error Code: " + errCode);
    console.log("Error Message: " + errMessage);
    return false;
  });
}

const Auth = () => {
  const { toast } = useToast();

  const app = initializeApp(firebaseConfig);
  const db = useFirebase();
  const auth = getAuth();
  const navigate = useNavigate();

  const [userSignInEmail, setUserSignInEmail] = React.useState("");
  const [userSignInPassword, setUserSignInPassword] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [userRegEmail, setUserRegEmail] = React.useState("");
  const [userPhoneNum, setUserPhoneNum] = React.useState("");
  const [userFirstName, setUserFirstName] = React.useState("");
  const [userLastName, setUserLastName] = React.useState("");
  const [userGender, setUserGender] = React.useState("");
  const [userAccType, setUserAccType] = React.useState("");
  const [userRegPassword, setUserRegPassword] = React.useState("");
  const [userRegConfPassword, setUserRegConfPassword] = React.useState("");

  return (
    <div>
      <Topnav></Topnav>
      <div className="h-screen flex items-center justify-center">
        <Tabs defaultValue="sign-in" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="sign-in">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Sign in to your account using your email and password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="user-email">Email</Label>
                  <Input id="user-email" type="email" disabled={loading} onInput={i => { setUserSignInEmail(i.target.value) }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" disabled={loading} onInput={i => { setUserSignInPassword(i.target.value) }} />
                </div>
              </CardContent>
              <CardFooter>
                {
                  loading ?
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button> :
                    <Button onClick={async () => {
                      setLoading(true);
                      let validateEmail = checkEmail(userSignInEmail);
                      if (validateEmail) {
                        signInWithEmailAndPassword(auth, userSignInEmail, userSignInPassword).then(async (userCredential) => {
                          const user = userCredential.user;
                          const userDocRef = doc(db, "Users", user.uid);
                          const userDocSnap = await getDoc(userDocRef);
                          const userData = userDocSnap.data();
                          setLoading(false);
                          if (userData.userType == "patient") {
                            navigate("/patient-ui");
                          } else {
                            navigate("/doctor-ui");
                          }
                        }).catch((error) => {
                          if (error.code === "auth/invalid-credential") {
                            toast({
                              title: "Invalid email or password",
                              description: "The email and password you entered do not exist",
                            })
                          } else {
                            toast({
                              title: "An error has occurred",
                              description: "An error has occurred while signing in. Please try again later",
                            });
                          }
                        });
                      } else {
                        toast({
                          title: "Please enter a valid email address",
                          description: "The email address you have entered is not properly formatted",
                        });
                      }

                    }}>Sign In</Button>
                }
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Create an account by entering some basic information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-email">Email</Label>
                    <Input id="user-reg-email" type="email" onInput={i => { setUserRegEmail(i.target.value) }} />
                  </div>
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-phone">Phone Number</Label>
                    <Input id="user-reg-phone" type="tel" onInput={i => { setUserPhoneNum(i.target.value) }} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-fname">First Name</Label>
                  <Input id="user-reg-fname" type="text" onInput={i => { setUserFirstName(i.target.value) }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-lname">Last Name</Label>
                  <Input id="user-reg-lname" type="text" onInput={i => { setUserLastName(i.target.value) }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-lname">Gender</Label>
                    <Select onValueChange={(gender) => { setUserGender(gender) }}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Choose an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="man">Man</SelectItem>
                          <SelectItem value="woman">Woman</SelectItem>
                          <SelectItem value="nonbinary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="na">Prefer not to say</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-lname">Account Type</Label>
                    <Select onValueChange={(accType) => { setUserAccType(accType) }}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Choose an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="doctor">Doctor</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-pwrd">Password</Label>
                  <Input id="user-reg-pwrd" type="password" onInput={i => { setUserRegPassword(i.target.value) }} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-conf-pwrd">Confirm Password</Label>
                  <Input id="user-reg-conf-pwrd" type="password" onInput={i => { setUserRegConfPassword(i.target.value) }} />
                </div>
              </CardContent>
              <CardFooter>
                {
                  loading ?
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button> :
                    <Button onClick={async () => {
                      setLoading(true);
                      let emailEmpty = checkEmpty(userRegEmail);
                      let phoneEmpty = checkEmpty(userPhoneNum);
                      let fNameEmpty = checkEmpty(userFirstName);
                      let lNameEmpty = checkEmpty(userLastName);
                      let genderEmpty = checkEmpty(userGender);
                      let accEmpty = checkEmpty(userAccType);
                      let pwrdEmpty = checkEmpty(userRegPassword);
                      let pwrdConfEmpty = checkEmpty(userRegConfPassword);
                      console.log(emailEmpty)
                      if (!emailEmpty || !phoneEmpty || !fNameEmpty || !lNameEmpty || !genderEmpty || !accEmpty || !pwrdEmpty || !pwrdConfEmpty) {
                        toast({
                          title: "Please make sure all fields are filled out",
                          description: "Please fill out every field in the register form",
                        });
                      } else {
                        let validateEmail = checkEmail(userRegEmail);
                        let validatePhone = checkPhone(userPhoneNum);

                        if (!validateEmail) {
                          toast({
                            title: "Please enter a valid email address",
                            description: "The email address you have entered is not properly formatted",
                          });
                        } else if (!validatePhone) {
                          toast({
                            title: "Please enter a valid phone number",
                            description: "The phone number you have entered is not properly formatted",
                          });
                        } else if (userRegPassword !== userRegConfPassword) {
                          toast({
                            title: "Passwords do not match",
                            description: "Please make sure both passwords match",
                          });
                        } else {
                          createUserWithEmailAndPassword(auth, userRegEmail, userRegPassword).then(async (userCredential) => {
                            const user = userCredential.user;
                            const usersRef = doc(db, "Users", user.uid);
                            const userData = {
                              uid: user.uid,
                              email: userRegEmail,
                              pNum: userPhoneNum,
                              gender: userGender,
                              firstName: userFirstName,
                              lastName: userLastName,
                              userType: userAccType,
                            };
                            await setDoc(usersRef, userData);
                            setLoading(false);
                            if (userAccType == "patient") {
                              navigate("/patient-ui");
                            } else {
                              navigate("/doctor-ui");
                            }
                          }).catch((error) => {
                            console.log(error)
                            if (error.code === "auth/weak-password") {
                              toast({
                                title: "Weak password",
                                description: "Please make sure your password is at least 6 characters long",
                              });
                            } else if (error.code === "auth/email-already-in-use") {
                              toast({
                                title: "Email already in use",
                                description: "There is an existing account with the email address you have entered. Please enter a new email address.",
                              });
                            } else {
                              toast({
                                title: "An error has occurred",
                                description: "An error has occurred while creating your account. Please try again later",
                              });
                            }
                          });
                        }
                      }
                    }}>Create Account</Button>
                }
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
