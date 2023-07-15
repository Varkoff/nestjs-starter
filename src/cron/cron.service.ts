import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_WEEKDAY)
  async doStuff() {
    console.log('Running cron job every weekday');
  }
}
