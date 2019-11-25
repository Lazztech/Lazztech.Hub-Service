import * as bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { Arg, Authorized, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../../dal/entity/user";
import { IMyContext } from "../context.interface";

@Resolver()
export class AccountResolver {

    @Authorized()
    @Mutation(() => User)
    public async changeName(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string
    ): Promise<User> {
        const user = await User.findOne({ where: { id: ctx.userId}});
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();

        return user;
    }

    @Authorized()
    @Mutation(() => User)
    public async changeEmail(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("newEmail") newEmail: string
    ): Promise<User> {
        const user = await User.findOne({ where: { id: ctx.userId}});
        user.email = newEmail;
        await user.save();

        return user;
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async changePassword(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("oldPassword") oldPassword: string,
        @Arg("newPassword") newPassword: string
    ): Promise<boolean> {
        const user = await User.findOne({ where: { id: ctx.userId}});

        const valid = await bcrypt.compare(oldPassword, user.password);

        if (valid) {
            const newHashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = newHashedPassword;
            await user.save();

            return true;
        } else {
            return false;
        }
    }

    @Authorized()
    @Mutation(() => Boolean)
    public async deleteAccount(
        @Ctx() ctx: any, //FIXME: should be an interface
        @Arg("email") email: string,
        @Arg("password") password: string
    ): Promise<boolean> {
        const user = await User.findOne({ where: { id: ctx.userId}});

        const valid = await bcrypt.compare(password, user.password);

        if (valid && email === user.email) {
            await user.remove();
            return true;
        } else {
            return false;
        }
    }

}
