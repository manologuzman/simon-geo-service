import { Injectable } from '@nestjs/common';
import { LocationDto } from './location.dto';
import { RedisService } from 'src/redis/redis.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class GeoService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  async processLocation(dto: LocationDto) {
    const key = `geo:${dto.deviceId}`;
    const exists = (await this.redisService.getClient().get(key)) as
      | string
      | null;

    if (exists) return { status: 'duplicate', message: 'Data already exists' };

    const timestamp = new Date().toISOString();
    const payload = {
      deviceId: dto.deviceId,
      lat: dto.origin.lat,
      lng: dto.origin.lng,
      timestamp,
    };

    await this.redisService
      .getClient()
      .set(key, JSON.stringify(payload), 'EX', 300);

    return { status: 'success', data: payload };
  }
}
