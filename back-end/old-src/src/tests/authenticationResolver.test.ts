import { Connection } from "typeorm";
import { User } from "../../../src/dal/entity/user";
import { IMyContext } from "../../../src/graphQL/context.interface";
import { gCall } from "./test-utils/gCall";
import { registerOrLogin } from "./test-utils/registerOrLogin";
import { contextSetup } from "./test-utils/setupGraphQLContext";
import { testConn } from "./test-utils/testConn";

let conn: Connection;
let ctx: IMyContext;
beforeAll(async () => {
    conn = await testConn();
    jest.setTimeout(40000);

    ctx = contextSetup();
    console.log("Setting up test account.");
    await registerOrLogin(ctx);
    console.log(ctx);
    console.log("Registered test account.");
});
afterAll(async () => {
    await conn.close();
});

describe("AuthenticationResolver", () => {
    it("logout mutation should return true and delete the jwt cookie.", async () => {
        // Arrange
        const mutation = `
        mutation {
            logout
          }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
            data: {
              logout: true
            }
          });
    });

    it("login mutation should return true and store the jwt cookie.", async () => {
        // Arrange`
        const mutation = `
        mutation {
            login(password: "Password0", email: "gianlazzarini@gmail.com")
          }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response.data.login).not.toBeNull();
    });

    it("me mutation should return my public user details from using my jwt to find me.", async () => {
        // Arrange
        const query = `
        query {
            me {
              id
              firstName
              lastName
              email
            }
          }
        `;
        // Act
        console.log("me mutation test context: " + JSON.stringify(ctx));

        const response = await gCall({ source: query, contextValue: ctx });
        const me: User = response.data.me;
        // Assert
        expect(me.firstName).toEqual("Gian");
        expect(me.lastName).toEqual("Lazzarini");
        expect(me.email).toEqual("gianlazzarini@gmail.com");
    });
});
