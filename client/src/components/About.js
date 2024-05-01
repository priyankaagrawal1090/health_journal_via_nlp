import React, { useState, useEffect, useRef } from "react";
import Topnav from "./Topnav";
import Container from "@mui/material/Container";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import myVideo from "../video1.mp4";
import myGIF from "../giphy (1).gif";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export default function About() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      // Hide video controls
      video.controls = false;

      // Play video continuously
      video.loop = true;
      video.muted = true;
      video.play();
    }
  }, []);

  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Immediate mental health support.",
    "Tailored resources and information based on individual needs.",
    "Simplified appointment booking process.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change the interval time as needed (milliseconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Topnav></Topnav>
      <Container
        maxWidth="xl"
        spacing={4}
        style={{
          paddingTop: "20px",
        }}
      >
        <Grid container spacing={4}>
          {/* <Grid
            item
            xs={12}
            sm={6}
            // style={{
            //   justifyContent: "center",
            //   alignItems: "center",
            //   textAlign: "left",
            //   height: "50vh",
            //   marginTop: "50px",
            // }}
          > */}
          {/* <Grid container direction="column" spacing={2}> */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">
              Health Journal is revolutionizing in making mental healthcare
              accessible, efficient, and effective.
              <br />
              <br />
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
              Immediate mental health support.
              <br />
              Tailored resources and information based on individual needs.
              <br />
              Simplified appointment booking process.
              {/* {texts[textIndex]} */}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              display: "flex",
              justifyContent: "center",
              // alignItems: "center",
            }}
          >
            {/* Add your video here  */}
            <video
              ref={videoRef}
              autoplay
              // width="100%"
              // height="auto"
              style={{ maxWidth: "50%", height: "80%" }}
            >
              <source src={myVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* <img
              src={myGIF}
              alt="Animated GIF"
              style={{ maxWidth: "100%", height: "80%" }}
            /> */}
          </Grid>
          {/* </Grid> */}
          {/* </Grid> */}
        </Grid>
      </Container>
      <Container
        maxWidth="none"
        style={{ backgroundColor: "#f9f9f9f9", height: "50vh" }}
        spacing={4}
      >
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          style={{ height: "100%" }}
        >
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Personalized Treatment Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    Say goodbye to endless online searches. Our intuitive
                    chatbot is here to assist you 24/7. Simply ask about the
                    resources, and receive accurate and relevant information
                    instantly.
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Personalized Treatment Search
                </Typography>
                <Typography variant="body1">
                  Say goodbye to endless online searches. Our intuitive chatbot
                  is here to assist you 24/7. Simply ask about the resources,
                  and receive accurate and relevant information instantly.
                </Typography>
              </CardContent>
            </Card> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardHeader>
                <CardTitle>Seamless Appointment Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    Booking appointments has never been easier. By simply
                    chatting with our virtual assitant, patients can schedule
                    appointments with their preferred doctors, eliminating the
                    hassle of phone calls and waiting times.
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Seamless Appointment Booking
                </Typography>
                <Typography variant="body1">
                  Booking appointments has never been easier. With just a few
                  clicks, patients can schedule appointments with their
                  preferred doctors, eliminating the hassle of phone calls and
                  waiting times.
                </Typography>
              </CardContent>
            </Card> */}
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardHeader>
                <CardTitle>Efficient Doctor Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    Doctors have full control over their schedules with our
                    user-friendly portal. They can manage pending and upcoming
                    appointments, and update their availability in real-time.
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Efficient Doctor Portal
                </Typography>
                <Typography variant="body1">
                  Doctors have full control over their schedules with our
                  user-friendly portal. They can manage pending and upcoming
                  appointments, accept or reject bookings, and update their
                  availability in real-time.
                </Typography>
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
