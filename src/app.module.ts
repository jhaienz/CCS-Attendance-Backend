import { Module } from '@nestjs/common';
import { AttendanceModule } from './attendance/attendance.module';
import { EventModule } from './event/event.module';
import config from './config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
        expiresIn: config.get('jwt.expiresIn'),
      }),
      global: true,
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('databaseUri'),
      }),
      inject: [ConfigService],
    }),
    AttendanceModule,
    EventModule,
    AuthModule,
    StudentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
