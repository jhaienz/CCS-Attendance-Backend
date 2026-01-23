import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  CSY: string;

  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  gbox: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
