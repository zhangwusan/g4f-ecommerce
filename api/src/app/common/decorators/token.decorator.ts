import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export const Tokens = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPair => {
    const request = ctx.switchToHttp().getRequest();

    const access_token = request.headers['authorization']?.replace('Bearer ', '').trim();
    const refresh_token = request.headers['x-refresh-token']?.replace('Refresh ', '').trim();

    if (!access_token || !refresh_token) {
      throw new BadRequestException('Access token and refresh token are required in headers.');
    }

    return {
      access_token,
      refresh_token,
    };
  },
);