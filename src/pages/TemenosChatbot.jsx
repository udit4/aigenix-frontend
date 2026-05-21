import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './TemenosChatbot.css';

function TemenosChatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Temenos Assistant. Ask me anything about customer details, transaction history, banking products, or our Temenos knowledge base.'
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

    // Add user message to state
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
        throw new Error('Failed to get response from chatbot API');
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
        { sender: 'bot', text: `Error: Could not connect to the assistant server. (${err.message})` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-layout">
      {/* Sidebar / Left Column */}
      <aside className="chatbot-sidebar glass-panel">
        <div className="sidebar-header" onClick={() => navigate('/status-tracker')}>
          <ArrowLeft size={18} className="back-icon" />
          <span>Back to Dashboard</span>
        </div>

        <div className="sidebar-brand">
          <div className="brand-logo">
            <Sparkles size={24} color="var(--accent-blue)" />
          </div>
          <div>
            <h3>Temenos Copilot</h3>
            <p>ACTIVE CONVERSATION</p>
          </div>
        </div>

        <div className="sidebar-info">
          <div className="info-section">
            <h4>MODEL PARAMETERS</h4>
            <div className="info-tag">Llama 3.1 8B</div>
            <div className="info-tag">Temperature: 0.2</div>
          </div>
          <div className="info-section">
            <h4>CONNECTED TOOLS</h4>
            <div className="info-tag tool-tag active">T24 Customer API</div>
            <div className="info-tag tool-tag active">Temenos Knowledge Base</div>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="system-status">
            <span className="status-indicator online"></span>
            <span>Copilot Service Online</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="chatbot-main">
        {/* Top Header */}
        <header className="chatbot-header glass-panel">
          <div className="header-info">
            <Bot size={24} className="bot-icon glow-blue" />
            <div>
              <h2>Temenos Assistant</h2>
              <p>Ask about accounts, profiles, products, or core banking processes.</p>
            </div>
          </div>
          <div className="header-actions">
            <button 
              className="reset-btn"
              onClick={() => setMessages([
                {
                  sender: 'bot',
                  text: 'Hello! I am your Temenos Assistant. Ask me anything about customer details, transaction history, banking products, or our Temenos knowledge base.'
                }
              ])}
            >
              <RefreshCw size={14} /> Clear Chat
            </button>
          </div>
        </header>

        {/* Messages Feed */}
        <div className="chatbot-feed glass-panel">
          <div className="feed-scrollarea">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
              >
                <div className="message-avatar">
                  {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="message-content">
                  <div className="message-sender-name">
                    {msg.sender === 'user' ? 'You' : 'Temenos Assistant'}
                  </div>
                  <div className="message-bubble">
                    <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="message-wrapper bot-msg typing-indicator">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="message-sender-name">Temenos Assistant</div>
                  <div className="message-bubble typing-bubble">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="chatbot-input-container glass-panel">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your query here (e.g. 'Show me profile for customer 100192')..."
            className="chat-input"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="send-button btn-primary"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send size={16} /> Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default TemenosChatbot;
