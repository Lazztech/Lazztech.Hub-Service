import { ConnectionOptions, createConnection } from "typeorm";

export const testConn = async (drop: boolean = false) => {
    if (process.env.NODE_ENV === "docker") {
        console.log("Detected docker environment variable for test connection string.");
    } else {
        console.log("Creating test connection for development environment.");
    }

    const connectionOptions: ConnectionOptions = {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: (process.env.NODE_ENV === "docker") ? "docker" : "test",
        password: (process.env.NODE_ENV === "docker") ? "docker" : "Password123",
        database: (process.env.NODE_ENV === "docker") ? "docker" : "postgres-test",
        // synchronize: drop,
        migrationsRun: true,
        logging: true,
        dropSchema: drop,
        entities: [
            __dirname + "/../../dal/entity/**/*.ts"
        ],
        migrations: [
            __dirname + "/../../dal/migration/**/*.ts"
        ]
    };
    console.log(JSON.stringify(connectionOptions, null, 2));
    const connection = await createConnection(connectionOptions);

    return connection;
};
