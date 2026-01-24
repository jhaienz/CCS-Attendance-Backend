import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  studentId: string;

  @IsNotEmpty()
  eventId: string;

  @IsOptional()
  @IsBoolean()
  AM: boolean;

  @IsOptional()
  @IsBoolean()
  PM: boolean;
}
