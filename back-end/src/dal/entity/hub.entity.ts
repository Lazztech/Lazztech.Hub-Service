import { Field, ID, ObjectType } from 'type-graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JoinUserHub } from './joinUserHub.entity';
import { MicroChat } from './microChat.entity';

@ObjectType()
@Entity()
export class Hub {
  @Field(type => ID)
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

  @Field({ nullable: true })
  @Column({ nullable: true })
  public image: string;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public latitude: number;

  @Field({ nullable: true })
  @Column({ type: 'float', nullable: true })
  public longitude: number;

  @Field(() => [JoinUserHub], { nullable: true })
  @OneToMany(
    type => JoinUserHub,
    joinUserHub => joinUserHub.hub,
  )
  public usersConnection: JoinUserHub[];

  @Field(() => [MicroChat], { nullable: true })
  @OneToMany(
    type => MicroChat,
    microChat => microChat.hub,
  )
  public microChats: MicroChat[];
}
