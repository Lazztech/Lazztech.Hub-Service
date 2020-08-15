import { gql } from 'apollo-server-core';
import { Connection } from 'typeorm';
import { gCall } from './test-utils/gCall';
import { testConn } from './test-utils/testConn';

let conn: Connection;
beforeAll(async () => {
  conn = await testConn();
});
afterAll(async () => {
  await conn.close();
});

describe('Hello Resolver', () => {
  it('should respond with hello world', async () => {
    const helloQuery = `
            query {
                hello
            }
        `;

    const response = await gCall({
      source: helloQuery,
    });

    expect(response).toMatchObject({
      data: {
        hello: 'Hello World!',
      },
    });
  });
});
