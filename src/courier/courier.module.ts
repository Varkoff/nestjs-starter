import { Module } from '@nestjs/common';
import { CourierService } from '@/courier/courier.service';
import { PrismaService } from '@/prisma.service';

@Module({
  controllers: [],
  providers: [CourierService, PrismaService],
})
export class CourierModule {}
