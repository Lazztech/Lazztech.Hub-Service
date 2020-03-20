import { createConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

export function createDockerDbConnection() {
  const logger = new Logger(createDockerDbConnection.name);
  logger.log("executing");

  return createConnection({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    logging: true,
    migrationsRun: true,
    // synchronize: true,
    entities: [__dirname + '/../dal/entity/**/*.*'],
    migrations: [__dirname + '/../dal/migration/**/*.*'],
    subscribers: [__dirname + '/../dal/migration/**/*.*'],
  });
}
