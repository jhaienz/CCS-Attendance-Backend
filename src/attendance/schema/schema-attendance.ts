import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Student } from '../../student/schema/schema-student';
import { Event } from '../../event/schema/schema-event';

export type AttendanceDocument = HydratedDocument<Attendance>;

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Student' })
  student: Student;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Event' })
  event: Event;

  @Prop()
  AM: boolean;

  @Prop()
  PM: boolean;

  @Prop()
  AMOut: boolean;

  @Prop()
  PMOut: boolean;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
