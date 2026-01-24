import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  eventTitle: string;

  @Prop({ required: true })
  eventDescription: string;

  @Prop({ required: true })
  date: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
