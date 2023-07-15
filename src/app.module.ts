import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    // ScheduleModule.forRoot(),
    // CronModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    // PublicModule,
    // AwsS3Module,
    // CourierModule,
    // SocketModule,
  ],
  controllers: [],
  providers: [RolesGuard, AppGateway],
})
export class AppModule {}
