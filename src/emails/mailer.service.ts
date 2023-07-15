import { CourierService } from '@/courier/courier.service';
import { Injectable } from '@nestjs/common';

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not defined');
}
const environnement = process.env.GOODCOLLECT_ENV;
@Injectable()
export class MailerService {
  constructor(private courierService: CourierService) {}
  private contactEmail = 'contact@goodcollect.co';

  /**
   * Envoi d'un mail via le formulaire de contact du site vitrine.
   */

  // async sendContactEmail({
  //   company,
  //   description,
  //   email,
  //   firstname,
  //   lastname,
  //   phone,
  // }: ContactFormDto) {
  //   // * Send Contact Form to GoodCollect
  //   await Promise.all([
  //     await this.courierService.getCourierClient().send({
  //       message: {
  //         data: {
  //           email,
  //           firstname,
  //           lastname,
  //           company,
  //           description,
  //           phone,
  //           environnement,
  //         },
  //         to: {
  //           email: this.contactEmail,
  //         },
  //         template: 'CS66XADNRH4GJZMFZVM3K7X63WA0',
  //         routing: {
  //           method: 'single',
  //           channels: ['email'],
  //         },
  //       },
  //     }),

  //     await this.courierService.getCourierClient().send({
  //       message: {
  //         to: {
  //           email,
  //         },
  //         template: '3BTHCZKDFTMFV6MAS4W2RBQ2YTEJ',
  //         routing: {
  //           method: 'single',
  //           channels: ['email'],
  //         },
  //       },
  //     }),
  //   ]);
  // }
}
