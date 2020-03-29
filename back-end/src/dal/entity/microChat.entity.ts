import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Hub } from './hub.entity';

@ObjectType()
@Entity()
export class MicroChat {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @PrimaryColumn()
  public hubId: number;

  @Field(type => ID)
  @ManyToOne(
    () => Hub,
    x => x.microChats,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  public hub: Hub;

  @Field()
  @Column()
  public text: string;
}
