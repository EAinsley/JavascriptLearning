"use strict";
const { createServer } = require("http");
const { URL } = require("url");
const { sep } = require("path");
const { createReadStream, createWriteStream } = require("fs");
const { stat, readdir, rmdir, unlink, mkdir } = require("fs").promises;

const mime = require("mime");

const methods = Object.create(null);
const baseDirectory = process.cwd();
const fileapi = sep + "files" + sep;
const pageapi = sep + "www" + sep;

const HTTPNoContent = { status: 204 };
const HTTPForbbiden = { status: 403, body: "Forbbiden" };

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  console.log("Receive request", request.method, request.url);
  handler(request)
    .catch((error) => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      response.writeHead(status, {
        "Content-Type": type,
      });
      if (body && body.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);

methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  if (path.startsWith(baseDirectory + pageapi)) {
    if (path == baseDirectory + pageapi) {
      return {
        body: createReadStream("./www/pages/index.html"),
        type: "text/html",
      };
    }
    if (path.endsWith(sep)) return HTTPForbbiden;
  }
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
  if (!path.startsWith(baseDirectory + fileapi)) return HTTPForbbiden;
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return HTTPNoContent;
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return HTTPNoContent;
};

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  if (!path.startsWith(baseDirectory + fileapi)) return HTTPForbbiden;
  await pipeStream(request, createWriteStream(path));
  return HTTPNoContent;
};

methods.MKCOL = async function (request) {
  let path = urlPath(request.url);
  if (!path.startsWith(baseDirectory + fileapi)) return HTTPForbbiden;
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return HTTPNoContent;
  }
  if (stats.isDirectory()) return HTTPNoContent;
  else return { status: 400, body: "File exist" };
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
  let base = baseDirectory;
  if (!path.startsWith(fileapi)) {
    base += pageapi;
  } else {
    base += sep;
  }
  const { pathname, search, hash } = new URL(
    path.slice(1),
    new URL(base, "resolve://")
  );
  if (pathname != baseDirectory && !pathname.startsWith(baseDirectory + sep)) {
    throw HTTPForbbiden;
  }
  return pathname + search + hash;
}

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed`,
  };
}
