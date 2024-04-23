const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// size is brush size, isPressed is whether or not the mouse is held, color
// is brush color, and x and y are mouse position.
let size = 20;
let isPressed = false;
let inCanvas = false;
let color = 'black';
let x;
let y;
let mouseButton = 0;

ctx.beginPath();
ctx.strokeStyle = 'white';
ctx.fillStyle = 'white';
ctx.rect(0, 0,canvas.width, canvas.height);
ctx.stroke();
ctx.fill();

document.getElementById("increase").onclick = () => {
    // Size of brush goes up, and then the label is set
    let newValue = Number(document.getElementById("size").innerText) + 5;
    document.getElementById("size").innerText = newValue;
    size = newValue;
}

document.getElementById("decrease").onclick = () => {
    // Size of brush goes down, and then the label is set
    let newValue = Number(document.getElementById("size").innerText) - 5;
    document.getElementById("size").innerText = newValue;
    size = newValue;
}

document.getElementById("color").onchange = () => {
    // When the color input changes, so too does the square
    color = document.getElementById("color").value;
}

document.getElementById("clear").onclick = () => {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.rect(0, 0,canvas.width, canvas.height);
    ctx.stroke();
    ctx.fill();
}

// Part of the black box
document.getElementById("save").onclick = download;

canvas.addEventListener('mousedown', (e) => {
    // Sets the x and y, and draws a circle there, to allow for taps
    if (e.button != 2) {
        isPressed = true;
    } else {
        mouseButton = 2;
    }

    x = e.offsetX;
    y = e.offsetY;
    drawCircle(x, y);
});

document.addEventListener('mousedown', (e) => {
    // Set pressed even when outside canvas.
    if (e.button != 2) {
        isPressed = true;
    } else {
        mouseButton = 2;
    }
})

canvas.addEventListener('mouseup', (e) => {
    // Draws the line and sets the values to undefined. This draws the line in case the user draws a straight line using shift.
    isPressed = false;

    const x2 = e.offsetX;
    const y2 = e.offsetY;

    if (e.button == 2) {
        drawRect(x, y, x2, y2)
    } else {
        drawCircle(x, y);
        drawCircle(x2, y2);
        drawLine(x, y, x2, y2);
    }

    x = x2;
    y = y2;
    x = undefined;
    y = undefined;
});

document.addEventListener('mouseup', () => {
    // Set pressed even when outside canvas.
    isPressed = false;
    mouseButton = 0
})

canvas.addEventListener("mouseenter", (e) => {
    // Tells when the canvas is moused over
    inCanvas = true;
    x = e.offsetX;
    y = e.offsetY;
})

canvas.addEventListener('mouseleave', () => {
    // Tells when the canvas is moused over
    inCanvas = false;
})

canvas.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if(mouseButton == 0 && inCanvas && isPressed && !e.shiftKey) {
        // If the user isn't holding shift, draw as normal, using lines to prevent gaps.
        // If they are, a line tool is being used, so don't draw until it or the mouse is released.

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
    // This is kind of a black box to me since I plagarized it from a stack exchange page, but it saves the image so whatevs
    var download = document.getElementById("save");
    var image = canvas.toDataURL("image/png");
    console.log(image);
    download.href = image;
}

function drawRect(x1, y1, x2, y2) {
    drawCircle(x1, y1);
    drawLine(x1, y1, x1, y2);
    drawCircle(x1, y2);
    drawLine(x1, y2, x2, y2);
    drawCircle(x2, y2);
    drawLine(x2, y2, x2, y1);
    drawCircle(x2, y1);
    drawLine(x2, y1, x1, y1)
}