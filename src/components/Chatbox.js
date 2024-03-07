import React, { Component } from "react";
import axios from 'axios';
import { HfInference } from "@huggingface/inference";
import "../App.css";

export default class Chatbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userInput: "",
    };
  }

  handleInputChange = (e) => {
    this.setState({
      userInput: e.target.value,
    });
  };

  handleSendMessage = async () => {
    // const sseUrl = 'http://192.168.1.10:5000/events';
    // const eventSource = new EventSource(sseUrl);
    const { userInput, messages } = this.state;
    // const { messages, userInput } = this.state;

    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    let updateMessages = [...messages, { text: userInput, user: "user" }];

    this.setState({ messages: updateMessages, userInput: "" });
    const userQuestion = new FormData();
    userQuestion.append('prompt', userInput)
    axios.post('http://192.168.1.10:5000/userintent', userQuestion).then(response => {
      if(response.data.user_intent.includes("CHAT_WITH_CHATBOT")) {
        axios.post('http://192.168.1.10:5000/chatresponse', userQuestion).then(response => {
          console.log(response.data);
          updateMessages = [
            ...this.state.messages,
            { text: response.data.chat_response, user: "bot" },
          ];
          this.setState({ messages: updateMessages });
        }).catch(error => {
          console.error(error);
        });
      } else if(response.data.user_intent.includes("SEARCH_FOR_RESOURCES")) {
        axios.post('http://192.168.1.10:5000/process_query', {query: userInput}).then(response => {
          console.log("LINKS:", response.data.links);
          let top_5_links = response.data.links.slice(0, 5);
          let top5linkstr = "";
          for(let i = 0; i < top_5_links.length; i++) {
            top5linkstr += top_5_links[i];
            if(i != top_5_links.length - 1) {
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
          { text: "Appointment booking still being worked on!", user: "bot" },
        ];
        this.setState({ messages: updateMessages });
      }
    }).catch(error => {
      console.error(error);
    });
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
