FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    ldc=1:1.28.0-1ubuntu1\
    gcc=4:11.2.0-1ubuntu1 \
    dub=1.27.0-2 \
    zlib1g-dev=1:1.2.11.dfsg-2ubuntu9.2 \
    libssl3=3.0.2-0ubuntu1.13 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /graphexperiment

