FROM ubuntu:latest 

RUN \
  apt-get update && \
  apt-get install -y ldc gcc dub zlib1g-dev libssl-dev && \
  rm -rf /var/lib/apt/lists/*

COPY source/ /tmp/source/
COPY dub.json /tmp

WORKDIR /tmp

