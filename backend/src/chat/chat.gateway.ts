import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, ValidationPipe, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { UsersService } from '../users/users.service';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server: Server;

  private connectedUsers = new Map<string, number>();
  private userConnections = new Map<number, Set<string>>();

  constructor(
    private chatService: ChatService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.usersService.setAllUsersOffline();
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.sub);
      
      if (!user) {
        client.disconnect();
        return;
      }

      this.connectedUsers.set(client.id, user.id);
      
      if (!this.userConnections.has(user.id)) {
        this.userConnections.set(user.id, new Set());
        await this.usersService.updateOnlineStatus(user.id, true);
        
        const onlineUsers = await this.usersService.getOnlineUsers();
        this.server.emit('userOnline', { user: { id: user.id, username: user.username, profileColor: user.profileColor } });
        this.server.emit('onlineUsers', onlineUsers);
        
      }
      
      this.userConnections.get(user.id)!.add(client.id);
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);
      
      const userSockets = this.userConnections.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        
        if (userSockets.size === 0) {
          this.userConnections.delete(userId);
          await this.usersService.updateOnlineStatus(userId, false);

          const user = await this.usersService.findById(userId);
          if (user) {
            this.server.emit('userOffline', { user: { id: user.id, username: user.username } });
            
            const onlineUsers = await this.usersService.getOnlineUsers();
            this.server.emit('onlineUsers', onlineUsers);

          }
        }
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody(ValidationPipe) sendMessageDto: SendMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      return;
    }

    try {
      const message = await this.chatService.createMessage(userId, sendMessageDto);
      const messageWithUser = await this.chatService.getMessageWithUser(message.id);

      this.server.emit('newMessage', {
        id: messageWithUser.id,
        content: messageWithUser.content,
        createdAt: messageWithUser.createdAt,
        user: {
          id: messageWithUser.user.id,
          username: messageWithUser.user.username,
          profileColor: messageWithUser.user.profileColor,
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async notifyProfileUpdate(userId: number, newProfileColor: string) {
    const user = await this.usersService.findById(userId);
    if (user && this.userConnections.has(userId)) {
      this.server.emit('userProfileUpdated', {
        userId: user.id,
        username: user.username,
        profileColor: newProfileColor,
      });
      
      const onlineUsers = await this.usersService.getOnlineUsers();
      this.server.emit('onlineUsers', onlineUsers);
    }
  }
} 