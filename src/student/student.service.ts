import { BadRequestException, Injectable } from '@nestjs/common';
import { Student } from './schema/schema-student';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async createStudent(data: CreateStudentDto) {
    try {
      const { firstName, lastName, CSY, studentId, gbox } = data;

      const studentExists = await this.studentModel.findOne({ studentId });

      if (studentExists) {
        throw new BadRequestException('Student Already Exists');
      }

      const student = await this.studentModel.create({
        firstName,
        lastName,
        CSY,
        studentId,
        gbox,
      });

      return { success: true, student };
    } catch (error) {
      throw new Error(error);
    }
  }
}
