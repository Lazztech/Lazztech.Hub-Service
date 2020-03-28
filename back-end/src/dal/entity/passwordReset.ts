import { Field, ID } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PasswordReset {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public pin: string;
}
