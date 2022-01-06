import { Field, ID, ObjectType } from '@nestjs/graphql';
import { JoinUserHub } from './joinUserHub.entity';
import { MicroChat } from './microChat.entity';
import { Invite } from './invite.entity';
import { ShareableId } from './shareableId.entity'
import { Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

@ObjectType()
@Entity()
export class Hub extends ShareableId {
  @Field(() => ID)
  @PrimaryKey()
  public id: number;

  @Field()
  @Property()
  public name: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public description: string;

  @Field({ nullable: true })
  @Property({ default: false })
  public active: boolean;

  /**
   * Handled with a field resolver
   */
  @Property({ nullable: true })
  public image: string;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public latitude: number;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public longitude: number;

  @Field(() => [JoinUserHub], { nullable: true })
  @OneToMany(() => JoinUserHub, (joinUserHub) => joinUserHub.hub)
  public usersConnection: Promise<JoinUserHub[]>;

  @Field(() => [MicroChat], { nullable: true })
  @OneToMany(() => MicroChat, (microChat) => microChat.hub)
  public microChats: Promise<MicroChat[]>;

  @Field(() => [Invite], { nullable: true })
  @OneToMany(() => Invite, (invite) => invite.hub)
  public invites: Promise<Invite[]>;
}
