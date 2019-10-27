import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResolver {
  @Query((returns) => String)
  public async hello() {
    return "Hello World!";
  }
}
