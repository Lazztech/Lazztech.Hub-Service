import { ID, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Invite } from "../entity/invite.entity";

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
    
}
