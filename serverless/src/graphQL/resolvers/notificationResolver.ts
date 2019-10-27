import { verify } from "jsonwebtoken";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InAppNotification } from "../../dal/entity/inAppNotification";
import { JoinUserInAppNotifications } from "../../dal/entity/joinUserInAppNotifications";
import { User } from "../../dal/entity/user";
import { UserDevice } from "../../dal/entity/userDevice";
import { NotificationService } from "../../services/notificationService";
import { IMyContext } from "../context.interface";

@Resolver()
export class NotificationResolver {

    constructor(
        private notificationService: NotificationService
    ) {}

    @Authorized()
    @Query(() => [InAppNotification])
    public async getInAppNotifications(
        @Ctx() ctx: IMyContext,
    ): Promise<InAppNotification[]> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;

        const joinInAppNotifications = await JoinUserInAppNotifications.find({
            where: { userId: data.userId},
            relations: ["inAppNotification"]
        });

        const usersNotifications: InAppNotification[] = [];
        joinInAppNotifications.forEach((element) => {
                usersNotifications.push(element.inAppNotification);
        });

        return usersNotifications;
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async addUserFcmNotificationToken(
        @Ctx() ctx: IMyContext,
        @Arg("token") token: string
    ): Promise<boolean> {
        let accessToken = ctx.req.cookies["access-token"];
        if (!accessToken) {
            accessToken = ctx.req.get("Authorization");
        }
        if (!accessToken) {
            console.error("Didn't find access token!");
        }

        const data = verify(accessToken, process.env.ACCESS_TOKEN_SECRET) as any;
        const user = await User.findOne({ where: { id: data.userId}});

        const userDevice = new UserDevice();
        userDevice.userId = user.id;
        userDevice.fcmPushUserToken = token;
        const result = await userDevice.save();
        console.log(result);

        return true;
    }

    @Query(() => Boolean)
    public async sendPushNotification(
        @Arg("userId") userId: number,
    ) {
        await this.notificationService.sendPushToUser(
            userId,
            "this is a test push message",
            `this is a test push message`,
            ""
            );

        return true;
    }

}
