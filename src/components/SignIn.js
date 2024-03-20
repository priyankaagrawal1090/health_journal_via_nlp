// import React, { useState, useEffect } from "react";
// import { useFirebase } from "./FirebaseContext";
// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";
// import { Typography } from "@mui/material";
// import { Grid } from "@mui/material";
// import { Box } from "@mui/material";
// import Container from "@mui/material/Container";
// import Avatar from "@mui/material/Avatar";
// import TextField from "@mui/material/TextField";
// import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Stack from "@mui/material/Stack";
// import Checkbox from "@mui/material/Checkbox";
// import Button from "@mui/material/Button";
// import theme from "./../theme";
// import "../App.css";

// const SIGNIN_FORM_FIELDS = [
//   {
//     id: 0,
//     name: "Username",
//     title: "Username",
//     type: "text",
//     required: true,
//   },
//   {
//     id: 1,
//     name: "Password",
//     title: "Password",
//     type: "password",
//     required: true,
//   },
// ];

// const firebaseConfig = {
//   apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
//   authDomain: "mental-health-journal-2605e.firebaseapp.com",
//   projectId: "mental-health-journal-2605e",
//   storageBucket: "mental-health-journal-2605e.appspot.com",
//   messagingSenderId: "725820602981",
//   appId: "1:725820602981:web:b16539f99e4678bc51248c",
//   measurementId: "G-7V9YPQPLEP",
// };

// const app = initializeApp(firebaseConfig);

// export default function SignIn({ onUpdateIsRegistered }) {
//   // Firebase db
//   const db = useFirebase();
//   const auth = getAuth();

//   const navigate = useNavigate();
//   // Initialize form state based on SIGNIN_FORM_FIELDS
//   const initialFormState = SIGNIN_FORM_FIELDS.reduce((acc, field) => {
//     acc[field.name] = ""; // Initialize each field with an empty string
//     return acc;
//   }, {});

//   // Define a state variable with multiple form fields
//   const [formState, setFormState] = useState(initialFormState);
//   // Create a state variable to manage error messages
//   const [errors, setErrors] = useState({});
//   //
//   const [authErrors, setAuthErrors] = useState({});

//   const [signInSuccess, setSignInSuccess] = useState(false);
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);

//   const [currentUserId, setCurrentUserId] = useState("");

//   // Function to update a specific field in the form state
//   const updateField = (fieldName, value) => {
//     setFormState((prevFormState) => ({
//       ...prevFormState,
//       [fieldName]: value,
//     }));
//     // Validate the field and update errors state
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [fieldName]: validateField(fieldName, value),
//     }));
//   };

//   // Validation function for a specific field
//   const validateField = (fieldName, value) => {
//     // Check if the field is required and not empty for all required fields
//     if (
//       SIGNIN_FORM_FIELDS.find((field) => field.name === fieldName)?.required &&
//       !value.trim()
//     ) {
//       return `${fieldName} is required.`;
//     }
//     return ""; // No error
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Validate each field input before submitting
//     const newErrors = {};
//     SIGNIN_FORM_FIELDS.forEach((field) => {
//       newErrors[field.name] = validateField(field.name, formState[field.name]);
//     });

//     // Update errors state with the latest validation results
//     setErrors(newErrors);

//     // Check if there are no errors (i.e., form is valid)
//     if (Object.values(newErrors).every((error) => !error)) {
//       signInWithEmailAndPassword(
//         auth,
//         formState["Username"],
//         formState["Password"]
//       )
//         .then((userCredential) => {
//           const user = userCredential.user;
//           setCurrentUserId(user.uid);
//           setSignInSuccess(true);
//           setShowSuccessMessage(true);
//           console.log("Sign in SUCCESS! User :", user.email);
//         })
//         .catch((error) => {
//           const errorCode = error.code;
//           const errorMessage = error.message;
//           setSignInSuccess(false);
//           setShowSuccessMessage(false);
//           console.log("Sign in FAIL!");
//           console.log("Error Code: " + errorCode);
//           console.log("Error Message: " + errorMessage);
//         });
//       // Hide the success message after 5 seconds
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 1000); // 1000 milliseconds (adjust as needed)
//     } else {
//       // There are validation errors, handle them accordingly
//       console.log("Form has validation errors.");
//     }

//     console.log(formState);
//   };

//   const formFields = SIGNIN_FORM_FIELDS.map((field) => (
//     <div className="form-container">
//       <label htmlFor={field.name}>{field.title}:</label>
//       <input
//         className="form-field"
//         id={field.name}
//         value={formState[field.name]}
//         onChange={(e) => updateField(field.name, e.target.value)}
//         type={field.type}
//         required={field.required}
//       ></input>
//       {errors[field.name] && (
//         <p style={{ color: "red" }}>{errors[field.name]}</p>
//       )}
//       {authErrors[field.name] && (
//         <p style={{ color: "red" }}>{authErrors[field.name]}</p>
//       )}
//     </div>
//   ));

//   const [entries, setEntries] = useState([]);
//   const [currentUserType, setCurrentUserType] = useState("");

