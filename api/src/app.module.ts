import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { BooksModule } from './books/books.module.js';
import { GenresModule } from './genres/genres.module.js';

@Module({
  imports: [PrismaModule, BooksModule, GenresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
