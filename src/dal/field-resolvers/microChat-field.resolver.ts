import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { MicroChat } from "../entity/microChat.entity";

@Resolver((of) => MicroChat)
export class MicroChatFieldResolver {

  @ResolveField(() => ID)
  hubId(
    @Parent() parent: MicroChat,
  ) {
    return parent.hub.id;
  }
}
