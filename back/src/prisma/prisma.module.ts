import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IsString, IsOptional } from 'class-validator';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsString()
  @IsOptional()
  image?: string;
}
