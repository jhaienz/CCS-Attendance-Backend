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

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createEvent(@Request() req) {
    const user = req.userId;
    console.log(req);
    return { user };
  }
}
