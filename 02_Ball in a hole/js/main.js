// CANVAS SETUP
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");


// GYROSCOPE CONTROLS
const orientation = { beta: 0, gamma: 0 }
window.addEventListener('deviceorientation', setOrientation);

function setOrientation(e) { //Zmienia wartości przechylenia telefonu
    orientation.beta = e.beta;
    orientation.gamma = e.gamma;
}


// GAME
let bestTime = 0;
let currentTime = 0;
let ball;
let ghost;
let holes = [];
let walls = [];
let teleportsIn = [];
let teleportsOut = [];
let objects = [];
let nextFrame;

function loadResources() {

    const wall1 = new Wall(0, 500, canvas.width, 50, true);
    const wall2 = new Wall(400, 0, 50, canvas.height, false);
    walls.push(wall1, wall2);

    const bg = new Rectangle(0, 0, canvas.width, canvas.height, 'white');
    ball = new Ball(50, 50);

    ghost = new Ghost(canvas.width/2, 900);

    holes = [];
    holes.push(new Hole(100, 400))
    holes.push(new Hole(200, 800))
    holes.push(new Hole(500, 50))
    holes.push(new Hole(650, 840))

    teleportsIn = [];
    teleportsIn.push(new TeleportIn(350, 450));
    teleportsIn.push(new TeleportIn(670, 50));
    teleportsIn.push(new TeleportIn(250, 600));
    teleportsIn.push(new TeleportIn(670, 950));

    teleportsOut = [];
    teleportsOut.push(new TeleportOut(50, 50));
    teleportsOut.push(new TeleportOut(50, 950));
    teleportsOut.push(new TeleportOut(500, 450));
    teleportsOut.push(new TeleportOut(600, 600));

    objects = [bg, ...holes, ...walls, ...teleportsIn, ...teleportsOut, ball, ghost];

    displayBestTime();
    displayCurrentTime();
}

function displayCurrentTime() {
    document.querySelector('.current-time').textContent = currentTime;
}
function displayBestTime() {
    document.querySelector('.best-time').textContent = bestTime;
}

function gameOver() {
    const gameover = document.querySelector('.gameover');

    if (currentTime > bestTime) { //Zaaktualizuj najlepszy czas
        bestTime = currentTime;
        displayBestTime();
    }

    //Zresetuj grę
    ball.x = 50;
    ball.y = 50;
    ball.speed = {x: 0, y: 0};
    ghost.x = canvas.width/2;
    ghost.y = 900;
    ghost.speed = 1;
    currentTime = 0;
    displayCurrentTime();

    gameover.style.display = "block"; //Wyświetl napis game over

    setTimeout(()=> { 
        gameover.style.display = "none"; //Ukryj napis game over
    }, 1600)
}

function timer() {
    setInterval(() => {
        currentTime++;
        displayCurrentTime();
        
        if (currentTime % 5 === 0) { //Przyśpiesz ducha (zwiększenie trudności)
            ghost.speed += 0.2;
        }
    }, 1000);
}

function refreshFrame() {
    
    ball.changePos(); //Rusz kulką
    ball.controlBorders(); //Kontroluj odbicia od zewznętrznych ścian
    ball.controlWalls(); //Kontroluj odbicia od wewnętrznych ścian
    ball.controlGhost() //Kontroluj zderzenia z duchem
    ball.controlHoles() //Kontroluj wpadnięcia do dziur
    ball.controlTeleports() //Kontroluj wpadnięcie do teleportu
    ghost.changePos(); //Rusz ducha
    
    objects.forEach(obj => obj.draw()); //Rysuj obiekty na canvas
    
    nextFrame = requestAnimationFrame(refreshFrame); //Wczytaj kolejną klatkę
}

loadResources();
timer();
refreshFrame();