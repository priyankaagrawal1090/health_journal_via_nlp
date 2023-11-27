import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function Login() {
  const [isRegistered, setIsRegistered] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleFormSwitchSignUp = () => {
    setIsRegistered(false);
  };

  // const handleFormSwitchSignIn = () => {
  //   setIsRegistered(true);
  // };

  const updateIsRegistered = (newValue) => {
    setIsRegistered(newValue);
  };

  const authForm = isRegistered ? (
    <SignIn onUpdateIsRegistered={updateIsRegistered} />
  ) : (
    <SignUp onUpdateIsRegistered={updateIsRegistered} />
  );

  return <div className="">{authForm}</div>;
}
