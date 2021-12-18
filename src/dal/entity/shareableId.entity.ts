import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, Column } from 'typeorm';
import { v4 as uuid } from 'uuid';

@ObjectType({ isAbstract: true })
export abstract class ShareableId {
  @Column()
  @Field({nullable: true})
  shareableId!:string;

  // Only fires is repostiory.create is used for before save
  @BeforeInsert()
  private addId(){
    this.shareableId = uuid();
  }
  
}