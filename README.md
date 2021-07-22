# Lazztech.Hub-Service

## Companion Mobile App
For the companion mobile app client see the repo linked below.

[Lazztech.Hub-App](https://github.com/Lazztech/Lazztech.Hub-App)

## Installation Dependencies

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Kubernetes

```bash
# deploy local secrets
$ kubectl create secret generic local-lazztechhub --from-env-file=.env.local
# deploy local
$ kubectl apply -f kubernetes/local.yaml

# open graphql-playground
$ open http://localhost:30000/graphql

# delete local
$ kubectl delete -f kubernetes/local.yaml
# delete local secrets
$ kubectl delete secret local-lazztechhub
```

```bash
# deploy dev secrets
$ kubectl create secret generic dev-lazztechhub --from-env-file=.env.dev
# deploy dev
$ kubectl apply -f kubernetes/dev.yaml

# delete dev
$ kubectl delete -f kubernetes/dev.yaml
# delete dev secrets
$ kubectl delete secret dev-lazztechhub
```

```bash
# deploy stage secrets
$ kubectl create secret generic stage-lazztechhub --from-env-file=.env.stage
# deploy stage
$ kubectl apply -f kubernetes/stage.yaml

# delete stage
$ kubectl delete -f kubernetes/stage.yaml
# delete stage secrets
$ kubectl delete secret stage-lazztechhub
```

## Configuration

| Parameter | Function | Optional | Example |
| ----------- | ----------- | ----------- | ----------- |
| APP_NAME | Used when sending emails to call out the name of the service | ❌ | Lazztech Hub |
| ACCESS_TOKEN_SECRET | Used for jwt tokens | ❌ |
| FIREBASE_SERVER_KEY | Used for push notifications | ❌ |
| PUSH_NOTIFICATION_ENDPOINT | Used for triggering push notifications via http | ❌ |
| EMAIL_FROM_ADDRESS | Used for emailing users | ❌ |
| EMAIL_PASSWORD | Used for emailing users | ❌ |
| DATABASE_HOST | Used for connecting to database | ❌ |
| DATABASE_PORT | Used for connecting to database | ❌ |
| DATABASE_USER | Used for connecting to database | ❌ |
| DATABASE_PASS | Used for connecting to database | ❌ |
| DATABASE_SCHEMA | Used for connecting to database | ❌ |
| DATABASE_SSL | To configure whether to use SSL for database | ❌ |
| FILE_STORAGE_TYPE | For selecting azure blob or S3 compatible storage configuration | Optional depending on file storage type ✅ | Select 'azure' or 'object' |
| OBJECT_STORAGE_ACCESS_KEY_ID | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |
| OBJECT_STORAGE_SECRET_ACCESS_KEY | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |
| OBJECT_STORAGE_ENDPOINT | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |
| BLOB_STORAGE_CONNECTION_STRING | Used when using Azure Blob for file storage | Optional depending on file storage type ✅  |

## Stay in touch

- Website - [https://lazz.tech/](https://lazz.tech/)

## License
Copyright Lazztech LLC