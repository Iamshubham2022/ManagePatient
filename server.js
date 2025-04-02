require('dotenv').config();
const express = require('express');
const http = require('http');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const { logRequest } = require('./utils/logger');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(logRequest);

// Initialize queueService with `io`
const queueService = require('./services/queueService');
queueService.init(io);

// Routes
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);

// Handle WebSocket Connections
io.on('connection', (socket) => {
    console.log('Client connected via Socket.IO');
    socket.emit('message', { message: 'Connected to ER queue updates' });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, io };
