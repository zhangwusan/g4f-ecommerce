import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis, { RedisOptions } from 'ioredis';
import { redisConstants } from "../constants/redis.constants";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    onModuleInit() {
        this.client = new Redis({
            host: redisConstants.host,
            port: redisConstants.port as RedisOptions['port'],
        })
    }

    getClient(): Redis {
        return this.client;
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}