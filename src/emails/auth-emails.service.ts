import { CourierService } from '@/courier/courier.service';
import { Injectable } from '@nestjs/common';

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not defined');
}
@Injectable()
export class AuthEmailsService {
  constructor(private courierService: CourierService) {}
  // /**
  //  * * Envoi d'un email de confirmation de création de compte
  //  * @param recipient
  //  */
  // async sendCreatedAccountEmailConfirmation({
  //   name,
  //   recipient,
  //   token,
  //   userId,
  // }: {
  //   recipient: string;
  //   token: string;
  //   name: string;
  //   userId: string;
  // }) {
  //   const link = `${FRONTEND_URL}/auth/confirm?token=${token}`;
  //   const notificationId = '2SGJKXMN91M3RXHDXJXKVNAVTEB6';
  //   await this.courierService.saveUserEmailHistory({
  //     notificationId,
  //     recipient,
  //     userId,
  //   });
  //   await this.courierService.getCourierClient().send({
  //     message: {
  //       template: notificationId,
  //       data: {
  //         link,
  //         name,
  //       },
  //       to: {
  //         email: recipient,
  //       },
  //       routing: {
  //         method: 'single',
  //         channels: ['email'],
  //       },
  //     },
  //   });
  // }

  // //* Cet email est envoyé à l'utilisateur lorsqu'il a oublié son mot de passe et souhaite le réinitialiser.
  // async sendPasswordResetRequestEmail({
  //   recipient,
  //   token,
  //   name,
  //   userId,
  // }: {
  //   recipient: string;
  //   token: string;
  //   name: string;
  //   userId: string;
  // }) {
  //   const passwordResetLink = `${FRONTEND_URL}/password-reset?token=${token}`;
  //   const notificationId = 'KK1HMN6JBRMTZ7KQA4VNPGS502A8';
  //   await this.courierService.saveUserEmailHistory({
  //     notificationId,
  //     recipient,
  //     userId,
  //   });

  //   await this.courierService.getCourierClient().send({
  //     message: {
  //       template: notificationId,
  //       data: {
  //         link: passwordResetLink,
  //         name,
  //       },
  //       to: {
  //         email: recipient,
  //       },
  //       routing: {
  //         method: 'single',
  //         channels: ['email'],
  //       },
  //     },
  //   });
  // }

  // //* Cet email est envoyé une fois le mot de passe modifié, pour prévenir l'utilisateur du changement effectué.
  // async sendPasswordChangeConfirmation({
  //   recipient,
  //   name,
  //   userId,
  // }: {
  //   recipient: string;
  //   name: string;
  //   userId: string;
  // }) {
  //   const notificationId = 'M2H6F8VTF7MV9QKGQ8MBX3NRF362';
  //   await this.courierService.saveUserEmailHistory({
  //     notificationId,
  //     recipient,
  //     userId,
  //   });

  //   await this.courierService.getCourierClient().send({
  //     message: {
  //       template: notificationId,
  //       data: {
  //         name,
  //         date: new Date().toLocaleDateString('fr-FR'),
  //       },
  //       to: {
  //         email: recipient,
  //       },
  //       routing: {
  //         method: 'single',
  //         channels: ['email'],
  //       },
  //     },
  //   });
  // }
}
