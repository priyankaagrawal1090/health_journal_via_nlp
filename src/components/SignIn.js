import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../App.css";

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


const SIGNIN_FORM_FIELDS = [
  {
    id: 0,
    name: "Username",
    title: "Username",
    type: "text",
    required: true,
  },
  {
    id: 1,
    name: "Password",
    title: "Password",
    type: "password",
    required: true,
  },
];

export default function SignIn({ onUpdateIsRegistered }) {
  const navigate = useNavigate();
  // Initialize form state based on SIGNIN_FORM_FIELDS
  const initialFormState = SIGNIN_FORM_FIELDS.reduce((acc, field) => {
    acc[field.name] = ""; // Initialize each field with an empty string
    return acc;
  }, {});

  // Define a state variable with multiple form fields
  const [formState, setFormState] = useState(initialFormState);
  // Create a state variable to manage error messages
  const [errors, setErrors] = useState({});
  //
  const [authErrors, setAuthErrors] = useState({});

  const [signInSuccess, setSignInSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Function to update a specific field in the form state
  const updateField = (fieldName, value) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [fieldName]: value,
    }));
    // Validate the field and update errors state
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  // Validation function for a specific field
  const validateField = (fieldName, value) => {
    // Check if the field is required and not empty for all required fields
    if (
      SIGNIN_FORM_FIELDS.find((field) => field.name === fieldName)?.required &&
      !value.trim()
    ) {
      return `${fieldName} is required.`;
    }
    return ""; // No error
  };

  const passwordAuth = (Username, fieldName, value) => {
    // Retreive data from local storage
    const storedFormData = localStorage.getItem(Username);
    console.log("Username = ", Username);
    console.log("fieldName = ", fieldName);
    // Check if the Username is valid
    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      console.log("Username is valid. Retrieved data:", parsedData);
      if (parsedData[fieldName] === value) {
        console.log("Field verified.");
      } else {
        return `${fieldName} invalid!!`;
      }
    } else {
      console.log("Username is invalid");
      return `${fieldName} is invalid`;
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate each field input before submitting
    const newErrors = {};
    SIGNIN_FORM_FIELDS.forEach((field) => {
      newErrors[field.name] = validateField(field.name, formState[field.name]);
    });

    // Authenticate Username and Password
    // const newAuthErrors = {};
    // SIGNIN_FORM_FIELDS.forEach((field) => {
    //   newAuthErrors[field.name] = passwordAuth(
    //     formState["Username"],
    //     field.name,
    //     formState[field.name]
    //   );
    // });
    // Update errors state with the latest validation results
    setErrors(newErrors);
    //setAuthErrors(newAuthErrors);
    //console.log("Errors:", newAuthErrors);

    // Check if there are no errors (i.e., form is valid)
    if (
      Object.values(newErrors).every((error) => !error)
    ) {
      signInWithEmailAndPassword(auth, formState['Username'], formState['Password'])
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('SUCCESS!')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error Code: " + errorCode);
        console.log("Error Message: " + errorMessage);        
      });
      setSignInSuccess(true);
      setShowSuccessMessage(true);
      // Hide the success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000); // 1000 milliseconds (adjust as needed)
    } else {
      // There are validation errors, handle them accordingly
      console.log("Form has validation errors.");
    }

    console.log(formState);
  };

  const formFields = SIGNIN_FORM_FIELDS.map((field) => (
    <div className="form-container">
      <label htmlFor={field.name}>{field.title}:</label>
      <input
        className="form-field"
        id={field.name}
        value={formState[field.name]}
        onChange={(e) => updateField(field.name, e.target.value)}
        type={field.type}
        required={field.required}
      ></input>
      {errors[field.name] && (
        <p style={{ color: "red" }}>{errors[field.name]}</p>
      )}
      {authErrors[field.name] && (
        <p style={{ color: "red" }}>{authErrors[field.name]}</p>
      )}
    </div>
  ));

  // Use useEffect to navigate to PatientUI/DoctorUI component after signInSuccess is set to true
  useEffect(() => {
    if (signInSuccess) {
      // Simulate a redirect to the PatientUI/DoctorUI page
      const redirectTimer = setTimeout(() => {
        // Navigate to the SignIn component or route as needed
        console.log("Signing In...");
        const targetRoute = "/patient-ui";
        navigate(targetRoute);
      }, 1000); // 1000 milliseconds (adjust as needed)
      // Clear the timer if the component is unmounted
      return () => clearTimeout(redirectTimer);
    }
  }, [signInSuccess, onUpdateIsRegistered, navigate]);

  const handleFormSwitchSignUp = () => {
    onUpdateIsRegistered(false);
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h2>Sign in</h2>
        <hr />
        {showSuccessMessage && (
          <div className="success-popup">
            <p>Signing in...</p>
          </div>
        )}
        {!signInSuccess && (
          <form onSubmit={handleSubmit}>
            {formFields}
            <button
              className="btn btn-primary sign-in-btn"
              onClick={handleSubmit}
            >
              Sign In
            </button>
            <hr></hr>
            <div className="form-switch" style={{ fontSize: 20 }}>
              Don't have an account?{" "}
              <button className="link-button" onClick={handleFormSwitchSignUp}>
                Sign Up here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
