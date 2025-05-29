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
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'generated/prisma';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatsGateway');
  private readonly connectedUsers = new Map<string, string>(); // Map socket.id to user.id
  private readonly typingUsers = new Map<string, string>(); // Map user.id to socket.id

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatsService: ChatsService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(_server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Send initial data to the newly connected client
    await this.findAll().then((chats) => {
      client.emit('chats', chats);
    });
  }

  handleDisconnect(client: Socket) {
    // Remove user from connected users map
    const userId = this.connectedUsers.get(client.id);
    if (userId) {
      this.connectedUsers.delete(client.id);

      // Also remove from typing users if they were typing
      if (this.typingUsers.has(userId)) {
        this.typingUsers.delete(userId);
        // Notify others that user is no longer typing
        this.server.emit('userStoppedTyping', { userId });
      }

      this.logger.log(`User disconnected: ${userId}`);

      // Broadcast user left message
      this.server.emit('userLeft', { userId });
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createUser')
  async createUser(
    @MessageBody() createUserDto: CreateUserDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = await this.chatsService.createUser(createUserDto);

      // Associate socket with user
      this.connectedUsers.set(client.id, user.id);

      // Notify client of successful user creation
      client.emit('userCreated', user);

      // Broadcast new user to all clients
      this.server.emit('newUser', user);

      return { success: true, user };
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('login')
  async login(
    @MessageBody() loginData: { userId?: string; userData?: CreateUserDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      let user: User | null = null;

      if (loginData.userId) {
        // Try to find existing user first by ID
        user = await this.chatsService.findOneUser(loginData.userId);
      }

      // If user not found by ID but name is provided, try to find by name
      if (!user && loginData.userData?.name) {
        const existingUser = await this.chatsService.findUserByName(
          loginData.userData.name,
        );

        if (existingUser) {
          this.logger.log(
            `Found existing user with name: ${loginData.userData.name}`,
          );
          user = existingUser;

          // Optionally update the user's color if it was provided and different
          if (
            loginData.userData.color &&
            loginData.userData.color !== existingUser.color
          ) {
            // If you want to update the user's color, you would need to add an update method
            // to your ChatsService and call it here
          }
        }
      }

      // If user still not found and we have user data, create a new user
      if (!user && loginData.userData) {
        user = await this.chatsService.createUser(loginData.userData);
        this.logger.log(`New user created during login: ${user.id}`);
      } else if (!user) {
        // Neither userId worked, nor user found by name, nor userData provided
        client.emit('loginError', {
          message: 'User not found and no user data provided for creation',
        });
        return {
          success: false,
          message: 'User not found and no creation data provided',
        };
      }

      // Associate socket with user
      this.connectedUsers.set(client.id, user.id);

      // Notify client of successful login
      client.emit('loginSuccess', user);

      // Broadcast user joined
      this.server.emit('userJoined', user);

      return { success: true, user };
    } catch (error) {
      this.logger.error(`Error logging in: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('createChat')
  async create(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.connectedUsers.get(client.id);

    if (!userId) {
      client.emit('error', {
        message: 'You must be logged in to send messages',
      });
      return { success: false, message: 'Not authenticated' };
    }

    // Attach the author ID from the connected users map
    const chatWithAuthor = { ...createChatDto, authorId: userId };

    const chat = await this.chatsService.create(chatWithAuthor);
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

  @SubscribeMessage('findAllUsers')
  async findAllUsers() {
    return this.chatsService.findAllUsers();
  }

  @SubscribeMessage('findOneUser')
  async findOneUser(@MessageBody() id: string) {
    return this.chatsService.findOneUser(id);
  }

  @SubscribeMessage('whoami')
  async whoAmI(@ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);

    if (!userId) {
      return { authenticated: false };
    }

    const user = await this.chatsService.findOneUser(userId);
    return { authenticated: true, user };
  }

  @SubscribeMessage('updateUserColor')
  async handleUpdateUserColor(
    @MessageBody() data: { userId: string; color: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const updatedUser = await this.usersService.updateColor(
        data.userId,
        data.color,
      );

      this.server.emit('userUpdated', updatedUser);
      client.emit('loginSuccess', updatedUser);

      return updatedUser;
    } catch (error) {
      client.emit('updateError', {
        message: error.message || 'Failed to update user color',
      });

      return { error: error.message };
    }
  }

  @SubscribeMessage('startTyping')
  async handleStartTyping(@ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      return { success: false, message: 'Not authenticated' };
    }

    try {
      const user = await this.chatsService.findOneUser(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Mark user as typing
      this.typingUsers.set(userId, client.id);

      // Broadcast to all clients that this user is typing
      this.server.emit('userTyping', { userId, userName: user.name });

      return { success: true };
    } catch (error) {
      this.logger.error(`Error handling typing start: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(@ConnectedSocket() client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    if (!userId) {
      return { success: false, message: 'Not authenticated' };
    }

    // Remove user from typing list
    this.typingUsers.delete(userId);

    // Broadcast to all clients that this user stopped typing
    this.server.emit('userStoppedTyping', { userId });

    return { success: true };
  }
}
