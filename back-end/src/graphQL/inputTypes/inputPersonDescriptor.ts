import { Field, Float, InputType } from 'type-graphql';
import { InputPerson } from './InputPerson';

@InputType()
export class InputPersonDescriptor {
//FIXME No longer needed?

  @Field(type => InputPerson, { nullable: true })
  public person?: InputPerson;

  @Field(type => [Float], { nullable: true })
  public descriptor?: number[];
}
