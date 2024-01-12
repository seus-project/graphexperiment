import  std.format, std.net.curl, std.stdio;

import core.time;

string api;

void main(string[] args)
{
    import std.getopt;

    string IP, password;
    const port = "8529";
    const database = "seus";
    const user = "root@seus";

    try {
        auto helpInformation = getopt(args,
            std.getopt.config.required,
            "ip",          "The server IP address",                 &IP,
            std.getopt.config.required,
            "pw|password", format!`The database password for user "%s"`(user), &password);
        if (helpInformation.helpWanted)
        {
            defaultGetoptPrinter(format!`Replaces contents of "%s" ArangoDB database, etc.`(database),
                helpInformation.options);
            return;
        }
    } catch (GetOptException e) {
        writeln(e.msg ~ `. See "dub run -- --help".`);
        return;
    }

    api = "http://" ~ IP ~ ":" ~ port ~ "/_db/" ~ database ~ "/_api";

    auto http = HTTP();
    http.authenticationMethod = HTTP.AuthMethod.basic;
    http.setAuthentication(user, password);
    http.addRequestHeader("accept", "application/json");
    http.onReceiveHeader = (in char[] key, in char[] value) { writeln(key, " = ", value); };
    http.dataTimeout = 3.hours;
    http.dataToConsole;

    http.printApiVersion;
    http.dropGraph("Bulkhead");
    http.createGraph("Bulkhead");
    http.fillGraph(10, 10);

    printCompartmentBoundaries(http.listCompartments);

    http.moveBulkhead("B4", 44.7);
    printCompartmentBoundaries(http.listCompartments);
}

// https://docs.arangodb.com/3.11/develop/http-api/graphs/named-graphs/#drop-a-graph
void dropGraph(ref HTTP http, string name)
{
    static bool graphExists(ref HTTP http, string name)
    {
        import std.json;

        bool found = false;
        http.url = api ~ "/gharial/";
        http.method = HTTP.Method.get;
        http.onReceive = (ubyte[] data)
        {
            foreach (size_t i, const ref graph; parseJSON(cast(string) data)["graphs"])
                if (graph["name"].str == name)
                {
                    found = true;
                    break;
                }
            return data.length;
        };
        http.perform;
        http.dataToConsole;
        return found;
    }

    if (graphExists(http, name))
    {
        http.url = api ~ "/gharial/" ~ name ~ "?dropCollections=true";
        http.method = HTTP.Method.del;
        http.perform;
    }
}

