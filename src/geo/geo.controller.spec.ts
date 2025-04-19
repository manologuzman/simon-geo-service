import { Test, TestingModule } from '@nestjs/testing';
import { GeoController } from './geo.controller';
import { RedisService } from '../redis/redis.service';
import { HttpService } from '@nestjs/axios';

describe('GeoController', () => {
  let controller: GeoController;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeoController],
      providers: [
        {
          provide: RedisService,
          useValue: { getClient: () => ({ get: jest.fn(), set: jest.fn() }) },
        },
        {
          provide: HttpService,
          useValue: { axiosRef: { post: jest.fn() } },
        },
      ],
    }).compile();

    controller = module.get<GeoController>(GeoController);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
