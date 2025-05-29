import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class ChatsService {
  constructor(private prisma: PrismaService) {}

  async create(createChatDto: CreateChatDto) {
    return this.prisma.chat.create({
      data: createChatDto,
      include: {
        author: true, // Include the author details with the chat
      },
    });
  }

  async findAll() {
    return this.prisma.chat.findMany({
      include: {
        author: true, // Include the author details with all chats
      },
      orderBy: {
        createdAt: 'asc', // Sort by creation time
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        author: true, // Include the author details
      },
    });
  }

  async remove(id: string) {
    return this.prisma.chat.delete({
      where: { id },
    });
  }

  // User-related methods
  async createUser(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAllUsers() {
    return this.prisma.user.findMany();
  }

  async findOneUser(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByName(name: string) {
    return this.prisma.user.findFirst({
      where: { name },
    });
  }

  async removeUser(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}