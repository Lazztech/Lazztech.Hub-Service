const commonSettings = {
  migrationsRun: true,
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
  migrations: ['dist/src/dal/migrations/postgres/*.js'],
  cli: {
    migrationsDir: 'src/dal/migrations/postgres/',
  },
  ...commonSettings
},{
  name: 'default',
  type: 'sqlite',
  database: 'data/sqlite3.db',
  migrations: ['dist/src/dal/migrations/sqlite/*.js'],
  cli: {
    migrationsDir: 'src/dal/migrations/sqlite',
  },
  ...commonSettings
},];

module.exports = config
