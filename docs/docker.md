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
  -e AzureWebJobsStorage= \
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

### Parameters

| Parameter | Function |
| ----------- | ----------- |
| APP_NAME | Used when sending emails to call out the name of the service |
| ACCESS_TOKEN_SECRET | Used for jwt tokens |
| FIREBASE_SERVER_KEY | Used for push notifications |
| AzureWebJobsStorage | Used for file storage |
| EMAIL_FROM_ADDRESS | Used for emailing users |
| EMAIL_PASSWORD | Used for emailing users |
| PUSH_NOTIFICATION_ENDPOINT | Used for triggering push notifications via http |
| DATABASE_HOST | Used for connecting to database |
| DATABASE_PORT | Used for connecting to database |
| DATABASE_USER | Used for connecting to database |
| DATABASE_PASS | Used for connecting to database |
| DATABASE_SCHEMA | Used for connecting to database |
| DATABASE_SSL | To configure whether to use SSL for database |
| OBJECT_STORAGE_ACCESS_KEY_ID | Used for S3 compatible object file storage |
| OBJECT_STORAGE_SECRET_ACCESS_KEY | Used for S3 compatible object file storage |
| OBJECT_STORAGE_ENDPOINT | Used for S3 compatible object file storage |

## Building container

```bash
Lazztech.Hub-Service me$ docker build -f docker/Dockerfile . -t registry.lazz.tech/dev-lazztechhub-service
```