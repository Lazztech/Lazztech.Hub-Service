import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { verify } from 'jsonwebtoken';
import { User } from 'src/dal/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name, true);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.logger.log('constructor');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log(this.canActivate.name);

    const ctx = GqlExecutionContext.create(context);
    let accessToken = ctx.getContext().req.headers['authorization'];

    if (!accessToken) {
      this.logger.error(
        "Custom Auth Checker didn't find Authorization header access token.",
      );
      return false;
    }

    const tokenSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    const data = verify(accessToken, tokenSecret) as any;
    if (data.userId) {
      const user = await this.userRepository.findOne({
        where: { id: data.userId },
      });
      if (user) {
        ctx.getContext().req.headers['userId'] = data.userId;
        this.logger.log('verified access token.');
        return true;
      } else {
        this.logger.error('unable to verify access token.');
        return false;
      }
    }

    // or false if access is denied
    return false;
  }
}
