const mikroOrmPostgresConfig = {
  type: 'postgresql',
  contextName: 'postgreConfig',
  name: 'postgre',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Password123',
  dbName: 'postgres',
  entities: ['src/dal/entity/**/*.*.*'],
  migrations: {
    tableName: "migrations",
    path: 'src/dal/migrations/postgres',
    pattern: /^[\w-]+\d+|\d\.ts$/,
    transactional: true,
  },
  debug: true,
};

module.exports = mikroOrmPostgresConfig;