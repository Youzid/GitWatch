import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      throw new Error(`Failed to connect to Redis: ${err.message}`);
    });

    this.client.on('connect', () => {
      console.log('✓ Connected to Redis');
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.quit();
    }
  }

  getClient(): RedisClientType {
    return this.client;
  }

  async get(key: string): Promise<any> {
    const value = await this.client.get(key);
    // @ts-expect-error asd
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttl) {
      await this.client.setEx(key, Math.ceil(ttl / 1000), serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    return (await this.client.exists(key)) === 1;
  }

  async flush(): Promise<void> {
    await this.client.flushDb();
  }
}
