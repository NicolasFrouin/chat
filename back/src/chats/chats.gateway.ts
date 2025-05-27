import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from './chats.service';
import { Logger } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatsGateway');

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.chatsService.create(createChatDto);
    this.server.emit('newChat', chat);
    return chat;
  }

  @SubscribeMessage('findAllChats')
  async findAll() {
    return this.chatsService.findAll();
  }

  @SubscribeMessage('findOneChat')
  async findOne(@MessageBody() id: string) {
    return this.chatsService.findOne(id);
  }

  @SubscribeMessage('removeChat')
  async remove(@MessageBody() id: string) {
    const chat = await this.chatsService.remove(id);
    this.server.emit('chatRemoved', { id });
    return chat;
  }
}
