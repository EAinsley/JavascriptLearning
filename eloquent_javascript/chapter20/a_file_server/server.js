"use strict";
const { createServer } = require("http");
const { URL } = require("url");
const { sep } = require("path");
const { createReadStream, createWriteStream } = require("fs");
const { stat, readdir, rmdir, unlink } = require("fs").promises;

const mime = require("mime");

const methods = Object.create(null);
const baseDirectory = process.cwd();

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch((error) => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      response.writeHead(status, { "Content-Type": type });
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);

methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 404, body: "File not found" };
  }
  if (stats.isDirectory()) {
    return { body: (await readdir(path)).join("\n") };
  } else {
    return { body: createReadStream(path), type: mime.getType(path) };
  }
};

methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return { status: 204 };
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}
function urlPath(url) {
  let { pathname: path } = new URL(url, "resolve://");
  const { pathname, search, hash } = new URL(
    path.slice(1),
    new URL(baseDirectory + sep, "resolve://")
  );
  if (pathname != baseDirectory && !pathname.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }
  return pathname + search + hash;
}

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed`,
  };
}
