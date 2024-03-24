import React, { Component, useEffect } from "react";
import axios from 'axios';
import "../App.css";
import moment from "moment";
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const firebaseConfig = {
  apiKey: "AIzaSyDvXnjcl4fyhzIXxhN-NSJFom3DLonoih0",
  authDomain: "mental-health-journal-2605e.firebaseapp.com",
  projectId: "mental-health-journal-2605e",
  storageBucket: "mental-health-journal-2605e.appspot.com",
  messagingSenderId: "725820602981",
  appId: "1:725820602981:web:b16539f99e4678bc51248c",
  measurementId: "G-7V9YPQPLEP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default class Chatbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      enabledDates: [],
      timeSlots: [],
      filteredTimeSlots: [],
      doctorsForSelectedDate: [],
      selectedDate: "",
      selectedDoctorID: "",
      selectedDoctorName: "",
      selectedSlotId: "",
      userInput: "",
      isBookingAppointment: false,
      isCancelAppointment: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      userInput: e.target.value,
    });
  };

  resetState = () => {
    this.setState({
      enabledDates: [], 
      timeSlots: [], 
      filteredTimeSlots: [], 
      doctorsForSelectedDate: [], 
      selectedDate: "", 
      selectedDoctorID: "",
      selectedDoctorName: "",
      selectedSlotId: "",
    });
  }

  fetchTimeSlots = async (slotDate) => {
    const slots = [];
    const slotQuery = query(collection(db, "Time Slots"), where("slotDate", "==", slotDate));
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
      let data = doc.data();
      data.slotId = doc.id;
      slots.push(data);
    });
    return slots;
  }

  fetchBookedTimeSlots = async (slotDate) => {
    const slots = [];
    const slotQuery = query(collection(db, "Booked Time Slots"), where("slotDate", "==", slotDate));
    const slotQuerySnap = await getDocs(slotQuery);
    slotQuerySnap.forEach((doc) => {
      let data = doc.data();
      data.slotId = doc.id;
      slots.push(data);
    });
    return slots;
  }

  fetchAvailableDates = async () => {
    const slotDates = [];
    const slotDateQuery = query(collection(db, "Time Slots"));
    const slotDateQuerySnap = await getDocs(slotDateQuery);
    slotDateQuerySnap.forEach((doc) => {
      let data = doc.data();
      if (!slotDates.includes(data.slotDate)) {
        slotDates.push(data.slotDate);
      }
    });
    return slotDates;
  }

  fetchBookedDates = async (userId) => {
    const slotDates = [];
    const slotDateQuery = query(collection(db, "Booked Time Slots"), where("userId", "==", userId));
    const slotDateQuerySnap = await getDocs(slotDateQuery);
    slotDateQuerySnap.forEach((doc) => {
      let data = doc.data();
      if (!slotDates.includes(data.slotDate)) {
        slotDates.push(data.slotDate);
      }
    });
    return slotDates;
  }

  fetchSlotsByDoctorID = (doctorID) => {
    const filteredSlots = [];
    this.state.timeSlots.forEach((slot) => {
      if (slot.doctorId == doctorID) {
        filteredSlots.push(slot);
      }
    });
    return filteredSlots;
  }

  fetchDoctorById = async (doctorId) => {
    const doctorDocRef = doc(db, "Users", doctorId);
    const doctorDataSnap = await getDoc(doctorDocRef);
    if (doctorDataSnap.exists()) {
      return doctorDataSnap.data();
    }
    return null;
  }

  fetchResources = async (userInput) => {
    let response = await axios.post('http://192.168.1.10:5000/process_query', { query: userInput });
    let top_5_links = response.data.links.slice(0, 5);
    let top5linkstr = "";
    for (let i = 0; i < top_5_links.length; i++) {
      top5linkstr += top_5_links[i];
      if (i != top_5_links.length - 1) {
        top5linkstr += '\n\n';
      }
    }
    return top5linkstr;
  }

  fetchUserAppointments = async (userId) => {
    const patientAppointments = [];
    const patientTimeSlotsQuery = query(collection(db, "Booked Time Slots"), where("userId", "==", userId));
    const patientTimeSlotsQuerySnap = await getDocs(patientTimeSlotsQuery);
    patientTimeSlotsQuerySnap.forEach((doc) => {
      let data = doc.data();
      patientAppointments.push(data);
    });
    return patientAppointments;
  }

  fetchChatResponse = async (userQuestion) => {
    let response = await axios.post('http://192.168.1.10:5000/chatresponse', userQuestion);
    return response.data.chat_response;
  }

  fetchUserIntent = async (userQuestion) => {
    let response = await axios.post('http://192.168.1.10:5000/userintent', userQuestion);
    let labels = response.data.user_intent;
    labels.sort((a, b) => b.score - a.score);
    return labels[0].label;
  }

  handleSendMessage = async () => {
    const { userInput, messages, isBookingAppointment, isCancelAppointment, timeSlots } = this.state;

    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    let updateMessages = [...messages, { text: userInput, user: "user" }];

    this.setState({ messages: updateMessages, userInput: "" });

    const userQuestion = new FormData();
    userQuestion.append('prompt', userInput);
    let userIntent = await this.fetchUserIntent(userQuestion);
    if(isBookingAppointment || isCancelAppointment) {
      this.resetState();
      this.setState({isBookingAppointment: false});
      this.setState({isCancelAppointment: false});
    }
    if (userIntent === "chat" || userIntent === "question") {
      let chatResponse = await this.fetchChatResponse(userQuestion);
      updateMessages = [
        ...this.state.messages,
        { text: chatResponse, user: "bot" },
      ];
    } else if (userIntent === "search for resources") {
      let urls = await this.fetchResources(userInput);
      updateMessages = [
        ...this.state.messages,
        { text: urls, user: "bot" },
      ];
    } else if (userIntent === "view appointments") {

      let patientAppointments = await this.fetchUserAppointments(this.props.userId);
      let patientApptInfo = [{ text: `You currently have ${patientAppointments.length} upcoming appointments`, user: "bot" }];
      for (let i = 0; i < patientAppointments.length; i++) {
        let doctorInfo = await this.fetchDoctorById(patientAppointments[i].doctorId);
        patientAppointments[i].doctorEmail = doctorInfo.email;
        patientAppointments[i].doctorFName = doctorInfo.firstName;
        patientAppointments[i].doctorLName = doctorInfo.lastName;
        let apptInfoStr = "You have an appointment with Dr. " + doctorInfo.firstName + " " + doctorInfo.lastName + " on " + patientAppointments[i].slotDate +
          " from " + patientAppointments[i].startTime + " to " + patientAppointments[i].endTime;
        patientApptInfo.push({ text: apptInfoStr, user: "bot" });
      }
      updateMessages = [
        ...this.state.messages,
        ...patientApptInfo,
      ];
    } else if (userIntent == "cancel appointment") {
      let enabledDates = await this.fetchBookedDates(this.props.userId);
      this.setState({ isCancelAppointment: true });
      this.setState({ enabledDates: enabledDates });
      updateMessages = [
        ...this.state.messages,
        { text: "I would be glad to assist you in cancelling an appointment!", user: "bot" },
      ];
    } else {
      let enabledDates = await this.fetchAvailableDates();
      this.setState({ isBookingAppointment: true });
      this.setState({ enabledDates: enabledDates });
      updateMessages = [
        ...this.state.messages,
        { text: "I would be glad to assist you in booking an appointment! What date would you like to book for?", user: "bot" },
      ];
    }
    this.setState({ messages: updateMessages });
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default form submission behavior
      this.handleSendMessage();
    }
  };

  renderMessages() {
    return this.state.messages.map((message, index) => (
      <div key={index} className={`${message.user}`}>
        <div className={`${message.user}-bubble`}>{message.user}</div>
        {/* <div className={`${message.user}-text-bubble`}>{message.user}</div> */}
        <div className="message-text">{message.text}</div>
      </div>
    ));
  }
  renderAppointmentCancel() {
    return (
      <div>
        <DatePicker selected={this.state.selectedDate} onChange={async date => {
          this.setState({ selectedDate: date });
          let bookedSlots = await this.fetchBookedTimeSlots(moment(date).format('YYYY-MM-DD'));
          this.setState({ timeSlots: bookedSlots });
        }}
          filterDate={(d) => this.state.enabledDates.includes(moment(d).format('YYYY-MM-DD'))}
        />
        <br />
        <br />
        {this.state.timeSlots.length != 0 &&
          <select value={this.state.selectedSlotId} onChange={(e) => {
            this.setState({ selectedSlotId: e.target.value });
          }}>
            <option value="" selected disabled hidden>Choose here</option>
            {this.state.timeSlots.map(slot => <option value={slot.slotId}>{"Appointment Time " + slot.startTime + "-" + slot.endTime}</option>)}
          </select>
        }
        <br />
        <br />
        {this.state.selectedSlotId !== "" &&
          <button onClick={async () => {
            let selectedSlot = this.state.timeSlots.filter(slot => {
              return slot.slotId === this.state.selectedSlotId;
            });
            delete selectedSlot[0]['userId'];
            await setDoc(doc(db, "Time Slots", this.state.selectedSlotId), selectedSlot[0])
            await deleteDoc(doc(db, "Booked Time Slots", this.state.selectedSlotId));
            this.setState({ isCancelAppointment: false });
            let updateMessages = [
              ...this.state.messages,
              { text: "Thank you for allowing us to help you cancel your appointment! Have a great day!", user: "bot" },
            ];
            this.setState({ messages: updateMessages, userInput: "" });
            this.resetState();
          }}>Cancel Appointment</button>
        }
      </div>);
  }

  renderAppointmentBooking() {
    return (
      <div>
        <DatePicker selected={this.state.selectedDate} onChange={async date => {
          this.setState({ selectedDate: date });
          let doctors = [];
          let timeSlots = await this.fetchTimeSlots(moment(date).format('YYYY-MM-DD'));
          this.setState({ timeSlots: timeSlots });
          for (let i = 0; i < timeSlots.length; i++) {
            let doctorInfo = await this.fetchDoctorById(timeSlots[i].doctorId);
            if (!doctors.some(doctor => doctor.firstName === doctorInfo.firstName)) {
              doctors.push(doctorInfo);
            }
          }
          this.setState({ doctorsForSelectedDate: doctors });
        }}
          filterDate={(d) => this.state.enabledDates.includes(moment(d).format('YYYY-MM-DD'))}
        />
        <br />
        <br />
        {this.state.doctorsForSelectedDate.length != 0 &&
          <select value={this.state.selectedDoctorID} onChange={(e) => {
            this.setState({ selectedDoctorID: e.target.value });
            let filteredSlots = this.fetchSlotsByDoctorID(e.target.value);
            this.setState({ filteredTimeSlots: filteredSlots });
          }
          }>
            <option value="" selected disabled hidden>Choose here</option>
            {this.state.doctorsForSelectedDate.map(doctor => <option value={doctor.uid}>{"Dr. " + doctor.firstName + " " + doctor.lastName}</option>)}
          </select>

        }
        <br />
        <br />
        {this.state.selectedDoctorID !== "" &&
          <select value={this.state.selectedSlotId} onChange={(e) => {
            this.setState({ selectedSlotId: e.target.value });
          }}>
            <option value="" selected disabled hidden>Choose here</option>
            {this.state.filteredTimeSlots.map(slot => <option value={slot.slotId}>{"Appointment Time " + slot.startTime + "-" + slot.endTime}</option>)}
          </select>
        }
        <br />
        <br />
        {this.state.selectedSlotId !== "" &&
          <button onClick={async () => {
            let userId = this.props.userId
            let doctorInfo = await this.fetchDoctorById(this.state.selectedDoctorID);
            let selectedSlot = this.state.filteredTimeSlots.filter(slot => {
              return slot.slotId === this.state.selectedSlotId;
            });
            selectedSlot[0].userId = userId;
            // add updated slot to "booked time slots"
            await setDoc(doc(db, "Booked Time Slots", this.state.selectedSlotId), selectedSlot[0])
            // remove slot from "time slots" collection
            await deleteDoc(doc(db, "Time Slots", this.state.selectedSlotId));
            this.setState({ isBookingAppointment: false });

            let updateMessages = [
              ...this.state.messages,
              { text: `Thank you for booking an appointment! You are all set for your appointment on ${this.state.selectedDate} with ${"Dr. " + doctorInfo.firstName + " " + doctorInfo.lastName}`, user: "bot" },
            ];
            this.setState({ messages: updateMessages, userInput: "" });
            this.resetState();
          }}>Book Appointment</button>
        }
      </div>
    );
  }

  render() {
    return (
      <div className="chat-container">
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={this.state.userInput}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyDown}
          />
          <button onClick={this.handleSendMessage}>Send</button>
        </div>

        <div className="chat-messages">
          {this.renderMessages()}
          {this.state.isCancelAppointment && this.renderAppointmentCancel()}
          {this.state.isBookingAppointment && this.renderAppointmentBooking()}
        </div>

      </div>
    );
  }
}
