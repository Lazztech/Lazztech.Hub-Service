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
    @Field(() => [TItemClass])
    // and here the generic type
    items: TItem[];

    @Field(() => Int)
    total: number;
  }
  return PaginatedResponseClass;
}

@ObjectType()
export class PaginatedInAppNotificationsResponse extends PaginatedResponse(
  InAppNotification,
) {}

@InputType()
export class SortOptions {
  @Field()
  public field: string;

  @Field()
  public ascending: boolean;
}

@InputType()
export class PageableOptions {
  @Field(() => Int, { nullable: true })
  public limit?: number;

  @Field(() => Int, { nullable: true })
  public offset?: number;

  @Field({ nullable: true })
  public sortOptions?: SortOptions;
}

/**
 *
 * @param sortOptions
 * @returns typeorm order param compatible result
 */
export function generateOrderOptions(
  sortOptions?: SortOptions,
): {
  [field: string]: 'ASC' | 'DESC';
} {
  return sortOptions
    ? {
        [`${sortOptions?.field}`]: sortOptions?.ascending ? 'ASC' : 'DESC',
      }
    : undefined;
}
