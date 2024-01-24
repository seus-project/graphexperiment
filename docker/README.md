# Integrated environment for running the graph experiment

These are the instructions for building a Docker project that contains everything to run the experiment, removing the need to install the DBMS and compiler manually.

## Prerequisites

To run this repo you'll need Docker installed.

* [Windows](https://docs.docker.com/desktop/install/windows-install/)
    * On Windows the commands below need to be executed in Powershell.
* [OS X](https://docs.docker.com/desktop/install/mac-install/)
* [Linux](https://docs.docker.com/desktop/install/linux-install/)

The default configuration should work out of the box. You may consult the [tutorial](https://docs.docker.com/compose/gettingstarted/) if needed.

### Execution

#### Startup

In the `docker` subdirectory of the repo root, execute:

```bash
docker compose up -d
```

#### Database web interface

The web interface of the database can be accessed using an ordinary web browser, at [http://localhost:8529](http://localhost:8529), using these credentials:

```text
user: root@seus
pass: rootseus
```

⚠ *This is not expected to be used in production*, and the credentials can be changed in [docker-compose.yaml](./docker-compose.yml#L9)

#### Running the code

The following command opens an interactive shell in the container:

```shell
docker exec -it graphexperiment-d_app-1 bash
```

At the shell prompt, the following will compile and run the code.

```shell
dub run -- --pw=rootseus --ip=arangodb
```

#### Shutdown

```shell
docker compose down
```