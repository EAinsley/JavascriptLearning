class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}

let blackRabbit = new Rabbit('black');

console.log(blackRabbit.toString());

let a = [];
a.push(10);
console.log(a);