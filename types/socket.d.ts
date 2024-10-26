// types/socket.d.ts
import { Server as NetServer } from "http";
import { Server as SocketServer } from "socket.io";

declare global {
  var io: SocketServer | undefined;
  
  namespace NodeJS {
    interface Global {
      io: SocketServer | undefined
    }
  }
}