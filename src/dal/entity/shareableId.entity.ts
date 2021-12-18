import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { v4 as uuid } from 'uuid';

@ObjectType({ isAbstract: true })
export abstract class ShareableId {
  @Column()
  @Field({nullable: true})
  shareableId!:string;

  @BeforeInsert()
  private addId(){
    this.shareableId = uuid();
  }
  
}