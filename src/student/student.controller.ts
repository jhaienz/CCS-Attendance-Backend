import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateStudentDto } from './dto/create-student.dto';

@UseGuards(JwtAuthGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async CreateStudentDto(@Body() data: CreateStudentDto) {
    return this.studentService.createStudent(data);
  }
}
