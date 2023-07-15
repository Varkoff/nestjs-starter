import { Controller, Get, Param, Query } from '@nestjs/common';

import { PublicService } from './public.service';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  // @Get('/get-addresses')
  // async getFrenchAddressesByQuery(
  //   @Query() { search, type }: GetAddressesParamsDto,
  // ) {
  //   return await this.publicService.getFrenchAddresses({ search, type });
  // }

  // @Get('/get-addresses-by-lat-lng')
  // async getFrenchAddressesByLatLng(
  //   @Query() { latitude, longitude }: GetAddressesByLatLngParamsDto,
  // ) {
  //   return await this.publicService.getFrenchAddressByLatLng({
  //     latitude,
  //     longitude,
  //   });
  // }
}
