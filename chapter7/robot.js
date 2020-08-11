// data initiate
const roads = [
    "Alice's House-Bob's House", "Alice's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

// pre-process

/**
 * Build an adjacency list from a specific graph structure.
 * @param {string | string[]} edges the graph structure, which should look like this:
 *              ["palce1-place2", "place1-place3", "place2-place3"]
 * @return {object} an adjacecy list
 */
function buildGraph(edges) {
    let graph = Object.create(null); // 创建不以Object.prototype为原型的对象。
    function addEdge(from, to) {
        if (graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }

    for (let [from, to] of edges.map(r => r.split("-"))) {
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
            let parcels = this.parcels.map(p => {
                if (p.place != this.place) return p;

                return {
                    place: destination,
                    address: p.address
                };
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState("Post Office",
    [{
        place: "Post Office",
        address: "Alice's House"
    }]);

let next = first.move("Alice's House");
console.log(next.place);
console.log(next.parcels);
console.log(first.place);

// Simulation
function runRobot(state, robot, memory) {
    for (let turn = 0;; turn++) {
        if (state.parcels.length == 0) {
            console.log(`Done in ${turn} turn${turn > 1 ? 's' : ""}`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory - action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return {
        direction: randomPick(roadGraph[state.place])
    };
}