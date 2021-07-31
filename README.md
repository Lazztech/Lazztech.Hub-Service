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

## Scripts

```bash
# test, build & push container, deploy dev and deploy stage
$ ./scripts/preCommit.sh && ./scripts/buildTagAndPushDocker.sh && ./scripts/deployToDev.sh && ./scripts/deployToStage.sh
```

## Documentation
[Lazztech.Hub-Service Docs](https://lazztech-hub-service.netlify.app/)

## Stay in touch

- Website - [https://lazz.tech/](https://lazz.tech/)

## License
Copyright Lazztech LLC