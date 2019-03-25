class Ball extends Circle {
    constructor(x, y) {
        super(x, y, 30, '#428ff4')
        this.speed = {x: 1, y: 1};
    }
    changePos() {        
        this.speed.x += 0.01 * orientation.gamma;
        this.speed.y += 0.01 * orientation.beta;
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
    controlBorders() {
        if (this.y < this.r) { //Górna
            this.y = this.r;
            this.speed.y = 0
        } else if (this.y + this.r > canvas.height) { //Dolna
            this.y = canvas.height - this.r;
            this.speed.y = 0
        }
        if (this.x < this.r) { //Lewa
            this.x = this.r;
            this.speed.x = 0;
        } else if (this.x + this.r > canvas.width) { //Prawa
            this.x = canvas.width - this.r;
            this.speed.x = 0;
        }
    }
    controlGhost() {
        if (Math.abs(ghost.x - this.x) < this.r && Math.abs(ghost.y - this.y) < this.r) {
            gameOver();
        }
    }
    controlHoles() {
        holes.forEach(hole => {
            if (hole.isOver()) {
                gameOver();
            }
        })
    }
    controlTeleports() {
        teleportsIn.forEach(teleport => {
            if (teleport.isOver()) {
                
                //Teleportuj się do losowego teleportOut
                const num = Math.floor(Math.random() * teleportsOut.length);

                ball.x = teleportsOut[num].x;
                ball.y = teleportsOut[num].y;
                ball.speed.x = 0;
                ball.speed.y = 0;
            }
        })
    }
    controlWalls() {
        walls.forEach(wall => {
            if (wall.isHorizontal) { //ściana pozioma

                if (this.y + this.r > wall.y && this.y - this.r < wall.y + wall.h/2) { //zderzenie ze ścianą z góry
                    this.y = wall.y - this.r;
                    this.speed.y = 0
                }
                else if (this.y - this.r > wall.y + wall.h/2 && this.y - this.r < wall.y + wall.h) { //zderzenie ze ścianą z dołu
                    this.y = wall.y + wall.h + this.r;
                    this.speed.y = 0
                }
            } else { //ściana pionowa
                if (this.x + this.r > wall.x && this.x - this.r < wall.x + wall.w/2) { //zderzenie ze ścianą z lewej
                    this.x = wall.x - this.r;
                    this.speed.x = 0
                }
                else if (this.x - this.r > wall.x + wall.w/2 && this.x - this.r < wall.x + wall.w) { //zderzenie ze ścianą z prawej
                    this.x = wall.x + wall.w + this.r;
                    this.speed.x = 0
                }
            }
        });
    }
}