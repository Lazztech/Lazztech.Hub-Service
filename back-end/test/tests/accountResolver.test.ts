import { IMyContext } from "src/graphQL/context.interface";
import { Connection } from "typeorm";
import { gCall } from "./test-utils/gCall";
import { registerOrLogin } from "./test-utils/registerOrLogin";
import { contextSetup } from "./test-utils/setupGraphQLContext";
import { testConn } from "./test-utils/testConn";

let conn: Connection;
let ctx: IMyContext;
beforeAll(async () => {
    conn = await testConn();
    jest.setTimeout(30000);

    ctx = contextSetup();
    await registerOrLogin(ctx);
});
afterAll(async () => {
    await conn.close();
});

describe("AccountResolver", () => {
    it("changeName mutation should change name.", async () => {
        // Arrange
        const mutation = `
            mutation {
                changeName(firstName: "Gian", lastName: "Lazzarini1") {
                    firstName
                    lastName
                }
            }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
            data: {
                changeName: {
                    firstName: "Gian",
                    lastName: "Lazzarini1"
                }
            }
        });
    });

    it("changeEmail should change email address.", async () => {
        // Arrange
        const mutation = `
            mutation {
                changeEmail(newEmail: "me@gianlazzarini.com") {
                    email
                }
            }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
            data: {
                changeEmail: {
                    email: "me@gianlazzarini.com"
                }
            }
        });
    });

    it("changePassword should change users password.", async () => {
        // Arrange
        const mutation = `
            mutation {
                changePassword(oldPassword: "Password0", newPassword: "password")
            }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
            data: {
                changePassword: true
            }
        });
    });

    it("deleteAccount should delete the account.", async () => {
        // Arrange
        const mutation = `
            mutation {
                deleteAccount(email: "me@gianlazzarini.com", password: "password")
            }
        `;
        // Act
        const response = await gCall({ source: mutation, contextValue: ctx });
        // Assert
        expect(response).toMatchObject({
            data: {
                deleteAccount: true
            }
        });
    });
});
