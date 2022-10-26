import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UserDevice } from "../entity/userDevice.entity";

@Resolver(() => UserDevice)
export class UserDeviceFieldResolver {

    @ResolveField(() => ID)
    userId(@Parent() parent: UserDevice) {
      return parent.user.id;
    }
}
