import { createConnection } from 'typeorm';

export function createAzureSqlDbConnection() {
  return createConnection({
    type: 'mssql',
    // url: "lazztechhub-db.database.windows.net",
    host: 'lazztechhub-db.database.windows.net',
    connectionTimeout: 25000,
    username: 'gian',
    password: 'Password123',
    database: 'lazztechhubdev-db',
    logging: true,
    // migrationsRun: true,
    extra: {
      options: {
        encrypt: true,
      },
    },
    synchronize: true,
    entities: [__dirname + '/../dal/entity/**/*.*'],
    migrations: [__dirname + '/../dal/mssqlMigrations/**/*.*'],
    subscribers: [__dirname + '/../dal/mssqlMigrations/**/*.*'],
  });
}
