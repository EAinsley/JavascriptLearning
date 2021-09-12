function findPath(a, b) {
  const visited = new Set([a]);
  const path_queue = [[a]];
  for (let i = 0; i < path_queue.length; i++) {
    const path = path_queue[i];
    const end = path[path.length - 1];
    if (end == b) return path;
    for (const neibour of end.edges) {
      if (!visited.has(neibour)) {
        visited.add(neibour);
        path_queue.push(path.concat(neibour));
      }
    }
  }
  return null;
}

// testcases
console.log("---find path---");
let graph = treeGraph(6, 6);
let root = graph[0],
  leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);

leaf.connect(root);
console.log(findPath(root, leaf).length);
console.log("---end---");

console.log("---Timing---");
let graph2 = treeGraph(6, 15);
let start = Date.now();
console.log(findPath(graph2[0], graph2[graph2.length - 1]).length);
console.log(Date.now() - start);
console.log("---end---");
