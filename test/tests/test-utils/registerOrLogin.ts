import { gCall } from './gCall';

export const registerOrLogin = async (contextValue: any) => {
  const mutation = `
    mutation {
        register(data: {
        firstName: "Gian",
        lastName: "Lazzarini",
        email: "gianlazzarini@gmail.com",
        password: "Password0"
        })
    }
    `;
  const response = await gCall({ source: mutation, contextValue });
  console.log(response);
  if (response.data.register == null) {
    const loginMutation = `
        mutation {
            login(password: "Password0", email: "gianlazzarini@gmail.com")
        }
        `;
    await gCall({ source: loginMutation, contextValue });
  }
};
