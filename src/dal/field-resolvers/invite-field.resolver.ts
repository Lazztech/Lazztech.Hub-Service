import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { UsersByUserIdLoader } from "../dataloaders/users-by-userId.loader";
import { Hub } from "../entity/hub.entity";
import { Invite } from "../entity/invite.entity";
import { User } from "../entity/user.entity";

@Resolver(() => Invite)
export class InviteFieldResolver {

    constructor(
        private readonly usersByUserIdLoader: UsersByUserIdLoader,
    ) {}

    @ResolveField(() => ID)
    invitersId(@Parent() parent: Invite) {
        return parent.inviter.id;
    }

    @ResolveField(() => ID)
    inviteesId(@Parent() parent: Invite) {
        return parent.invitee.id;
    }

    @ResolveField(() => ID)
    hubId(@Parent() parent: Invite) {
      return parent.hub.id;
    }

    @ResolveField(() => User, { nullable: true })
    async inviter(@Parent() parent: Invite): Promise<User> {
        return this.usersByUserIdLoader.load(parent.inviter.id);
    }

    @ResolveField(() => User, { nullable: true })
    async invitee(@Parent() parent: Invite): Promise<User> {
        return this.usersByUserIdLoader.load(parent.invitee.id);
    }

    @ResolveField(() => Hub, { nullable: true })
    async hub(@Parent() parent: Invite) {
        return parent.hub.load();
    }
    
}
