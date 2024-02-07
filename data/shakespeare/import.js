'use strict';

const db = require('@arangodb').db;
const databaseName = 'shakespeare';
const user = 'shake';
const passwd = 'shake1234';

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

// Nodes
const nodes = require(__dirname + "/nodes.json");
db.author.save(nodes["author"]);
db.city.save(nodes["city"]);
db.company.save(nodes["company"]);
db.country.save(nodes["country"]);
db.county.save(nodes["county"]);
db.performance.save(nodes["performance"]);
db.play.save(nodes["play"]);
db.production.save(nodes["production"]);
db.review.save(nodes["review"]);
db.street.save(nodes["street"]);
db.user.save(nodes["user"]);
db.venue.save(nodes["venue"]);

// Edges
const edges = require(__dirname + "/edges.json");
db.BASED_IN.save(edges["basedIn"]);
db.BORN_IN.save(edges["bornIn"]);
db.CITY.save(edges["city"]);
db.COUNTRY.save(edges["country"]);
db.COUNTY.save(edges["county"]);
db.PERFORMANCE_OF.save(edges["performanceOf"]);
db.PRODUCED.save(edges["produced"]);
db.PRODUCTION_OF.save(edges["productionOf"]);
db.REVIEW_OF.save(edges["reviewOf"]);
db.STREET.save(edges["street"]);
db.VENUE.save(edges["venue"]);
db.WROTE_PLAY.save(edges["wrotePlay"]);
db.WROTE_REVIEW.save(edges["wroteReview"]);

// Create views
var graph_module =  require("org/arangodb/general-graph");
var graph = graph_module._create("Shakespeare_full");

// Add top level documents
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
