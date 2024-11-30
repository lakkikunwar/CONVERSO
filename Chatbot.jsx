import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles for DatePicker
import axios from "axios"; // Import axios for HTTP requests
import Navbar from "./Navbar";

// For voice-to-text
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const Chatbot = () => {
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // Store the selected date
  const [isListening, setIsListening] = useState(false); // For voice input state
  const chatEndRef = useRef(null); // Reference to the bottom of the chat area

  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Scroll to the bottom of the chat area whenever chatLog updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  // Handle voice input
  const handleStartVoiceInput = () => {
    if (!recognition) {
      addChatMessage("bot", "Voice recognition is not supported on this browser.");
      return;
    }

    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      addChatMessage("user", transcript);
      sendMessage(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("Voice recognition error:", event.error);
      addChatMessage("bot", "Sorry, I couldn't understand. Please try again.");
    };
  };

  const handleButtonClick = async (presetText) => {
    addChatMessage("user", presetText);
    await sendMessage(presetText); // Automatically send the message
  };

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (chatInput.trim() === "") return;

    // Add the user's message to the chat log
    addChatMessage("user", chatInput);
    await sendMessage(chatInput);

    // Clear the input after sending the message
    setChatInput("");
  };

  const sendMessage = async (message) => {
    try {
      // Send the user's message to the backend
      const response = await axios.post("http://localhost:5000/chat", {
        message,
      });

      // Get the response message from the backend and display it in the chat log
      const botMessage = response.data.message;
      addChatMessage("bot", botMessage);
    } catch (error) {
      console.error("Error sending message to backend:", error);
      addChatMessage("bot", "Sorry, something went wrong.");
    }
  };

  const addChatMessage = (sender, message) => {
    setChatLog((prevLog) => [...prevLog, { sender, message }]);
  };

  // Function to handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = date ? date.toLocaleDateString() : "";
    const message = `Show me bills for ${formattedDate}`;
    addChatMessage("user", message);
    sendMessage(message);
  };

  return (
    <div className="chatbot">
      <Navbar />
      <header className="chatbot-header">
        <h1>Chat with conversoDB</h1>
      </header>

      <div className="chatbot-body">
        <div className="buttons-container">
          <div className="options-panel">
            <h3>Quick Options:</h3>
            <button onClick={() => handleButtonClick("Display Bills")}>Display Bills</button>
            <button onClick={() => handleButtonClick("Add Item")}>Add Item</button>
            <button onClick={() => handleButtonClick("Get User Details")}>Get User Details</button>
            <button onClick={() => handleButtonClick("Update Item")}>Update Item</button>
            <button onClick={() => handleButtonClick("Delete Item")}>Delete Item</button>
            <button onClick={() => handleButtonClick("Search Item")}>Search Item</button>
            <button onClick={() => handleButtonClick("Help")}>Help</button>
          </div>

          {/* Calendar Section */}
          <div className="calendar-section">
            <h3>Select a Date:</h3>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select a day"
              className="calendar-input"
            />
          </div>
        </div>

        <div className="chat-display-container">
          <div className="chat-display">
            {chatLog.map((chat, index) => (
              <div
                key={index}
                className={`chat-message ${chat.sender === "user" ? "user" : "bot"}`}
                dangerouslySetInnerHTML={{ __html: chat.message }} // Render HTML content
              />
            ))}
            <div ref={chatEndRef}></div> {/* Invisible element to scroll into view */}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
              placeholder="Type your message here..."
            />
            <button onClick={handleSendMessage}>Send</button>
            <button
              onClick={handleStartVoiceInput}
              disabled={isListening}
              className="voice-input-button"
            >
              <i className={`fa-solid fa-microphone ${isListening ? "listening" : ""}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
