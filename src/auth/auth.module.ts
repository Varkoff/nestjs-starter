import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PublicService } from '@/public/public.service';
import { StripeService } from '@/stripe/stripe.service';
import { MailerService } from '@/emails/mailer.service';
import { AuthEmailsService } from '@/emails/auth-emails.service';
import { CourierService } from '@/courier/courier.service';

@Module({
  imports: [
    UserModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    MailerService,
    JwtStrategy,
    PublicService,
    StripeService,
    AuthEmailsService,
    CourierService,
  ],
})
export class AuthModule {}
