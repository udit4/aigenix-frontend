import React, { useState, useRef, useEffect } from 'react';
import './TemenosChatbot.css';

function TemenosChatbot() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Temenos Bank AI Assistant. How can I help you today? You can ask about FD rates, loans, or query a customer profile by entering a customer ID.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userQuery = inputValue;
    setInputValue('');

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://65.0.23.203:8000/api/v1';
      const response = await fetch(`${baseUrl}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userQuery }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to the assistant API.');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.response || 'No response returned.' }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Error: Unable to reach the Temenos services. (${err.message})` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="temenos-chat-container">
      {/* 1. Header */}
      <header className="temenos-chat-header">
        <h1 className="temenos-chat-title">
          Temenos Bank AI Assistant <span className="robot-emoji">🤖</span>
        </h1>
      </header>

      {/* 2. Messages area */}
      <div className="temenos-chat-messages-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`temenos-msg-wrapper ${msg.sender === 'user' ? 'msg-right' : 'msg-left'}`}
          >
            {/* Sender Label */}
            <span className="temenos-sender-label">
              {msg.sender === 'user' ? 'You' : 'Temenos Assistant'}
            </span>
            {/* Message Bubble */}
            <div className="temenos-msg-bubble">
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {/* 4. Typing Indicator */}
        {isLoading && (
          <div className="temenos-msg-wrapper msg-left">
            <span className="temenos-sender-label">Temenos Assistant</span>
            <div className="temenos-msg-bubble temenos-typing-bubble">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          </div>
        )}

        {/* Anchor for Auto Scroll */}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input area fixed at bottom */}
      <form onSubmit={handleSend} className="temenos-chat-input-row">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about FD rates, loans, or enter a customer ID..."
          className="temenos-chat-input"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="temenos-chat-send-btn"
          disabled={!inputValue.trim() || isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default TemenosChatbot;
