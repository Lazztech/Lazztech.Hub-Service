import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Hub } from './hub.entity';

@ObjectType()
@Entity()
@Index(["invitersId", "inviteesId", "hubId"], { unique: true })
export class Invite {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field(() => ID)
  @Column()
  public invitersId: number;

  @Field(() => ID)
  @Column()
  public inviteesId: number;

  @Field(() => ID)
  @Column()
  public hubId: number;

  @Field(() => Boolean)
  @Column({ default: false })
  public accepted: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.invitesSent, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitersId' })
  public inviter: Promise<User>;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.invitesReceived, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inviteesId' })
  public invitee: Promise<User>;

  @Field(() => Hub)
  @ManyToOne(() => Hub, (hub) => hub.invites, { onDelete: 'CASCADE' })
  public hub: Promise<Hub>;
}
