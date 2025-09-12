const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let drawing = false;
let lastPos = { x: 0, y: 0 };

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
  return { x: point.clientX - rect.left, y: point.clientY - rect.top };
}

function drawLine(from, to, color = '#111827', width = 4) {
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
  drawLine(lastPos, pos);
  lastPos = pos;
}