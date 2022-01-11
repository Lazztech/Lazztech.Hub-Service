const mikroOrmSqliteConfig = {
  type: 'sqlite',
  contextName: 'sqliteConfig',
  name: 'sqlite',
  dbName: __dirname + '/data/sqlite3.db',
  entities: ['src/dal/entity/**/*.*.*'],
  migrations: {
    path: 'src/dal/migrations/sqlite/*.ts',
  },
  debug: true,
};

module.exports = mikroOrmSqliteConfig;
