import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GeoService } from './geo/geo.service';
import { GeoController } from './geo/geo.controller';
import { RoutingServiceClient } from './common/http/routing.service';

@Module({
  imports: [
    RedisModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [GeoController],
  providers: [GeoService, RoutingServiceClient],
  exports: [RoutingServiceClient],
})
export class AppModule {}
