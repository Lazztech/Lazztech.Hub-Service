import { verify } from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { User } from "../dal/entity/user";
import { IMyContext } from "./context.interface";

export const customAuthChecker: AuthChecker<IMyContext> = async (
    { root, args, context, info },
    roles,
  ) => {
    // here we can read the user from context
    // and check his permission in the db against the `roles` argument
    // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    // if (context.req.cookies.) {
    //   return true;
    // }
    console.log("Executing customAuthChecker");
    let accessToken = context.req.cookies["access-token"];
    if (!accessToken) {
      console.error("Custom Auth Checker didn't find an access-token in cookie.");
      accessToken = context.req.get("Authorization");
    }
    if (!accessToken) {
      console.error("Custom Auth Checker didn't find Authorization header access token.");
      return false;
    }

    const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
    if (data.userId) {
      const user =  await User.findOne({ where: { id: data.userId}});
      if (user) {
        return true;
        console.log("verified access token.");
      } else {
        console.error("unable to verify access token.");
        return false;
      }
    }

    // or false if access is denied
    return false;
  };
