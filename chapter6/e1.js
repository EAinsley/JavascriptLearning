class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  plus(vec2) {
    return new Vec(this.x + vec2.x, this.y + vec2.y);
  }
  minus(vec2) {
    return new Vec(this.x - vec2.x, this.y - vec2.y);
  }
  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
}
