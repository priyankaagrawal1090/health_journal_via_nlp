import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import theme from "./../theme";
import Topnav from "./Topnav";
import * as React from "react";
import bgimg from "./../backimg.jpg";
import bglogin from "./../bglogin.jpg";
import SignIn from "./SignIn";
import SignUp from "./SignUp";


const Auth = () => {
  const bgstyle = {
    backgroundImage: `url(${bgimg})`,
    backgroundSize: "cover",
    height: "100vh",
    color: "#f5f5f5",
  };
  const boxstyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "75%",
    height: "70%",
    bgcolor: "background.paper",
    boxShadow: 24,
  };
  const loginBoxstyle = {
    backgroundImage: `url(${bglogin})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    marginTop: "40px",
    marginLeft: "15px",
    marginRight: "15px",
    height: "63vh",
    color: "#f5f5f5",
  };
  const signinBoxStyle = {
    backgroundSize: "cover",
    height: "70vh",
    minHeight: "500px",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  };
  const registerBoxStyle = {
    backgroundSize: "cover",
    height: "70vh",
    minHeight: "500px",
    backgroundColor: "#3b33d5",
  };
  const center = {
    position: "relative",
    top: "50%",
    left: "37%",
  };
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const [isRegistered, setIsRegistered] = React.useState(true);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const updateIsRegistered = (newValue) => {
    setIsRegistered(newValue);
  };

  const authForm = isRegistered ? (
    <SignIn onUpdateIsRegistered={updateIsRegistered} />
  ) : (
    <SignUp darkTheme={darkTheme} signinBoxStyle={signinBoxStyle} onUpdateIsRegistered={updateIsRegistered} />
  );

  const isXsOrSm = window.innerWidth < 960; // Check if the screen size is < md breakpoint
    console.log(isXsOrSm);
  return (
    <>
      <Topnav></Topnav>
      <div style={bgstyle}>
        <Box sx={boxstyle}>
          <Grid container>
            {isXsOrSm ? (
              <Grid item xs={12} sm={12} lg={6}>
                {authForm}
              </Grid>
            ) : (
              <>
                <Grid item xs={12} sm={12} lg={6} style={{ height: "100%" }}>
                  <Box style={loginBoxstyle} />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  {authForm}
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default Auth;
