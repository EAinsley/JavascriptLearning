const {find} = require('../chapter5/05_higher_order/code/scripts');

// data initiate
const roads = [
  'Alice\'s House-Bob\'s House', 'Alice\'s House-Cabin',
  'Alice\'s House-Post Office', 'Bob\'s House-Town Hall',
  'Daria\'s House-Ernie\'s House', 'Daria\'s House-Town Hall',
  'Ernie\'s House-Grete\'s House', 'Grete\'s House-Farm', 'Grete\'s House-Shop',
  'Marketplace-Farm', 'Marketplace-Post Office', 'Marketplace-Shop',
  'Marketplace-Town Hall', 'Shop-Town Hall'
];

// pre-process

/**
 * Build an adjacency list from a specific graph structure.
 * @param {string | string[]} edges the graph structure, which should look like
 *     this:
 *              ["palce1-place2", "place1-place3", "place2-place3"]
 * @return {object} an adjacecy list
 */
function buildGraph(edges) {
  let graph = Object.create(null);  // 创建不以Object.prototype为原型的对象。
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map(r => r.split('-'))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

console.log(roadGraph);

// States
/**
 * Class record robots's current location and parcels left.
 */
class VillageState {
  /**
   * @param {string} place - robot's initial location.
   * @param {string | string[]} parcels - parcels need to be delivered.
   */
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  /**
   * change the location and deliver the parcels.
   * @param {string} destination the name of the location the robot leaves for.
   * @return {VillageState} new states after delivery.
   */
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
                        .map(p => {
                          if (p.place != this.place) return p;

                          return {place: destination, address: p.address};
                        })
                        .filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

let first = new VillageState(
    'Post Office', [{place: 'Post Office', address: 'Alice\'s House'}]);

let next = first.move('Alice\'s House');
console.log(next.place);
console.log(next.parcels);
console.log(first.place);

// Simulation
/**
 * the function simultes the robot's action
 * @param {VillageState} state the village's state
 * @param {function(object, string[])} robot robot's strategy
 * @param {string[]} memory robot's memory
 * @return {undefined} no return
 */
function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turn${turn > 1 ? 's' : ''}`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

/**
 * return a random choice
 * @param {array} array the options
 * @return {string} the chosen one
 */
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

/**
 * choose the destination through random strategy.
 * @param {VillageState} state village's state
 * @return {string} the chose location.
 */
function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}
/**
 * randomly generate parcels.
 * @param {number} parcelCount total number of parcels to be generated
 */
VillageState.random =
    function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState('Post Office', parcels);
}

/*
    console.log('radom robot:');
runRobot(VillageState.random(), randomRobot);
*/

// mail car
const mailRoute = [
  'Alice\'s House', 'Cabin', 'Alice\'s House', 'Bob\'s House', 'Town Hall',
  'Daria\'s House', 'Ernie\'s House', 'Grete\'s House', 'Shop',
  'Grete\'s House', 'Farm', 'Marketplace', 'Post Ofiice'
];

/**
 * choose the destination according to mailRoute
 * @param {VillageState} state Village's state
 * @param {string[]} memory robot's memory
 * @return {object} an object contains robot's destionation and its memory
 */
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}

/*
console.log('route robot:');
runRobot(VillageState.random(), routeRobot, []);
*/

// path finder
/**
 * using breadth first search to find a route.
 * @param {string[]} graph an adjacecy list.
 * @param {string} form initial location of the robot.
 * @param {string} to the target location.
 * @return {string[]} the shortest route.
 */
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}

/**
 * deliver the mail one by one, and find the route.
 * @param {VillageState} param0 village's state.
 * @param {string[]} route robot's memorized route.
 * @return {object} an object contains robot's destination and its memory.
 */
function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

console.log('goal oriented robot:');
runRobot(VillageState.random(), goalOrientedRobot, []);