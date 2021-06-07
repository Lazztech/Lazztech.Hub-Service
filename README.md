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

## Documentation
[Lazztech.Hub-Service Docs](https://lazztech-hub-service.netlify.app/)

<!-- ## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support). -->

## Stay in touch

- Website - [https://lazz.tech/](https://lazz.tech/)

## License
Copyright Lazztech LLC