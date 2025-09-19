import { ConflictException, Inject, Injectable, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt.strategy';
import { argon2d, hash, verify } from 'argon2';
import { randomUUID } from 'crypto';
import Redis from 'ioredis';
import e, { Request, Response } from 'express';
import { error } from 'console';



@Injectable()
export class AuthService {

    private readonly ACCESS_TTL: string
    private readonly REFRESH_TTL: string
    private readonly REDIS_REFRESH_TTL: string

    constructor(
        private readonly prismaService: PrismaService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) {
        this.ACCESS_TTL = configService.getOrThrow<string>('ACCESS_TTL');
        this.REFRESH_TTL = configService.getOrThrow<string>('REFRESH_TTL');
        this.REDIS_REFRESH_TTL = configService.getOrThrow<string>('REDIS_REFRESH_TTL');
    }

    public async register(dto: AuthRegisterDto) {
        const existEmail = await this.prismaService.user.findUnique({
            where: { email: dto.email },
            select: { email: true }
        });

        if (existEmail) throw new ConflictException('Invalid credentials');

        const hashedPass = await hash(dto.password);
        const sessionId = randomUUID();
        let user;

        try {
            user = await this.prismaService.user.create({
                data: { email: dto.email, password: hashedPass },
                select: { id: true, role: true }, 
            });
        } catch (e: any) {
            if (e.code === 'P2002') throw new ConflictException('Email already exists')
            throw e
        }

        const tokens = await this.auth(user.id, sessionId, user.role);

        try {
            await this.redis.set(`refresh:${user.id}:${sessionId}`, '1', 'EX', this.REDIS_REFRESH_TTL);
        } catch (error) {
            throw new ServiceUnavailableException('Redis client is not aviable', { cause: error })
        }

        return { ...tokens };
    }

    public async login(dto: AuthLoginDto) {

        const user = await this.prismaService.user.findUnique({
            where: { email: dto.email }
        });

        if (!user) throw new UnauthorizedException('User not found');

        const isValid = await verify(user.password, dto.password);

        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        const sessionId = randomUUID();

        const tokens = await this.auth(user.id, sessionId, user.role);

        try {
            await this.redis.set(`refresh:${user.id}:${sessionId}`, '1', 'EX', this.REDIS_REFRESH_TTL);
        } catch (error) {
            throw new ServiceUnavailableException('Redis client is not aviable', { cause: error })
        }

        return { ...tokens };

    }

    public async logout(req: Request) {
        const p = await this.validateToken(req);
        const deleted = await this.redis.del(`refresh:${p.sub}:${p.sid}`);
        if (deleted === 0) return { message: 'Logged out' };   
    }

    public async refresh(req: Request) {
        const p = await this.validateToken(req);

        const newSid = randomUUID()
        const tokens = await this.auth(p.sub, newSid, p.role);

        try {
            await this.redis.multi()
                .del(`refresh:${p.sub}:${p.sid}`)
                .set(`refresh:${p.sub}:${newSid}`, '1', 'EX', this.REDIS_REFRESH_TTL)
                .exec();
        } catch (error: any) {
            throw new ServiceUnavailableException('Redis client is not aviable', { cause: error });
        }

        return { ...tokens };
    }

    private async issueTokens(payload: JwtPayload) {
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.ACCESS_TTL
        });

        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.REFRESH_TTL
        });

        return { accessToken, refreshToken };
    }

    private async auth(sub: string, sid: string, role: string) {
        const payload: JwtPayload = { sub, sid, role};
        const tokens = await this.issueTokens(payload);
        return tokens;
    }

    private async validateToken(req: Request) {
        const header = req.headers['x-refresh-token'] as string;

        if (!header) throw new UnauthorizedException('Missing headers');

        const token = header.startsWith('Bearer ') ? header.slice(7) : header;
        let payload: JwtPayload;
        
        try {
            payload = this.jwtService.verify<JwtPayload>(token);    
        } catch (error: any) {
            throw new UnauthorizedException('Invalid token', { cause: error });
        }

        return { ...payload };
    }



}
