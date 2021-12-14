import { Field } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

export class shareableId {
  @Column()
  @Field({nullable: true})
  shareableId?:string = uuid()
}