import React, { Component, useEffect } from "react";
import axios from 'axios';
import "../App.css";
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, where } from 'firebase/firestore';

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
      timeSlots: [],
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
    console.log(slots);
    return slots;
  }
  fetchDoctorById = async (doctorId) => {
    const doctorDocRef = doc(db, "Users", doctorId);
    const doctorDataSnap = await getDoc(doctorDocRef);
    if(doctorDataSnap.exists()) {
      return doctorDataSnap.data();
    }
    return null;
  }

  handleSendMessage = async () => {
    const { userInput, messages, stop, timeSlots } = this.state;
    if(userInput !== ""){
      this.props.showWelcomeText(false);
    }
    if (userInput.trim() === "") return; // Prevent sending empty messages


    // Add the user's message to the list
    let updateMessages = [...messages, { text: userInput, user: "user" }];


    

    // useEffect(() => {
      
    // }, [messages]);

    this.setState({ messages: updateMessages, userInput: "" });

    if (stop) {
      if(isNaN(userInput) === true) {
        let parsedDate = userInput.split("/");
        let firebaseDateFormat = parsedDate[2] + "-" + parsedDate[0] + "-" + parsedDate[1];
        let availableTimeSlots = await this.fetchTimeSlots(firebaseDateFormat);
        this.setState({timeSlots: availableTimeSlots});
        for(let i = 0; i < availableTimeSlots.length; i++) {
          if(i < 9) {
            let doctorInfo = await this.fetchDoctorById(availableTimeSlots[i].doctorId);
            let timeSlotStr = i + " - Start Time: " + availableTimeSlots[i].startTime + ", End Time: " + availableTimeSlots[i].endTime + 
            ", Doctor Name: " + doctorInfo.firstName + " " + doctorInfo.lastName + ", Doctor Gender: " + doctorInfo.gender;
            updateMessages.push({ text: timeSlotStr, user: "bot" });          
          } else {
            break;
          }
        }
        updateMessages.push({ text: "Type in the number of the time slot you would like!", user: "bot" });   
        this.setState({ messages: updateMessages });
      } else {
        // add patient id to slot
        let index = parseInt(userInput);
        let selectedSlot = timeSlots[index];
        let userId = this.props.userId
        selectedSlot.patientId = userId;
        // add updated slot to "booked time slots"
        await setDoc(doc(db, "Booked Time Slots", selectedSlot.slotId), selectedSlot)
        // remove slot from "time slots" collection
        await deleteDoc(doc(db, "Time Slots", selectedSlot.slotId));
      }
    } else {
      const userQuestion = new FormData();
      userQuestion.append('prompt', userInput)
      axios.post('http://192.168.1.10:5000/userintent', userQuestion).then(response => {
        if (response.data.user_intent.includes("CHAT_WITH_CHATBOT")) {
          axios.post('http://192.168.1.10:5000/chatresponse', userQuestion).then(response => {
            updateMessages = [
              ...this.state.messages,
              { text: response.data.chat_response, user: "bot" },
            ];
            this.setState({ messages: updateMessages });
          }).catch(error => {
            console.error(error);
          });
        } else if (response.data.user_intent.includes("SEARCH_FOR_RESOURCES")) {
          axios.post('http://192.168.1.10:5000/process_query', { query: userInput }).then(response => {
            let top_5_links = response.data.links.slice(0, 5);
            let top5linkstr = "";
            for (let i = 0; i < top_5_links.length; i++) {
              top5linkstr += top_5_links[i];
              if (i !== top_5_links.length - 1) {
                top5linkstr += '\n\n';
              }
            }
            updateMessages = [
              ...this.state.messages,
              { text: top5linkstr, user: "bot" },
            ];
            this.setState({ messages: updateMessages });
          }).catch(error => {
            console.error(error);
          });

        } else {
          updateMessages = [
            ...this.state.messages,
            { text: "I would be glad to assist you in booking an appointment! What date would you like to book for? Enter the date in the format mm/dd/yyyy", user: "bot" },
          ];
          this.setState({ stop: true, messages: updateMessages });
        }
      }).catch(error => {
        console.error(error);
      });
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
        <div className="chat-messages">{this.renderMessages()}</div>
      </div>
    );
  }
}
