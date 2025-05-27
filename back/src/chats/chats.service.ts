import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  create(createChatDto: CreateChatDto) {
    return this.prisma.chat.create({
      data: createChatDto,
      include: { author: true },
    });
  }

  findAll() {
    return this.prisma.chat.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  remove(id: string) {
    return this.prisma.chat.delete({
      where: { id },
    });
  }
}