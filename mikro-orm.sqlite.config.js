const mikroOrmSqliteConfig = {
  type: 'sqlite',
  contextName: 'sqliteConfig',
  name: 'sqlite',
  dbName: './data/sqlite3.db',
  entities: ['./src/dal/entity/**/*.*.*'],
  entitiesTs: ['./dist/dal/entity/**/*.*.*'],
  migrations: {
    path: './dist/dal/migrations/sqlite',
    pathTs: './src/dal/migrations/sqlite',
    transactional: true,
    snapshot: false // see https://github.com/mikro-orm/mikro-orm/issues/2710
  },
  debug: true,
};

module.exports = mikroOrmSqliteConfig;
