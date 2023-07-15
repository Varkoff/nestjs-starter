import { RequestWithUser } from '@/types/utils.types';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

import { JwtAuthGuard } from './jwt-auth.guard';
import { getUserIdFromRequest } from '@/utils/auth-utils';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // * Permet d'identifier l'utilisateur et préserve sa session
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAuthUser(@Request() req: RequestWithUser) {
    // * req.user contient { userId : string}
    // * Cette route est appelée pour valider la session de l'utilisateur
    const userId = getUserIdFromRequest({
      requestWithUser: req,
      connectAsUser: true,
    });

    return await this.userService.getAuthenticatedUser({ userId, req });
  }

  /**
   * * Route permettant de créer un compte client
   * @param userData
   * @returns
   */
  @Post('/register')
  async registerUser(@Body() userData: RegisterUserDto) {
    // * Renvoie un token JWT en cas de connexion réussie
    return await this.authService.registerUserAccount({ userData });
  }

  // /**
  //  * Route permettant de changer le mot de passe du compte utilisateur.
  //  * Il doit être connecté et fournir son ancien mot de passe.
  //  * @param userData
  //  * @returns
  //  */
  // @UseGuards(JwtAuthGuard)
  // @Post('/edit-user-password')
  // async editUserPassword(
  //   @Request() req: RequestWithUser,
  //   @Body() passwordData: EditUserPasswordDto,
  // ): ApiFeedbackResponse {
  //   const userId = getUserIdFromRequest({
  //     requestWithUser: req,
  //     connectAsUser: true,
  //   });
  //   // * Envoie un lien de réinitialisation d'email d'un compte utilisateur
  //   // * pour qu'il puisse réinitialiser son mot de passe.
  //   return await this.authService.editUserPassword({ userId, passwordData });
  // }

  // /**
  //  * * Route permettant de faire une demande de réinitialisation de mot de passe.
  //  * @param userData
  //  * @returns
  //  */
  // @Post('/trigger-reset-password-request')
  // async triggerResetProviderPasswordRequest(
  //   @Body() userData: ResetUserPasswordRequestDto,
  // ) {
  //   // * Envoie un lien de réinitialisation d'email d'un compte utilisateur
  //   // * pour qu'il puisse réinitialiser son mot de passe.
  //   return await this.authService.triggerResetPasswordRequest(userData);
  // }

  // /**
  //  * * Route permettant de réinitialiser le mot de passe.
  //  * @param userData
  //  * @returns
  //  */
  // @Post('/reset-user-password')
  // async resetUserPassword(@Body() userData: ResetUserPasswordDto) {
  //   // * Envoie un lien de réinitialisation d'email d'un compte utilisateur
  //   // * pour qu'il puisse réinitialiser son mot de passe.
  //   return await this.authService.resetUserPassword(userData);
  // }

  // /**
  //  * Vérifie la validité d'un token de validation d'email
  //  */
  // @Get('/check-token-validity')
  // async checkEmailTokenValidity(@Query('token') token: string) {
  //   return await this.authService.getTokenValidity(token);
  // }

  // /**
  //  * Vérifie la validité d'un token d'une demande de réinitialisation de mot de passe
  //  */
  // @Get('/check-password-reset-token-validity')
  // async checkPasswordResetTokenValidity(@Query('token') token: string) {
  //   return await this.authService.getPasswordResetTokenValidity(token);
  // }

  // /**
  //  * Route permettant de valider l'email d'un compte prestataire
  //  * @param userData
  //  * @returns
  //  */
  // @Post('/validate-user')
  // async validateUserRegistration(@Body() userData: ValidateUserDto) {
  //   // * Authentifie le compte et renvoie un token JWT
  //   return await this.authService.validateUserAccount(userData);
  // }

  /**
   * Route permettant d'authentifier un utilisateur
   * @param loginData
   * @returns
   */
  @Post('/login')
  async login(
    @Body() loginData: LoginDto,
    @Query('customer') customerAuth: string,
  ) {
    // If customerAuth is set to 1, we only allow customers authentication.
    // This is a signin method right after customer checkout.
    const onlyAllowCustomerAuth = customerAuth === '1';
    // * Renvoie un token JWT en cas de connexion réussie
    return await this.authService.logUser({ loginData, onlyAllowCustomerAuth });
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role(UserRoles.ADMINISTRATOR)
  // @Post('/connect-as-user/:userId')
  // async connectAsProvider(
  //   @Request() req: RequestWithUser,
  //   @Param('userId') userId: string,
  // ) {
  //   const adminUserId = req.user.userId;

  //   const [, token] = await Promise.all([
  //     await this.userService.getUserAdminById(adminUserId),
  //     await this.authService.authenticateUser({
  //       userId: adminUserId,
  //       asUserId: userId,
  //       role: UserRoles.ADMINISTRATOR,
  //     }),
  //   ]);

  //   return token;
  // }

  // // * Permet d'identifier l'utilisateur et préserve sa session
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role(UserRoles.ADMINISTRATOR)
  // @Get('admin')
  // async getAuthAdmin(@Request() req: RequestWithUser) {
  //   // * req.user contient { userId : string}
  //   // * Cette route est appelée pour valider la session de l'utilisateur
  //   const userId = getUserIdFromRequest({
  //     requestWithUser: req,
  //     connectAsUser: false,
  //   });

  //   return await this.authService.authenticateUser({
  //     userId,
  //     asUserId: null,
  //     role: UserRoles.ADMINISTRATOR,
  //   });
  // }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role(UserRoles.PROVIDER_MANAGER)
  // @Post('/manage-as-provider/:userId')
  // async manageAsProvider(
  //   @Request() req: RequestWithUser,
  //   @Param('userId') userId: string,
  // ) {
  //   const managerUserId = req.user.userId;

  //   const user = await this.userService.getProviderManagerByUserId(
  //     managerUserId,
  //   );
  //   const token = await this.authService.authenticateUser({
  //     userId: managerUserId,
  //     asUserId: userId,
  //     role: user.role,
  //   });

  //   return token;
  // }

  // // * Le manager de prestataire se reconnecte après avoir fait ses modifications en tant que prestataire
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Role(UserRoles.PROVIDER_MANAGER)
  // @Get('provider-manager')
  // async getAuthProviderManager(@Request() req: RequestWithUser) {
  //   // * req.user contient { userId : string}
  //   // * Cette route est appelée pour valider la session de l'utilisateur
  //   const userId = getUserIdFromRequest({
  //     requestWithUser: req,
  //     connectAsUser: false,
  //   });

  //   return await this.authService.authenticateUser({
  //     userId,
  //     asUserId: null,
  //     role: req.user.role,
  //   });
  // }
}
