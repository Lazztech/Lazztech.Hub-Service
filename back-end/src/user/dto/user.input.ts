import { IsEmail, Length } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UserInput {
  @Field()
  @Length(1, 255)
  public firstName: string;

  @Field()
  @Length(1, 255)
  public lastName: string;

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public password: string;
}
