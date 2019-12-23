import { Field, ID, InputType } from 'type-graphql';
import { InputPerson } from './InputPerson';
import { InputPersonDescriptor } from './inputPersonDescriptor';

@InputType()
export class InputImage {
  @Field()
  public image: string;

  // @Field((type) => [InputPerson], { nullable: true })
  // public persons?: InputPerson[];

  @Field(type => [InputPersonDescriptor], { nullable: true })
  public personDescriptors?: InputPersonDescriptor[];
}
