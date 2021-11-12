import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { InAppNotification } from '../entity/inAppNotification.entity';

export interface ClassType<T = any> {
  new (...args: any[]): T;
}

export default function PaginatedResponse<TItem>(TItemClass: ClassType<TItem>) {
  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    // here we use the runtime argument
    @Field((type) => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field((type) => Int)
    total: number;
  }
  return PaginatedResponseClass;
}

@ObjectType()
export class PaginatedInAppNotificationsResponse extends PaginatedResponse(
  InAppNotification,
) {}

@InputType()
export class PageableOptions {
  @Field(() => Int, { nullable: true })
  public limit?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;

  @Field({ nullable: true })
  descending?: boolean = true;
}
