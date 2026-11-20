import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookDto } from './dto/create-book.dto.js';
import { UpdateBookDto } from './dto/update-book.dto.js';

function hasPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBookDto: CreateBookDto) {
    try {
      return await this.prisma.book.create({
        data: {
          ...createBookDto,
          availableCopies: createBookDto.totalCopies,
        },
        include: {
          genre: true,
        },
      });
    } catch (error) {
      if (hasPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException('A book with this ISBN already exists.');
      }

      if (hasPrismaErrorCode(error, 'P2003')) {
        throw new ConflictException('The specified genre does not exist.');
      }

      throw error;
    }
  }

  async findAll(
    genreId?: number,
    search?: string,
    page = 1,
    limit = 10,
  ) {
    const where = {
      ...(genreId !== undefined ? { genreId } : {}),
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
              {
                author: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        include: {
          genre: true,
        },
        orderBy: {
          title: 'asc',
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} was not found.`);
    }

    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    await this.findOne(id);

    try {
      return await this.prisma.book.update({
        where: { id },
        data: {
          ...updateBookDto,
          ...(updateBookDto.totalCopies !== undefined
            ? { availableCopies: updateBookDto.totalCopies }
            : {}),
        },
        include: {
          genre: true,
        },
      });
    } catch (error) {
      if (hasPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException('A book with this ISBN already exists.');
      }

      if (hasPrismaErrorCode(error, 'P2003')) {
        throw new ConflictException('The specified genre does not exist.');
      }

      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.book.delete({
      where: { id },
    });

    return {
      message: `Book with ID ${id} deleted successfully.`,
    };
  }
}