import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

@ObjectType({ isAbstract: true })
export class ShareableId {
  @Column()
  @Field()
  shareableId?:string = uuid()
}