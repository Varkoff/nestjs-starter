import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { generateHashedPassword } from '@/utils/auth-utils';
import { UserRoles } from '@/auth/user-roles.enum';
import { RequestWithUser } from '@/types/utils.types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserById(id: User['id']) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    });

    if (!existingUser) {
      throw new BadRequestException("Ce compte n'existe pas.");
    }
    return existingUser;
  }

  async findUserByEmail(email: User['email']) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    });

    // if (!existingUser) {
    //   throw new BadRequestException("Ce compte n'existe pas.");
    // }
    return existingUser;
  }

  async findUserByResetPasswordToken(token: string) {
    const existingUser = await this.prisma.user.findFirstOrThrow({
      where: {
        resetpasswordToken: token,
      },
      select: {
        id: true,
        role: true,

        hasRequestedPasswordReset: true,
      },
    });

    if (!existingUser) {
      throw new BadRequestException(
        "Le code de réinitialisation est invalide (le compte n'a pas été trouvé).",
      );
    }
    if (existingUser?.hasRequestedPasswordReset === false) {
      throw new BadRequestException(
        "Aucune demande de réinitialisation de mot de passe n'a été faite. Veuillez contacter le support pour débloquer votre compte.",
      );
    }

    return { existingUser };
  }

  async updateUserPassword(userId: User['id'], password: string) {
    const existingUser = await this.findUserById(userId);
    const hashedPassword = await generateHashedPassword(password);
    return await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async resetUserPassword(userId: User['id'], password: string) {
    const existingUser = await this.findUserById(userId);
    const hashedPassword = await generateHashedPassword(password);
    // * L'utilisateur venant d'effectuer une demande de réinitialisation de mot de passe, nous pouvons mettre à jour le statut de la demande à false.
    return await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hashedPassword,
        hasRequestedPasswordReset: false,
      },
    });
  }
  // async getUserAdminById(id: User['id']) {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: id,
  //     },
  //     select: {
  //       id: true,
  //       email: true,
  //       firstname: true,
  //       lastname: true,
  //       role: true,
  //     },
  //   });

  //   if (user.role !== UserRoles.ADMINISTRATOR) {
  //     throw new UnauthorizedException(
  //       "Vous n'avez pas les droits pour accéder à cette ressource.",
  //     );
  //   }
  //   return user;
  // }

  async getAuthenticatedUser({
    userId,
    req,
  }: {
    userId: string;
    req: RequestWithUser;
  }) {
    if (!userId) {
      throw new UnauthorizedException("L'utilisateur n'est pas connecté.");
    }
    const userInfo = await this.findUserById(userId);
    const isAdmin = req.user.role === UserRoles.ADMINISTRATOR;
    return {
      ...userInfo,
      authOptions: {
        isAdmin: isAdmin,
        asUserId: req.user.asUserId,
        userId: req.user.userId,
      },
    };
  }
}
