import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Hub } from './hub.entity';

@ObjectType()
@Entity()
export class Invite {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => ID)
  @PrimaryColumn()
  public invitersId: number;

  @Field(() => ID)
  @PrimaryColumn()
  public inviteesId: number;

  @Field(() => ID)
  @PrimaryColumn()
  public hubId: number;

  @Field(() => Boolean)
  @Column({ default: false })
  public accepted: boolean;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.invitesSent,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'invitersId' })
  public inviter: Promise<User>;

  @Field(() => User)
  @ManyToOne(
    () => User,
    user => user.invitesReceived,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'inviteesId' })
  public invitee: Promise<User>;

  @Field(() => Hub)
  @ManyToOne(
    () => Hub,
    hub => hub.invites,
    { onDelete: 'CASCADE' },
  )
  public hub: Promise<Hub>;
}
