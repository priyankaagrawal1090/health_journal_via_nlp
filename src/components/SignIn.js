import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate each field input before submitting
    const newErrors = {};
    SIGNIN_FORM_FIELDS.forEach((field) => {
      newErrors[field.name] = validateField(field.name, formState[field.name]);
    });

    // Update errors state with the latest validation results
    setErrors(newErrors);

    // Check if there are no errors (i.e., form is valid)
    if (Object.values(newErrors).every((error) => !error)) {
      // Perform form submission logic
      // Store form data in local storage
      //   localStorage.setItem("formData", JSON.stringify(formState));
      console.log("Form submitted with state:", formState);

      // Set signUpSuccess to true
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
    <label for={field.name}>
      {field.title}:
      <input
        value={formState[field.name]}
        onChange={(e) => updateField(field.name, e.target.value)}
        type={field.type}
        required={field.required}
      ></input>
      {errors[field.name] && (
        <p style={{ color: "red" }}>{errors[field.name]}</p>
      )}
    </label>
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
      }, 1000); // 5000 milliseconds (adjust as needed)
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
        {showSuccessMessage && (
          <div className="success-popup">
            <p>Signing in...</p>
          </div>
        )}
        {!signInSuccess && (
          <form onSubmit={handleSubmit}>
            {formFields}
            <button onClick={handleSubmit}>Sign In</button>
            <p>Don't have an account?</p>
            <button onClick={handleFormSwitchSignUp}>Sign Up here</button>
          </form>
        )}
      </div>
    </div>
  );
}
