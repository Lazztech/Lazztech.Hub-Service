import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ExpeditedRegistration {
    @Field()
    username: string;
    @Field()
    jwt: string;
    @Field()
    password: string;
}