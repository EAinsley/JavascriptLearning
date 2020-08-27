var bigOak = require("./crow-tech").bigOak;

var defineRequestType = require("./crow-tech").defineRequestType;

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});

function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

var Timeout = class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;

    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}

function requestType(name, handler) {
  defineRequestType(name, (nest, content, source,
    callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response),
          failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}

requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}

var everywhere = require("./crow-tech").everywhere;

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${
               message}' from ${source}`);
  sendGossip(nest, message, source);
});

requestType("connections", (nest, {
    name,
    neighbors
  },
  source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) ==
    JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map();
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});

function findRoute(from, to, connections) {
  let work = [{
    at: from,
    via: null
  }];
  for (let i = 0; i < work.length; i++) {
    let {
      at,
      via
    } = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({
          at: next,
          via: via || next
        });
      }
    }
  }
  return null;
}

function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target,
      nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route", {
      target,
      type,
      content
    });
  }
}

requestType("route", (nest, {
  target,
  type,
  content
}) => {
  return routeRequest(nest, target, type, content);
});

requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
  return storage(nest, name).then(found => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n != nest.name);

  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
        sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(nest, source, "storage", name)
        .then(value => value != null ? value : next(),
          next);
    }
  }
  return next();
}

var Group = class Group {
  constructor() {
    this.members = [];
  }
  add(m) {
    this.members.add(m);
  }
}

function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
  let list = "";
  await Promise.all(network(nest).map(async name => {
    list += `${name}: ${
      await anyStorage(nest, name, `chicks in ${year}`)
    }\n`;
  }));
  return list;
}

// ex1

async function locateScalpel(nest) {
  // Your code here.
  let current = nest.name;
  let before = null;
  while (current != before) {
    before = current;
    current = await anyStorage(nest, current, "scalpel");
  }
  return current;
  /*
   let log = [];
   for (let current = nest.name; !log.includes(current); current = await anyStorage(nest, current, "scalpel")) {
     log.push(current);
   }
   return log;
  */
}

function locateScalpel2(nest) {
  // Your code here.
  function loop(current) {
    return anyStorage(nest, current, "scalpel").then(next => {
      if (next == current) return current;
      else return loop(next);
    });
  }
  return loop(nest.name);
}

locateScalpel(bigOak).then(console.log);
// → Butcher Shop

// ex2

function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
    let results = [];
    let left = promises.length;
    if (left == 0) resolve([]);
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(value => {
        results[i] = value;
        left--;
        if (left == 0) resolve(results);
      }).catch(reason => {
        console.log(`fail at ${i}: ${reason}`);
        reject(reason);
      });
    }
  });
}

// Test code.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});

function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(array => {
    console.log("We should not get here");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });