import { Controller, Post, Body } from '@nestjs/common';
import { GeoService } from './geo.service';
import { LocationDto } from './location.dto';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Post()
  async handleGPSData(@Body() dto: LocationDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.geoService.processGps(dto);
  }
}
