import { MikroORM } from '@mikro-orm/core';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../../dal/entity/user.entity';
import { Payload } from '../dto/payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private readonly orm: MikroORM,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // TODO handle expired tokens
      secretOrKey: configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: Payload) {
    this.logger.debug('verified access token.');
    await this.orm.em.transactional(async em => {
      const userRepository = em.getRepository(User);
      const user = await userRepository.findOne(({ id: payload.userId }));

      if (!user || user?.banned) {
        this.logger.error('unable to verify access token.');
        throw new UnauthorizedException();
      } else {
        user.lastOnline = Date.now().toString();
        this.logger.debug('verified user');
      }
      em.persist(user);
    });
    return payload;
  }
}
