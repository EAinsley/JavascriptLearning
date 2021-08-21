const process = require("process");
const { readFile } = require("fs").promises;

const aim = new RegExp(process.argv[2]);

if (process.argv.length > 3) {
  /* file search
    TODO: rewrite promise
    TODO: skip duplicate files
    TODO: restrain maximun file read
    TODO: add error handler
   */
  let num_matched = 0;
  let working = [];
  for (let filename of process.argv.slice(3)) {
    working.push(
      readFile(filename, "utf-8")
        .catch((error) => {
          if (error.code != "ENOENT") return Promise.reject("Unknown error");
          return Promise.reject(`No such file: ${filename}`);
        })
        .then((text) => {
          if (aim.test(text)) {
            num_matched++;
            return { matched: true, filename };
          }
          return { matched: false, filename };
        })
    );
  }

  Promise.allSettled(working).then((values) => {
    values.forEach((value) => {
      if (value.status == "rejected") console.log(value.reason);
      else if (value.value.matched)
        console.log(`Matched: ${value.value.filename}`);
    });
    if (num_matched) console.log(`totoal matched files: ${num_matched}`);
    else console.log("No match.");
  });
} else {
  /* recursive search */
  console.log("Not Implemented.");
}
