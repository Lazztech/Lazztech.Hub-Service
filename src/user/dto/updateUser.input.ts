import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsPhoneNumber, Length } from "class-validator";

@InputType()
export class UpdateUserInput {
  @Field()
  @Length(1, 255)
  @Field({ nullable: true })
  public firstName?: string;

  @Field()
  @Length(1, 255)
  @Field({ nullable: true })
  public lastName?: string;

  @Field()
  @Length(1, 255)
  @Field({ nullable: true })
  public description?: string;

  @Field()
  @IsEmail()
  @Field({ nullable: true })
  public email?: string;

  @Field({ nullable: true })
  @IsPhoneNumber()
  public phoneNumber?: string;
}
