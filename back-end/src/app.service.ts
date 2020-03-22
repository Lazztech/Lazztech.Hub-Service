import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class AppService {
  //FIXME is this unused code or should I purpose it?

  logger = new Logger(AppService.name, true);
  static staticLogger = new Logger(AppService.name, true);

  getHello(): string {
    return 'Copyright Lazztech LLC';
  }

  static getAzureSqlDbConnectionOptions(): TypeOrmModuleOptions {
    this.staticLogger.log(this.getAzureSqlDbConnectionOptions.name);
    const options: TypeOrmModuleOptions = {
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
    };

    return options;
  }

  static getDevDbConnection(): TypeOrmModuleOptions {
    this.staticLogger.log(this.getDevDbConnection.name);
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: '***REMOVED***',
      username: '***REMOVED***',
      password: 'Password123',
      database: 'postgres',
      logging: false,
      // migrationsRun: true,
      synchronize: true,
      entities: [__dirname + '/dal/entity/**/*.*'],
      migrations: [__dirname + '/dal/migrations/**/*.*'],
      subscribers: [__dirname + '/dal/migrations/**/*.*'],
    };
    return options;
  }
}
