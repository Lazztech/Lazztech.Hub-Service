import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Hub } from './hub.entity';
import { User } from './user.entity';

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
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public user: Promise<User>;

  @Field(type => Hub)
  @ManyToOne(
    () => Hub,
    hub => hub.usersConnection,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn()
  public hub: Promise<Hub>;

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
