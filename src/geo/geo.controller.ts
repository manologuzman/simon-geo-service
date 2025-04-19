import { Controller, Post, Body } from '@nestjs/common';
import { GeoService } from './geo.service';
import { LocationDto } from './location.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar geolocatión GPS' })
  @ApiResponse({
    status: 201,
    description: 'Datos GPS registrados correctamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async handleGPSData(@Body() dto: LocationDto) {
    return await this.geoService.processGps(dto);
  }
}
