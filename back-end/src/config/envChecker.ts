import { isNull, isNullOrUndefined } from "util";

export function checkEnvVariables() {

    if (isNullOrUndefined(process.env.PORT) || process.env.PORT === "") {
        throw Error("Missing process.env.PORT");
    }

    if (isNullOrUndefined(process.env.ACCESS_TOKEN_SECRET) || process.env.ACCESS_TOKEN_SECRET === "") {
        throw Error("Missing process.env.ACCESS_TOKEN_SECRET");
    }

    if (isNullOrUndefined(process.env.EMAIL_FROM_ADDRESS) || process.env.EMAIL_FROM_ADDRESS === "") {
        throw Error("Missing process.env.EMAIL_FROM_ADDRESS");
    }

    if (isNullOrUndefined(process.env.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD === "")) {
        throw Error("Missing process.env.EMAIL_PASSWORD");
    }

    if (isNullOrUndefined(process.env.FIREBASE_SERVER_KEY) || process.env.FIREBASE_SERVER_KEY === "") {
        throw Error("Missing process.env.FIREBASE_SERVER_KEY");
    }

    if (isNullOrUndefined(process.env.APP_NAME) || process.env.APP_NAME === "") {
        throw Error("Missing process.env.APP_NAME");
    }
}
