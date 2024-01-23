'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

module.context.use(router);

const arangodb = require("@arangodb");
const db = arangodb.db;

router.get('/:key', function (req, res) {
  res.set("Content-Type", "text/plain; charset=utf-8");

  const key = req.param("key");
  const query = `FOR b IN Bulkhead ` +
                    `FILTER b.name == '${key}' LIMIT 1 ` +
                    `FOR pb IN OUTBOUND b BulkheadToPias ` +
                        `RETURN pb.position`;
  const stmt = db._createStatement({ "query": query });
  const c = stmt.execute();

  res.json(c.toArray());
});
