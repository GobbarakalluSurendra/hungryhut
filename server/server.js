require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hungryhunt';

// Create HTTP Server and Socket.io instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ["GET", "POST"]
    }
});

// Attach io to app so we can use it in controllers
app.set('io', io);

io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);
    
    // Optional: Admin joins a specific room
    socket.on('join_admin', () => {
        socket.join('admin_room');
        console.log(`Socket ${socket.id} joined admin_room`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // IMPORTANT: listen on the `server` (http), not the `app` (express)
        server.listen(PORT, () => {
            console.log(`Server & Socket.IO are running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
    });