//   // Use useEffect to navigate to PatientUI/DoctorUI component after signInSuccess is set to true
//   useEffect(() => {
//     const fetchEntries = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "Users"));
//         const fetchedEntries = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setEntries(fetchedEntries);
//       } catch (error) {
//         console.error("Error fetching entries:", error);
//       }
//     };
//     // Fetch entries from DB to check the userType
//     fetchEntries();
//     const entry = entries.find((entry) => entry.uid === currentUserId);
//     if (entry && entry.hasOwnProperty("userType")) {
//       setCurrentUserType(entry.userType);
//     } else {
//       console.log(
//         "No entry found with the current user ID or userType property not present"
//       );
//     }

//     if (signInSuccess) {
//       // Simulate a redirect to the PatientUI/DoctorUI page
//       const redirectTimer = setTimeout(() => {
//         // Navigate to the SignIn component or route as needed
//         console.log("Signing In...");
//         if (currentUserType === "patient") {
//           navigate("/patient-ui");
//         } else if (currentUserType === "doctor") {
//           navigate("/doctor-ui");
//         }
//       }, 1000); // 1000 milliseconds (adjust as needed)
//       // Clear the timer if the component is unmounted
//       return () => clearTimeout(redirectTimer);
//     }
//   }, [
//     currentUserId,
//     currentUserType,
//     signInSuccess,
//     onUpdateIsRegistered,
//     navigate,
//     db,
//   ]);

//   const handleFormSwitchSignUp = () => {
//     onUpdateIsRegistered(false);
//   };

//   const [open, setOpen] = useState(false);
//   const [remember, setRemember] = useState(false);
//   const vertical = "top";
//   const horizontal = "right";

//   const handleSubmit2 = async (event) => {
//     setOpen(true);
//     event.preventDefault();
//     const data = new FormData(event.currentTarget);
//   };

//   const handleClose = (event, reason) => {
//     if (reason === "clickaway") {
//       return;
//     }
//     setOpen(false);
//   };

//   const darkTheme = createTheme({
//     palette: {
//       mode: "dark",
//     },
//   });

//   return (
//     <>
//       <Box
//         style={{
//           backgroundSize: "cover",
//           height: "70vh",
//           minHeight: "500px",
//           backgroundColor: theme.palette.primary.dark,
//           color: theme.palette.primary.contrastText,
//         }}
//       >
//         <ThemeProvider theme={darkTheme}>
//           <Container sx={{ textAlign: "center" }}>
//             <Box height={35} />
//             {/* <Box
//               sx={{
//                 position: "relative",
//                 top: "50%",
//                 left: "37%",
//               }}
              
//             > */}
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%", // Ensure the box takes up the full height of its parent
//               }}
//             >
//               <Avatar
//                 sx={{
//                   bgcolor: "#ffffff",
//                   mb: 2,
//                 }}
//               >
//                 <LockOutlinedIcon />
//               </Avatar>
//               <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
//                 Sign In
//               </Typography>
//             </Box>
//             {/* <Box
//               sx={{
//                 width: "100%", // Take up all available width
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 flexGrow: 1, // Grow to occupy remaining space
//                 height: "50",
//               }}
//             >
//               <Grid container spacing={1} justifyContent="center">
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="email"
//                     label="Username"
//                     name="email"
//                     autoComplete="email"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <TextField
//                     required
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type="password"
//                     id="password"
//                     autoComplete="new-password"
//                   />
//                 </Grid>
//               </Grid>
//             </Box> */}
//             <Box
//               component="form"
//               noValidate
//               onSubmit={handleSubmit2}
//               sx={{ mt: 2 }}
//             >
//               <Grid container spacing={1}>
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <TextField
//                     required
//                     fullWidth
//                     id="email"
//                     label="Username"
//                     name="email"
//                     autoComplete="email"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <TextField
//                     required
//                     fullWidth
//                     name="password"
//                     label="Password"
//                     type="password"
//                     id="password"
//                     autoComplete="new-password"
//                   />
//                 </Grid>
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <Stack direction="row" spacing={2}>
//                     <FormControlLabel
//                       sx={{ width: "60%" }}
//                       onClick={() => setRemember(!remember)}
//                       control={<Checkbox checked={remember} />}
//                       label="Remember me"
//                     />
//                     <Typography
//                       variant="body1"
//                       component="span"
//                       onClick={() => {
//                         navigate("/reset-password");
//                       }}
//                       style={{ marginTop: "10px", cursor: "pointer" }}
//                     >
//                       Forgot password?
//                     </Typography>
//                   </Stack>
//                 </Grid>
//                 <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     fullWidth="true"
//                     size="large"
//                     sx={{
//                       mt: "10px",
//                       mr: "20px",
//                       borderRadius: 28,
//                       color: "#ffffff",
//                       minWidth: "170px",
//                       backgroundColor: "#FF9A01",
//                     }}
//                   >
//                     Sign in
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
//                   <Stack direction="row" spacing={2}>
//                     <Typography
//                       variant="body1"
//                       component="span"
//                       style={{ marginTop: "10px" }}
//                     >
//                       Not registered yet?{" "}
//                       <span
//                         style={{ color: "#beb4fb", cursor: "pointer" }}
//                         onClick={() => {
//                           navigate("/register");
//                         }}
//                       >
//                         Create an Account
//                       </span>
//                     </Typography>
//                   </Stack>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Container>
//         </ThemeProvider>
//       </Box>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useFirebase } from "./FirebaseContext";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import theme from "./../theme";
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