/// https://docs.arangodb.com/3.11/develop/http-api/graphs/named-graphs/#create-a-graph
void createGraph(ref HTTP http, string name)
{
    http.url = api ~ "/gharial";
    http.method = HTTP.Method.post;
    http.setPostData(format!q"JSON
{
  "name": "%s",
  "edgeDefinitions": [
    {
      "collection": "BulkheadToCadmatic",
      "from": [
        "Bulkhead"
      ],
      "to": [
        "Cadmatic_Bulkhead"
      ]
    },
    {
      "collection": "BulkheadToPias",
      "from": [
        "Bulkhead"
      ],
      "to": [
        "Pias_Bulkhead"
      ]
    },
    {
      "collection": "Cadmatic_BulkheadHasPanel",
      "from": [
        "Cadmatic_Bulkhead"
      ],
      "to": [
        "Cadmatic_Panel"
      ]
    },
    {
      "collection": "Cadmatic_PanelHasStiffener",
      "from": [
        "Cadmatic_Panel"
      ],
      "to": [
        "Cadmatic_Stiffener"
      ]
    },
    {
      "collection": "Pias_BulkheadAdjacentCompartment",
      "from": [
        "Pias_Bulkhead"
      ],
      "to": [
        "Pias_Compartment"
      ]
    }
  ]
}
JSON"(name), "application/json");
    http.perform;
}

void fillGraph(ref HTTP http, int numberOfBulkheads, int panelsPerBulkhead)
{
    import std.conv, std.datetime.stopwatch;

    auto aql = text(
// Add conceptual bulkheads with edges to Pias and Cadmatic specialisations.
"LET b_ids = ( ",
    "FOR i IN 1 .. @numberOfBulkheads ",
        "LET b_id = ( ",
            "INSERT { name: CONCAT('B', i) } INTO Bulkhead ",
            "RETURN NEW._id ",
        ") ",
        "LET pias_b_id = ( ",
            "INSERT { position: 10 * i } INTO Pias_Bulkhead ",
            "RETURN NEW._id ",
        ") ",
        "LET cadmatic_b_id = ( ",
            "INSERT {  } INTO Cadmatic_Bulkhead ",
            "RETURN NEW._id ",
        ") ",
        "INSERT { '_from': b_id[0], '_to': pias_b_id[0] } INTO BulkheadToPias ",
        "INSERT { '_from': b_id[0], '_to': cadmatic_b_id[0] } INTO BulkheadToCadmatic ",
        "RETURN [ pias_b_id, cadmatic_b_id ] ",
") ",
// Add panels to cadmatic bulkheads
"LET p_ids = ( ",
    "FOR b_id IN b_ids ",
        "FOR j IN 1 .. @panelsPerBulkhead ",
            "LET p1_ids = ( ",
                "INSERT { } INTO Cadmatic_Panel ",
                "RETURN NEW._id ",
            ") ",
            "INSERT { '_from': b_id[1][0], '_to': p1_ids[0] } INTO Cadmatic_BulkheadHasPanel ",
") ",
// Add compartments with edges from bounding bulkheads
"LET pias_c_ids = ( ",
    "FOR i IN 1 .. @numberOfBulkheads + 1 ",
        "INSERT { name: CONCAT('C', i) } INTO Pias_Compartment ",
        "RETURN NEW._id ",
") ",
"LET aft = ( ",
    "FOR i IN 0 .. @numberOfBulkheads-1 ",
        "RETURN { '_from': b_ids[i][0][0], '_to': pias_c_ids[i] } ",
") ",
"LET fore = ( ",
    "FOR i IN 0 .. @numberOfBulkheads-1 ",
        "RETURN { '_from': b_ids[i][0][0], '_to': pias_c_ids[i+1] } ",
") ",
"LET adjacents = ( ",
    "RETURN FLATTEN([aft, fore]) ",
") ",
"FOR adjacent IN adjacents[0] ",
    "INSERT adjacent INTO Pias_BulkheadAdjacentCompartment ",
);

    http.method = HTTP.Method.post;
    http.url = api ~ "/cursor";
    http.setPostData(format!(
        `{` ~ 
            `"query": "%s",` ~
            `"bindVars": {` ~
                `"numberOfBulkheads": %d,` ~
                `"panelsPerBulkhead": %d` ~
            `}` ~
        `}`)(aql, numberOfBulkheads, panelsPerBulkhead), "application/json");

    auto sw = StopWatch(AutoStart.yes);
    http.perform;
    writeln("\tIt takes ", sw.peek, " to execute \"", aql, "\"");

}

double[][string] listCompartments(ref HTTP http)
{
    import std.json, std.range;

    auto app = appender!(ubyte[]);
    http.onReceive = (ubyte[] data) {
        app ~= data;
        return data.length;
    };
    http.performAql(`FOR c IN Pias_Compartment ` ~
                        `FOR pb IN INBOUND c Pias_BulkheadAdjacentCompartment ` ~
                            `RETURN [ c.name, pb.position ] `);
    http.dataToConsole;

    double[][string] compartmentBounds;
    foreach (size_t i, const ref e; parseJSON(cast(string) app.data)["result"])
        compartmentBounds[e[0].str] ~= e[1].get!double;

    return compartmentBounds;
}

void printCompartmentBoundaries(double[][string] compartmentBounds)
{
    import std.algorithm;

    foreach (key; compartmentBounds.keys.sort!((a, b) => compartmentBounds[a][0] < compartmentBounds[b][0]))
        writeln(format!"Compartment \"%s\" is bounded by bulkeheads at positions %s"(key, compartmentBounds[key]));
}

void moveBulkhead(ref HTTP http, string name, double pos)
{
    http.performAql(format!(`FOR b IN Bulkhead ` ~
                                `FILTER b.name == '%s' LIMIT 1 ` ~
                                `FOR pb IN OUTBOUND b BulkheadToPias ` ~
                                    `UPDATE pb WITH { position: %f } IN Pias_Bulkhead RETURN NEW`)(name, pos));
}

void printApiVersion(ref HTTP http)
{
    http.url = api ~ "/version";
    http.method = HTTP.Method.get;
    http.perform;
}

void dataToConsole(ref HTTP http)
{
    http.onReceive = (ubyte[] data) { writeln(cast(string) data); return data.length; };
}

/// Sets AQL code to postData
void performAql(ref HTTP http, string aql)
{
    import std.datetime.stopwatch;

    http.method = HTTP.Method.post;
    http.url = api ~ "/cursor";
    http.setPostData(`{"query":"` ~ aql ~ `"}`, "application/json");
    auto sw = StopWatch(AutoStart.yes);
    http.perform;
    writeln("\tIt takes ", sw.peek, " to execute \"", aql, "\"");
}
