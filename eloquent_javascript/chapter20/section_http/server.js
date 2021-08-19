const { createServer } = require("http");
let server = createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "Text/html" });
  response.write(`
  <h1>hello!</h1>
  <p>You ask for <code>${request.url}</code></p>
  `);
  response.end();
});
server.listen(80);
console.log("Listening! (port 80)");
