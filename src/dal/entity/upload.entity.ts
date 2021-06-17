import { Logger } from '@nestjs/common';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Upload {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public fileName: string;
}
