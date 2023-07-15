import { OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway(8001, {
  cors: '*',
})
export class AppGateway
  implements
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection,
    OnModuleInit
{
  constructor(private socketService: SocketService) {}
  @WebSocketServer()
  public server: Server;
  private connectedCustomers: { userId: string; socketId: string }[] = [];
  private connectedSockets: Socket[] = [];

  onModuleInit() {
    console.log('Websocket server started');
    this.server.emit('confirmation', 'connected');
  }
  afterInit(server: Server) {
    this.socketService.socket = server;
    // console.log({
    //   message: 'Running after init',
    //   server,
    //   socketService: this.socketService,
    // });
  }

  handleDisconnect(client: Socket) {
    const hasCustomer = this.connectedCustomers.some(
      (c) => c.socketId === client.id,
    );
    if (hasCustomer) {
      const connectedUser = this.connectedCustomers.find(
        (c) => c.socketId === client.id,
      );
      this.connectedCustomers = this.connectedCustomers.filter(
        (c) => c.socketId !== connectedUser.socketId,
      );
      console.log(`User (customer) ${connectedUser.userId} disconnected`);
    }
    this.connectedSockets = this.connectedSockets.filter(
      (c) => c.id !== client.id,
    );

    console.log(
      `${client.id} disconnected : ${this.connectedSockets.length} left`,
      this.connectedSockets.map((c) => c.id),
    );
  }

  handleConnection(client: Socket) {
    client.emit('confirmation', 'connected');
    // console.log(`${client.id} connected`);
    const hasUser = this.connectedSockets.some((c) => c.id === client.id);
    if (!hasUser) {
      this.connectedSockets.push(client);
    }
    console.log(
      `A user connected : ${this.connectedSockets.length} left`,
      this.connectedSockets.map((c) => c.id),
    );
  }

  @SubscribeMessage('booking')
  async userEntersBookingDetail(
    @MessageBody() booking: { bookingId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { bookingId } = booking;
    console.log('Room joined', bookingId);
    // Join booking room for all users watching current booking.
    await socket.join(bookingId);
  }

  @SubscribeMessage('checkout')
  async customerEntersCheckout(
    @MessageBody() user: { userId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const { userId } = user;
    // Add user Id to the room
    await socket.join(userId);
    this.connectedCustomers.push({ userId, socketId: socket.id });
    // Send server event to the room
    this.server.to(userId).emit('checkout', 'connected');
    console.log(`User (Customer) ${userId} enters checkout !`);
  }
}
