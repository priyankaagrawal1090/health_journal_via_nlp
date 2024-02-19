import React, { Component } from "react";

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
    const hf = new HfInference("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");
    const { userInput, messages } = this.state;
    // const { messages, userInput } = this.state;

    if (userInput.trim() === "") return; // Prevent sending empty messages

    // Add the user's message to the list
    let updateMessages = [...messages, { text: userInput, user: "user" }];

    this.setState({ messages: updateMessages, userInput: "" });

    let output = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: userInput,
      parameters: {
        max_new_tokens: 125,
      }
    });
    let output_trimmed = output.generated_text.substring(userInput.length);
    let output_complete = output_trimmed.match(/\(?[^\.\?\!]+[\.!\?]\)?/g);
    let last_sentence = output_complete.at(output_complete.length - 1);
    if(last_sentence.charAt(last_sentence.length - 1) == '?') {
      output_complete = output_complete.slice(0, output_complete.length - 1);
    }
    //Add the response to the list
    updateMessages = [
      ...this.state.messages,
      { text: output_complete.toString(), user: "bot" },
    ];

    this.setState({ messages: updateMessages });

    // Simulate a response (for demo only)
    // setTimeout(() => {
    //     let response = 'Sample response from bot';

    //     // Add the response to the list
    //     const updateMessages = [...this.state.messages, { text: response, user: 'bot'}];

    //     this.setState({ messages: updateMessages });
    // }, 1000);
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
