import { Injectable } from '@nestjs/common';
import { LocationDto } from './location.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { RoutingServiceClient } from '../common/http/routing.service';

export interface RoutingResonceZ {
  deviceId: string;
  origin: Origin;
  destination: Destination;
  route: Route[];
  status: string;
  cacheTTL: number;
}

interface Origin {
  lat: number;
  lng: number;
}

interface Destination {
  lat: number;
  lng: number;
}

interface Route {
  lat: number;
  lng: number;
}

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
    const key = `gps:${dto.deviceId}-${dto.origin.lat}-${dto.origin.lng}`;
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
      routeResult = (await this.routingClient.calculateRoute(
        dto,
      )) as unknown as RoutingResonceZ;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      await this.registerAlert(
        'routing-error',
        `Error al calcular ruta: ${errorMessage}`,
        'geo-service',
        dto.deviceId,
      );
      return { status: 'error', message: 'Error al calcular ruta' };
    }

    return {
      status: 'success',
      data: {
        saved: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Error desconocido';
      console.error('Error al registrar alerta:', errorMessage);
    }
  }
}
