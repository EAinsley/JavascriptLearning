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

  [Symbol.iterator]() {
    return new GroupIterator(this);
  }
}
class GroupIterator {
  constructor(group) {
    this.current = 0;
    this.group = group;
  }
  next() {
    if (this.current == this.group.property.length) return {done: true};
    return {value: this.group.property[this.current++], done: false};
  }
}
/*

Group.prototype[Symbol.iterator] = function () {
    return new GroupIterator(this);
}*/

for (let value of Group.from(['a', 'b', 'c'])) {
  console.log(value);
}