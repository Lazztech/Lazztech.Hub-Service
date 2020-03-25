import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hub } from './hub';
import { User } from './user';

@ObjectType()
@Entity()
export class JoinUserHub {
  @Field(type => ID)
  @PrimaryColumn()
  public userId: number;

  @Field(type => ID)
  @PrimaryColumn()
  public hubId: number;

  @Field(type => User)
  @ManyToOne(
    () => User,
    user => user.hubsConnection,
    { primary: true, onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public user: User;

  @Field(type => Hub)
  @ManyToOne(
    () => Hub,
    hub => hub.usersConnection,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  public hub: Hub;

  @Field()
  @Column()
  public isOwner: boolean;

  @Field()
  @Column({ default: false })
  public starred: boolean;

  /**
   * Boolean value for if user is presently at the hub.
   */
  @Field()
  @Column({ default: false })
  public isPresent: boolean;
}
