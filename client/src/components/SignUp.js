import React, { useState, useEffect } from "react";
import { useFirebase } from "./FirebaseContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore/lite";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import theme from "../theme";
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
    name: "Gender",
    title: "Gender",
    type: "select",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
    required: true,
  },
  {
    id: 3,
    name: "PhoneNumber",
    title: "Phone Number",
    type: "tel",
    required: true,
  },
  {
    id: 4,
    name: "Username",
    title: "Username",
    type: "text",
    required: true,
  },
  {
    id: 5,
    name: "Password",
    title: "Password",
    type: "password",
    required: true,
  },
  {
    id: 6,
    name: "UserType",
    title: "User Type",
    type: "radio",
    options: [
      { label: "Patient", value: "patient" },
      { label: "Doctor", value: "doctor" },
    ],
    required: true,
  },
];

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_UPPER_CASE_CHAR = 1;
const PASSWORD_MIN_LOWER_CASE_CHAR = 1;
const PASSWORD_MIN_DIGITS = 1;
const PASSWORD_MIN_SPECIAL_CHAR = 1;
const PASSWORD_SPECIAL_CHAR_LIST = ["@", "#", "%", "&", "*", "_"];

export default function SignUp({
  darkTheme,
  signinBoxStyle,
  onUpdateIsRegistered,
}) {
  const db = useFirebase();
  const auth = getAuth();

  const initialFormState = SIGNUP_FORM_FIELDS.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const updateField = (fieldName, value) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      [fieldName]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const validateField = (fieldName, value) => {
    if (
      SIGNUP_FORM_FIELDS.find((field) => field.name === fieldName)?.required &&
      !value.trim()
    ) {
      return `${fieldName} is required.`;
    }

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
      if (
        (value.match(specialCharRegex) || []).length < PASSWORD_MIN_SPECIAL_CHAR
      ) {
        return `${fieldName} should have at least 1 special character. Allowed characters: ${PASSWORD_SPECIAL_CHAR_LIST.join(
          " "
        )}`;
      }
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    SIGNUP_FORM_FIELDS.forEach((field) => {
      newErrors[field.name] = validateField(field.name, formState[field.name]);
    });

    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      createUserWithEmailAndPassword(
        auth,
        formState["Username"],
        formState["Password"]
      )
        .then((userCredential) => {
          const user = userCredential.user;
          const usersRef = doc(getFirestore(), "Users", user.uid);
          const userData = {
            uid: user.uid,
            email: formState["Username"],
            pNum: formState["PhoneNumber"],
            gender: formState["Gender"],
            firstName: formState["FirstName"],
            lastName: formState["LastName"],
            userType: formState["UserType"],
          };
          setDoc(usersRef, userData);
          setSignUpSuccess(true);
          setShowSuccessMessage(true);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Error Code: " + errorCode);
          console.log("Error Message: " + errorMessage);
          setSignUpSuccess(false);
          setShowSuccessMessage(false);
        });

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);
    } else {
      console.log("Form has validation errors.");
    }
  };

  const formFields = SIGNUP_FORM_FIELDS.map((field) => (
    <div
      className="form-container"
      key={field.id}
      style={{ display: "flex", alignItems: "center", marginBottom: "1px" }}
    >
      <label
        htmlFor={field.name}
        style={{
          flex: "0 0 auto",
          width: "150px", // Set a fixed width for the labels
          marginRight: "10px",
        }}
      >
        {field.title}:
      </label>
      {field.type === "select" ? (
        <Select
          labelId={`${field.name}-label`}
          id={field.name}
          value={formState[field.name]}
          onChange={(e) => updateField(field.name, e.target.value)}
          label={field.title}
          fullWidth
          required={field.required}
          sx={{
            backgroundColor: "#ffffff", // Set background color
            color: theme.palette.secondary.contrastText,
            margin: "0", // Use text color of the parent element
          }}
        >
          {field.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      ) : field.type === "radio" ? (
        <div>
          {field.options.map((option) => (
            <div key={option.value}>
              <input
                id={option.value}
                name={field.name}
                type="radio"
                value={option.value}
                checked={formState[field.name] === option.value}
                onChange={(e) => updateField(field.name, e.target.value)}
                required={field.required}
                style={{ margin: "0" }}
              />
              <label htmlFor={option.value}>{option.label}</label>
            </div>
          ))}
        </div>
      ) : (
        <input
          className=""
          value={formState[field.name]}
          onChange={(e) => updateField(field.name, e.target.value)}
          type={field.type}
          required={field.required}
          style={{ margin: "0" }}
        ></input>
      )}
      {errors[field.name] && (
        <p style={{ color: "red" }}>{errors[field.name]}</p>
      )}
    </div>
  ));

  //   const formFields = (
  //     <Box sx={{ maxHeight: "70vh", overflowY: "auto" }}>
  //       {SIGNUP_FORM_FIELDS.map((field) => (
  //         <div className="form-container" key={field.id}>
  //           <label htmlFor={field.name}>{field.title}:</label>
  //           {field.type === "radio" ? (
  //             <div>
  //               {field.options.map((option) => (
  //                 <div key={option.value}>
  //                   <input
  //                     id={option.value}
  //                     name={field.name}
  //                     type="radio"
  //                     value={option.value}
  //                     checked={formState[field.name] === option.value}
  //                     onChange={(e) => updateField(field.name, e.target.value)}
  //                     required={field.required}
  //                   />
  //                   <label htmlFor={option.value}>{option.label}</label>
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <input
  //               className=""
  //               value={formState[field.name]}
  //               onChange={(e) => updateField(field.name, e.target.value)}
  //               type={field.type}
  //               required={field.required}
  //             ></input>
  //           )}
  //           {errors[field.name] && (
  //             <p style={{ color: "red" }}>{errors[field.name]}</p>
  //           )}
  //         </div>
  //       ))}
  //     </Box>
  //   );

  useEffect(() => {
    if (signUpSuccess) {
      const redirectTimer = setTimeout(() => {
        console.log("Redirecting to SignIn page...");
        onUpdateIsRegistered(true);
      }, 2000);

      return () => clearTimeout(redirectTimer);
    }
  }, [signUpSuccess, onUpdateIsRegistered]);

  const handleFormSwitchSignIn = () => {
    onUpdateIsRegistered(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        style={{
          backgroundSize: "cover",
          height: "70vh",
          //   minHeight: "500px",
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
          overflowX: "hidden", // Hide horizontal overflow
          overflowY: "auto", // Enable vertical scrolling
          paddingLeft: "2rem", // Adjust left padding as needed
          paddingRight: "2rem",
          padding: "2rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              //   py: 3,
              //   px: 2,
              //   boxShadow: 1,
              borderRadius: 1,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#ffffff" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            {showSuccessMessage && (
              <div className="success-popup">
                <p>
                  Sign up successful! You are being routed to the Sign In
                  page...
                </p>
              </div>
            )}
            {!signUpSuccess && (
              <ThemeProvider theme={theme}>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    {formFields}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{
                        mt: "10px",
                        mr: "20px",
                        borderRadius: 28,
                        color: "#ffffff",
                        minWidth: "170px",
                        backgroundColor: "#FF9A01",
                      }}
                    >
                      Sign Up
                    </Button>
                    <Grid container justifyContent="space-around">
                      <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                        <Typography
                          variant="body1"
                          component="span"
                          sx={{ marginTop: "10px" }}
                        >
                          Already have an account?{" "}
                          <span
                            style={{ color: "#beb4fb", cursor: "pointer" }}
                            onClick={handleFormSwitchSignIn}
                          >
                            Sign in
                          </span>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                </form>
              </ThemeProvider>
            )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
