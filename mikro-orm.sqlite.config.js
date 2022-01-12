const mikroOrmSqliteConfig = {
  type: 'sqlite',
  contextName: 'sqliteConfig',
  name: 'sqlite',
  dbName: __dirname + '/data/sqlite3.db',
  entities: ['src/dal/entity/**/*.*.*'],
  migrations: {
    tableName: "migrations",
    path: 'src/dal/migrations/sqlite',
    pattern: /^[\w-]+\d+|\d\.ts$/,
    transactional: true,
  },
  debug: true,
};

module.exports = mikroOrmSqliteConfig;
