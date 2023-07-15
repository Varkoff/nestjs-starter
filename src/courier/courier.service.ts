import { PrismaService } from '@/prisma.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CourierClient, ICourierClient } from '@trycourier/courier';

@Injectable()
export class CourierService implements OnModuleInit {
  private courierClient: ICourierClient;
  constructor(private readonly prisma: PrismaService) {}

  // private contactEmail = 'contact@goodcollect.co';
  onModuleInit() {
    if (!process.env.COURIER_AUTH_TOKEN) {
      throw new Error('COURIER_AUTH_TOKEN is not defined');
    }
    this.courierClient = CourierClient({
      authorizationToken: process.env.COURIER_AUTH_TOKEN,
    });
  }
  getCourierClient() {
    return this.courierClient;
  }

  async getNotification({ notificationId }: { notificationId: string }) {
    const notifications = await this.getCourierClient().notifications.list({
      cursor: notificationId,
    });
    const notification = notifications.results.find(
      (r) => r.id === notificationId,
    );
    return notification;
  }

  // /**
  //  * This method gets the notification content from courier and adds an email history entry to the database with the email detail.
  //  * @param
  //  */
  // async saveUserEmailHistory({
  //   userId,
  //   notificationId,
  //   recipient,
  // }: {
  //   userId: string;
  //   notificationId: string;
  //   recipient: string;
  // }) {
  //   const notification = await this.getNotification({ notificationId });
  //   const emailHistory = await this.prisma.emailHistory.create({
  //     data: {
  //       email: recipient,
  //       templateId: notificationId,
  //       title: notification.title,
  //       user: {
  //         connect: {
  //           id: userId,
  //         },
  //       },
  //     },
  //   });
  // }
}
