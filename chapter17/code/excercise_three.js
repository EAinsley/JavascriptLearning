class Vec {
  // x: num, y: num
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  // Vec -> Vec
  add(that) {
    return new Vec(this.x + that.x, this.y + that.y);
  }
  // Vec -> Vec
  multiply(scale) {
    return new Vec(this.x * scale, this.y * scale);
  }
}
class Ball {
  // radius: num, initialspeed: Vec, initialposition: Vec
  constructor(radius, initialposisition, initalspeed, color = "red") {
    this.radius = radius;
    this.position = initialposisition;
    this.speed = initalspeed;
    this.color = color;
  }
  // time: num -> Ball
  update(time) {
    return new Ball(
      this.radius,
      this.position.add(this.speed.multiply(time)),
      this.speed,
      this.color
    );
  }
}

class BouncingBallBox {
  // startpoint: Vec, size: Vec, balls: Array[Ball]
  constructor(startpoint, size, color, ...balls) {
    this.startpoint = startpoint;
    this.size = size;
    this.balls = balls;
    this.color = color;
  }
  // ball: Ball -> bool
  touchesX(ball) {
    let { radius, position } = ball;
    return (
      position.x + radius > this.startpoint.x + this.size.x ||
      position.x - radius < this.startpoint.x
    );
  }
  // ball: Ball -> bool
  touchesY(ball) {
    let { radius, position } = ball;
    return (
      position.y - radius < this.startpoint.y ||
      position.y + radius > this.startpoint.y + this.size.y
    );
  }
  // time: num -> BouncingBallBox
  update(time) {
    if (time) {
      return new BouncingBallBox(
        this.startpoint,
        this.size,
        this.color,
        ...this.balls.map((ball) => {
          let { radius, position, speed, color } = ball;
          let newball = ball.update(time);
          let newposition = newball.position;
          if (this.touchesX(newball)) {
            console.log("touch x");
            return new Ball(
              radius,
              new Vec(position.x, newposition.y),
              new Vec(-speed.x, speed.y),
              color
            );
          } else if (this.touchesY(newball)) {
            console.log("touch y");
            return new Ball(
              radius,
              new Vec(newposition.x, position.y),
              new Vec(speed.x, -speed.y),
              color
            );
          } else {
            return new Ball(radius, newposition, speed, color);
          }
        })
      );
    }
    return this;
  }
  draw(contex) {
    contex.fillStyle = this.color;
    contex.fillRect(
      this.startpoint.x,
      this.startpoint.y,
      this.size.x,
      this.size.y
    );
    for (const ball of this.balls) {
      let { position, radius, color } = ball;
      contex.beginPath();
      contex.fillStyle = color;
      contex.arc(position.x, position.y, radius, 0, 7);
      contex.fill();
    }
  }
}
