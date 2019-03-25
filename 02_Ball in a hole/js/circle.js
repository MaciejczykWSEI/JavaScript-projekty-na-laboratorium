class Circle {
    constructor(x, y, r, color) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    draw() { //narysuj kółko
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
    isOver() { //Sprawdź, czy gracz dotyka tego obiektu
        return (Math.sqrt(Math.abs(ball.x - this.x) * Math.abs(ball.x - this.x) +
        Math.abs(ball.y - this.y) * Math.abs(ball.y - this.y)) < ball.r + this.r)
    }
}