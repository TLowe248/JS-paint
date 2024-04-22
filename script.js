const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// size is brush size, isPressed is whether or not the mouse is held, color
// is brush color, and x and y are mouse position.
let size = 20;
let isPressed = false;
let color = 'black';
let x;
let y;

document.getElementById("increase").onclick = () => {
    let newValue = Number(document.getElementById("size").innerText) + 5;
    document.getElementById("size").innerText = newValue;
    size = newValue;
}

document.getElementById("decrease").onclick = () => {
    let newValue = Number(document.getElementById("size").innerText) - 5;
    document.getElementById("size").innerText = newValue;
    size = newValue;
}

document.getElementById("color").onchange = () => {
    color = document.getElementById("color").value;
}

document.getElementById("clear").onclick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById("save").onclick = download;

canvas.addEventListener('mousedown', (e) => {
    isPressed = true;

    x = e.offsetX;
    y = e.offsetY;
});

canvas.addEventListener('mouseup', (e) => {
    isPressed = false;

    const x2 = e.offsetX;
    const y2 = e.offsetY;

    drawCircle(x, y);
    drawCircle(x2, y2);
    drawLine(x, y, x2, y2);

    x = x2;
    y = y2;
    x = undefined;
    y = undefined;
});

canvas.addEventListener('mousemove', (e) => {
    if(isPressed && !e.shiftKey) {
        const x2 = e.offsetX;
        const y2 = e.offsetY;

        drawCircle(x, y);
        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);

        x = x2;
        y = y2;
    }
});

function drawCircle(x, y) {
    // draws a circle by arcing at the target location
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(x1, y1, x2, y2) {
    // Draws lines by targeting the line as a path and then making it a stroke.
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.stroke();
}

function download() {
    var download = document.getElementById("save");
    var image = canvas.toDataURL("image/png");
    console.log(image);
    download.href = image;
}