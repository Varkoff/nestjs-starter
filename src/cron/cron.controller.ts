import { Controller, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/jwt-auth.guard';

import { RolesGuard } from '@/auth/roles.guard';
import { Role } from '@/auth/roles.decorator';
import { UserRoles } from '@/auth/user-roles.enum';
import { CronService } from './cron.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Role(UserRoles.ADMINISTRATOR)
@Controller('tasks')
export class CronController {
  constructor(private readonly cronService: CronService) {}
}
