import { Field, ID, ObjectType } from '@nestjs/graphql';
import { JoinUserHub } from './joinUserHub.entity';
import { MicroChat } from './microChat.entity';
import { Invite } from './invite.entity';
import { ShareableId } from './shareableId.entity'
import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

 /* eslint-disable */ // needed for mikroorm default value & type which conflicts with typescript-eslint/no-unused-vars
@ObjectType()
@Entity()
export class Hub extends ShareableId {
  @Field(() => ID)
  @PrimaryKey()
  public id!: number;

  @Field()
  @Property()
  public name!: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  public description?: string;

  @Field({ nullable: true })
  @Property({ default: false })
  public active: boolean = false;

  /**
   * Handled with a field resolver
   */
  @Property({ nullable: true })
  public image?: string;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public latitude?: number;

  @Field({ nullable: true })
  @Property({ type: 'float', nullable: true })
  public longitude?: number;

  /**
   * Handled with a field resolver
   */
  @OneToMany(() => JoinUserHub, (joinUserHub) => joinUserHub.hub)
  public usersConnection = new Collection<JoinUserHub>(this);

  /**
   * Handled with a field resolver
   */
  @OneToMany(() => MicroChat, (microChat) => microChat.hub)
  public microChats = new Collection<MicroChat>(this);

  /**
   * Handled with a field resolver
   */
  @OneToMany(() => Invite, (invite) => invite.hub)
  public invites = new Collection<Invite>(this);
}
