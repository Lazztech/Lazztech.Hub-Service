import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub.entity';

@ObjectType()
@Entity()
export class MicroChat {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public hubId: number;

  @Field(() => ID)
  @ManyToOne(() => Hub, (x) => x.microChats, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public hub: Hub;

  @Field()
  @Column()
  public text: string;
}
