import * as React from "react";
import Topnav from "./Topnav";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import { Box } from "@mui/material";
import { Stack } from "@mui/material";
import bgimg from "./../backimg.jpg";
import "../App.css";

export default function About() {
  return (
    <>
      <Topnav></Topnav>
      <Container maxWidth="xl" spacing={4} style={{ height: "50vh" }}>
        <Grid xs={12} container spacing={4}>
          <Grid
            item
            xs={12}
            sm={6}
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              heigth: "50vh",
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item style={{ backgroundImage: `url(${bgimg})`,}}>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} style={{ 
              justifyContent: "center",
              alignItems: "center",
              textAlign: "left",
              heigth: "50vh",
          }}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="h4">
                  Health Journal is revolutionizing in making mental healthcare
                  accessible, efficient, and effective.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth='none' style={{ backgroundColor: "#f9f9f9f9", height: "50vh"}} spacing={4}>
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
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
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
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card>
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
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
