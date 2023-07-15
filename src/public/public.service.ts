import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { z } from 'zod';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
const propertySchema = z.object({
  label: z.string(),
  context: z.string(),
  id: z.string(),
  postcode: z.string(),
  name: z.string(),
  city: z.string(),
});
const addressSchema = z.array(
  z.object({
    properties: propertySchema,
    geometry: z.object({
      coordinates: z.array(z.number()),
    }),
  }),
);

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getFrenchAddresses({ search, type }: { search: string; type: string }) {
    if (search.length < 3) return [];

    if (type !== '' && type !== 'housenumber') {
      throw new Error('Invalid type');
    }
    const searchParam = new URLSearchParams();
    searchParam.append('q', search);
    searchParam.append('type', type);
    searchParam.append('autocomplete', '1');
    searchParam.append('limit', '10');

    const response = (await firstValueFrom(
      this.httpService.get(
        `https://api-adresse.data.gouv.fr/search/?${searchParam.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control':
              'max-age=300, s-maxage=60, stale-while-revalidate=604800',
          },
        },
      ),
    )) as { data: any };

    const result = addressSchema.safeParse(response.data.features);

    if (!result.success) {
      return [];
    }

    if (result.data.length === 0) return [];

    const addresses = result.data.map((a) => {
      return {
        address: a.properties.label,
        context: a.properties.context,
        id: a.properties.id,
        latitude: a.geometry.coordinates[1],
        longitude: a.geometry.coordinates[0],
        postcode: a.properties.postcode,
        name: a.properties.name,
        city: a.properties.city,
      };
    });

    return addresses;
  }

  async getFullAddress({ queryAddress }: { queryAddress: string }) {
    if (!Boolean(queryAddress)) {
      throw new Error(`L'adresse est vide !`);
    }
    // Getting first element from the array
    const [fullAddress] = await this.getFrenchAddresses({
      search: queryAddress,
      type: 'housenumber',
    });

    if (!fullAddress) {
      throw new Error(`Nous n'avons pas retrouvé l'adresse : ${queryAddress}`);
    }

    const address = fullAddress.address;
    const zipCode = fullAddress.postcode;

    return {
      zipCode,
      address,
      fullAddress,
      latitude: fullAddress.latitude,
      longitude: fullAddress.longitude,
    };
  }

  async getFrenchAddressByLatLng({
    latitude,
    longitude,
  }: {
    latitude: string;
    longitude: string;
  }) {
    const searchParam = new URLSearchParams();
    searchParam.append('lat', latitude);
    searchParam.append('lon', longitude);

    const response = (await firstValueFrom(
      this.httpService.get(
        `https://api-adresse.data.gouv.fr/reverse/?${searchParam.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control':
              'max-age=300, s-maxage=60, stale-while-revalidate=604800',
          },
        },
      ),
    )) as { data: any };

    const result = addressSchema.safeParse(response.data.features);

    if (!result.success) {
      throw new Error('Did not find any address');
    }

    const addresses = result.data.map((a) => {
      return {
        address: a.properties.label,
        context: a.properties.context,
        id: a.properties.id,
        latitude: a.geometry.coordinates[1],
        longitude: a.geometry.coordinates[0],
        postcode: a.properties.postcode,
        name: a.properties.name,
        city: a.properties.city,
      };
    });

    return addresses;
  }
}
