import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, Length } from 'class-validator';

@InputType()
export class UserInput {
  @Field()
  @Length(1, 255)
  public firstName: string;

  @Field()
  @Length(1, 255)
  public lastName: string;

  @Field({ description: 'string representation of unix timestamp' })
  public birthdate: string;

  @Field()
  @IsEmail()
  public email: string;

  @Field()
  public password: string;
}
