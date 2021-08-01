import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  it('/graphql register', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `mutation {
        register(data: {
          firstName: "gian",
          lastName: "lazzarini",
          email: "gianlazzarini@gmail.com",
          password: "Password123"
        })
      }`,
        variables: {},
      })
      .expect(200);

    return result;
  });

  it('/graphql login', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: `mutation {
        login(
          email: "gianlazzarini@gmail.com",
          password: "Password123"
        )
      }`,
        variables: {},
      })
      .expect(200);

    expect(result.body?.data?.login).toBeDefined();
    token = result.body?.data?.login;

    return result;
  });
});
