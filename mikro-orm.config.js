const commonSettings = {
  migrationsRun: false,
  synchronize: false,
  entities: ['src/dal/entity/**/*.*.*'],
};

const config = [{
  name: 'postgres',
  type: 'postgres',
  host: 'localhost',
  database: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'Password123',
  ssl: false,
  migrations: ['src/dal/migrations/postgres/*.ts'],
  cli: {
    migrationsDir: 'src/dal/migrations/postgres',
  },
  ...commonSettings
},{
  name: 'default',
  type: 'sqlite',
  database: __dirname + '/data/sqlite3.db',
  migrations: ['src/dal/migrations/sqlite/*.ts'],
  cli: {
    migrationsDir: 'src/dal/migrations/sqlite',
  },
  ...commonSettings
},];

module.exports = config
