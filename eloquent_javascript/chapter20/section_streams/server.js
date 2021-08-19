const { createServer } = require("http");
createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  request.on("data", (chunck) => {
    console.log("receiving data...");
    response.write(chunck.toString().toUpperCase());
  });
  request.on("end", () => response.end());
}).listen(8000);

console.log("server start");
