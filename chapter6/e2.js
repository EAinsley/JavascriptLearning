class Group {
  constructor() {
    this.property = [];
  }

  add(value) {
    if (this.has(value)) {
      console.log(`failed: value ${value} exists`);
    } else {
      this.property.push(value);
    }
  }

  delete(value) {
    if (!this.has(value)) {
      console.log(`failed: value ${value} doesn't exist`);
    } else {
      this.property.splice(this.property.indexOf(value), 1);
    }
  }

  has(value) {
    return this.property.includes(value);
  }

  static from(arr) {
    let tGroup = new Group();
    for (let a of arr) {
      tGroup.add(a);
    }
    return tGroup;
  }
}

// test
let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false