import { BeforeCreate, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { v4 as uuid } from 'uuid';

@ObjectType({ isAbstract: true })
export abstract class ShareableId {
  @Property()
  @Field({nullable: false})
  shareableId:string;

  // Only fires is repostiory.create is used for before save
  @BeforeCreate()
  private addId(){
    this.shareableId = uuid();
  }
  
}