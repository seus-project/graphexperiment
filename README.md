# Graph Experiment

Exploring the usefulness of a graph database as the implementation foundation of the SEUS data model. The current version uses docker containers to run the experiment.

> ``⚠`` *THIS MAY BECOME A PUBLIC REPOSITORY.* Do not commit sensitive information.

## Prerequisites

To run this repo you'll need docker installed.

* [Windows](https://docs.docker.com/desktop/install/windows-install/)
* [OS X](https://docs.docker.com/desktop/install/mac-install/)
* [Linux](https://docs.docker.com/desktop/install/linux-install/)

## Configuration

To build a meaningful setup, we start from the [tutorial](https://docs.docker.com/compose/gettingstarted/)
that Docker put together to illustrate Compose. In our scenario, we create a graph database (`ArangoDB` at this moment) and then we execute a D application to populate the database.

Please read the comments in [docker-compose.yml](./docker-compose.yml) and check the configurations.

### Execution

In the project repo root, to instantiate the arangoDB and populate with `d` app ([source here](./apps/d/source/app.d)), execute:

```bash
docker compose -up -d
```

Then, open a browser, navigate to [http://localhost:8529](http://localhost:8529) and use these credentials:

```text
user: root@seus
pass: rootseus
```

> ``⚠`` *This is not expected to be used in production*, and the credentials can be changed in [docker-compose.yaml](./docker-compose.yml#L9)

## License

This project is licensed under the Boost License - see the [LICENSE.md](LICENSE.md) file for details.
