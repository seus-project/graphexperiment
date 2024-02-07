# Shakespeare project

This is a small dataset of some plays and consumption regarding Shakespearean literature. It includes plays, performances, and some geospatial locations.

## Structure

This project consists of the following files:

* `edges.json` - Responsible for storing all data related to the connections between nodes. It is a JSON object, where each node in the first level belongs to a collection;
* `nodes.json` - Responsible for storing all data related to each node. It is a JSON object, where each node in the first level belongs to a collection;
* `insert.js` - Create a database called `shakespeare` and populate this db with all content in the previous JSON files. The script also creates a graph view to visualize the data.

## Execution

Follow these steps to execute this example:

1. Start the docker container, using the information described in [docker/README.md](../../docker/README.md);
2. Access the `arangodb` docker container, using this command:

   ```shell
   docker compose exec arangodb sh
   ```

3. In the terminal, execute:

   ```shell
   cd /data/shakespeare
   arangosh --server.username root --server.password x --javascript.execute import.js
   ```

⚠ This is not expected to be used in production, and the root password for `arandodb` server is defined in [docker/docker-compose.yml](../../docker/docker-compose.yml) file.

1. You can check the new database on your local machine, at the following address [http://localhost:8529/](http://localhost:8529/), using these credentials:

```text
username: shake
password: shake1234
```
