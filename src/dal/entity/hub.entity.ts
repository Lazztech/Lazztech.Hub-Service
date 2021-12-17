import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinUserHub } from './joinUserHub.entity';
import { MicroChat } from './microChat.entity';
import { Invite } from './invite.entity';
import { ShareableId } from './shareableId'

@ObjectType()
@Entity()
export class Hub extends ShareableId {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  public description: string;

  @Field({ nullable: true })
  @Column({ default: false })
  public active: boolean;

  /**
   * Handled with a field resolver
   */
  @Column({ nullable: true })
  public image: string;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public latitude: number;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
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
