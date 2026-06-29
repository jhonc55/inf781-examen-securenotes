import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as argon2 from 'argon2';

import { UsersService } from '../users/users.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,

    @InjectRepository(RefreshToken)
    private refreshRepository:
        Repository<RefreshToken>,
    ) {}

  async register(email: string, password: string) {
    const exists = await this.usersService.findByEmail(email);

    if (exists) {
        throw new ConflictException('Email already exists');
    }

    const hash = await argon2.hash(password);

    const user = await this.usersService.create({
        email,
        password: hash,
    });

    const tokens = await this.generateTokens(
        user.id,
        user.email,
    );

    await this.saveRefreshToken(
        user.id,
        tokens.refreshToken,
    );

    return tokens;
    }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const valid = await argon2.verify(
      user.password,
      password,
    );

    if (!valid) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateTokens(
    user.id,
    user.email,
    );

    await this.saveRefreshToken(
    user.id,
    tokens.refreshToken,
    );

    return tokens;
  }

  async refresh(refreshToken: string) {
    try {
        const payload = await this.jwtService.verifyAsync(
        refreshToken,
        {
            secret: this.config.get(
            'JWT_REFRESH_SECRET',
            ),
        },
        );

        const tokens =
            await this.refreshRepository.find();

            let validToken: RefreshToken | null = null;

            for (const token of tokens) {
            const matches = await argon2.verify(
                token.hashedToken,
                refreshToken,
            );

            if (matches) {
                validToken = token;
                break;
            }
            }

            if (!validToken || validToken.revoked) {
            throw new UnauthorizedException(
                'Invalid refresh token',
            );
            }

        const accessToken =
        await this.jwtService.signAsync(
            {
            sub: payload.sub,
            email: payload.email,
            },
            {
            secret: this.config.get(
                'JWT_ACCESS_SECRET',
            ),
            expiresIn: '15m',
            },
        );

        return {
        accessToken,
        };
    } catch {
        throw new UnauthorizedException(
        'Invalid refresh token',
        );
    }
    }

  async generateTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(
    userId: string,
    refreshToken: string,
    ) {
    const hash =
        await argon2.hash(refreshToken);

    const expiresAt = new Date();

    expiresAt.setDate(
        expiresAt.getDate() + 7,
    );

    await this.refreshRepository.save({
        userId,
        hashedToken: hash,
        expiresAt,
    });
    }

    async logout(refreshToken: string) {
    const tokens = await this.refreshRepository.find();

    for (const token of tokens) {
        const matches = await argon2.verify(
        token.hashedToken,
        refreshToken,
        );

        if (matches) {
        token.revoked = true;
        await this.refreshRepository.save(token);

        return {
            message: 'Logout successful',
        };
        }
    }

    throw new UnauthorizedException(
        'Invalid refresh token',
    );
    }
}