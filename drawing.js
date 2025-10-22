const socket = io();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let currentColor = "#111827";
const colorPicker = document.getElementById("colorPicker");
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
});

function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight - 100);
    canvas.width = size;
    canvas.height = size;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let drawing = false;
let lastPos = null;

const timerEl = document.getElementById("timer");

socket.on("connect", () => {
  console.log("Connected, requesting canvas");
  socket.emit("requestCanvas")
});

socket.on("draw", (stroke) => drawLine(scale(stroke.from), scale(stroke.to), stroke.color, stroke.width));
socket.on("loadCanvas", (strokes) => strokes.forEach(s => drawLine(scale(s.from), scale(s.to), s.color, s.width)));
socket.on("setGoal", (goal) => document.getElementById("goal").textContent = `Goal: ${goal}`);
socket.on("timer", (ms) => updateTimer(ms));
socket.on("clearCanvas", () => {ctx.clearRect(0, 0, canvas.width, canvas.height)});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

function getPointerPos(e) {
  const rect = canvas.getBoundingClientRect();
  const point = e.touches ? e.touches[0] : e;
  return { x: (point.clientX - rect.left) / canvas.width, y: (point.clientY - rect.top) / canvas.height };
}

function scale(pos) { 
    return { x: pos.x * canvas.width, y: pos.y * canvas.height }; 
}

function drawLine(from, to, color = currentColor, width = 4) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function startDrawing(e) {
  e.preventDefault();
  drawing = true;
  lastPos = getPointerPos(e);
}

function stopDrawing(e) {
  e.preventDefault();
  drawing = false;
  lastPos = null;
}

function draw(e) {
  if (!drawing) return;
  e.preventDefault();
  const pos = getPointerPos(e);
  drawLine(scale(lastPos), scale(pos));

  socket.emit("draw", { from: lastPos, to: pos, color: currentColor, width: 4 });

  lastPos = pos;
}

function updateTimer(ms) {
    const sec = Math.floor(ms / 1000);
    const min = Math.floor(sec / 60);
    const seconds = sec % 60;
    timerEl.textContent = `Time left: ${min}:${seconds.toString().padStart(2, "0")}`;
}