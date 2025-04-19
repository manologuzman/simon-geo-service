import {
  IsNotEmpty,
  IsString,
  IsObject,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber() lat: number;
  @IsNumber() lng: number;
}

export class LocationDto {
  @IsString() @IsNotEmpty() deviceId: string;
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  origin: CoordinatesDto;
  @IsObject()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  destination: CoordinatesDto;
}
