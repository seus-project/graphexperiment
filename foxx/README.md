## Installation

Ideally, installation should happen programmatically.

This is how the service is installed manually:
1. Navigate to Services in the web interface: http://`_IP_`:8529/_db/seus/_admin/aardvark/index.html#services.
2. Click on Add Service.
3. Click on Upload.
4. Upload the file [`foxx/bulkhead_position.js`](foxx/bulkhead_position.js).
5. Click on Install, type in mount point `bulkhead_position`, click Install.

## Update

To upload a new version of the script:

1. Navigate to Services in the web interface: http://`_IP_`:8529/_db/seus/_admin/aardvark/index.html#services.
2. Click on /bulkhead_position.
3. Click on Settings.
4. Click on Replace.
5. Click on Upload.
6. Upload the modified [`foxx/bulkhead_position.js`](foxx/bulkhead_position.js).
7. Click on Replace, click on Replace.

## Foxx Documentation

The documentation at https://docs.arangodb.com/3.11/develop/foxx-microservices/getting-started/ seems to be outdated, the examples don't work.

This is an example that works: https://github.com/arangodb-foxx/demo-hello-foxx. To play with it: Download the ZIP and upload it at `http://_IP_:8529/_db/seus/_admin/aardvark/index.html#services`.

