class Wall extends Rectangle{
    constructor(x, y, w, h, isHorizontal) {
        super(x,y,w,h,'orange')
        this.isHorizontal = isHorizontal;
    }
}