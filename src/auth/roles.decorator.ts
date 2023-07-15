import { SetMetadata } from '@nestjs/common';
import { UserRoles } from './user-roles.enum';

export const ROLES_KEY = 'role';
export const Role = (role: UserRoles) => SetMetadata(ROLES_KEY, role);
