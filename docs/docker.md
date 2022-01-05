# Docker

## Supported Architectures

| Architecture | Tag |
| ----------- | ----------- |
| x86      | amd64-latest   |

## Usage

### Docker CLI

```bash
docker run -d \
  --name=lazztech-hub-service \
  -e APP_NAME=Lazztech Hub \
  -e ACCESS_TOKEN_SECRET= \
  -e FIREBASE_SERVER_KEY= \
  -e EMAIL_FROM_ADDRESS= \
  -e EMAIL_PASSWORD= \
  -e PUSH_NOTIFICATION_ENDPOINT= \
  -e DATABASE_HOST= \
  -e DATABASE_PORT= \
  -e DATABASE_USER= \
  -e DATABASE_PASS= \
  -e DATABASE_SCHEMA= \
  -e DATABASE_SSL= \
  --restart unless-stopped \
  registry.lazz.tech/lazztechhub-service
```

## Building container

```bash
Lazztech.Hub-Service me$ docker build -f docker/Dockerfile . -t registry.lazz.tech/lazztechhub-service
```