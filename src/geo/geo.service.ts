import { Injectable } from '@nestjs/common';
import { LocationDto } from './location.dto';
import { RedisService } from 'src/redis/redis.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RoutingServiceClient } from 'src/common/http/routing.service';

@Injectable()
export class GeoService {
  private ttl: number;
  private auditUrl: string;

  constructor(
    private readonly redisService: RedisService,
    private readonly routingClient: RoutingServiceClient,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.ttl = this.configService.get<number>('REDIS_TTL') ?? 300;
    this.auditUrl = this.configService.get<string>('AUDIT_SERVICE_URL') ?? '';
  }

  async processGps(dto: LocationDto): Promise<any> {
    const key = `gps:${dto.deviceId}`;
    const exists = await this.redisService.getClient().get(key);

    if (exists) {
      await this.registerAlert(
        'geo-duplicate-detected',
        `Duplicado detectado para ${dto.deviceId}`,
        'geo-service',
        dto.deviceId,
      );
      return { status: 'duplicate', message: 'Ya existe ubicación reciente' };
    }

    const payload = {
      deviceId: dto.deviceId,
      lat: dto.origin.lat,
      lng: dto.origin.lng,
      destination: dto.destination,
    };

    await this.redisService
      .getClient()
      .set(key, JSON.stringify(payload), 'EX', this.ttl);

    let routeResult;
    try {
      routeResult = await this.routingClient.calculateRoute(dto);
    } catch (err) {
      await this.registerAlert(
        'routing-error',
        `Error al calcular ruta: ${err.message}`,
        'geo-service',
        dto.deviceId,
      );
      return { status: 'error', message: 'Error al calcular ruta' };
    }

    return {
      status: 'success',
      data: {
        saved: true,
        route: routeResult,
      },
    };
  }

  private async registerAlert(
    type: string,
    message: string,
    source: string,
    deviceId: string,
  ) {
    try {
      await this.httpService.axiosRef.post(`${this.auditUrl}/alert`, {
        type,
        message,
        source,
        deviceId,
      });
    } catch (err) {
      console.error('Error al registrar alerta:', err.message);
    }
  }
}
