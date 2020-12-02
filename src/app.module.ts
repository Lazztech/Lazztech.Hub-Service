import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './dal/entity/user.entity';
import { AuthGuard } from './guards/authguard.service';
import { HubModule } from './hub/hub.module';
import { NotificationModule } from './notification/notification.module';
import { ServicesModule } from './services/services.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASS', 'postgres'),
        database: configService.get('DATABASE_SCHEMA', 'postgres'),
        logging: true,
        // migrationsRun: true,
        synchronize: true,
        entities: [__dirname + '/dal/entity/**/*.*.*'],
        migrations: [__dirname + '/dal/migrations/**/*.*'],
        subscribers: [__dirname + '/dal/migrations/**/*.*'],
      }),
    } as TypeOrmModuleOptions),
    TypeOrmModule.forFeature([User]),
    ServicesModule,
    NotificationModule,
    HubModule,
    UserModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req }) => ({ req }),
      cors: {
        credentials: true,
        origin: true,
      },
    }),
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [AuthGuard],
})
export class AppModule {}
