import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Event } from './schema/schema-event';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(data: CreateEventDto) {
    const { eventTitle, eventDescription, date } = data;

    const event = await this.eventModel.findOne({ eventTitle });

    if (event) {
      throw new BadRequestException('This Event Exists');
    }

    await this.eventModel.create({
      eventTitle,
      eventDescription,
      date,
    });

    return { message: 'succesfully created', success: true };
  }

  async getAllEvents() {
    const events = await this.eventModel.find().exec();

    if (events.length === 0 || !events) {
      throw new HttpException(
        'No events were found in the database',
        HttpStatus.NOT_FOUND,
      );
    }

    return { success: true, events };
  }

  async getEvent(id: string) {
    if (Types.ObjectId.isValid(id) === false) {
      throw new HttpException('Invalid Event ID', HttpStatus.BAD_REQUEST);
    }
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    return { event, success: true };
  }

  async deleteEvent(id: string) {
    const event = await this.eventModel.findByIdAndDelete(id);

    if (Types.ObjectId.isValid(id) === false) {
      throw new HttpException('Invalid Event ID', HttpStatus.BAD_REQUEST);
    }

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    return { success: true, messsage: 'Successfully deleted', event };
  }

  async updateEvent(data: CreateEventDto, id: string) {
    const { eventTitle, eventDescription, date } = data;

    if (Types.ObjectId.isValid(id) === false) {
      throw new HttpException('Invalid Event ID', HttpStatus.BAD_REQUEST);
    }

    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
    }

    const updatedEvent = await this.eventModel
      .findByIdAndUpdate(
        id,
        { eventTitle, eventDescription, date },
        { new: true },
      )
      .exec();

    return { success: true, message: 'successfully updated', updatedEvent };
  }
}
