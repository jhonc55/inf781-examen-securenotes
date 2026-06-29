import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { NotesService } from './notes.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(
    private readonly notesService: NotesService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateNoteDto,
    @Req() req: any,
  ) {
    return this.notesService.create(
      dto,
      req.user.sub,
    );
  }

  @Get()
  findAll(@Req() req: any) {
    return this.notesService.findAll(
      req.user.sub,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notesService.findOne(
      id,
      req.user.sub,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
    @Req() req: any,
  ) {
    return this.notesService.update(
      id,
      dto,
      req.user.sub,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    return this.notesService.remove(
      id,
      req.user.sub,
    );
  }
}