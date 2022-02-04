import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payload } from '../dto/payload.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // TODO handle expired tokens
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: Payload) {
    this.logger.log('verified access token.');

    const user = await this.userService.getUser(payload.userId);
    if (!user) {
      this.logger.error('unable to verify access token.');
      throw new UnauthorizedException();
    } else {
      await this.userService.updateLastOnline(user);
      this.logger.log('verified user');
    }

    return payload;
  }
}
