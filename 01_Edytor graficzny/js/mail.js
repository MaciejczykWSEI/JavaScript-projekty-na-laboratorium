
let container = document.getElementById('canvas');
let canvas, ctx, pos = { x: 0, y: 0 };
init(container, 800, 600, 'gray');

function createCanvas(parent, width, height) {
    let canvas = {};
    canvas.node = document.createElement('canvas');
    canvas.context = canvas.node.getContext('2d');
    canvas.node.id = "canvas-node";
    canvas.node.width = width || 50;
    canvas.node.height = height || 50;
    parent.appendChild(canvas.node);
    return canvas;
}

function init(container, width, height, fillColor) {
    canvas = createCanvas(container, width, height);
    ctx = canvas.context;
    ctx.fillCircle = function (x, y, radius, fillColor) {
        this.fillStyle = fillColor;
        this.beginPath();
        this.moveTo(x, y);
        this.arc(x, y, radius, 0, Math.PI * 2, false);
        this.fill();
    };
    ctx.clearTo = function (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, width, height);
    };
    ctx.clearTo(fillColor || "white");
}

document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}

function draw(e) {
    if (e.buttons !== 1) return;

    ctx.beginPath();

    ctx.lineWidth = document.getElementById('size').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('color').value;

    ctx.moveTo(pos.x - canvas.node.offsetLeft, pos.y - canvas.node.offsetTop);
    setPosition(e);
    ctx.lineTo(pos.x - canvas.node.offsetLeft, pos.y - canvas.node.offsetTop);

    ctx.stroke();
}
//Loading image
function loadImage() {
    let img = new Image();
    let file = document.getElementById("image");
    img.src = window.URL.createObjectURL(file.files[0]);
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.node.width, canvas.node.height);
    }
}
function display() {
   
    // loadImage();
    let filter = 
        "brightness(" + document.getElementById("brightness").value + "%) " + 
        "contrast(" + document.getElementById("contrast").value + "%) " +
        "blur(" + document.getElementById("blur").value + "px) " +
        "grayscale(" + document.getElementById("grayscale").value + ") " +
        "hue-rotate(" + document.getElementById("hue-rotate").value + "deg) " +
        "invert(" + document.getElementById("invert").value + "%) " + 
        "saturate(" + document.getElementById("saturate").value + "%) " + 
        "sepia(" + document.getElementById("sepia").value + "%) ";
    document.getElementById("canvas-node").style.filter = filter;
    //ctx.filter = filter;
    //ctx.drawImage(document.getElementById("canvas-node"), 0, 0);

}
