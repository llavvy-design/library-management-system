import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

function hasPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === code
  );
}

@Injectable()
export class GenresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        data: createGenreDto,
      });
    } catch (error) {
      if (hasPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException(
          'A genre with this name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.genre.findMany({
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    if (!genre) {
      throw new NotFoundException(`Genre with ID ${id} was not found.`);
    }

    return genre;
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    try {
      return await this.prisma.genre.update({
        where: { id },
        data: updateGenreDto,
      });
    } catch (error) {
      if (hasPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException(
          'A genre with this name or slug already exists.',
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    if (genre._count.books > 0) {
      throw new ConflictException(
        'This genre cannot be deleted because it still contains books.',
      );
    }

    await this.prisma.genre.delete({
      where: { id },
    });

    return {
      message: `Genre "${genre.name}" deleted successfully.`,
    };
  }
}