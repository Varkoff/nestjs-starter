import { RequestWithUser } from '@/types/utils.types';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRoles } from './user-roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // * On récupère le rôle requis pour accéder à la route.
    const requiredRole = this.reflector.getAllAndOverride<UserRoles>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si aucun role n'a été défini, la route est n'est pas gardée.
    if (!requiredRole) {
      return true;
    }

    // Récupération du payload du token JWT depuis la jwt-strategy (méthode validate)
    const request = context.switchToHttp().getRequest();

    const { user } = request as RequestWithUser;
    const isConnectingAs = Boolean(user.asUserId);

    // Un administrateur peut se connecter en tant qu'un autre utilisateur.
    if (user.role === UserRoles.ADMINISTRATOR && isConnectingAs) {
      return true;
    }

    // Si l'utilisateur n'est pas administrateur et qu'il a le rôle spécifié, il est utilisé.
    return requiredRole === user.role;
  }
}
