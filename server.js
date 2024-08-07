const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const users = new Map();
const messages = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('login', (username) => {
    users.set(socket.id, username);
    io.emit('updateUsers', Array.from(users.values()));
  });

  socket.on('sendMessage', ({ to, message }) => {
    
    
    const from = users.get(socket.id);
    const newMessage = { 
      id: Date.now(), 
      from, 
      to, 
      text: message, 
      timestamp: new Date().toISOString(),
      read: false
    };
    
    if (!messages.has(from)) {
      messages.set(from, new Map());
    }
    if (!messages.get(from).has(to)) {
      messages.get(from).set(to, []);
    }
    messages.get(from).get(to).push(newMessage);

    if (!messages.has(to)) {
      messages.set(to, new Map());
    }
    if (!messages.get(to).has(from)) {
      messages.get(to).set(from, []);
    }
    messages.get(to).get(from).push(newMessage);

    
    socket.emit('newMessage', newMessage);
    const recipientSocket = Array.from(io.sockets.sockets.values()).find(
      (s) => users.get(s.id) === to
    );
    if (recipientSocket) {
      recipientSocket.emit('newMessage', newMessage);
    }
  });

  socket.on('getMessages', (otherUser) => {
    const currentUser = users.get(socket.id);
    const userMessages = messages.get(currentUser);
    const chatMessages = userMessages ? userMessages.get(otherUser) || [] : [];
    socket.emit('loadMessages', chatMessages);
  });

  socket.on('logout', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('updateUsers', Array.from(users.values()));
    console.log(`User ${username} logged out`);
  });

  socket.on('messageRead', ({ from, to, messageId }) => {
    const senderSocket = Array.from(io.sockets.sockets.values()).find(
        (s) => users.get(s.id) === to
      );
      if (senderSocket) {
        senderSocket.emit('messageReadUpdate', { messageId, reader: from });
      }
  });
  

  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    io.emit('updateUsers', Array.from(users.values()));
    console.log(`Client disconnected: ${username}`);
  });
});

const PORT = 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));