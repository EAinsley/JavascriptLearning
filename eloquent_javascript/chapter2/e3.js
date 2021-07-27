const size = 8;
for (let i = 0; i < size; i++) {
  let s = '';
  for (let j = 0; j < size; j++) {
    s += ((i + j) % 2 == 0 ? ' ' : '#');
  }
  console.log(s);
}