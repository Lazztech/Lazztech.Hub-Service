import { Field, ObjectType } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

@ObjectType({ isAbstract: true })
export class ShareableId {
  @Column({nullable: true})
  @Field({nullable: true})
  shareableId?:string = uuid()
}