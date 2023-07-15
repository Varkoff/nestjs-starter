import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTPayloadType } from '@/types/utils.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // * Cette fonction est appelée par le middleware Passport si le token JWT est valide. Elle permet d'identifier l'utilisateur.
  async validate(payload: JWTPayloadType): Promise<JWTPayloadType> {
    return {
      userId: payload.userId,
      asUserId: payload.asUserId,
      role: payload.role,
    };
  }
}
