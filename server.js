const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});