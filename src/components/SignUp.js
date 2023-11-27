import React, { useState, useEffect } from "react";
import "../App.css";

const SIGNUP_FORM_FIELDS = [
  {
    id: 0,
    name: "FirstName",
    title: "First Name",
    type: "text",
    required: true,
  },
  {
    id: 1,
    name: "LastName",
    title: "Last Name",
    type: "text",
    required: true,
  },
  {
    id: 2,
    name: "Username",
    title: "Username",
    type: "text",
    required: true,
  },
  {
    id: 3,
    name: "Password",
    title: "Password",
    type: "password",
    required: true,
  },
];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_UPPER_CASE_CHAR = 1;
const PASSWORD_MIN_LOWER_CASE_CHAR = 1;
const PASSWORD_MIN_DIGITS = 1;
const PASSWORD_MIN_SPECIAL_CHAR = 1;
// const PASSWORD_SPECIAL_CHAR_LIST = [
//   "!",
//   "@",
//   "#",
//   "%",
//   "&",
//   "*",
//   "(",
//   ")",
//   "_",
//   "+",
//   "=",
//   "[",
//   "{",
//   "]",
//   "}",
//   ":",
//   ";",
//   "<",
//   ">",
// ];

const PASSWORD_SPECIAL_CHAR_LIST = ["@", "#", "%", "&", "*", "_"];

export default function SignUp({ onUpdateIsRegistered }) {
  // Initialize form state based on SIGNUP_FORM_FIELDS
  const initialFormState = SIGNUP_FORM_FIELDS.reduce((acc, field) => {
    acc[field.name] = ""; // Initialize each field with an empty string
    return acc;
  }, {});

  // Define a state variable with multiple form fields
  const [formState, setFormState] = useState(initialFormState);
  // Create a state variable to manage error messages
  const [errors, setErrors] = useState({});

  const [signUpSuccess, setSignUpSuccess] = useState(false);
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
      SIGNUP_FORM_FIELDS.find((field) => field.name === fieldName)?.required &&
      !value.trim()
    ) {
      return `${fieldName} is required.`;
    }

    // Check if password field value meets the following conditions:
    // Password must be greater than 8 characters in length.
    // Password must contain at least one uppercase character.
    // Password must contain at least one lowercase character.
    // Password must contain at least one digit.
    // Password must contain at least one special character.
    if (
      SIGNUP_FORM_FIELDS.find((field) => field.name === fieldName)?.type ===
      "password"
    ) {
      if (value.length < PASSWORD_MIN_LENGTH) {
        return `${fieldName} should have at least 8 characters.`;
      }
      if ((value.match(/[A-Z]/g) || []).length < PASSWORD_MIN_UPPER_CASE_CHAR) {
        return `${fieldName} should have at least 1 upper case character.`;
      }
      if ((value.match(/[a-z]/g) || []).length < PASSWORD_MIN_LOWER_CASE_CHAR) {
        return `${fieldName} should have at least 1 lower case character.`;
      }
      if ((value.match(/[0-9]/g) || []).length < PASSWORD_MIN_DIGITS) {
        return `${fieldName} should have at least 1 digit.`;
      }
      let specialCharRegex = new RegExp(
        `[${PASSWORD_SPECIAL_CHAR_LIST.join("")}]`
      );
      //   console.log(specialCharRegex);
      if (
        (value.match(specialCharRegex) || []).length < PASSWORD_MIN_SPECIAL_CHAR
      ) {
        return `${fieldName} should have at least 1 special character. Allowed characters: ${PASSWORD_SPECIAL_CHAR_LIST.join(
          " "
        )}`;
      }
    }

    return ""; // No error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate each field input before submitting
    const newErrors = {};
    SIGNUP_FORM_FIELDS.forEach((field) => {
      newErrors[field.name] = validateField(field.name, formState[field.name]);
    });

    // Update errors state with the latest validation results
    setErrors(newErrors);

    // Check if there are no errors (i.e., form is valid)
    if (Object.values(newErrors).every((error) => !error)) {
      // Perform form submission logic
      // Store form data in local storage
      localStorage.setItem(formState.Username, JSON.stringify(formState));
      console.log("Form submitted with state:", formState);

      // Set signUpSuccess to true
      setSignUpSuccess(true);
      setShowSuccessMessage(true);

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000); // 2000 milliseconds (adjust as needed)
    } else {
      // There are validation errors, handle them accordingly
      console.log("Form has validation errors.");
    }

    console.log(formState);
  };

  const formFields = SIGNUP_FORM_FIELDS.map((field) => (
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

  // Use useEffect to navigate to SignIn component after signUpSuccess is set to true
  useEffect(() => {
    if (signUpSuccess) {
      // Simulate a redirect to the Sign In page after 5 seconds
      const redirectTimer = setTimeout(() => {
        // Navigate to the SignIn component or route as needed
        console.log("Redirecting to SignIn page...");
        onUpdateIsRegistered(true);
      }, 5000); // 5000 milliseconds (adjust as needed)

      // Clear the timer if the component is unmounted
      return () => clearTimeout(redirectTimer);
    }
  }, [signUpSuccess, onUpdateIsRegistered]);

  const handleFormSwitchSignIn = () => {
    onUpdateIsRegistered(true);
  };

  return (
    <div className="container">
      <div className="auth-form">
        <h2>Sign up</h2>
        {showSuccessMessage && (
          <div className="success-popup">
            <p>
              Sign up successful! You are being routed to the Sign In page...
            </p>
          </div>
        )}
        {!signUpSuccess && (
          <form onSubmit={handleSubmit}>
            {formFields}
            <button onClick={handleSubmit}>Sign Up</button>
            <p>Already have an account?</p>
            <button onClick={handleFormSwitchSignIn}>Sign In here</button>
          </form>
        )}
      </div>
    </div>
  );
}
