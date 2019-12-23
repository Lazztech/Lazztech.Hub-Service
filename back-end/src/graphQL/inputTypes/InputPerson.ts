import { Field, ID, InputType } from 'type-graphql';
import { InputImage } from './inputImage';

@InputType()
export class InputPerson {
  @Field()
  public name: string;

  @Field()
  public image: string;
}
