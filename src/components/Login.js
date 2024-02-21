import React, { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import SloganComponent from "./SloganComponent";

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

  return (
    <>
      <div className="homeSection">
        <h1 className="mainHeadding">
          Welcome to Health Journal - Your Mental Wellness Companion
        </h1>
        <h2 className="mainSlogan">Navigating Mental Health Made Easy</h2>
      </div>
      <div className="row justify-content-between align-items-center ">
        <div className="col">
          <SloganComponent></SloganComponent>
        </div>
        <div className="col">{authForm}</div>
      </div>
    </>
  );
}
