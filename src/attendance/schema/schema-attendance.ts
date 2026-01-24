import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Student' })
  studentId: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  eventId: string;

  @Prop()
  AM: boolean;

  @Prop()
  PM: boolean;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
