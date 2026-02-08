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

  async getAttendanceByEvent(eventId: string, CSY: string) {
    return this.attendanceModel.aggregate([
      {
        // 1. Find attendance for this event
        $match: { event: new Types.ObjectId(eventId) },
      },
      {
        // 2. Join with Students collection
        $lookup: {
          from: 'Student', // Make sure this matches your actual collection name
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      { $unwind: '$studentInfo' },
      {
        // 3. Filter by the CSY (e.g., 'BSIT 2A')
        $match: { 'studentInfo.CSY': CSY },
      },
      {
        // 4. Shape the output
        $project: {
          _id: 0,
          student: {
            firstName: '$studentInfo.firstName',
            lastName: '$studentInfo.lastName',
            studentId: '$studentInfo.studentId',
            CSY: '$studentInfo.CSY',
          },
          AM: 1,
          PM: 1,
          AMOut: 1,
          PMOut: 1,
        },
      },
    ]);
  }

  async postAttendance(data: any, eventId: string) {
    const { firstName, lastName, CSY, studentId, gbox, AM, PM, AMOut, PMOut } =
      data;

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
      return this.patchAttendance(checkAttendance._id.toString(), {
        AM,
        PM,
        AMOut,
        PMOut,
      });
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
      AMOut: AMOut || false,
      PMOut: PMOut || false,
    });

    return { message: 'Success' };
  }

  async patchAttendance(
    attendanceId: string,
    updateData: {
      AM?: boolean;
      PM?: boolean;
      AMOut?: boolean;
      PMOut?: boolean;
    },
  ) {
    const update: any = {};
    if (updateData.AM !== undefined) update.AM = updateData.AM;
    if (updateData.PM !== undefined) update.PM = updateData.PM;
    if (updateData.AMOut !== undefined) update.AMOut = updateData.AMOut;
    if (updateData.PMOut !== undefined) update.PMOut = updateData.PMOut;
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
