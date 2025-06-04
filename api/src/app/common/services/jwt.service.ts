import { JwtPayload, UserPayload } from '@/app/common/interfaces/jwt.interface';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { jwtConstants } from '../constants/jwt.constants';

@Injectable()
export class JwtService {
  private accessSecret: jwt.Secret;
  private refreshSecret: jwt.Secret;
  private accessSignOptions: SignOptions;
  private refreshSignOptions: SignOptions;

  constructor() {
    this.accessSecret = jwtConstants.secret || 'default_jwt_secret';
    this.refreshSecret = jwtConstants.refresh_secret || 'default_refresh_secret';

    this.accessSignOptions = {
      expiresIn: jwtConstants.expires_in as jwt.SignOptions['expiresIn'],
    };

    this.refreshSignOptions = {
      expiresIn: jwtConstants.refresh_expires_in as jwt.SignOptions['expiresIn'],
    };
  }

  signTempAccessToken(
    payload: {
      id: number, is_2fa: boolean
    },
    expire
  ) {
    return jwt.sign({ user: payload }, this.accessSecret, expire);
  }

  signAccessToken(payload: UserPayload): string {
    return jwt.sign({ user: payload }, this.accessSecret, this.accessSignOptions);
  }

  signRefreshToken(payload: UserPayload): string {
    return jwt.sign({ user: payload }, this.refreshSecret, this.refreshSignOptions);
  }

  verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, this.accessSecret) as JwtPayload;
  }

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, this.refreshSecret) as JwtPayload;
  }

  decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }

  getExpiresIn() {
    return new Date(Date.now() + this.getExpiryInMilliseconds(this.accessSignOptions.expiresIn));
  }

  private getExpiryInMilliseconds(expiresIn: string | number): number {
    if (typeof expiresIn === 'number') {
      return expiresIn * 1000;
    }

    const regex = /^(\d+)([smhd])$/; // supports s, m, h, d
    const match = expiresIn.match(regex);

    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 0;
    }
  }
}