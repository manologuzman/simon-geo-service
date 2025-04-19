import { Controller, Post, Body } from '@nestjs/common';
import { GeoService } from './geo.service';
import { LocationDto } from './location.dto';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Post()
  async handleGPSData(@Body() dto: LocationDto) {
    return await this.geoService.processLocation(dto);
  }
}
