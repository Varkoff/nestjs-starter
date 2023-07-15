import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { FastifyMultipartOptions, fastifyMultipart } from '@fastify/multipart';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      rawBody: true,
    },
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: [
      'http://localhost:*',
      'https://goodcollect.co',
      'https://fba9652401e95cae.goodcollect.co',
      // Stripe Webhook Ips
      'https://3.18.12.63',
      'https://3.130.192.231',
      'https://13.235.14.237',
      'https://13.235.122.149',
      'https://18.211.135.69',
      'https://35.154.171.200',
      'https://52.15.183.38',
      'https://54.88.130.119',
      'https://54.88.130.237',
      'https://54.187.174.169',
      'https://54.187.205.235',
      'https://54.187.216.72',
    ],

    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Accept',
      'Content-Type',
      'Authorization',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
  });

  const multipartOptions: FastifyMultipartOptions = {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
    addToBody: true,
  };
  app.register(fastifyMultipart, multipartOptions);

  // Added WS code
  const server = app.getHttpServer();
  const io = new socketio.Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  app.useWebSocketAdapter(new IoAdapter(io));

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
