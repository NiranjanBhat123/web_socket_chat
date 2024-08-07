import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatWindow.css';

function ChatWindow({ messages, selectedUser, currentUser, sendMessage, socket }) {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    
    const unreadMessages = messages.filter(msg => msg.to === currentUser && !msg.read);
    unreadMessages.forEach(msg => {
      socket.emit('messageRead', { messageId: msg.id, from: currentUser, to: selectedUser });
    });
  }, [messages, currentUser, selectedUser, socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-window">
      <h2>Chat with {selectedUser}</h2>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.from === currentUser ? 'sent' : 'received'}`}>
            <div className="message-content">
              <p>{msg.text}</p>
              <span className="message-time">
                {formatTime(msg.timestamp)}
                {msg.from === currentUser && (
                  <span className={`read-status ${msg.read ? 'read' : ''}`}>
                    ✓✓
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatWindow;