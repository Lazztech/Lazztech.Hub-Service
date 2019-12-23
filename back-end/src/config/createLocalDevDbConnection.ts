import { createConnection } from "typeorm";

export function createLocalDevDbConnection() {
    return createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "test",
            password: "Password123",
            database: "postgres",
            logging: true,
            // migrationsRun: true,
            synchronize: true,
            dropSchema: true,
            entities: [
                __dirname + "/../dal/entity/**/*.*"
            ],
            migrations: [
                __dirname + "/../dal/migration/**/*.*"
            ],
            subscribers: [
                __dirname + "/../dal/migration/**/*.*"
            ]
        });
}
