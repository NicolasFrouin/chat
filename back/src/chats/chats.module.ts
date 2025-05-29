import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsGateway } from './chats.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ChatsController } from './chats.controller';

@Module({
  controllers: [ChatsController],
  imports: [PrismaModule, UsersModule],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
