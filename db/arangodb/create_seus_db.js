
db._createDatabase("seus");

var users = require("@arangodb/users");

users.save(`${process.env.SEUS_USERNAME}`, `${process.env.SEUS_PASSWORD}`);
users.grantDatabase(`${process.env.SEUS_USERNAME}`, "seus");
