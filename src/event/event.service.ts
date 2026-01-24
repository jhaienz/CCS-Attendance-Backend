import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Event } from './schema/schema-event';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(data: CreateEventDto) {
    const { eventTitle, eventDescription, date } = data;

    try {
      const event = await this.eventModel.findOne({ eventTitle });

      if (event) {
        throw new BadRequestException('Event Exists');
      }

      await this.eventModel.create({
        eventTitle,
        eventDescription,
        date,
      });

      return { message: 'succesfully created' };
    } catch (error) {
      throw new Error('Cannot Create Event');
    }
  }

  async getAllEvents() {
    try {
      const events = await this.eventModel.find().exec();

      if (events.length === 0 || !events) {
        throw new NotFoundException('No events were found in the database');
      }

      return { success: true, events };
    } catch (error) {
      throw new Error('Cannot Get Events');
    }
  }

  async getEvent(id: number) {
    try {
      const event = await this.eventModel.findById(id).exec();

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      return { event };
    } catch (error) {
      throw new Error('Cannot get event');
    }
  }

  async deleteEvent(id: number) {
    try {
      const event = await this.eventModel.findByIdAndDelete(id);

      if (!event) {
        throw new BadRequestException('Something went Wrong');
      }

      return { success: true, event };
    } catch (error) {
      throw new Error('Cannot Delete Event');
    }
  }

  async updateEvent(data: CreateEventDto, id: number) {
    const { eventTitle, eventDescription, date } = data;
    console.log(eventDescription, eventTitle, date, id);

    try {
      const event = await this.eventModel.findById(id).exec();

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      const updatedEvent = await this.eventModel
        .findByIdAndUpdate(
          id,
          { eventTitle, eventDescription, date },
          { new: true },
        )
        .exec();

      return { success: true, updatedEvent };
    } catch (error) {
      console.error(error);
      throw new Error('Cannot update Event');
    }
  }
}
