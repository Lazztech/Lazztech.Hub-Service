import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ExpeditedRegistration {
    @Field()
    jwt: string;
    @Field()
    password: string;
}