#!/bin/sh
docker buildx build --platform linux/amd64 --no-cache -f docker/Dockerfile . -t registry.internal.lazz.tech/lazztechhub-service:latest \
&& docker push registry.internal.lazz.tech/lazztechhub-service
