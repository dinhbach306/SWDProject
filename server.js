const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');
const { Server } = require('socket.io')
dotenv.config({ path: './config.env' });
const http = require("http")
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));


const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"]
  }
})
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`)
  socket.on('send_order', (data) => {
    console.log(data);
    socket.broadcast.emit('receive_order', data)

  })

})
// catch error if server not working
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
