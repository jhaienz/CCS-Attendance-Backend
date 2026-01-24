import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendance, AttendanceSchema } from './schema/schema-attendance';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../guards/jwt.strategy.module';
import { Student, StudentSchema } from '../student/schema/schema-student';
import { Event, EventSchema } from '../event/schema/schema-event';

@Module({
  imports: [
    AuthModule,
    StudentModule,
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Event.name, schema: EventSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
