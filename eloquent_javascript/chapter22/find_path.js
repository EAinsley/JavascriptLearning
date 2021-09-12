function findPath(a, b) {
  const visited = [a];
  const pathChain = [0];
  let currentNode = a;
  let currentNodePosition = 0;
  while (currentNode != b) {
    for (const neibour of currentNode.edges) {
      if (!visited.includes(neibour)) {
        visited.push(neibour);
        pathChain.push(currentNodePosition);
      }
    }
    currentNodePosition++;
    currentNode = visited[currentNodePosition];
  }
  const path = [b];
  while (currentNodePosition != 0) {
    currentNodePosition = pathChain[currentNodePosition];
    path.unshift(visited[currentNodePosition]);
  }
  return path;
}

// testcases
console.log("---find path---");
let graph = treeGraph(4, 4);
let root = graph[0],
  leaf = graph[graph.length - 1];
console.log(findPath(root, leaf).length);
// → 4

leaf.connect(root);
console.log(findPath(root, leaf).length);
// → 2

console.log("---end---");
