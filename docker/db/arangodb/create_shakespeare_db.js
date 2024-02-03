'use strict';

const db = require('@arangodb').db;
const databaseName = 'shakespeare';
const user = 'shake';
const passwd = 'shake1234';
const rel_path = '/../data/shakespeare';

// Create a new database (remove if the previous exists)
if (db._databases().includes(databaseName)) {
    console.log("Drop " + databaseName + " database");
    db._dropDatabase(databaseName);
}

db._createDatabase(
    databaseName, 
    {},
    [{ 
        username: user, 
        passwd: passwd,
        active: true
    }]);
db._useDatabase(databaseName);

// Create all node collections used in Shakespeare example
// 
// Each collection represents a node type
db._create("author");
db._create("play");
db._create("production");
db._create("user");
db._create("review");
db._create("company");
db._create("performance");
db._create("venue");
db._create("street");
db._create("city");
db._create("county");
db._create("country");

// Create all edge collections used in Shakespeare example
// 
// Each collection represents a edge relation between different node types
db._createEdgeCollection("WROTE_PLAY");
db._createEdgeCollection("PRODUCTION_OF");
db._createEdgeCollection("WROTE_REVIEW");
db._createEdgeCollection("REVIEW_OF");
db._createEdgeCollection("PRODUCED");
db._createEdgeCollection("PERFORMANCE_OF");
db._createEdgeCollection("VENUE");
db._createEdgeCollection("BASED_IN");
db._createEdgeCollection("CITY");
db._createEdgeCollection("STREET");
db._createEdgeCollection("COUNTY");
db._createEdgeCollection("COUNTRY");
db._createEdgeCollection("BORN_IN");

// Import documents to collections
const internal = require("internal")

// Nodes
db.author.save(internal.load(__dirname + rel_path + "/node/author.json"));
db.play.save(internal.load(__dirname + rel_path + "/node/play.json"));
db.production.save(internal.load(__dirname + rel_path + "/node/production.json"));
db.user.save(internal.load(__dirname + rel_path + "/node/user.json"));
db.review.save(internal.load(__dirname + rel_path + "/node/review.json"));
db.company.save(internal.load(__dirname + rel_path + "/node/company.json"));
db.performance.save(internal.load(__dirname + rel_path + "/node/performance.json"));
db.venue.save(internal.load(__dirname + rel_path + "/node/venue.json"));
db.street.save(internal.load(__dirname + rel_path + "/node/street.json"));
db.city.save(internal.load(__dirname + rel_path + "/node/city.json"));
db.county.save(internal.load(__dirname + rel_path + "/node/county.json"));
db.country.save(internal.load(__dirname + rel_path + "/node/country.json"));

// Edges
db.WROTE_PLAY.save(internal.load(__dirname + rel_path + "/edge/wrotePlay.json"));
db.PRODUCTION_OF.save(internal.load(__dirname + rel_path + "/edge/productionOf.json"));
db.WROTE_REVIEW.save(internal.load(__dirname + rel_path + "/edge/wroteReview.json"));
db.REVIEW_OF.save(internal.load(__dirname + rel_path + "/edge/reviewOf.json"));
db.PRODUCED.save(internal.load(__dirname + rel_path + "/edge/produced.json"));
db.PERFORMANCE_OF.save(internal.load(__dirname + rel_path + "/edge/performanceOf.json"));
db.VENUE.save(internal.load(__dirname + rel_path + "/edge/venue.json"));
db.BASED_IN.save(internal.load(__dirname + rel_path + "/edge/basedIn.json"));
db.CITY.save(internal.load(__dirname + rel_path + "/edge/city.json"));
db.STREET.save(internal.load(__dirname + rel_path + "/edge/street.json"));
db.COUNTY.save(internal.load(__dirname + rel_path + "/edge/county.json"));
db.COUNTRY.save(internal.load(__dirname + rel_path + "/edge/country.json"));
db.BORN_IN.save(internal.load(__dirname + rel_path + "/edge/bornIn.json"));


// Create views?
var graph_module =  require("org/arangodb/general-graph");
var graph = graph_module._create("Shakespeare_full");

//Add top level documents
graph._addVertexCollection("author");
graph._addVertexCollection("play");
graph._addVertexCollection("production");
graph._addVertexCollection("user");
graph._addVertexCollection("review");
graph._addVertexCollection("company");
graph._addVertexCollection("performance");
graph._addVertexCollection("venue");
graph._addVertexCollection("street");
graph._addVertexCollection("city");
graph._addVertexCollection("county");
graph._addVertexCollection("country");

graph._extendEdgeDefinitions(graph_module._relation("WROTE_PLAY", ["author"], ["play"]));
graph._extendEdgeDefinitions(graph_module._relation("BORN_IN", ["author"], ["city"]));
graph._extendEdgeDefinitions(graph_module._relation("PRODUCTION_OF", ["production"], ["play"]));
graph._extendEdgeDefinitions(graph_module._relation("WROTE_REVIEW", ["user"], ["review"]));
graph._extendEdgeDefinitions(graph_module._relation("REVIEW_OF", ["review"], ["performance"]));
graph._extendEdgeDefinitions(graph_module._relation("PERFORMANCE_OF", ["performance"], ["production"]));
graph._extendEdgeDefinitions(graph_module._relation("PRODUCED", ["company"], ["production"]));
graph._extendEdgeDefinitions(graph_module._relation("VENUE", ["performance"], ["venue"]));
graph._extendEdgeDefinitions(graph_module._relation("STREET", ["venue"], ["street"]));
graph._extendEdgeDefinitions(graph_module._relation("CITY", ["street"], ["city"]));
graph._extendEdgeDefinitions(graph_module._relation("COUNTY", ["city"], ["county"]));
graph._extendEdgeDefinitions(graph_module._relation("COUNTRY", ["county", "city"], ["country"]));
graph._extendEdgeDefinitions(graph_module._relation("BASED_IN", ["company"], ["city"]));
