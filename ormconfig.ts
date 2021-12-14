const commonSettings = {
  migrationsRun: false,
  synchronize: false,
  entities: ['dist/src/dal/entity/**/*.*.*'],
  subscribers: [__dirname + '/dal/migrations/**/*.*'],
};

const config = [{
  name: 'prod',
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
  database: 'data/sqlite3.db',
  migrations: ['src/dal/migrations/sqlite/*.ts'],
  cli: {
    migrationsDir: 'src/dal/migrations/sqlite',
  },
  ...commonSettings
},];

module.exports = config
