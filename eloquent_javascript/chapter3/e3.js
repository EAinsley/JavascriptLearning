/*
function countBs(st) {
    let count = 0;
    for (let i = 0; i < st.length; i++) {
        if (st[i] == "B") count++;
    }
    return count;
}

let testString = "B.B.K.B.";

console.log(`There's ${countBs(testString)} Bs in "` + testString + '"');
*/

function countChar(st, ch) {
  let count = 0;
  for (let i = 0; i < st.length; i++) {
    if (st[i] == ch) count++;
  }
  return count;
}

function countBs(st) {
  return countChar(st, 'B');
}

// test settings
const testString = 'B.B.K.B.';
const testChar = 'B';

// call and output
let totalCount = countChar(testString, testChar);
console.log(
    `There'${totalCount <= 1 ? 's' : 're'} \
${countChar(testString, testChar)} \
${testChar || 'B'}${totalCount <= 1 ? '' : 's'} \
in "` +
    testString + '"');