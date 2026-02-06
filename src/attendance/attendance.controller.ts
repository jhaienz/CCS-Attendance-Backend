import { Controller, Post, Body, UseGuards, Param, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
// import { CreateAttendanceDto } from './dto/create-attendance.dto';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post(':eventId')
  async postAttendance(@Body() data: any, @Param('eventId') eventId: any) {
    console.log(eventId);
    return this.attendanceService.postAttendance(data, eventId);
  }

  @Get(':eventId')
  async getAttendanceByEvent(@Param('eventId') eventId: any) {
    return this.attendanceService.getAttendanceByEvent(eventId);
  }
}
