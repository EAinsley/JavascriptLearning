const { request } = require("http");
request(
  {
    hostname: "localhost",
    port: 8000,
    method: "POST",
  },
  (response) => {
    response.on("data", (chunck) => {
      console.log("receiving data...");
      process.stdout.write(chunck.toString());
    });
  }
).end("Hello Server");
console.log("message sent");
