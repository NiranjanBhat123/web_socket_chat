import React, { useState } from 'react';
import '../styles/Login.css';
import logo from '../assets/icon.avif'; 

function Login({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <img src={logo} alt="Chat App Logo" className="login-logo" />
        <h2>Welcome to ChatApp</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <button type="submit">Start Chatting</button>
      </form>
    </div>
  );
}

export default Login;