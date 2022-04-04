import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Hub } from "../entity/hub.entity";
import { Invite } from "../entity/invite.entity";
import { User } from "../entity/user.entity";

@Resolver((of) => Invite)
export class InviteFieldResolver {

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
    async inviter(@Parent() parent: Invite) {
        return parent.inviter.load();
    }

    @ResolveField(() => User, { nullable: true })
    async invitee(@Parent() parent: Invite) {
        return parent.invitee.load();
    }

    @ResolveField(() => Hub, { nullable: true })
    async hub(@Parent() parent: Invite) {
        return parent.hub.load();
    }
    
}
