# graphexperiment

Exploring the usefulness of a graph database as the implementation foundation of the SEUS data model.

*THIS IS A PUBLIC REPOSITORY.* Do not commit sensitive information.

## Installation

### DBMS

This experiment builds on the ArangoDB database management system. Below are the instructions for installing the open-source community edition of ArangoDB on [Ubuntu](https://ubuntu.com/download/server) 20.04. [Other systems are supported](https://arangodb.com/download-major/). Alternatively, a [cloud instance can be configured](https://docs.arangodb.com/3.11/get-started/set-up-a-cloud-instance/) for free for fourteen days.

**Assuming `_IP_` is the IP address of the Ubuntu server and `_PW_` is the password used for the database.** The name of the database will be `seus` and the user `root@seus` (hardcoded in this experiment).

Per [https://arangodb.com/download-major/ubuntu/](https://arangodb.com/download-major/ubuntu/):

```
wget -O - https://download.arangodb.com/arangodb311/DEBIAN/Release.key | sudo apt-key add -
echo 'deb https://download.arangodb.com/arangodb311/DEBIAN/ /' | sudo tee /etc/apt/sources.list.d/arangodb.list
sudo apt-get install apt-transport-https
sudo apt-get update
sudo apt-get install arangodb3=3.11.6-1
```

Per https://www.liquidweb.com/kb/how-to-install-arangodb-on-ubuntu-20-04/: Log in to the `_system` database and create the `seus` database:

```
arangosh
db._createDatabase("seus");
var users = require("@arangodb/users");
users.save("root@seus", "_PW_");
users.grantDatabase("root@seus", "seus");
exit
```

Enable the service:
```
sudo systemctl start arangodb3
sudo systemctl enable arangodb3
```

By default, the dashboard is only accessible through localhost. To change that, edit `/etc/arangodb3/arangod.conf`

```
sudo pico arangod.conf
```
and change
```
endpoint = tcp://127.0.0.1:8529
```
into
```
endpoint = tcp://_IP_:8529
```
then
```
sudo systemctl restart arangodb3
```

Browse to `http://_IP_:8529/` and log in as `root@seus`.

### Foxx

Foxx services need to be installed manually for now. See [foxx/README.md](foxx/README.md).

### Compiler

The source code in this experiment is written in the [D programming language](https://dlang.org/), and various compilers for all mayor platforms can be downloaded from there. The compilation assumes the presence of package manager Dub, which is included in most D compiler distributions.

## Execution

After the above prerequisites have been met, the experiment is run by invoking
```
dub run -- --pw="_PW_" --ip=_IP_
```
