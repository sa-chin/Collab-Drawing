const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = 3000;

// Serve static files (index.html, drawing.js)
app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for draw events from clients
  socket.on("draw", (data) => {
    // Broadcast to all other clients
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});