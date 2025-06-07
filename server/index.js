const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/drivers', require('./routes/drivers'));
app.use('/api/admin', require('./routes/admin'));

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/food_delivery')
  .then(() => console.log("MongoDB connecté"))
  .catch(err => console.error(err));

// Socket.IO
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('Client connecté via WebSocket');

  // Client -> Restaurant
  socket.on('order:request', (data) => {
    io.emit('order:requested', data);
  });

  // Restaurant -> Livreurs
  socket.on('order:acceptedByRestaurant', (data) => {
    io.emit('order:availableForDriver', data);
  });

  // Livreur -> Client
  socket.on('driver:acceptedOrder', (data) => {
    io.emit('order:confirmedToClient', data);
  });

  // Client -> Restaurant
  socket.on('client:confirmPreparation', (data) => {
    io.emit('order:startPreparation', data);
  });

  // Restaurant -> Livreur
  socket.on('order:readyForPickup', (data) => {
    io.emit('order:readyForDriver', data);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
});