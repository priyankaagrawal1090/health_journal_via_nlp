import React, { useState, useEffect } from "react";
import { Separator } from "./separator";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Textarea } from "./textarea";
import { useToast } from "./use-toast";
import { Loader2 } from "lucide-react";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage"
import {
  getAuth,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";

const checkEmail = (email) => {
  let emailExp =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailExp.test(email);
};

const checkPassword = (password) => {
  return password.length >= 6;
};

const checkPhone = (phone) => {
  let phoneExp = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneExp.test(phone);
};

const Settings = (props) => {
  const db = getFirestore();
  const auth = getAuth();
  const storage = getStorage();
  const googleProvider = new GoogleAuthProvider();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [currPassword, setCurrPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [popupLoading, setPopupLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const noChanges = () => {
    return (
      firstName === "" &&
      lastName === "" &&
      gender === "" &&
      email === "" &&
      phone === "" &&
      password === ""
    );
  };

  return (
    <div className="settings-container">
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
        Settings
      </h2>

      <Separator className="my-4" />

      <div
        className=" flex items-start justify-center"
        style={{ paddingTop: "30px" }}
      >
        <Card className="w-[950px]">
          <CardHeader>
            <CardTitle>Update Personal Details</CardTitle>
            <CardDescription>
              Change any of your account details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5  grid gap-2">
                    <Label htmlFor="fname">First Name</Label>
                    <Input
                      id="fname"
                      placeholder="First name"
                      value={firstName}
                      disabled={loading}
                      onInput={(i) => {
                        setFirstName(i.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5  grid gap-2">
                    <Label htmlFor="lname">Last Name</Label>
                    <Input
                      id="lname"
                      placeholder="Last name"
                      value={lastName}
                      disabled={loading}
                      onInput={(i) => {
                        setLastName(i.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    disabled={loading}
                    value={gender}
                    onValueChange={(gender) => {
                      setGender(gender);
                    }}
                  >
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
                {auth.currentUser.providerData[0].providerId !==
                  "google.com" && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        placeholder="Email Address"
                        value={email}
                        disabled={loading}
                        onInput={(i) => {
                          setEmail(i.target.value);
                        }}
                      />
                    </div>
                  )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    disabled={loading}
                    onInput={(i) => {
                      setPhone(i.target.value);
                    }}
                  />
                </div>
                {auth.currentUser.providerData[0].providerId !==
                  "google.com" && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="pwrd">Password</Label>
                      <Input
                        id="pwrd"
                        placeholder="Password"
                        value={password}
                        disabled={loading}
                        onInput={(i) => {
                          setPassword(i.target.value);
                        }}
                      />
                    </div>
                  )}
                {props.isDoctor && (
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Enter your bio here"
                      value={bio}
                      onChange={(e) => {
                        setBio(e.target.value)
                      }}
                    />
                  </div>
                )}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="pfp">Picture</Label>
                  <Input className="text-white" id="pfp" type="file" accept="image/*" onChange={(e) => {
                    setProfileImage(e.target.files[0])
                  }} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={dialogOpen}>
              <DialogTrigger asChild>
                {loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setLoading(true);
                      if (
                        auth.currentUser.providerData[0].providerId !==
                        "google.com"
                      ) {
                        setDialogOpen(true);
                      } else {
                        await reauthenticateWithPopup(
                          auth.currentUser,
                          googleProvider
                        )
                          .then(async (userCredential) => {
                            let userRef = doc(
                              db,
                              "Users",
                              userCredential.user.uid
                            );

                            let phoneNotBlank = phone !== "";
                            let fNameNotBlank = firstName !== "";
                            let lNameNotBlank = lastName !== "";
                            let genderNotBlank = gender !== "";
                            let picNotBlank = profileImage !== null;
                            let bioNotBlank = bio !== "";

                            if (phoneNotBlank) {
                              let verifyPhone = checkPhone(phone);
                              if (!verifyPhone) {
                                toast({
                                  title: "Please enter a valid phone number",
                                  description:
                                    "The phone number you have entered is not properly formatted",
                                });
                              } else {
                                await updateDoc(userRef, {
                                  pNum: phone,
                                });
                              }
                            }

                            if (fNameNotBlank) {
                              await updateDoc(userRef, {
                                firstName: firstName,
                              });
                            }
                            if (lNameNotBlank) {
                              await updateDoc(userRef, { lastName: lastName });
                            }
                            if (genderNotBlank) {
                              await updateDoc(userRef, { gender: gender });
                            }
                            if (bioNotBlank) {
                              await updateDoc(userRef, { bio: bio });
                            }
                            if (picNotBlank) {
                              const pfpRef = ref(storage, `images/${auth.currentUser.uid}`);
                              await uploadBytes(pfpRef, profileImage).then(async () => {
                                await getDownloadURL(pfpRef).then(async (url) => {
                                  console.log(url);
                                  await updateProfile(auth.currentUser, {
                                    photoURL: url
                                  }).then(async () => {
                                    await updateDoc(doc(db, "Users", auth.currentUser.uid), {profilePhotoLink: auth.currentUser.photoURL});
                                  }).catch((err) => {
                                    console.log(err);
                                  })
                                }).catch((err) => {
                                  console.log(err);
                                })
                              }).catch((err) => {
                                console.log(err);
                              })
                            }

                            setFirstName("");
                            setLastName("");
                            setPhone("");
                            setGender("");
                            setBio("");
                            setLoading(false);
                          })
                          .catch((error) => {
                            console.log(error);
                            toast({
                              title: "An error has occurred",
                              description:
                                "An error has occurred while reauthenticating",
                            });
                          });
                        setLoading(false);
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Please Verify Your Account Details</DialogTitle>
                  <DialogDescription>
                    Sign In to Verify Your Account Changes
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="curr-password" className="text-right">
                      Password
                    </Label>
                    <Input
                      value={currPassword}
                      id="curr-password"
                      type="password"
                      placeholder="password"
                      onInput={(i) => {
                        setCurrPassword(i.target.value);
                      }}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  {popupLoading ? (
                    <Button disabled>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </Button>
                  ) : (
                    <Button
                      onClick={async () => {
                        setPopupLoading(true);
                        if (currPassword !== "") {
                          let credential = EmailAuthProvider.credential(
                            auth.currentUser.email,
                            currPassword
                          );
                          await reauthenticateWithCredential(
                            auth.currentUser,
                            credential
                          )
                            .then(async () => {
                              let userRef = doc(db, "Users", props.userId);

                              let emailNotBlank = email !== "";
                              let phoneNotBlank = phone !== "";
                              let fNameNotBlank = firstName !== "";
                              let lNameNotBlank = lastName !== "";
                              let bioNotBlank = bio !== "";
                              let pfpNotBlank = profileImage !== null;
                              let genderNotBlank = gender !== "";
                              let passwordNotBlank = password !== "";

                              if (emailNotBlank) {
                                let verifyEmail = checkEmail(email);
                                if (!verifyEmail) {
                                  toast({
                                    title: "Please enter a valid email address",
                                    description:
                                      "The email address you have entered is not properly formatted",
                                  });
                                } else {
                                  await updateEmail(auth.currentUser, email)
                                    .then(async () => {
                                      await updateDoc(userRef, {
                                        email: email,
                                      })
                                        .then(() => { })
                                        .catch((error) => {
                                          console.log(error);
                                          toast({
                                            title: "An error has occurred",
                                            description:
                                              "An error has occurred while updating your email.",
                                          });
                                        });
                                    })
                                    .catch((error) => {
                                      console.log(error);
                                      toast({
                                        title: "An error has occurred",
                                        description:
                                          "An error has occurred while updating your email.",
                                      });
                                    });
                                }
                              }

                              if (phoneNotBlank) {
                                let verifyPhone = checkPhone(phone);
                                if (!verifyPhone) {
                                  toast({
                                    title: "Please enter a valid phone number",
                                    description:
                                      "The phone number you have entered is not properly formatted",
                                  });
                                } else {
                                  await updateDoc(userRef, {
                                    pNum: phone,
                                  });
                                }
                              }

                              if (fNameNotBlank) {
                                await updateDoc(userRef, {
                                  firstName: firstName,
                                });
                              }
                              if (lNameNotBlank) {
                                await updateDoc(userRef, {
                                  lastName: lastName,
                                });
                              }
                              if (genderNotBlank) {
                                await updateDoc(userRef, { gender: gender });
                              }
                              if (bioNotBlank) {
                                await updateDoc(userRef, { bio: bio });
                              }
                              if (pfpNotBlank) {
                                const pfpRef = ref(storage, `images/${auth.currentUser.uid}`);
                                await uploadBytes(pfpRef, profileImage).then(async () => {
                                  console.log('success')
                                  await getDownloadURL(pfpRef).then(async (url) => {
                                    console.log(url);
                                    await updateProfile(auth.currentUser, {
                                      photoURL: url
                                    }).then(async () => {
                                      await updateDoc(doc(db, "Users", auth.currentUser.uid), {profilePhotoLink: auth.currentUser.photoURL});
                                    }).catch((err) => {
                                      console.log(err);
                                    });
                                  })
                                }).catch((err) => {
                                  console.log(err);
                                })
                              }

                              if (passwordNotBlank) {
                                let verifyPassword = checkPassword(password);
                                if (!verifyPassword) {
                                  toast({
                                    title: "Strong password required",
                                    description:
                                      "Please make sure your password is at least 6 characters long",
                                  });
                                } else {
                                  await updatePassword(
                                    auth.currentUser,
                                    password
                                  )
                                    .then(() => { })
                                    .catch((error) => {
                                      toast({
                                        title: "An error has occurred",
                                        description:
                                          "An error has occurred while updating your password.",
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
                              setBio("");
                              setProfileImage(null);
                              setCurrPassword("");
                              setPopupLoading(false);
                              setDialogOpen(false);
                              setLoading(false);
                            })
                            .catch((error) => {
                              console.log(error);
                              toast({
                                title: "An error has occurred",
                                description:
                                  "An error has occurred while reauthenticating",
                              });
                            });
                        } else {
                          toast({
                            title: "Please Fill out All Fields",
                            description:
                              "Please make sure to enter both your email address and password",
                          });
                        }
                        setLoading(false);
                      }}
                      type="submit"
                    >
                      Save changes
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
