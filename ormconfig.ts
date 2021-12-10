const path = require("path");

const commonSettings = {
  migrationsRun: true,
  synchronize: false,
  entities: ['dist/src/dal/entity/**/*.*.*'],
  // migrations: [__dirname + '/dal/migrations/**/*.*'],
  migrations: ['dist/src/dal/migrations/*.js'],
  subscribers: [__dirname + '/dal/migrations/**/*.*'],
  cli: {
    migrationsDir: 'src/dal/migrations',
  }
};
// Check typeORM documentation for more information.
const config = [{
  name: 'prod',
  type: 'postgres',
  host: 'localhost',
  database: 'postgres',
  port: 5432,
  // schema: 'postgres',
  username: 'postgres',
  password: 'Password123',
  ssl: false,
  ...commonSettings
},{
  name: 'default',
  type: 'sqlite',
  database: 'data/sqlite3.db',
  ...commonSettings
},];


module.exports = config
