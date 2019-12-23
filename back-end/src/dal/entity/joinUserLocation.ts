import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location';
import { User } from './user';

@ObjectType()
@Entity()
export class JoinUserLocation extends BaseEntity {
  @Field(type => ID)
  @PrimaryColumn()
  public userId: number;

  @Field(type => ID)
  @PrimaryColumn()
  public locationId: number;

  @Field(type => User)
  @ManyToOne(
    () => User,
    user => user.locationsConnection,
    { primary: true },
  )
  @JoinColumn()
  public user: User;

  @Field(type => Location)
  @ManyToOne(
    () => Location,
    location => location.usersConnection,
    { primary: true },
  )
  @JoinColumn()
  public location: Location;
}
