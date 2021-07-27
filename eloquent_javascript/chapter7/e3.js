class PGroup {
  constructor(arr = []) {
    this.property = [];
    for (let a of arr) {
      this.property.push(a);
    }
  }

  add(value) {
    if (this.has(value)) {
      console.log(`failed: value ${value} exists`);
    } else {
      return new PGroup(this.property.concat(value));
    }
  }

  delete(value) {
    if (!this.has(value)) {
      console.log(`failed: value ${value} doesn't exist`);
    } else {
      return new PGroup(this.property.filter(a => a!= value));
    }
  }

  has(value) {
    return this.property.includes(value);
  }
}

PGroup.empty = new PGroup([]);

// test
let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false