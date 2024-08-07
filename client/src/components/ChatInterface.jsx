import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import ChatWindow from './ChatWindow';
import '../styles/ChatInterface.css';
import logo from '../assets/icon.avif';

function ChatInterface({ currentUser, users, socket, onLogout }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    socket.on('newMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        if (message.to === currentUser && message.from !== selectedUser) {
          setUnreadCounts((prev) => ({
            ...prev,
            [message.from]: (prev[message.from] || 0) + 1
          }));
        }
      });
  
      socket.on('messageReadUpdate', ({ messageId, reader }) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, read: true } : msg
          )
        );
      });
  

    socket.on('loadMessages', (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messageReadUpdate');
      socket.off('loadMessages');
    };
  }, [socket, currentUser, selectedUser]);

  const selectUser = (user) => {
    setSelectedUser(user);
    socket.emit('getMessages', user);
    setUnreadCounts((prev) => ({ ...prev, [user]: 0 }));
  };

  const sendMessage = (message) => {
    if (message.trim() && selectedUser) {
      socket.emit('sendMessage', { to: selectedUser, message });
    }
  };

  return (
    <div className="chat-interface">
      <div className="header">
        <img src={logo} alt="App Logo" className="app-logo" />
        <div className="user-info">
          <span className="user-icon">👤</span>
          <span>{currentUser}</span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="content">
        <UserList 
          users={users} 
          selectUser={selectUser} 
          selectedUser={selectedUser}
          unreadCounts={unreadCounts}
        />
        {selectedUser ? (
          <ChatWindow
            messages={messages.filter(
              msg => (msg.from === currentUser && msg.to === selectedUser) ||
                     (msg.from === selectedUser && msg.to === currentUser)
            )}
            selectedUser={selectedUser}
            currentUser={currentUser}
            sendMessage={sendMessage}
            socket={socket}
          />
        ) : (
          <div className="empty-chat">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInterface;