import { BeforeCreate, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
@ObjectType({ isAbstract: true })
export abstract class ShareableId {

  @Field({nullable: false})
  @Property({ fieldName: 'shareableId' })
  shareableId!: string;

  // Only fires is repostiory.create is used for before save
  @BeforeCreate()
  public addId(){
    this.shareableId = randomUUID();
  }

  @Property({ nullable: true })
  public flagged?: boolean;

  @Property({ nullable: true })
  public banned?: boolean;
  
}