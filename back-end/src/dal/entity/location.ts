import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinUserLocation } from './joinUserLocation';

@ObjectType()
@Entity()
export class Location extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column({ nullable: true })
  public name: string;

  @Field()
  @Column({ nullable: true })
  public description: string;

  @Field()
  @Column({ nullable: true })
  public latitude: string;

  @Field()
  @Column({ nullable: true })
  public longitude: string;

  @OneToMany(
    type => JoinUserLocation,
    joinUserLocation => joinUserLocation.location,
  )
  public usersConnection: JoinUserLocation[];
}
