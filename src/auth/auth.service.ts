import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';

import { isPasswordValid } from '@/utils/auth-utils';
import { v4 as uuidv4 } from 'uuid';
import { UserRoles } from './user-roles.enum';
import { ApiFeedbackResponse, JWTPayloadType } from '@/types/utils.types';
import { PublicService } from '@/public/public.service';
import { StripeService } from '@/stripe/stripe.service';
import { AuthEmailsService } from '@/emails/auth-emails.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authEmailsService: AuthEmailsService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly publicService: PublicService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * Création d'un compte utilisateur
   * 1. Créer d'un compte 'User' permettant à l'utilisateur de se connecter
   * 2. TODO: Envoi d'un email de validation
   *
   * @param userData
   * @returns
   */
  async registerUserAccount({ userData }: { userData: RegisterUserDto }) {
    const { email, password } = userData;

    // * Vérification de l'existence d'un compte utilisateur avec l'email fourni
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // * Si un compte utilisateur existe déjà, on renvoie une erreur
    if (existingUser) {
      throw new BadRequestException('Ce compte existe déjà.');
    }

    // const {
    //   fullAddress,
    //   zipCode: customerZipCode,
    //   latitude,
    //   longitude,
    // } = await this.publicService.getFullAddress({ queryAddress: address });

    // let professionalCustomerData = {};
    // let fullBillingAddress: Awaited<
    //   ReturnType<PublicService['getFullAddress']>
    // > = null;

    // if (isProfessional) {
    //   const { billingAddress, siret, tvaNumber, companyName } =
    //     professionalData;

    //   fullBillingAddress = await this.publicService.getFullAddress({
    //     queryAddress: billingAddress,
    //   });

    //   professionalCustomerData = {
    //     billingAddress: fullBillingAddress.fullAddress.address,
    //     billingCity: fullBillingAddress.fullAddress.city,
    //     billingLine1: fullBillingAddress.fullAddress.name,
    //     billingZipCode: fullBillingAddress.fullAddress.postcode,
    //     billingLatitude: fullBillingAddress.latitude,
    //     billingLongitude: fullBillingAddress.longitude,

    //     siretNumber: siret,
    //     tvaNumber: tvaNumber,
    //     companyName: companyName,
    //   } as Pick<
    //     Customer,
    //     | 'billingAddress'
    //     | 'billingCity'
    //     | 'billingLine1'
    //     | 'billingZipCode'
    //     | 'tvaNumber'
    //     | 'siretNumber'
    //     | 'companyName'
    //     | 'billingLatitude'
    //     | 'billingLongitude'
    //   >;
    // }

    const createdToken = uuidv4();

    // * Création du compte utilisateur et du compte prestataire
    const user = await this.prisma.user.create({
      data: {
        email,

        role: UserRoles.USER,
        // resetpasswordToken: null,
        hasRequestedPasswordReset: false,
        hasConfirmedEmail: false,
        resetpasswordToken: createdToken,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        email: true,
      },
    });

    return await this.authenticateUser({
      role: UserRoles.USER,
      asUserId: null,
      userId: user.id,
    });
  }

  async getTokenValidity(token: string): ApiFeedbackResponse {
    if (!token) {
      return {
        message: 'Le code de sécurité a expiré.',
        error: true,
      };
    }

    try {
      // * Vérification de la validité du token
      await this.checkUserTokenValidity(token);
      // * Si le token est valide, on renvoie l'information à l'application (on autorise l'utilisateur à le valider)
      return {
        message: 'Le code de sécurité est valide.',
        error: false,
      };
    } catch (err) {
      const error = err as Error;
      return {
        message: error.message,
        error: true,
      };
    }
  }
  // ** Vérification de l'existence d'un token de validation de compte prestataire
  async checkUserTokenValidity(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetpasswordToken: token,
      },
      select: {
        id: true,
        role: true,
        hasConfirmedEmail: true,
      },
    });

    if (!user?.role) {
      throw new NotFoundException("Le compte n'existe pas.");
    }

    if (user.role === UserRoles.USER) {
      if (user.hasConfirmedEmail) {
        throw new BadRequestException(
          'Le compte prestataire a déjà été validé.',
        );
      }
    }

    return user;
  }
  // /**
  //  * Cette méthode permet de valider un compte utilisateur
  //  * On demande un mot de passe à l'utilisateur pour se connecter.
  //  * @param userData Contient le mot de passe et le token de validation du compte
  //  * @returns
  //  */
  // async validateUserAccount(userData: ValidateUserDto) {
  //   const { password, token } = userData;
  //   const userDetails = await this.checkUserTokenValidity(token);

  //   if (userDetails.role === UserRoles.PROVIDER) {
  //     // * Mise à jour de la progression de l'authentification du prestataire
  //     await this.prisma.providerAuthenticationProgress.update({
  //       where: {
  //         token: token,
  //       },
  //       data: {
  //         hasConfirmedEmail: true,
  //       },
  //       select: {
  //         provider: {
  //           select: {
  //             userId: true,
  //             user: {
  //               select: {
  //                 role: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   } else if (userDetails.role === UserRoles.CUSTOMER) {
  //     await this.prisma.customer.update({
  //       where: {
  //         token: token,
  //       },
  //       data: {
  //         user: {
  //           update: {
  //             lastLogin: new Date(),
  //           },
  //         },
  //         hasConfirmedEmail: true,
  //       },
  //     });
  //   }

  //   // * Mise à jour du mot de passe
  //   await this.userService.updateUserPassword(userDetails.id, password);
  //   // * Lorsque l'utilisateur prestataire valide son compte mail, nous le connectons pour qu'il puisse commencer à renseigner ses informations
  //   return await this.authenticateUser({
  //     userId: userDetails.id,
  //     role: userDetails.role,
  //     asUserId: null,
  //   });
  // }

  /**
   * Cette méthode permet d'authentifier un utilisateur, avec son email et son mot de passe
   * Elle renvoie un token d'authentification (JWT)
   * @param param
   * @returns
   */
  async logUser({
    loginData: { email, password, ipAddress, userAgent },
    onlyAllowCustomerAuth,
  }: {
    onlyAllowCustomerAuth: boolean;
    loginData: LoginDto;
  }) {
    // * Lors de la connexion, nous devons vérifier le rôle de l'utilisateur. Prestataire ou client

    const user = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
      select: {
        password: true,
        id: true,
        hasConfirmedEmail: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Le compte n'existe pas");
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'Vous devez définir un mot de passe avant de pouvoir vous connecter.',
      );
    }

    if (!user.hasConfirmedEmail) {
      throw new UnauthorizedException(
        'Vous devez valider votre adresse email avant de pouvoir vous connecter.',
      );
    }

    const isValid = await isPasswordValid(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException("Le mot de passe n'est pas valide");
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });
    // await Promise.allSettled([

    // await this.prisma.connectionHistory.create({
    //   data: {
    //     user: {
    //       connect: {
    //         id: user.id,
    //       },
    //     },
    //     ipAddress: ipAddress ?? null,
    //     userAgent: userAgent ?? null,
    //   },
    // }),
    // ]);

    return await this.authenticateUser({
      userId: user.id,
      role: user.role,
      asUserId: null,
    });
  }

  /**
   * Renvoie un JWT signé correspondant à l'identifiant de l'utilisateur
   * @param userId
   * @returns
   */
  async authenticateUser({ userId, asUserId, role }: JWTPayloadType) {
    return {
      token: this.jwtService.sign({ userId, asUserId, role }),
    };
  }

  // /**
  //  * * Cette méthode renvoie un mail à l'utilisateur avec un lien permettant de réinitialiser son mot de passe
  //  * * Si l'utilisateur a déjà effectué une demande, on n'autorise pas une nouvelle demande.
  //  *
  //  * @param userData
  //  * @returns
  //  */
  // async triggerResetPasswordRequest(userData: ResetUserPasswordRequestDto) {
  //   const { email } = userData;
  //   // * Vérification de l'existence d'un compte utilisateur avec l'email fourni
  //   const existingUser = await this.prisma.user.findUnique({
  //     where: {
  //       email: email.toLowerCase(),
  //     },
  //     select: {
  //       id: true,
  //       firstname: true,
  //       hasRequestedPasswordReset: true,
  //       resetpasswordToken: true,
  //     },
  //   });

  //   // * Si le compte utilisateur n'existe pas, on renvoie une erreur
  //   if (!existingUser) {
  //     throw new BadRequestException("Ce compte n'existe pas.");
  //   }

  //   const generatedToken = uuidv4();

  //   const hasRequestedPasswordReset = existingUser.hasRequestedPasswordReset;
  //   // * Si l'utilisateur a déjà fait une demande de réinitialisation de mot de passe, on n'autorise pas la demande.
  //   if (hasRequestedPasswordReset) {
  //     throw new BadRequestException(
  //       'Une demande de réinitialisation a déjà été faite pour ce compte. Veuillez contacter le support pour débloquer votre compte.',
  //     );
  //   }

  //   const updatedUser = await this.prisma.user.update({
  //     where: {
  //       id: existingUser.id,
  //     },
  //     data: {
  //       hasRequestedPasswordReset: true,
  //       resetpasswordToken: generatedToken,
  //     },
  //     select: {
  //       firstname: true,
  //       resetpasswordToken: true,
  //     },
  //   });

  //   await this.authEmailsService.sendPasswordResetRequestEmail({
  //     recipient: email,
  //     token: updatedUser.resetpasswordToken,
  //     name: updatedUser.firstname,
  //     userId: existingUser.id,
  //   });
  //   return {
  //     message:
  //       'Un code de réinitialisation de mot de passe vous a été envoyé. Veuillez consulter vos emails pour vous connecter.',
  //     error: false,
  //   };
  // }

  // /**
  //  * Cette méthode renvoie un mail à l'utilisateur avec un lien permettant de réinitialiser son mot de passe
  //  *
  //  * @param userData
  //  * @returns
  //  */
  // async resetUserPassword(userData: ResetUserPasswordDto) {
  //   const { password, passwordConfirmation, resetPasswordToken } = userData;

  //   if (password !== passwordConfirmation) {
  //     throw new BadRequestException(
  //       'Les mots de passe ne correspondent pas. Veuillez réessayer.',
  //     );
  //   }
  //   // * Vérification de l'existence d'un compte utilisateur avec l'email fourni
  //   const { existingUser } =
  //     await this.userService.findUserByResetPasswordToken(resetPasswordToken);

  //   await this.userService.resetUserPassword(existingUser.id, password);

  //   return {
  //     message: 'Votre mot de passe a bien été modifié.',
  //     error: false,
  //   };
  // }

  // /**
  //  * Cette méthode permet de changer le mot de passe d'un compte utilisateur.
  //  * Il doit fournir son ancien mot de passe.
  //  *
  //  * @param passwordData
  //  * @returns
  //  */
  // async editUserPassword({
  //   userId,
  //   passwordData,
  // }: {
  //   userId: string;
  //   passwordData: EditUserPasswordDto;
  // }) {
  //   // * Vérification de l'existence d'un compte utilisateur avec l'email fourni
  //   const existingUser = await this.prisma.user.findUniqueOrThrow({
  //     where: {
  //       id: userId,
  //     },
  //     select: {
  //       id: true,
  //       password: true,
  //     },
  //   });

  //   const { password, passwordConfirmation, oldPassword } = passwordData;

  //   if (password !== passwordConfirmation) {
  //     throw new BadRequestException(
  //       'Les mots de passe ne correspondent pas. Veuillez réessayer.',
  //     );
  //   }

  //   const isValid = await isPasswordValid(oldPassword, existingUser.password);

  //   if (!isValid) {
  //     throw new UnauthorizedException("L'ancien mot de passe n'est pas valide");
  //   }

  //   await this.userService.resetUserPassword(existingUser.id, password);

  //   return {
  //     message: 'Votre mot de passe a bien été modifié.',
  //     error: false,
  //   };
  // }

  // /**
  //  * Cette méthode détermine si le token de réinitialisation de mot de passe est valide
  //  *
  //  * @param userData
  //  * @returns
  //  */
  // async getPasswordResetTokenValidity(token: string) {
  //   try {
  //     await this.userService.findUserByResetPasswordToken(token);

  //     return {
  //       message: 'Le code de réinitialisation est valide.',
  //       error: false,
  //     };
  //   } catch (error) {
  //     // * Si l'utilisateur n'a pas effectué de demande de réinitialisation de mot de passe, on n'autorise pas la demande.

  //     return {
  //       message: error.message,
  //       error: true,
  //     };
  //   }
  // }

  // // * Authentification d'un administrateur, qui peut se connecter en tant que prestataire.
  // async getAuthenticatedAdmin({
  //   adminUserId,
  // }: {
  //   adminUserId: string;
  //   userId?: string;
  // }): Promise<{ adminUserId: string; asUserId: string | null }> {
  //   const adminUser = await this.prisma.user.findUniqueOrThrow({
  //     where: {
  //       id: adminUserId,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   });

  //   if (!Boolean(adminUserId)) {
  //     return { adminUserId: adminUser.id, asUserId: null };
  //   }
  // }
}
