import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JoinUserHub } from './joinUserHub';
import { User } from './user';
import { MicroChat } from './microChat';
import { Logger } from '@nestjs/common';

@ObjectType()
@Entity()
export class Hub extends BaseEntity {
  private logger = new Logger(Hub.name, true);

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

  @Field(() => [User], { nullable: true })
  public async owners(): Promise<User[]> {
    this.logger.log(this.owners.name);

    const joinUserHubResults = await JoinUserHub.find({
      where: {
        hubId: this.id,
        isOwner: true,
      },
      relations: ['user'],
    });
    const owners: User[] = [];
    joinUserHubResults.forEach(result => {
      const user = result.user;
      owners.push(user);
    });

    return owners;
  }

  @Field(() => [User], { nullable: true })
  public async members(): Promise<User[]> {
    this.logger.log(this.members.name);

    const joinUserHubResults = await JoinUserHub.find({
      where: {
        hubId: this.id,
        isOwner: false,
      },
      relations: ['user'],
    });
    const members: User[] = [];
    joinUserHubResults.forEach(result => {
      const user = result.user;
      members.push(user);
    });

    return members;
  }
}
