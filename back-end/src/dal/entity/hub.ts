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

@ObjectType()
@Entity()
export class Hub extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column()
  public name: string;

  //FIXME: this may break if not using mssql as the type is specific to mssql
  @Field({ nullable: true })
  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
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

  @Field(() => [User], { nullable: true })
  public async owners(): Promise<User[]> {
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

  @Field({ nullable: true })
  public starred: boolean;
}
