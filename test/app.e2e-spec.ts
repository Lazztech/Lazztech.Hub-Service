import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

 /* eslint-disable */
describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let emailAddress = "testtest@gmail.com";
  let password = "Password123";
  let userId;
  let hubId;
  let lastOnline;
  let lastUpdated;

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
          firstName: "test",
          lastName: "test",
          birthdate: "759398400",
          email: "testtest@gmail.com",
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
          email: "testtest@gmail.com",
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

  it('/graphql me', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `query {
          me {
            id
            firstName
            lastName
            description
            image
            email
            birthdate
            lastOnline
            userDevices {
              id
              fcmPushUserToken
            }
          }
        }`,
        variables: {},
      })
      .expect(200);
    
    userId = result.body?.data?.me?.id;
    expect(userId).toBeDefined();
    
    lastOnline = result.body?.data?.me?.lastOnline;
    expect(lastOnline).toBeDefined();
    

    expect(result.body?.data?.me).toMatchObject({
      id: userId,
      firstName: 'test',
      lastName: 'test',
      description: null,
      image: null,
      email: 'testtest@gmail.com',
      birthdate: '759398400',
      userDevices: [],
    });
    return result;
  });

  it('/graphql createHub', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation createHub(
          $name: String!
          $description: String
          $latitude: Float!
          $longitude: Float!
          $locationLabel: String
          $imageFile: Upload
      ){
          createHub(
              name: $name, 
              description: $description,
              latitude: $latitude,
              longitude: $longitude
              locationLabel: $locationLabel
              imageFile: $imageFile
              ) {
                  userId
                  hubId
                  isOwner
                  starred
                  isPresent
                  hub {
                      id
                      name
                      description
                      active
                      image
                      latitude
                      longitude
                      usersConnection {
                          isPresent
                          isOwner
                      }
                  }
              }
      }
        `,
        variables: {
          description: 'test',
          latitude: 0,
          longitude: 0,
          name: 'test',
          locationLabel: 'test location label'
        },
      })
      .expect(200);

    expect(result.body?.data?.createHub?.hub).toBeDefined();
    expect(result.body?.data?.createHub?.hubId).toBeDefined();
    hubId = result.body?.data?.createHub?.hubId;
    return result;
  });

  it('/graphql usersHubs', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `query {
          usersHubs{
            userId
            hubId
            isOwner
            starred
            isPresent
            hub {
              id
              name
              active
            }
          }
        }`,
        variables: {},
      })
      .expect(200);

    expect(result.body?.data?.usersHubs).toBeDefined();
    expect((result.body?.data?.usersHubs as []).length).toBeTruthy();
    // hub should be active when first created
    expect(result.body?.data?.usersHubs[0]?.hub?.active).toBe(true);
    return result;
  });

  it('/graphql hub', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `query hub($hubId: ID!) {
          hub(id: $hubId) {
            userId
            hubId
            isOwner
            starred
            isPresent
            hub {
              id
              name
              description
              active
              image
              latitude
              longitude
              usersConnection {
                user {
                  id
                  firstName
                  lastName
                  description
                  image
                }
                isOwner
                isPresent
              }
              microChats {
                id
                text
              }
            }
          }
        }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.hub).toBeDefined();
    return result;
  });

  it('/graphql usersPeople', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `query usersPeople {
          usersPeople {
              id
              firstName
              lastName
              email
              description
              image
          }
      }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.usersPeople).toBeDefined();
    return result;
  });

  it('/graphql activateHub', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation enter_test($hubId: ID!) {
          activateHub(hubId: $hubId) {
            active
          }
        }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.activateHub).toBeDefined();
    expect(result.body?.data?.activateHub?.active).toBe(true);
    return result;
  });

  it('/graphql enteredHubGeofence', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation enter_test($hubId: ID!) {
          enteredHubGeofence(hubId: $hubId) {
            isPresent
          }
        }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.enteredHubGeofence).toBeDefined();
    expect(result.body?.data?.enteredHubGeofence?.isPresent).toBe(true);
    return result;
  });

  it('/graphql dwellHubGeofence', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation dwellHubGeofence($hubId: ID!) {
          dwellHubGeofence(hubId: $hubId) {
          userId
          hubId
          isPresent
        }
      }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.dwellHubGeofence).toBeDefined();
    expect(result.body?.data?.dwellHubGeofence?.isPresent).toBe(true);
    return result;
  });

  it('/graphql exitedHubGeofence', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation exit_test($hubId: ID!) {
          exitedHubGeofence(hubId: $hubId) {
            isPresent
          }
        }`,
        variables: {
          hubId
        },
      })
      .expect(200);

    expect(result.body?.data?.exitedHubGeofence).toBeDefined();
    expect(result.body?.data?.exitedHubGeofence?.isPresent).toBe(false);
    return result;
  });

  it('/graphql deleteHub', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation deleteHub($hubId: ID!) {
          deleteHub(hubId: $hubId)
      }`,
        variables: {
          hubId,
        },
      })
      .expect(200);

    expect(result.body?.data?.deleteHub).toBeDefined();
  });

  it('/graphql createEvent', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation createEvent(
          $name: String!
          $hubId: String
          $description: String
          $startDateTime: String
          $endDateTime: String
          $minimumCapacity: Int
          $maximumCapacity: Int
          $latitude: Float
          $longitude: Float
          $locationLabel: String
          $imageFile: Upload
        ) {
          createEvent(
            name: $name
            hubId: $hubId
            description: $description
            startDateTime: $startDateTime
            endDateTime: $endDateTime
            minimumCapacity: $minimumCapacity
            maximumCapacity: $maximumCapacity
            latitude: $latitude
            longitude: $longitude
            locationLabel: $locationLabel
            imageFile: $imageFile
          ) {
            userId
            eventId
            user {
              id
              firstName
              lastName
              description
              image
              email
              shareableId
            }
            event {
              id
              name
              description
              startDateTime
              endDateTime
              latitude
              longitude
              shareableId
            }
            rsvp
            lastGeofenceEvent
            lastUpdated
          }
        }`,
        variables: {
          name: 'test event',
        },
      })
      .expect(200);

    expect(result.body?.data?.createEvent).toBeDefined();
  });

  it('/graphql deleteAccount', async () => {
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .set({ authorization: `Bearer ${token}` })
      .send({
        operationName: null,
        query: `mutation deleteAccount(
          $emailAddress: String!
          $password: String!
      ){
          deleteAccount(
              email: $emailAddress, 
              password: $password
              )
      }`,
        variables: {
          emailAddress,
          password,
        },
      })
      .expect(200);

    expect(result.body?.data?.deleteAccount).toBeDefined();
    return result;
  });
});
