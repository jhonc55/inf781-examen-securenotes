import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Note } from './entities/note.entity';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(
    dto: CreateNoteDto,
    userId: string,
  ) {
    const note = this.noteRepository.create({
      ...dto,
      ownerId: userId,
    });

    return this.noteRepository.save(note);
  }

  async findAll(userId: string) {
    return this.noteRepository.find({
      where: {
        ownerId: userId,
      },
    });
  }

  async findOne(
    id: string,
    userId: string,
  ) {
    const note =
      await this.noteRepository.findOne({
        where: {
          id,
          ownerId: userId,
        },
      });

    if (!note) {
      throw new NotFoundException();
    }

    return note;
  }

  async update(
    id: string,
    dto: UpdateNoteDto,
    userId: string,
  ) {
    const note = await this.findOne(
      id,
      userId,
    );

    Object.assign(note, dto);

    return this.noteRepository.save(note);
  }

  async remove(
    id: string,
    userId: string,
  ) {
    const note = await this.findOne(
      id,
      userId,
    );

    await this.noteRepository.remove(note);

    return {
      message: 'Note deleted',
    };
  }
}