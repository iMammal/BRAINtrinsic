

var previousMap;
var hierarchy = [];
var rootNode;
var dist;

function PriorityQueue () {
    this._nodes = [];

    this.enqueue = function (priority, key) {
        this._nodes.push({key: key, priority: priority });
        this.sort();
    }
    this.dequeue = function () {
        return this._nodes.shift().key;
    }
    this.sort = function () {
        this._nodes.sort(function (a, b) {
            return a.priority - b.priority;
        });
    }
    this.isEmpty = function () {
        return !this._nodes.length;
    }
}

/**
 * Pathfinding starts here
 */
function Graph(){
    var INFINITY = 1/0;
    this.vertices = {};

    this.addVertex = function(name, edges){
        this.vertices[name] = edges;
    }

    this.shortestPath = function (start) {
        var nodes = new PriorityQueue(),
            distances = {},
            previous = {},
            path = [],
            smallest, vertex, neighbor, alt;

        for(vertex in this.vertices) {
            if(vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(0, vertex);
            }
            else {
                distances[vertex] = INFINITY;
                nodes.enqueue(INFINITY, vertex);
            }

            previous[vertex] = null;
        }

        while(!nodes.isEmpty()) {
            smallest = nodes.dequeue();

            for(neighbor in this.vertices[smallest]) {
                alt = distances[smallest] + this.vertices[smallest][neighbor];

                if(alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = smallest;

                    nodes.enqueue(alt, neighbor);
                }
            }
        }


        previousMap = previous;
        dist = distances;
        rootNode = start;
        setHierarchy(root);
        return distances;
    }
}



setHierarchy = function(root){
    hierarchy[0] = [];
    hierarchy[0].push(root);
    var k = 0;
    var addedElement = true;

    while ( addedElement){
        addedElement = false;

        for(var i=0; i < hierarchy[k].length; i++) {
            var el = [];
            for (var j in previousMap) {
                if (previousMap[j] == hierarchy[k][i]) {
                    console.log("push");
                    el.push(parseInt(j));
                }
            }
            if (el.length > 0) {
                hierarchy[hierarchy.length] = el;
                addedElement = true;
                k++;
            }
        }
    }
};


getShortestPathDistances = function(nodeIndex){
    if(rootNode && rootNode == nodeIndex){
        return dist;
    }

    computeShortestPathDistances(nodeIndex);

    return dist;
};
