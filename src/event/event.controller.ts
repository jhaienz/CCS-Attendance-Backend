import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';

@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async createEvent(@Body() data: CreateEventDto) {
    return this.eventService.create(data);
  }

  @Get()
  async getEvents() {
    return this.eventService.getAllEvents();
  }

  @Get(':id')
  async getSingleEvent(@Param('id') id: number) {
    return this.eventService.getEvent(id);
  }

  @Patch(':id')
  async patchEvent(@Body() data: CreateEventDto, @Param('id') id: number) {
    return this.eventService.updateEvent(data, id);
  }

  @Delete(':id')
  async deleteEvent(@Param('id') id: number) {
    return this.eventService.deleteEvent(id);
  }
}
