import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "./dialog";
import { useToast } from "./use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { initializeApp } from "firebase/app";
import { Loader2 } from "lucide-react";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import Topnav from "./Topnav";
import * as React from "react";
import { Separator } from "./separator";

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP",
};

const Auth = () => {
  const { toast } = useToast();

  const app = initializeApp(firebaseConfig);
  const db = getFirestore();
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const [userSignInEmail, setUserSignInEmail] = React.useState("");
  const [userSignInPassword, setUserSignInPassword] = React.useState("");

  const [showDialog, setShowDialog] = React.useState(false);

  const [registerLoading, setRegisterLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const [signInLoading, setSignInLoading] = React.useState(false);

  const [resetEmail, setResetEmail] = React.useState("");

  const [userRegEmail, setUserRegEmail] = React.useState("");
  const [userPhoneNum, setUserPhoneNum] = React.useState("");
  const [userFirstName, setUserFirstName] = React.useState("");
  const [userLastName, setUserLastName] = React.useState("");
  const [userGender, setUserGender] = React.useState("");
  const [userAccType, setUserAccType] = React.useState("");
  const [userRegPassword, setUserRegPassword] = React.useState("");
  const [userRegConfPassword, setUserRegConfPassword] = React.useState("");

  // Function to check if email exists in Firestore
  const checkEmailExists = async (email) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty; // Return true if email exists, false otherwise
  };

  const checkEmailProviderGoogle = async (email) => {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    return signInMethods.includes("google.com");
  }

  const checkEmail = (email) => {
    let emailExp =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailExp.test(email);
  };

  const checkPhone = (phone) => {
    let phoneExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneExp.test(phone);
  };

  const checkEmpty = (input) => {
    return input.trim() !== "";
  };

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
                <div className="grid grid-cols-2 gap-6">
                  <Button
                    onClick={() => {
                      signInWithPopup(auth, googleProvider)
                        .then(async (userCredential) => {
                          let { isNewUser } =
                            getAdditionalUserInfo(userCredential);
                          if (isNewUser) {
                            setShowDialog(true);
                          } else {
                            let userDataRef = doc(
                              db,
                              "Users",
                              userCredential.user.uid
                            );
                            let userDataSnap = await getDoc(userDataRef);
                            let userData = userDataSnap.data();
                            if (userData.userType == "patient") {
                              navigate("/patient-ui");
                            } else {
                              navigate("/doctor-ui");
                            }
                          }
                        })
                        .catch((error) => {
                          console.log(error);
                          toast({
                            title: "An error has occurred",
                            description:
                              "An error has occurred while signing in. Please try again later",
                          });
                        });
                    }}
                    className="col-span-2 font-bold"
                  >
                    <svg role="img" viewBox="0 0 24 24" class="mr-2 h-4 w-4">
                      <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      ></path>
                    </svg>
                    Google
                  </Button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div class="relative flex justify-center text-xs uppercase">
                    <span class="bg-background px-2 text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                <Separator />
                <div className="space-y-1">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    disabled={signInLoading}
                    value={userSignInEmail}
                    onInput={(i) => {
                      setUserSignInEmail(i.target.value);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    disabled={signInLoading}
                    value={userSignInPassword}
                    onInput={(i) => {
                      setUserSignInPassword(i.target.value);
                    }}
                  />
                </div>
              </CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <span
                    style={{
                      paddingLeft: "25px",
                      paddingBottom: "10px",
                      transition: "text-decoration 0.3s ease-in-out",
                      cursor: "pointer",
                      borderBottom: "1px solid transparent", // Initially transparent border
                      display: "inline-block", // Ensures padding and border work correctly
                      fontSize: "0.8rem", // Smaller font size
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                      e.target.style.borderBottom = "1px solid black"; // Change border color on hover
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                      e.target.style.borderBottom = "1px solid transparent"; // Restore transparent border
                    }}
                  >
                    Forgot Password?
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Password Reset</DialogTitle>
                    <DialogDescription>
                      Enter your email and we will send you a link to reset your password
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Email
                      </Label>
                      <Input
                        id="link"
                        value={resetEmail}
                        onInput={(i) => { setResetEmail(i.target.value) }}
                        placeholder="Email"
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    {resetLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </Button>
                    ) : (
                      <Button type="button" variant="secondary" onClick={async (e) => {
                        e.preventDefault();
                        setResetLoading(true);
                        const checkEmailEmpty = checkEmpty(resetEmail);
                        if (!checkEmailEmpty) {
                          toast({
                            title: "Please enter an email address",
                            description:
                              "To reset your password, fill out the email field",
                          });
                        } else {
                          const checkProviderGoogle = await checkEmailProviderGoogle(resetEmail);
                          console.log("Contains Google: ", checkProviderGoogle);
                          if (checkProviderGoogle) {
                            toast({
                              title: "Cannot reset password for Google account",
                              description:
                                "The password for this account cannot be reset because it is a Google account",
                            });
                          } else {
                            const verifyEmail = checkEmail(resetEmail)
                            if (!verifyEmail) {
                              toast({
                                title: "Please enter a valid email address",
                                description:
                                  "The email address you have entered is not properly formatted",
                              });
                            } else {
                              // Check if email exists
                              const emailExists = await checkEmailExists(resetEmail);

                              if (emailExists) {
                                // Email exists, send password reset email
                                sendPasswordResetEmail(auth, resetEmail)
                                  .then(() => {
                                    toast({
                                      title: "Password reset email sent",
                                      description:
                                        "Check your email for instructions to reset your password.",
                                    });
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Error sending password reset email:",
                                      error
                                    );
                                    toast({
                                      title: "Error sending email",
                                      description:
                                        "An error occurred while sending the password reset email.",
                                    });
                                  })
                                  .finally(() => {
                                    setResetLoading(false);
                                  });
                              } else {
                                // Email does not exist, show error message
                                toast({
                                  title: "Email not found",
                                  description:
                                    "The email you entered does not exist in our records.",
                                });
                              }
                            }
                          }
                        }
                        setResetLoading(false);
                      }}
                      >
                        Reset Password
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <CardFooter>
                {signInLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      setSignInLoading(true);
                      let validateEmail = checkEmail(userSignInEmail);
                      if (validateEmail) {
                        signInWithEmailAndPassword(
                          auth,
                          userSignInEmail,
                          userSignInPassword
                        )
                          .then(async (userCredential) => {
                            const user = userCredential.user;
                            const userDocRef = doc(db, "Users", user.uid);
                            const userDocSnap = await getDoc(userDocRef);
                            const userData = userDocSnap.data();
                            setSignInLoading(false);
                            if (userData.userType == "patient") {
                              navigate("/patient-ui");
                            } else {
                              navigate("/doctor-ui");
                            }
                          })
                          .catch((error) => {
                            if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found") {
                              toast({
                                title: "Invalid email or password",
                                description:
                                  "The email and password you entered do not exist",
                              });
                            } else {
                              toast({
                                title: "An error has occurred",
                                description:
                                  "An error has occurred while signing in. Please try again later",
                              });
                            }
                          });
                      } else {
                        toast({
                          title: "Please enter a valid email address",
                          description:
                            "The email address you have entered is not properly formatted",
                        });
                      }
                      setSignInLoading(false);
                    }}
                  >
                    Sign In
                  </Button>
                )}
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
                    <Input
                      id="user-reg-email"
                      type="email"
                      onInput={(i) => {
                        setUserRegEmail(i.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-phone">Phone Number</Label>
                    <Input
                      id="user-reg-phone"
                      type="tel"
                      onInput={(i) => {
                        setUserPhoneNum(i.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-fname">First Name</Label>
                  <Input
                    id="user-reg-fname"
                    type="text"
                    onInput={(i) => {
                      setUserFirstName(i.target.value);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-lname">Last Name</Label>
                  <Input
                    id="user-reg-lname"
                    type="text"
                    onInput={(i) => {
                      setUserLastName(i.target.value);
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 grid gap-2">
                    <Label htmlFor="user-reg-lname">Gender</Label>
                    <Select
                      onValueChange={(gender) => {
                        setUserGender(gender);
                      }}
                    >
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
                    <Select
                      onValueChange={(accType) => {
                        setUserAccType(accType);
                      }}
                    >
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
                  <Input
                    id="user-reg-pwrd"
                    type="password"
                    onInput={(i) => {
                      setUserRegPassword(i.target.value);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="user-reg-conf-pwrd">Confirm Password</Label>
                  <Input
                    id="user-reg-conf-pwrd"
                    type="password"
                    onInput={(i) => {
                      setUserRegConfPassword(i.target.value);
                    }}
                  />
                </div>
              </CardContent>
              <CardFooter>
                {registerLoading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={async () => {
                      setRegisterLoading(true);
                      let emailEmpty = checkEmpty(userRegEmail);
                      let phoneEmpty = checkEmpty(userPhoneNum);
                      let fNameEmpty = checkEmpty(userFirstName);
                      let lNameEmpty = checkEmpty(userLastName);
                      let genderEmpty = checkEmpty(userGender);
                      let accEmpty = checkEmpty(userAccType);
                      let pwrdEmpty = checkEmpty(userRegPassword);
                      let pwrdConfEmpty = checkEmpty(userRegConfPassword);
                      console.log(emailEmpty);
                      if (
                        !emailEmpty ||
                        !phoneEmpty ||
                        !fNameEmpty ||
                        !lNameEmpty ||
                        !genderEmpty ||
                        !accEmpty ||
                        !pwrdEmpty ||
                        !pwrdConfEmpty
                      ) {
                        toast({
                          title: "Please make sure all fields are filled out",
                          description:
                            "Please fill out every field in the register form",
                        });
                      } else {
                        let validateEmail = checkEmail(userRegEmail);
                        let validatePhone = checkPhone(userPhoneNum);

                        if (!validateEmail) {
                          toast({
                            title: "Please enter a valid email address",
                            description:
                              "The email address you have entered is not properly formatted",
                          });
                        } else if (!validatePhone) {
                          toast({
                            title: "Please enter a valid phone number",
                            description:
                              "The phone number you have entered is not properly formatted",
                          });
                        } else if (userRegPassword !== userRegConfPassword) {
                          toast({
                            title: "Passwords do not match",
                            description:
                              "Please make sure both passwords match",
                          });
                        } else {
                          createUserWithEmailAndPassword(
                            auth,
                            userRegEmail,
                            userRegPassword
                          )
                            .then(async (userCredential) => {
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
                              setRegisterLoading(false);
                              if (userAccType == "patient") {
                                navigate("/patient-ui");
                              } else {
                                navigate("/doctor-ui");
                              }
                            })
                            .catch((error) => {
                              console.log(error);
                              if (error.code === "auth/weak-password") {
                                toast({
                                  title: "Weak password",
                                  description:
                                    "Please make sure your password is at least 6 characters long",
                                });
                              } else if (
                                error.code === "auth/email-already-in-use"
                              ) {
                                toast({
                                  title: "Email already in use",
                                  description:
                                    "There is an existing account with the email address you have entered. Please enter a new email address.",
                                });
                              } else {
                                toast({
                                  title: "An error has occurred",
                                  description:
                                    "An error has occurred while creating your account. Please try again later",
                                });
                              }
                            });
                        }
                      }
                      setRegisterLoading(false);
                    }}
                  >
                    Create Account
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <Dialog open={showDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter your details</DialogTitle>
              <DialogDescription>
                Please fill out the details below to finish creating your
                account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  First Name
                </Label>
                <Input
                  id="name"
                  disabled={registerLoading}
                  value={userFirstName}
                  onInput={(i) => {
                    setUserFirstName(i.target.value);
                  }}
                  placeholder="First name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="username"
                  disabled={registerLoading}
                  value={userLastName}
                  onInput={(i) => {
                    setUserLastName(i.target.value);
                  }}
                  placeholder="Last name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="username"
                  disabled={registerLoading}
                  value={userPhoneNum}
                  onInput={(i) => {
                    setUserPhoneNum(i.target.value);
                  }}
                  placeholder="Phone Number"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-reg-gender" className="text-right">
                  Gender
                </Label>
                <Select
                  disabled={registerLoading}
                  onValueChange={(gender) => {
                    setUserGender(gender);
                  }}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user-reg-acc-type" className="text-right">
                  Account Type
                </Label>
                <Select
                  disabled={registerLoading}
                  onValueChange={(accType) => {
                    setUserAccType(accType);
                  }}
                >
                  <SelectTrigger className="col-span-3">
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
            <DialogFooter>
              {registerLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    setRegisterLoading(true);
                    let firstNameEmpty = checkEmpty(userFirstName);
                    let lastNameEmpty = checkEmpty(userLastName);
                    let phoneEmpty = checkEmpty(userPhoneNum);
                    let genderEmpty = checkEmpty(userGender);
                    let userTypeEmpty = checkEmpty(userAccType);
                    if (
                      !phoneEmpty ||
                      !firstNameEmpty ||
                      !lastNameEmpty ||
                      !genderEmpty ||
                      !userTypeEmpty
                    ) {
                      toast({
                        title: "Please make sure all fields are filled out",
                        description:
                          "Please fill out every field in the register form",
                      });
                    } else {
                      let validatePhone = checkPhone(userPhoneNum);
                      if (!validatePhone) {
                        toast({
                          title: "Please enter a valid phone number",
                          description:
                            "The phone number you have entered is not properly formatted",
                        });
                      } else {
                        let user = auth.currentUser;
                        let usersRef = doc(db, "Users", user.uid);
                        let userData = {
                          uid: user.uid,
                          email: user.email,
                          pNum: userPhoneNum,
                          gender: userGender,
                          firstName: userFirstName,
                          lastName: userLastName,
                          userType: userAccType,
                        };
                        await setDoc(usersRef, userData);
                        setRegisterLoading(false);
                        if (userAccType == "patient") {
                          navigate("/patient-ui");
                        } else {
                          navigate("/doctor-ui");
                        }
                      }
                    }
                    setRegisterLoading(false);
                  }}
                  type="submit"
                >
                  Create Account
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Auth;
