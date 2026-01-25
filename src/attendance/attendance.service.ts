import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StudentService } from '../student/student.service';
import { Model, Types } from 'mongoose';
import { Attendance } from './schema/schema-attendance';
import { Student } from '../student/schema/schema-student';
import { Event } from '../event/schema/schema-event';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Attendance.name) private attendanceModel: Model<Attendance>,
    @InjectModel(Event.name) private eventModel: Model<Event>,
    private studentService: StudentService,
  ) {}

  async postAttendance(data: any, eventId: string) {
    const { firstName, lastName, CSY, studentId, gbox, AM, PM } = data;

    // 1. Find the student and the event
    let student = await this.studentModel.findOne({ studentId }).exec();

    // Fix: findById takes the string directly
    const event = await this.eventModel.findById(eventId).exec();

    // Safety check: Does the event actually exist?
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // 2. Creation logic for NEW students
    if (!student) {
      const result = await this.studentService.createStudent({
        firstName,
        lastName,
        CSY,
        studentId,
        gbox,
      });
      student = result.student;
    }

    // check if attendance already exists
    const checkAttendance = await this.attendanceModel.findOne({
      student: student._id as any,
      event: event._id as any,
    });

    // updates existing attendance
    if (checkAttendance) {
      return this.patchAttendance(checkAttendance._id.toString(), { AM, PM });
    }

    // 3. Final Safety Check
    if (!student) {
      throw new InternalServerErrorException(
        'Failed to retrieve or create student',
      );
    }

    // 4. Create attendance
    await this.attendanceModel.create({
      student: student._id as any,
      event: event._id as any, // This now correctly points to the Event document
      AM: AM || false,
      PM: PM || false,
    });

    return { message: 'Success' };
  }

  async patchAttendance(
    attendanceId: string,
    updateData: { AM?: boolean; PM?: boolean },
  ) {
    const update: any = {};
    if (updateData.AM !== undefined) update.AM = updateData.AM;
    if (updateData.PM !== undefined) update.PM = updateData.PM;

    const updatedRecord = await this.attendanceModel.findByIdAndUpdate(
      attendanceId,
      { $set: update },
      { new: true }, // returns the updated document
    );

    return {
      message: 'Attendance updated (Success)',
      data: updatedRecord,
    };
  }
}
