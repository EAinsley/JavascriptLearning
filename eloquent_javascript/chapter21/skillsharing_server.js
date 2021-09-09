const { createServer } = require("http");
const Router = require("./router.js");
const ecstatic = require("ecstatic");
const { readFile, writeFile } = require("fs").promises;

const router = new Router();
const defaultHeaders = { "Content-Type": "text/plain" };
const talkPath = /^\/talks\/([^/]+)$/;
const dataPath = "./talks.json";

class SkillShareServer {
  constructor(talks) {
    this.talks = talks;
    this.version = 0;
    this.waiting = [];
    const fileServer = ecstatic({ root: "./public" });
    this.server = createServer((request, response) => {
      let resolved = router.resolve(this, request);
      if (resolved) {
        resolved
          .catch((error) => {
            if (error.status != null) return error;
            return { body: String(error), status: 500 };
          })
          .then(({ body, status = 200, headers = defaultHeaders }) => {
            response.writeHead(status, headers);
            response.end(body);
          });
      } else {
        fileServer(request, response);
      }
    });
  }

  talkReponse() {
    const talks = [];
    for (const title of Object.keys(this.talks)) {
      talks.push(this.talks[title]);
    }
    return {
      body: JSON.stringify(talks),
      headers: {
        "Content-Type": "Application/json",
        Etag: `"${this.version}"`,
        "Cache-Control": "no-store",
      },
    };
  }

  updated() {
    this.version++;
    const response = this.talkReponse();
    this.waiting.forEach((resolve) => resolve(response));
    this.waiting = [];
    saveTalk(this.talks, dataPath);
    console.log(this.talks);
    console.log("updated: ", this.version);
  }

  waitForChanges(time) {
    return new Promise((resolve) => {
      this.waiting.push(resolve);
      setTimeout(() => {
        if (!this.waiting.includes(resolve)) return;
        this.waiting = this.waiting.filter((r) => r != resolve);
        resolve({ status: 304 });
      }, time * 1000);
    });
  }
  start(port) {
    this.server.listen(port);
  }

  stop() {
    this.server.close();
  }

  update() {}
}
/**
 * Get the infromation of a talk.
 * Return 404 if no such talk has been found.
 */
router.add("GET", talkPath, async (server, title) => {
  if (title in server.talks) {
    return {
      body: JSON.stringify(server.talks[title]),
      headers: { "Content-Type": "application/json" },
    };
  } else {
    return { status: 404, body: `No talk '${title} found` };
  }
});
/**
 * Delete the talk.
 * Return 204 if finished.
 */
router.add("DELETE", talkPath, async (server, title) => {
  if (title in server.talks) {
    delete server.talks[title];
    server.updated();
  }
  return { status: 204 };
});
/**
 * Add a new talk.
 * Return 204 if finished.
 * Return 400 if is in bad format.
 * */
router.add("PUT", talkPath, async (server, title, request) => {
  const requestBody = await readStream(request);
  let talk;
  try {
    talk = JSON.parse(requestBody);
  } catch (_) {
    return { status: 400, body: "Invalid JSON" };
  }
  if (
    !talk ||
    typeof talk.presenter != "string" ||
    typeof talk.summary != "string"
  ) {
    return { status: 400, body: "Bad talk data" };
  }
  server.talks[title] = {
    title,
    presenter: talk.presenter,
    summary: talk.summary,
    comments: [],
  };
  server.updated();
  return { status: 204 };
});
/**
 * Add a comment to the talk.
 * Return 204 if finished.
 * Return 400 if is in bad format.
 * Return 404 if no such talk has been found.
 */
router.add(
  "POST",
  /^\/talks\/([^/]+)\/comments$/,
  async (server, title, request) => {
    const requestBody = await readStream(request);
    let comment;
    try {
      comment = JSON.parse(requestBody);
    } catch (_) {
      return { status: 400, body: "Invalid JSON" };
    }
    if (
      !comment ||
      typeof comment.author != "string" ||
      typeof comment.message != "string"
    ) {
      return { status: 400, body: "Bad comment data" };
    } else if (title in server.talks) {
      server.talks[title].comments.push(comment);
      server.updated();
      return { status: 204 };
    } else {
      return { status: 404, body: `No talk '${title}' found` };
    }
  }
);
/**
 * Get the talk list.
 * Return new talk list if the Etag of the client doesn't match the server's
 * or no Etag was given.
 * Return 304 if no change on the server.
 */
router.add("GET", /^\/talks$/, async (server, request) => {
  const tag = /"(.*)"/.exec(request.headers["if-none-match"]);
  const wait = /\bwait=(\d+)/.exec(request.headers["prefer"]);
  if (!tag || tag[1] != server.version) {
    return server.talkReponse();
  } else if (!wait) {
    return { status: 304 };
  } else {
    return server.waitForChanges(Number(wait[1]));
  }
});

function readStream(stream) {
  return new Promise((resolve, reject) => {
    let data = "";
    stream.on("error", reject);
    stream.on("data", (chunck) => (data += chunck.toString()));
    stream.on("end", () => resolve(data));
  });
}

async function restoreTalk(file) {
  return readFile(file)
    .then((data) => JSON.parse(data))
    .catch((error) => {
      if (error.code != "ENOENT") throw error;
      return [];
    });
}
function saveTalk(data, to) {
  writeFile(to, JSON.stringify(data))
    .then(() => {
      console.log("file saved");
    })
    .catch((error) => {
      console.log(error);
    });
}

restoreTalk(dataPath).then((talks) => new SkillShareServer(talks).start(8000));
