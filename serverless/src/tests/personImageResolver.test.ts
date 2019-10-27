import { Connection } from "typeorm";
import { IMyContext } from "../graphQL/context.interface";
import { gCall } from "./test-utils/gCall";
import { registerOrLogin } from "./test-utils/registerOrLogin";
import { contextSetup } from "./test-utils/setupGraphQLContext";
import { testConn } from "./test-utils/testConn";

let conn: Connection;
let ctx: IMyContext;
beforeAll(async () => {
    conn = await testConn();
    jest.setTimeout(120000);

    ctx = contextSetup();
    await registerOrLogin(ctx);
});
afterAll(async () => {
    await conn.close();
});

describe("PersonImageResolver", () => {
    it("newImage should process multiple images and recognize that it's the same image.", async () => {
        // Arrange
        const image = "https://fortunedotcom.files.wordpress.com/2018/07/gettyimages-961697338.jpg";
        const mutation = `
        mutation {
          newImage(inputImage: {
            image: "https://fortunedotcom.files.wordpress.com/2018/07/gettyimages-961697338.jpg"
          })
        }
        `;
        // Act
        const response1 = await gCall({ source: mutation, contextValue: ctx });
        const response2 = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response1).toMatchObject({
          data: {
            newImage: 1
          }
        });
        expect(response2).toMatchObject({
          data: {
            newImage: 2
          }
        });
    });

    it("getAllPersons query should return Person[].", async () => {
        // Arrange
        const query = `
        query {
          getAllPersons {
            id
            name
            images {
              id
              personDescriptors {
                id
              }
            }
          }
        }
        `;
        // Act
        const response = await gCall({ source: query, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
          data: {
            getAllPersons: [
              {
                id: "1",
                name: null,
                images: [
                  {
                    id: "1",
                    personDescriptors: [
                      {
                        id: "1"
                      }
                    ]
                  },
                  {
                    id: "2",
                    personDescriptors: [
                      {
                        id: "2"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        });
    });

    it("getAllImages should return all images in the database.", async () => {
      // Arrange
      const query = `
      query {
        getAllImages {
          id
          personDescriptors {
            id
          }
          people {
            id
            name
          }
        }
      }
      `;
      // Act
      const response = await gCall({ source: query, contextValue: ctx });
      // Assert
      expect(response).toMatchObject({
        data: {
          getAllImages: [
            {
              id: "1",
              personDescriptors: [
                {
                  id: "1"
                }
              ],
              people: [
                {
                  id: "1",
                  name: null
                }
              ]
            },
            {
              id: "2",
              personDescriptors: [
                {
                  id: "2"
                }
              ],
              people: [
                {
                  id: "1",
                  name: null
                }
              ]
            }
          ]
        }
      });
  });

    it("renamePerson should return true.", async () => {
    // Arrange
    const mutation = `
    mutation {
      renamePerson(personId: 1, newName: "Mark")
    }
    `;
    // Act
    const result = await gCall({ source: mutation, contextValue: ctx });
    // Assert
    expect(result).toMatchObject({
      data: {
        renamePerson: true
      }
    });
  });

    it("getAllPersons should reflect the renamePerson mutation's newName.", async () => {
    // Arrange
    const query = `
    query {
      getAllPersons {
        id
        name
        images {
          id
          personDescriptors {
            id
          }
        }
      }
    }
    `;
    // Act
    const result = await gCall({ source: query, contextValue: ctx });
    // Assert
    expect(result).toMatchObject({
      data: {
        getAllPersons: [
          {
            id: "1",
            name: "Mark",
            images: [
              {
                id: "1",
                personDescriptors: [
                  {
                    id: "1"
                  }
                ]
              },
              {
                id: "2",
                personDescriptors: [
                  {
                    id: "2"
                  }
                ]
              }
            ]
          }
        ]
      }
    });
  });

    it("newPerson mutation should return the id of the new person.", async () => {
    // Arrange
    const mutation = `
    mutation {
      newPerson(inputPerson: {
        image: "https://avatars3.githubusercontent.com/u/1166579?s=460&v=4"
        name: "Gian"
      })
    }
    `;
    // Act
    const result = await gCall({ source: mutation, contextValue: ctx });
    // Assert
    expect(result).toMatchObject({
      data: {
        newPerson: 2
      }
    });
  });
});
