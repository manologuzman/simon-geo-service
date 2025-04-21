import { Test, TestingModule } from '@nestjs/testing';
import { GeoController } from './geo.controller';
import { GeoService } from './geo.service';
import { RedisService } from '../redis/redis.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RoutingServiceClient } from '../common/http/routing.service';

describe('GeoController', () => {
  let controller: GeoController;

  const mockRedisService = {
    getClient: () => ({ get: jest.fn(), set: jest.fn() }),
  };
  const mockHttpService = { axiosRef: { post: jest.fn() } };
  const mockConfigService = { get: jest.fn().mockReturnValue('300') };
  const mockRoutingClient = { calculateRoute: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [GeoController],
      providers: [
        GeoService,
        { provide: RedisService, useValue: mockRedisService },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RoutingServiceClient, useValue: mockRoutingClient },
      ],
    }).compile();

    controller = module.get<GeoController>(GeoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
