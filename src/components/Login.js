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
    <SignIn />
  ) : (
    <SignUp onUpdateIsRegistered={updateIsRegistered} />
  );
  const formSwitch = isRegistered
    ? [
        <p>Don't have an account?</p>,
        <button onClick={handleFormSwitchSignUp}>Sign Up here</button>,
      ]
    : [
        // <p>Already have an account?</p>,
        // <button onClick={handleFormSwitchSignIn}>Sign In here</button>,
      ];

  return (
    <div className="">
      {authForm}
      {formSwitch}
    </div>
  );
}
