import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoutingServiceClient {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('ROUTING_SERVICE_URL') ?? '';
  }

  async calculateRoute(payload: {
    deviceId: string;
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
  }) {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.baseUrl}/routing`,
        payload,
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Routing service error: ${err.message}`);
    }
  }
}
