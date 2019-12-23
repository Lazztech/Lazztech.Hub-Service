import { createConnection } from "typeorm";

export function createDockerDbConnection() {
    return createConnection({
            type: "postgres",
            url: process.env.DATABASE_URL,
            logging: true,
            migrationsRun: true,
            // synchronize: true,
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
