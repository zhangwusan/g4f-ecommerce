import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { JwtService } from "../services/jwt.service";
import { TokenBlacklistService } from "../services";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private readonly _jwt_service: JwtService,
    private readonly _token_blacklist: TokenBlacklistService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Check if token is blacklisted
      const is_blacklisted = await this._token_blacklist.is_blacklisted(token);
      if (is_blacklisted) {
        return res.status(401).json({ message: 'Token is blacklisted' });
      }

      const decoded = this._jwt_service.verifyAccessToken(token);
      req['user'] = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}