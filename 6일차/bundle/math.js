export default class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    distance(point) {
        return Math.sqrt(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2));
    }
}