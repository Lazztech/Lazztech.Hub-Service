# Lazztech.Hub-Service

## Companion Mobile App
For the companion mobile app client see the repo linked below.

[Lazztech.Hub-App](https://github.com/Lazztech/Lazztech.Hub-App)

## Development Dependencies

Development tools:
- brew
  - https://brew.sh/
  - postgres
- docker
- node version manager
  - https://github.com/nvm-sh/nvm

```bash
# use nvm to install node from the .nvmrc file
$ nvm install
# set the in use node version from the .nvmrc file's verision
$ nvm use
# install node dependencies
$ npm install
```

```bash
# Apple M1 support & troubleshooting resources: 
# https://github.com/nvm-sh/nvm#macos-troubleshooting
# https://www.reddit.com/r/node/comments/lp9xlk/mac_mini_m1_issues_with_node_js_15/

# open x86 shell with rosetta
$ arch -x86_64 zsh
# install node version manager & use the version from the .nvmrc file
$ nvm install
# Now check that the architecture is correct:
$ node -p process.arch
x64
# It is now safe to return to the arm64 zsh process:
$ exit
# We're back to a native shell:
$ arch
arm64
# set the in use node version from the .nvmrc file's verision
$ nvm use
# verify that the despite running in an arm shell node architecture returns x86
$ node -p process.arch
x64
# install node dependencies
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

## Postgres
A local instance of postgres running in a docker container for testing against a prod DB replica.
Pgadmin is not required, but recommend for ease of use. Alternatively the database-client VSCode extension may be used.
- https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-database-client2

Create database dump and import to local database
```bash
# prepare gitignored data folder if it's not already present
$ mkdir ./data

# dump database
$ pg_dump -h <host> -p <port> -U <username> -Fc <database> > ./data/db.dump

# start postgres
$ docker run --name lazztech_postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=Password123 -e POSTGRES_DB=postgres -p 5432:5432 postgres

# copy dump file to the docker container
docker cp ./data/db.dump lazztech_postgres:/var/lib/postgresql/data/db.dump

# shell into container
docker exec -it lazztech_postgres bash

# restore it from within
pg_restore -U postgres -d postgres --no-owner -1 /var/lib/postgresql/data/db.dump

# cleanup
$ docker stop lazztech_postgres
$ docker rm lazztech_postgres
```

In your .env or .env.local file configure these enviroment varaibles for postgres

```bash
# Postgres
DATABASE_TYPE=postgres
DATABASE_SCHEMA=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=Password123
DATABASE_SSL=false
```

```yml
# docker-compose.yml
version: '3.8'
services:
  db:
    container_name: lazztech_postgres
    image: postgres
    restart: always
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=Password123
      - POSTGRES_DB=postgres
    volumes:
      - /<Your_Volume_Directory>
  pgadmin:
    container_name: pgadmin4
    image: dpage/pgadmin4
    restart: always
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@admin.com
      - PGADMIN_DEFAULT_PASSWORD=root
    ports:
      - '5050:80'
```

## Migrations
Custom scripts have been added to streamline and simplify handling migrations with two database contexts.
```bash
# each script comes in sqlite | postgres | all variations
# scripts ending with "all" perform the action on both databases
# <migration_name_here> name will be applied to a migration specific to each database

# create a migration generated from the entity schema
$ name=<migration_name_here> npm run migration:generate:<sqlite|postgres|all>

# create a blank migration
$ name=<migration_name_here> npm run migration:create:<sqlite|postgres|all>

# apply migrations
$ npm run migration:apply:<sqlite|postgres|all>

# revert most recently applied migration
$ npm run migration:revert:<sqlite|postgres|all>

# lists pending queries to executed based on the entity schema
$ npm run migration:log:all

# displays what migrations have been applied to the databases
$ npm run migration:show:all
```


## Scripts

```bash
# test, build & push container, deploy dev and deploy stage
# note: the buildTagAndPushDocker.sh uses docker buildx for m1 support to cross compile to x86
$ ./scripts/preCommit.sh && ./scripts/buildTagAndPushDocker.sh && ./scripts/deployToDev.sh && ./scripts/deployToStage.sh
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
| DATABASE_TYPE | Used for selecting sqlite or postgres | Defaults to sqlite ✅ | 'sqlite' or 'postgres' |
| DATABASE_HOST | Used for connecting to database | Optional depending on database type ✅ |
| DATABASE_PORT | Used for connecting to database | Optional depending on database type ✅ |
| DATABASE_USER | Used for connecting to database | Optional depending on database type ✅ |
| DATABASE_PASS | Used for connecting to database | Optional depending on database type ✅ |
| DATABASE_SCHEMA | Used for connecting to database | Optional depending on database type ✅ |
| DATABASE_SSL | To configure whether to use SSL for database | Optional depending on database type ✅ |
| FILE_STORAGE_TYPE | For selecting local or S3 compatible storage configuration | Defaults to local ✅ | Select 'local' or 'object' |
| OBJECT_STORAGE_ACCESS_KEY_ID | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |
| OBJECT_STORAGE_SECRET_ACCESS_KEY | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |
| OBJECT_STORAGE_ENDPOINT | Used for S3 compatible object file storage | Optional depending on file storage type ✅ |

## Stay in touch

- Website - [https://lazz.tech/](https://lazz.tech/)

## License
Copyright Lazztech LLC
