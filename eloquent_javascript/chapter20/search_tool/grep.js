const process = require("process");
const { readFile, stat, readdir } = require("fs").promises;

const aim = new RegExp(process.argv[2]);

/* file search
    TODO: filter file type
   */
const working = [];
if (process.argv.length > 3) {
  const searched = [];
  for (let filename of process.argv.slice(3)) {
    if (!searched.includes(filename)) {
      searched.push(filename);
      working.push(search(filename));
    }
  }
} else {
  working.push(search("."));
}

Promise.allSettled(working).then((values) => {
  values.forEach((value) => {
    let num_matched = 0;
    for (const result of value.value) {
      if (result.status == "matched") {
        console.log(`Matched: ${result.fileanme}`);
        num_matched++;
      } else if (result.status == "error") {
        console.log(`Error: ${result.reason}`);
      }
    }
    if (num_matched) console.log(`totoal matched files: ${num_matched}`);
    else console.log("No match.");
  });
});

async function search(name) {
  try {
    let stats = await stat(name);
    if (!stats.isDirectory()) {
      const text = await readFile(name, "utf-8");
      if (aim.test(text)) return [{ status: "matched", fileanme: name }];
      return [{ status: "nomatch" }];
    }
    const files = await readdir(name);
    const results = [];
    for (const file of files) {
      results.push(search(name + "/" + file));
    }
    return (await Promise.allSettled(results))
      .reduce((flattened, item) => flattened.concat(item.value), [])
      .filter((item) => item.status != "nomatch");
  } catch (error) {
    console.log("e1");
    if (error.code != "ENOENT") throw error;
    return [{ status: "error", reason: `No such file or directory: ${name}` }];
  }
}
