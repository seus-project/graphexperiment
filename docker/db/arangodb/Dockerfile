FROM arangodb:3.11.6
LABEL maintainer="Fernando Luz <fernando.luz@ntnu.no>"

# Add curl to check if the arangodb is live (in docker-compose.yaml)
RUN apk add --no-cache curl=8.5.0-r0

COPY create_seus_db.js /docker-entrypoint-initdb.d
COPY create_shakespeare_db.js /docker-entrypoint-initdb.d
