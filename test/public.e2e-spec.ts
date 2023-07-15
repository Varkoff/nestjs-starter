import { PublicService } from '../src/public/public.service';
import { Test } from '@nestjs/testing';
import { PublicModule } from '../src/public/public.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('PublicController (e2e)', () => {
  let app: NestFastifyApplication;
  const publicService = {
    getLandfields: async () => [{ id: 1, latitude: 40, longitude: 40 }],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PublicModule,
        HttpModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            timeout: configService.get('HTTP_TIMEOUT'),
            maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
          }),
          inject: [ConfigService],
        }),
      ],
    })
      .overrideProvider(PublicService)
      .useValue(publicService)
      .compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });
});
