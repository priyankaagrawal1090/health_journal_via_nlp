import React, { Component } from "react";
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

  handleSendMessage = () => {
    const { userInput, messages } = this.state;
    // const { messages, userInput } = this.state;

    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    const updateMessages = [...messages, { text: userInput, user: "user" }];

    this.setState({ messages: updateMessages, userInput: "" });

    // Simulate a response (for demo only)
    setTimeout(() => {
      const response = "This is a sample response.";

      // Add the response to the list
      const updateMessages = [
        ...this.state.messages,
        { text: response, user: "bot" },
      ];

      this.setState({ messages: updateMessages });
    }, 1000);
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
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
            onKeyPress={this.handleKeyPress}
          />
          <button onClick={this.handleSendMessage}>Send</button>
        </div>
        <div className="chat-messages">{this.renderMessages()}</div>
      </div>
    );
  }
}
