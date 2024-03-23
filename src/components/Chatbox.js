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
      stop: false,
    };
  }

  handleInputChange = (e) => {
    this.setState({
      userInput: e.target.value,
    });
  };

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

  // fetchDoctorsByDate = async (slotDate) => {
  //   const doctors = [];
  //   const slotQuery = query(collection(db, "Time Slots"), where("slotDate", "==", slotDate));
  //   const slotQuerySnap = await getDocs(slotQuery);
  //   slotQuerySnap.forEach(async (doc) => {
  //     let data = doc.data();
  //     let doctorInfo = await this.fetchDoctorById(data.doctorId);
  //     if(!doctors.some(doctor => doctor.firstName === doctorInfo.firstName)) {
  //       doctors.push(data)
  //     }
  //   });
  //   return doctors;
  // }

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
    const { userInput, messages, stop, timeSlots } = this.state;

    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    let updateMessages = [...messages, { text: userInput, user: "user" }];

    this.setState({ messages: updateMessages, userInput: "" });
    if (stop) {
      // if (isNaN(userInput) == true) {
      //   let parsedDate = userInput.split("/");
      //   let firebaseDateFormat = parsedDate[2] + "-" + parsedDate[0] + "-" + parsedDate[1];
      //   let availableTimeSlots = await this.fetchTimeSlots(firebaseDateFormat);
      //   this.setState({ timeSlots: availableTimeSlots });
      //   for (let i = 0; i < availableTimeSlots.length; i++) {
      //     if (i < 9) {
      //       let doctorInfo = await this.fetchDoctorById(availableTimeSlots[i].doctorId);
      //       let timeSlotStr = i + " - Start Time: " + availableTimeSlots[i].startTime + ", End Time: " + availableTimeSlots[i].endTime +
      //         ", Doctor Name: " + doctorInfo.firstName + " " + doctorInfo.lastName + ", Doctor Gender: " + doctorInfo.gender;
      //       updateMessages.push({ text: timeSlotStr, user: "bot" });
      //     } else {
      //       break;
      //     }
      //   }
      //   updateMessages.push({ text: "Type in the number of the time slot you would like!", user: "bot" });
      //   this.setState({ messages: updateMessages });
      // } else {
      //   // add patient id to slot
      //   let index = parseInt(userInput);
      //   let selectedSlot = timeSlots[index];
      //   let userId = this.props.userId
      //   selectedSlot.patientId = userId;
      //   // add updated slot to "booked time slots"
      //   await setDoc(doc(db, "Booked Time Slots", selectedSlot.slotId), selectedSlot)
      //   // remove slot from "time slots" collection
      //   await deleteDoc(doc(db, "Time Slots", selectedSlot.slotId));
      //   this.setState({ stop: false });
      // }
    } else {
      const userQuestion = new FormData();
      userQuestion.append('prompt', userInput);
      let userIntent = await this.fetchUserIntent(userQuestion);
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
      } else {
        let enabledDates = await this.fetchAvailableDates();
        this.setState({ stop: true });
        this.setState({ enabledDates: enabledDates });
        updateMessages = [
          ...this.state.messages,
          { text: "I would be glad to assist you in booking an appointment! What date would you like to book for?", user: "bot" },
        ];
      }
      this.setState({ messages: updateMessages });
    }
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
            this.setState({ stop: false });

            let updateMessages = [
              ...this.state.messages,
              { text: `Thank you for booking an appointment! You are all set for your appointment on ${this.state.selectedDate} with ${"Dr. " + doctorInfo.firstName + " " + doctorInfo.lastName}`, user: "bot" },
            ];
            this.setState({ messages: updateMessages, userInput: "" });
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
          {this.state.stop && this.renderAppointmentBooking()}
        </div>

      </div>
    );
  }
}
