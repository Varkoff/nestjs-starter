import { MailerService } from '@/emails/mailer.service';
import { PrismaService } from '@/prisma.service';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';

@Module({
  controllers: [CronController],
  providers: [PrismaService, MailerService, UserService],
})
export class CronModule {}
