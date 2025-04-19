import {
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @IsNumber() lat: number;
  @IsNumber() lng: number;
}

export class LocationDto {
  @ApiProperty({ example: 'JJW-322' })
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty({ example: { lat: 4.123, lng: -74.123 } })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  origin: CoordinatesDto;

  @ApiProperty({ example: { lat: 4.567, lng: -74.567 } })
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  destination: CoordinatesDto;
}