const firebaseConfig = {
    apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
    authDomain: "mental-health-journal-2605e.firebaseapp.com",
    projectId: "mental-health-journal-2605e",
    storageBucket: "mental-health-journal-2605e.appspot.com",
    messagingSenderId: "725820602981",
    appId: "1:725820602981:web:b16539f99e4678bc51248c",
    measurementId: "G-7V9YPQPLEP",
  };
  

const app = initializeApp(firebaseConfig);

export default function SignIn({ onUpdateIsRegistered }) {
  const db = useFirebase();
  const auth = getAuth();
  const navigate = useNavigate();

  const initialFormState = SIGNIN_FORM_FIELDS.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formState, setFormState] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

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
      SIGNIN_FORM_FIELDS.find((field) => field.name === fieldName)?.required &&
      !value.trim()
    ) {
      return `${fieldName} is required.`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    SIGNIN_FORM_FIELDS.forEach((field) => {
      newErrors[field.name] = validateField(field.name, formState[field.name]);
    });
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => !error)) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formState["Username"],
          formState["Password"]
        );
        const user = userCredential.user;
        setCurrentUserId(user.uid);
        setSignInSuccess(true);
        setShowSuccessMessage(true);
        console.log("Sign in SUCCESS! User :", user.email);
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        setSignInSuccess(false);
        setShowSuccessMessage(false);
        console.log("Sign in FAIL!");
        console.log("Error Code: " + errorCode);
        console.log("Error Message: " + errorMessage);
      }
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 1000); 
    } else {
      console.log("Form has validation errors.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  const formFields = SIGNIN_FORM_FIELDS.map((field) => (
    <div className="form-container" key={field.id} style={{ display: "flex", alignItems: "center", marginBottom: "1px",  }}>
      <label htmlFor={field.name}>{field.title}:</label>
      <input
        className="form-field"
        id={field.name}
        name={field.name}
        value={formState[field.name]}
        onChange={handleChange}
        type={field.type}
        required={field.required}
      />
      {errors[field.name] && (
        <p style={{ color: "red" }}>{errors[field.name]}</p>
      )}
    </div>
  ));

  const [entries, setEntries] = useState([]);
  const [currentUserType, setCurrentUserType] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Users"));
        const fetchedEntries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(fetchedEntries);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
    const entry = entries.find((entry) => entry.uid === currentUserId);
    if (entry && entry.hasOwnProperty("userType")) {
      setCurrentUserType(entry.userType);
    } else {
      console.log(
        "No entry found with the current user ID or userType property not present"
      );
    }

    if (signInSuccess) {
      const redirectTimer = setTimeout(() => {
        console.log("Signing In...");
        if (currentUserType === "patient") {
          navigate("/patient-ui");
        } else if (currentUserType === "doctor") {
          navigate("/doctor-ui");
        }
      }, 1000);
      return () => clearTimeout(redirectTimer);
    }
  }, [
    currentUserId,
    currentUserType,
    signInSuccess,
    onUpdateIsRegistered,
    navigate,
    db,
  ]);

  const handleFormSwitchSignUp = () => {
    onUpdateIsRegistered(false);
  };

  return (
    <>
      <Box
        style={{
          backgroundSize: "cover",
          height: "70vh",
          minHeight: "500px",
          backgroundColor: theme.palette.primary.dark,
          color: theme.palette.primary.contrastText,
        }}
      >
        <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
          <Container sx={{ textAlign: "center" }}>
            <Box height={35} />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%", 
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#ffffff",
                  mb: 2,
                }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h4" sx={{ mb: 2 }}>
                Sign In
              </Typography>
            </Box>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {formFields}
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                  <Stack direction="row" spacing={2}>
                    <FormControlLabel
                      sx={{ width: "60%" }}
                      control={<Checkbox />}
                      label="Remember me"
                    />
                    <Typography
                      variant="body1"
                      component="span"
                      onClick={() => {
                        navigate("/reset-password");
                      }}
                      style={{ marginTop: "10px", cursor: "pointer" }}
                    >
                      Forgot password?
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: "5em", mr: "5em" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
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
                    Sign in
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ ml: "3em", mr: "3em" }}>
                  <Typography
                    variant="body1"
                    component="span"
                    style={{ marginTop: "10px" }}
                  >
                    Not registered yet?{" "}
                    <span
                      style={{ color: "#beb4fb", cursor: "pointer" }}
                      onClick={handleFormSwitchSignUp}
                    >
                      Create an Account
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Container>
        </ThemeProvider>
      </Box>
    </>
  );
}



