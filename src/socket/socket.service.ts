import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService implements OnModuleInit {
  public socket: Server = null;

  onModuleInit() {
    // console.log('Socket Service running after init', this.socket);
  }
}
