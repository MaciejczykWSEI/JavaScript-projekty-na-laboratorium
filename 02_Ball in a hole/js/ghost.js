class Ghost extends Circle {
    constructor(x, y) {
        super(x, y)
        this.speed = 1;
        this.img = new Image();
        this.img.src = './ghost.png';
    }
    changePos() {
        if (ball.x > this.x) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        if (ball.y > this.y) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    }
    draw() {
        ctx.drawImage(this.img, this.x, this.y);
    }
}