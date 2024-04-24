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
let currentImage;

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
    if (mouseButton != 2 && !e.shiftKey) {
        drawCircle(e.offsetX, e.offsetY)
    }
    // sets current image, so that previews work
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Sets the x and y, and draws a circle there, to allow for taps
    isPressed = true;
    if (e.button == 2) {
        mouseButton = 2;
    }

    x = e.offsetX;
    y = e.offsetY;
});

document.addEventListener('mousedown', (e) => {
    currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // Set pressed even when outside canvas.
    isPressed = true;
    if (e.button == 2) {
        mouseButton = 2;
    }
})

canvas.addEventListener('mouseup', (e) => {
    // Draws the line and sets the values to undefined. This draws the line in case the user draws a straight line using shift.
    isPressed = false;

    const x2 = e.offsetX;
    const y2 = e.offsetY;

    if (!e.button == 2) {
        mouseButton = 2;
    } else {
        mouseButton = 0;
    }

    x = x2;
    y = y2;
    x = undefined;
    y = undefined;
    e.stopPropagation();
});

document.addEventListener('mouseup', () => {
    // Set pressed even when outside canvas.
    isPressed = false;
    mouseButton = 0
    ctx.putImageData(currentImage, 0, 0);
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
    if(isPressed) {
        if (mouseButton == 0) {
            if (e.shiftKey) {
                // if the line tool is being used, keep the preview a preview by setting the canvas to currentImage until release
                ctx.putImageData(currentImage, 0, 0);
            }
            // If the user isn't holding shift, draw as normal, using lines to prevent gaps.
            // If they are, a line tool is being used, so don't draw until it or the mouse is released.

            const x2 = e.offsetX;
            const y2 = e.offsetY;

            drawCircle(x, y);
            drawCircle(x2, y2);
            drawLine(x, y, x2, y2);

            if (!e.shiftKey) {
                x = x2;
                y = y2;
                currentImage = ctx.getImageData(0, 0, canvas.width, canvas.height)
                }
        } else {
            ctx.putImageData(currentImage,0,0)
            const x2 = e.offsetX;
            const y2 = e.offsetY;

            if (e.shiftKey) {
                drawHollowCircle(x, y, Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2)));
            } else {
                drawRect(x,y,x2,y2);
            }
        }
    }
});

document.addEventListener('mousemove', (e) => {
    e.preventDefault();
})

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
    if (document.getElementById("fill").checked) {
        ctx.fillRect(x1, y1, x2-x1, y2-y1)
    }
}

function drawHollowCircle(x1, y1, distance) {
    // draws a circle by arcing at the target location
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size * 2;
    ctx.arc(x, y, distance, 0, Math.PI * 2);
    ctx.stroke();
    if (document.getElementById("fill").checked) {
        ctx.fillStyle = color;
        ctx.fill();
    }
}