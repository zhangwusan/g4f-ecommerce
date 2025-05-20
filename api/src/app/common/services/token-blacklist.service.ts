import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class TokenBlacklistService {
  constructor(private readonly redis_service: RedisService) {}

  async blacklist(token: string, ttl_seconds: number) {
    const client = this.redis_service.getClient();
    await client.set(`blacklist:${token}`, '1', 'EX', ttl_seconds); // expire after token TTL
  }

  async is_blacklisted(token: string): Promise<boolean> {
    const client = this.redis_service.getClient();
    const result = await client.get(`blacklist:${token}`);
    console.log(result);
    return !!result;
  }
}