class GraphNode {
  constructor() {
    this.pos = new Vec(Math.random() * 1000, Math.random() * 1000);
    this.edges = [];
  }
  connect(other) {
    if (!this.hasEdge(other)) {
      this.edges.push(other);
      other.edges.push(this);
    }
  }
  hasEdge(other) {
    return this.edges.includes(other);
  }
  hasEdgeFast(other) {
    for (let i = 0; i < this.edges.length; i++) {
      if (this.edges[i] === other) return true;
    }
    return false;
  }
}

function treeGraph(depth, branches) {
  let graph = [new GraphNode()];
  if (depth > 1) {
    for (let i = 0; i < branches; i++) {
      let subGraph = treeGraph(depth - 1, branches);
      graph[0].connect(subGraph[0]);
      graph = graph.concat(subGraph);
    }
  }
  return graph;
}

const springLength = 40;
const springStrength = 0.1;
const repulsionStrength = 1500;

function forceDirected_simple(graph) {
  for (const node of graph) {
    for (const other of graph) {
      if (other == node) continue;
      const apart = other.pos.minus(node.pos);
      const distance = Math.max(1, apart.length);
      let forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other)) {
        forceSize += (distance - springLength) * springStrength;
      }
      let normalized = apart.times(1 / distance);
      node.pos = node.pos.plus(normalized.times(forceSize));
    }
  }
}

function forceDirected_noRepeat(graph) {
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      const other = graph[j];
      const apart = other.pos.minus(node.pos);
      const distance = Math.max(1, apart.length);
      let forceSize = -repulsionStrength / (distance * distance);
      if (node.hasEdge(other)) {
        forceSize += (distance - springLength) * springStrength;
      }
      const applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

const skipDistance = 175;

function forceDirected_skip(graph) {
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      const other = graph[j];
      const apart = other.pos.minus(node.pos);
      const distance = Math.max(1, apart.length);
      const hasEdge = node.hasEdge(other);
      if (!hasEdge && distance > skipDistance) continue;
      let forceSize = -repulsionStrength / (distance * distance);
      if (hasEdge) {
        forceSize += (distance - springStrength) * springStrength;
      }
      const applied = apart.times(forceSize / distance);
      node.pos = node.pos.plus(applied);
      other.pos = other.pos.minus(applied);
    }
  }
}

function forceDirected_noVector(graph) {
  for (let i = 0; i < graph.length; i++) {
    const node = graph[i];
    for (let j = i + 1; j < graph.length; j++) {
      const other = graph[j];
      const apartX = other.pos.x - node.pos.x;
      const apartY = other.pos.y - node.pos.y;
      const distance = Math.max(
        1,
        Math.sqrt(apartX * apartX + apartY * apartY)
      );
      const hasEdge = node.hasEdgeFast(other);
      if (!hasEdge && distance > skipDistance) continue;
      let forceSize = -repulsionStrength / (distance * distance);
      if (hasEdge) {
        forceSize += (distance - springLength) * springStrength;
      }
      const forceX = (apartX * forceSize) / distance;
      const forceY = (apartY * forceSize) / distance;
      node.pos.x += forceX;
      node.pos.y += forceY;
      other.pos.x -= forceX;
      other.pos.y -= forceY;
    }
  }
}

function runLayout(implementation, graph, tag) {
  function run(steps, time) {
    let startTime = Date.now();
    for (let i = 0; i < 100; i++) {
      implementation(graph);
    }
    time += Date.now() - startTime;
    drawGraph(graph);
    if (steps == 0) console.log(tag + ":", time);
    else requestAnimationFrame(() => run(steps - 100, time));
  }
  run(4000, 0);
}
