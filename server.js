const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

let canvas = []
let goals = ["cat", "dog", "tree", "frog", "iguana", "bison", "new york", "house", "lamp"]
let currentGoal = goals[Math.floor(Math.random() * goals.length)];

const RESET_INTERVAL = 5 * 60 * 1000
let timeLeft = RESET_INTERVAL

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.emit("loadCanvas", canvas);
    socket.emit("setGoal", currentGoal);
    socket.emit("timer", timeLeft);

    socket.on("draw", (stroke) => {
        canvas.push(stroke);
        socket.broadcast.emit("draw", stroke);
    });

    socket.on("requestCanvas", () => {
        socket.emit("loadCanvas", canvas);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

setInterval(() => {
    canvas = [];
    currentGoal = goals[Math.floor(Math.random() * goals.length)];
    io.emit("clearCanvas");
    io.emit("setGoal", currentGoal);
    timeLeft = RESET_INTERVAL;
    io.emit("timer", timeLeft);
    console.log("Canvas reset New Goal:", currentGoal);
}, RESET_INTERVAL);

setInterval(() => {
    timeLeft -= 1000;
    if (timeLeft < 0) timeLeft = 0;
    io.emit("timer", timeLeft);
}, 1000);

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});