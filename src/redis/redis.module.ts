import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
    imports: [],
    providers: [{
        provide: 'REDIS_CLIENT',
        useFactory: async (configSerive: ConfigService) => {
            const client = createClient({
                url: configSerive.getOrThrow<string>('REDIS_URI'),
            });
            await client.connect();
            return client;
        },
        inject: [ConfigService],
    }],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
