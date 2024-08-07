import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import './styles/App.css';

const socket = io('http://localhost:4000');

function App() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('updateUsers', (updatedUsers) => {
      setUsers(updatedUsers.filter(name => name !== username));
    });

    return () => {
      socket.off('updateUsers');
    };
  }, [username]);

  const handleLogin = (name) => {
    setUsername(name);
    socket.emit('login', name);
  };

  const handleLogout = () => {
    socket.emit('logout');
    setUsername('');
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <ChatInterface
        currentUser={username}
        users={users}
        socket={socket}
        onLogout={handleLogout}
      />
    </div>
  );
}

export default App;