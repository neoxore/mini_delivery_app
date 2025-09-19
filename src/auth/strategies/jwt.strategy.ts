import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
            algorithms: ['HS256']
        });
    }
    async validate(payload: JwtPayload) {
        if (!payload.sid || !payload.sub) throw new UnauthorizedException('Malformed token');

        const exists = await this.redis.exists(`refresh:${payload.sub}:${payload.sid}`);
        if (!exists) throw new UnauthorizedException('Session revoked');

        return { id: payload.sub, sessionId: payload.sid };
    }
}

export interface JwtPayload {
    sub: string;
    sid: string;
    role: string
}